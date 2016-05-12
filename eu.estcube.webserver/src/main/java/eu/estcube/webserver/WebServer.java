package eu.estcube.webserver;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.Servlet;

import eu.estcube.webserver.automation.ScriptOutputProcessor;
import eu.estcube.webserver.automation.TelecommandProcessor;
import eu.estcube.webserver.automation.TelemetryProcessor;
import eu.estcube.webserver.routes.WebserverMonitoringDispatcher;
import eu.estcube.webserver.script.request.ScriptServlet;
import eu.estcube.webserver.script.upload.ScriptSubmitServlet;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.websocket.WebsocketComponent;
import org.apache.camel.spring.Main;
import org.eclipse.jetty.http.security.Constraint;
import org.eclipse.jetty.security.Authenticator;
import org.eclipse.jetty.security.ConstraintMapping;
import org.eclipse.jetty.security.ConstraintSecurityHandler;
import org.eclipse.jetty.security.LoginService;
import org.eclipse.jetty.security.authentication.FormAuthenticator;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.SessionManager;
import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.component.LifeCycle;
import org.hbird.business.core.AddHeaders;
import org.hbird.exchange.configurator.StandardEndpoints;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.BusinessCard;
import org.hbird.exchange.groundstation.Track;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.atlassian.crowd.service.soap.client.SecurityServerClientFactory;

import eu.estcube.common.ByteUtil;
import eu.estcube.common.Constants;
import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.domain.transport.Uplink;
import eu.estcube.webserver.auth.LoginServiceListener;
import eu.estcube.webserver.auth.LogoutServlet;
import eu.estcube.webserver.auth.crowd.CrowdLoginService;
import eu.estcube.webserver.ax25.Ax25FrameSubmitServlet;
import eu.estcube.webserver.catalogue.CatalogueServlet;
import eu.estcube.webserver.catalogue.SatelliteTrajectoryServlet;
import eu.estcube.webserver.catalogue.SatellitesServlet;
import eu.estcube.webserver.customQuery.CustomQueryServlet;
import eu.estcube.webserver.gcp.GcpCommandArgumentsAutoCompleteServlet;
import eu.estcube.webserver.gcp.GcpCommandsAutoCompleteServlet;
import eu.estcube.webserver.gcp.GcpSubmitCommandServlet;
import eu.estcube.webserver.radiobeacon.BeaconListServlet;
import eu.estcube.webserver.radiobeacon.RadioBeaconServlet;
import eu.estcube.webserver.radiobeacon.RadioBeaconTranslationServlet;
import eu.estcube.webserver.routes.WebserverRouteBuilder;
import eu.estcube.webserver.test.request.HardwareTestServlet;
import eu.estcube.webserver.test.upload.HardwareTestSubmitServlet;
import eu.estcube.webserver.tle.request.TleServlet;
import eu.estcube.webserver.tle.upload.TleSubmitServlet;
import eu.estcube.webserver.tle.upload.TleUploadRequestConverter;
import eu.estcube.webserver.tle.upload.TleUploadRequestValidator;
import eu.estcube.webserver.tle.upload.TleUploadResponseCreator;
import eu.estcube.webserver.userinfo.UserInfoServlet;
import eu.estcube.webserver.utils.ContactNotifier;
import eu.estcube.webserver.utils.UIErrorHandler;

public class WebServer extends RouteBuilder {

    private static final String[] ROLES = new String[] { "mcs-premium-admin", "mcs-premium-op", "mcs-op" };

    private static final Logger LOG = LoggerFactory.getLogger(WebServer.class);

    @Value("${heart.beat.interval}")
    private int heartBeatInterval = 3000;

    @Value("${service.id}")
    private String serviceId;

    @Value("${service.version}")
    private String webServerVersion;

    @Value("${service.name}")
    private String serviceName;

    @Value("${web.server.host}")
    private String webServerHost;

    @Value("${web.server.port}")
    private int webServerPort;

    @Value("${web.socket.port}")
    private int webSocketPort;

    @Value("${static.resources}")
    private String staticResources;

    @Value("${iKnowWhatImDoing: }")
    private String iKnowWhatImDoing;

    @Autowired
    private LoginServiceListener loginServiceListener;

    @Autowired
    private ErrorServlet errorServlet;

    @Autowired
    private LogoutServlet logoutServlet;

    @Autowired
    private ToJsonProcessor toJsonProcessor;

    @Autowired
    private UIErrorHandler uiErrorHandler;

