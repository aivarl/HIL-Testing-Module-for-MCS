package eu.estcube.scriptengine;

import eu.estcube.scriptengine.camel.CamelScriptIO;
import eu.estcube.scriptengine.camel.CamelScriptLogger;
import eu.estcube.scriptengine.camel.ScriptRunProcessor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.spring.Main;
import org.hbird.business.core.AddHeaders;
import org.hbird.exchange.configurator.StandardEndpoints;
import org.hbird.exchange.core.BusinessCard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by Joonas on 25.6.2015.
 */
public class ScriptEngine extends RouteBuilder {
    private static final Logger LOG = LoggerFactory.getLogger(ScriptEngine.class);

    public static final String SCRIPT = "activemq:queue:estcube.scriptengine.script";

    @Autowired
    private ScriptEngineConfig config;

    @Autowired
    private AddHeaders addHeaders;

    //ScriptIO not possible because of configure() requiring CamelScriptIO; Autowiring can't be done
    @Autowired
    private CamelScriptIO scriptIO;

    @Autowired
    private ScriptRunProcessor scriptRunProcessor;

    @Override
    public void configure() throws Exception {
        // @formatter:off
        from(SCRIPT)
                .process(scriptRunProcessor)
                .to(CamelScriptLogger.SCRIPT_MESSAGE);

        from(CamelScriptIO.SCRIPT_IN)
                .process(scriptIO);

        BusinessCard card = new BusinessCard(config.getServiceId(), config.getServiceName());
        card.setPeriod(config.getHeartBeatInterval());
        card.setDescription(String.format("Script Engine; version: %s", config.getServiceVersion()));
        from("timer://heartbeat?fixedRate=true&period=" + config.getHeartBeatInterval())
                .bean(card, "touch")
                .process(addHeaders)
                .to(StandardEndpoints.MONITORING);
        // @formatter:on
    }

    public static void main(String[] args) throws Exception {
        LOG.info("Starting script engine");
        try {
            AbstractApplicationContext context = new ClassPathXmlApplicationContext("META-INF/spring/camel-context.xml");
            ScriptEngine scriptEngine = context.getAutowireCapableBeanFactory().createBean(ScriptEngine.class);

            Main m = new Main();
            m.setApplicationContext(context);
            m.addRouteBuilder(scriptEngine);
            m.run(args);
        } catch (Exception e) {
            LOG.error("Failed to start " + ScriptEngine.class.getName(), e);
        }
    }
}