    @Autowired
    private UserInfoServlet userInfoServlet;

    @Autowired
    private Ax25FrameSubmitServlet ax25frameSubmitServlet;

    @Autowired
    private TleSubmitServlet tleUploadServlet;

    @Autowired
    private TleServlet tleServlet;

    @Autowired
    private ScriptSubmitServlet scriptUploadServlet;

    @Autowired
    private HardwareTestSubmitServlet hardwareTestUploadServlet;

    @Autowired
    private HardwareTestServlet hardwareTestServlet;

    @Autowired
    private ScriptServlet scriptServlet;

    @Autowired
    private TleUploadRequestValidator tleValidator;

    @Autowired
    private TleUploadRequestConverter tleConverter;

    @Autowired
    private TleUploadResponseCreator tleResponse;

    @Autowired
    private AddHeaders headers;

    @Autowired
    private NamedObjectPublisher publisher;

    @Autowired
    private RadioBeaconServlet radioBeaconServlet;

    @Autowired
    private GcpSubmitCommandServlet gcpSubmitCommandServlet;

    @Autowired
    private GcpCommandArgumentsAutoCompleteServlet gcpCommandArgumentsAutoCompleteServlet;

    @Autowired
    private GcpCommandsAutoCompleteServlet gcpCommandsAutoCompleteServlet;

    @Autowired
    private RadioBeaconTranslationServlet radioBeaconTranslationServlet;

    @Autowired
    private SatellitesServlet satellitesServlet;

    @Autowired
    private CatalogueServlet catalogueServlet;

    @Autowired
    private BeaconListServlet beaconListServlet;

    @Autowired
    private SatelliteTrajectoryServlet trajectoryServlet;

    @Autowired
    private CustomQueryServlet customQueryServlet;

    @Autowired
    private RouteLoader loader;

    @Autowired
    private ContactNotifier contactNotifier;

    @Autowired
    private TelecommandProcessor telecommandProcessor;

    @Autowired
    private ScriptOutputProcessor scriptOutputProcessor;

    @Autowired
    private TelemetryProcessor telemetryProcessor;

    @Override
    public void configure() throws Exception {
        MDC.put(StandardArguments.ISSUED_BY, serviceId);
        setupJettyWebServer();
        setupCamelRoutes();
    }

    /**
     *
     */
    void setupCamelRoutes() {
        // configure websocket component
        WebsocketComponent websocketComponent = (WebsocketComponent) getContext().getComponent("websocket");
        websocketComponent.setPort(webSocketPort);
        // websocketComponent.setStaticResources("file:" + staticResources);

        // configure Camel routes
        // @formatter:off

        /* TEMPORARY SCRIPTING ENGINE ROUTES */
        from("activemq:topic:estcube.scriptengine.telecommand")
                .process(telecommandProcessor)
                .bean(headers)
                .choice()
                    .when(simple(TelecommandProcessor.FILTER_GCP_COMMAND)).to("direct:gcpCommandInput")
                    .when(simple(TelecommandProcessor.FILTER_SCRIPT_MESSAGE)).to("activemq:topic:estcube.scriptengine.message")
                    //TODO throw error on otherwise()
                .end();

        from("activemq:topic:estcube.scriptengine.message")
                .process(scriptOutputProcessor)
                .to(WebserverMonitoringDispatcher.DESTINATION_SCRIPTOUTPUT);

        from(StandardEndpoints.CALIBRATED_PARAMETERS)
                .process(telemetryProcessor)
                .to("activemq:topic:estcube.scriptengine.telemetry");
        /* HARDWARE TESTING ROUTES */
        // Connecting to the serial port [HardwareTestServlet.java].
        from("activemq:queue:estcube.hardwaretesting.serialport.output")
                .to(WebserverMonitoringDispatcher.DESTINATION_HARDWARETESTINGOUTPUT);

        /**In a standalone project, where the user would just run the
         * hardwaretesting project, things would look like this:
         * from(hardwaretesting.command).to(over the internet send it to a
         * hardwaretesting project running instance).
         * Now the command is in hardwaretesting project. Send it to Arduino,
         * wait for a response and send it over the internet back to this WebServer.
         * WebServer will listen to this internet endpoint and send incoming data
         * to "hardwaretesting.response". That's it.
         */

        // Send commands to testing module
        from("activemq:topic:estcube.hardwaretesting.command")
            .to("mina2:tcp://localhost:" + "6200" + "?transferExchange=true&sync=false");
        // Recieve commands from testing module
        // Will be sent to [HardwareTestingCamelScriptIO]'s process(exchange) method.
        from("mina2:tcp://localhost:" + "6201" + "?textline=true&sync=false")
            .to("activemq:topic:estcube.hardwaretesting.response");
        
        

        /* TLE */
        // submit
        from("direct:tle-submit")
                .bean(tleValidator)
                .to("log:tle-submit")
                .bean(tleConverter)
                .split(body())
                    .bean(headers)
                    .bean(publisher)
                .end()
                .bean(tleResponse);

        /* COMMANDING */
        // submit
        from("direct:gcpCommandInput")
                .bean(headers)
                .inOnly(Uplink.COMMANDS);


        /* BEACON */
        // submit
        from("direct:radioBeaconInput")
                .bean(headers)
                .bean(publisher);


        /*QUERY*/
        //submit
        from("direct:customQuery")
                .to(Constants.AMQ_RETRIEVE);

        /* HEART BEAT */
        BusinessCard card = new BusinessCard(serviceId, serviceName);
        card.setPeriod(heartBeatInterval);
        card.setDescription(String.format("Web server; version: %s", webServerVersion));
        from("timer:heartbeat?fixedRate=true&period=" + heartBeatInterval)
                .bean(card, "touch")
                .bean(headers)
                .to(StandardEndpoints.MONITORING);

        // listen for Track commands
        from(StandardEndpoints.COMMANDS + "?selector=class='" + Track.class.getSimpleName() + "'")
                .bean(contactNotifier);
        // @formatter:on
    }

    /**
     * @throws Exception
     */
    void setupJettyWebServer() throws Exception {
        // CacheMessage.setCacheLimit(cacheLimit);
        InetSocketAddress address = new InetSocketAddress(webServerHost, webServerPort);
        Server server = new Server(address);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        SessionManager sm = new HashSessionManager();
        SessionHandler sh = new SessionHandler(sm);
        context.setSessionHandler(sh);

        context.setResourceBase(staticResources);

        // Special servlet for static resources
        DefaultServlet defaultServlet = new DefaultServlet();
        ServletHolder holder = new ServletHolder(defaultServlet);

        // - This server prevents .js files from being cached.
        holder.setInitParameter("useFileMappedBuffer", "false");
        holder.setInitParameter("cacheControl", "no-store,no-cache,must-revalidate");
        holder.setInitParameter("maxCachedFiles", "0");
        context.addServlet(holder, "/");

        // Servlets without constraints
        addServlet(context, "/logout", logoutServlet);
        addServlet(context, "/error", errorServlet);

        // Servlets with constraints
        Constraint constraint = createConstraint("auth", ROLES);
        Constraint commandingConstraint = createConstraint("command", new String[] { "mcs-premium-admin",
                "mcs-premium-op" });
        List<ConstraintMapping> mappings = new ArrayList<ConstraintMapping>();

        // - Restrict all static resources under /MCS/*
        mappings.add(createConstraintMapping(constraint, "/MCS/*"));

        // Restricted servlets - available only for authenticated users
        mappings.add(addServlet(context, "/user", userInfoServlet, constraint));
        userInfoServlet.setServerInfo(this.serviceId, this.webServerVersion, this.webServerHost, this.webServerPort);
        mappings.add(addServlet(context, "/radioBeacon", radioBeaconServlet, constraint));
        mappings.add(addServlet(context, "/translateRadioBeacon", radioBeaconTranslationServlet, constraint));
        mappings.add(addServlet(context, "/tle/submit", tleUploadServlet, constraint));
        mappings.add(addServlet(context, "/tle", tleServlet, constraint));
        mappings.add(addServlet(context, "/script/submit", scriptUploadServlet, constraint));
        mappings.add(addServlet(context, "/hardwareTest/submit", hardwareTestUploadServlet, constraint));
        mappings.add(addServlet(context, "/hardwareTest/getPorts", hardwareTestServlet, constraint));
        mappings.add(addServlet(context, "/script/request", scriptServlet, constraint));
        mappings.add(addServlet(context, "/sendCommand", gcpSubmitCommandServlet, commandingConstraint));
        mappings.add(addServlet(context, "/getCommands", gcpCommandsAutoCompleteServlet, constraint));
        mappings.add(addServlet(context, "/getCommandArguments", gcpCommandArgumentsAutoCompleteServlet, constraint));
        mappings.add(addServlet(context, "/getTrajectory", trajectoryServlet, constraint));
        mappings.add(addServlet(context, "/ax25/submit", ax25frameSubmitServlet, commandingConstraint));
        mappings.add(addServlet(context, "/satellites/*", satellitesServlet, constraint));
        mappings.add(addServlet(context, "/catalogue/*", catalogueServlet, constraint));
        mappings.add(addServlet(context, "/beacons", beaconListServlet, constraint));
        mappings.add(addServlet(context, "/customQuery", customQueryServlet, constraint));

        // Login service
        LoginService loginService = createLoginService(loginServiceListener);
        server.addBean(loginService);

        // Authenticator
        Authenticator authenticator = createAutenticator("/MCS/login.html", "/error");

        // Security handler
        ConstraintSecurityHandler security = new ConstraintSecurityHandler();
        security.setConstraintMappings(mappings, new HashSet<String>(Arrays.asList(ROLES)));
        security.setAuthenticator(authenticator);
        security.setLoginService(loginService);
        security.setStrict(false);

        // Disabling next two rows will remove security constraints from the
        // web server
        context.setHandler(security);

        // This is something I'm not proud of.
        // Crack this if you don't like the login page ;)
        byte[] theKey = ByteUtil
                .toBytesFromHexString("49 6B 6E 6F 77 49 6D 44 6F 69 6E 67 49 74 57 72 6F 6E 67 42 75 74 49 6D 4C 61 7A 79 44 65 76 65 6C 6F 70 65 72");

        if (iKnowWhatImDoing.equals("OpenTheBackDoorPlease")
                && Arrays.equals(theKey, (System.getProperty("disablingSecurityIsVeryBadIdea",
                        "I won't do it").getBytes("ASCII")))) {
            LOG.warn("***");
            LOG.warn("*** SECURITY DISABLED FROM WEB SERVER CONFIGURATION ***");
            LOG.warn("*** In case you see this and you are not sure - stop the web server NOW!");
            LOG.warn("***");
            context.setHandler(null);
        }

        // Start the server
        server.setHandler(context);
        server.start();
    }

    Constraint createConstraint(String name, String[] roles) {
        Constraint constraint = new Constraint();
        constraint.setName(name);
        constraint.setRoles(roles);
        constraint.setAuthenticate(true);
        return constraint;
    }

    void addServlet(ServletContextHandler context, String path, Class<? extends Servlet> servletClass) {
        context.addServlet(servletClass, path);
    }

    void addServlet(ServletContextHandler context, String path, Servlet servlet) {
        context.addServlet(new ServletHolder(servlet), path);
    }

    ConstraintMapping addServlet(ServletContextHandler context, String path, Class<? extends Servlet> servletClass,
            Constraint constraint) {
        addServlet(context, path, servletClass);
        return createConstraintMapping(constraint, path);
    }

    ConstraintMapping addServlet(ServletContextHandler context, String path, Servlet servlet, Constraint constraint) {
        addServlet(context, path, servlet);
        return createConstraintMapping(constraint, path);
    }

    ConstraintMapping createConstraintMapping(Constraint constraint, String path) {
        ConstraintMapping mapping = new ConstraintMapping();
        mapping.setConstraint(constraint);
        mapping.setPathSpec(path);
        return mapping;
    }

    LoginService createLoginService(LifeCycle.Listener listener) {
        CrowdLoginService service = new CrowdLoginService(SecurityServerClientFactory.getSecurityServerClient());
        service.addLifeCycleListener(listener);
        return service;
    }

    Authenticator createAutenticator(String loginPage, String errorPage) {
        return new FormAuthenticator(loginPage, errorPage, true);
    }

    public static void main(String[] args) throws Exception {
        LOG.info("Starting WebServer");
        // new Main().run(args);
        // TODO - 14.08.2013; kimmell - switch back when upgrading to Camel 2.12
        try {
            AbstractApplicationContext context = new ClassPathXmlApplicationContext("META-INF/spring/camel-context.xml");
            WebServer webserver = context.getAutowireCapableBeanFactory().createBean(WebServer.class);

            Main m = new Main();
            m.setApplicationContext(context);

            m.addRouteBuilder(webserver);

            Map<String, WebserverRouteBuilder> builders = context.getBeansOfType(WebserverRouteBuilder.class);
            for (RouteBuilder builder : builders.values()) {
                LOG.info("Adding " + builder.getClass().getName() + " to the builder set");
                m.addRouteBuilder(builder);
            }

            m.run(args);
        } catch (Exception e) {
            LOG.error("Failed to start " + WebServer.class.getName(), e);
        }
    }
}
