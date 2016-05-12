package eu.estcube.hardwaretesting;

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

import eu.estcube.hardwaretesting.camel.SerialDataTransferProcessor;
import eu.estcube.hardwaretesting.camel.SerialPortProcessor;
import eu.estcube.hardwaretesting.camel.CommandProcessor;

/**
 * The main class of the HIL testing module.
 * Sets up connections between the module and the MCS.
 * @author Aivar Lobjakas
 */
public class HardwareTesting extends RouteBuilder {
    private static final Logger LOG = LoggerFactory.getLogger(HardwareTesting.class);

    public static final String SERIALPORT = "activemq:queue:estcube.hardwaretesting.serialport";
    public static final String SERIALPORT_OUTPUT = SERIALPORT + ".output";

    //Sending data to UI
    public static final String HARDWARETESTING_WEBSOCKET = "activemq:queue:estcube.hardwaretesting.websocket";

    @Autowired
    private ScriptEngineConfig config;

    @Autowired
    private AddHeaders addHeaders;

    @Autowired
    private SerialPortProcessor serialPortProcessor;

    @Autowired
    private CommandProcessor commandProcessor;

    @Autowired
    private SerialDataTransferProcessor serialDataTransferProcessor;

    @Override
    public void configure() throws Exception {
        // @formatter:off
        from(SERIALPORT)
                .process(serialPortProcessor)
                .to(SERIALPORT_OUTPUT);

        /**
         * Listen to script commands and pass them to Arduino.
         * TODO: TCP endpoint for listening to commands.
         */
		String port1 = "6200";
		String tcpMode = "transferExchange";//"textline";

		//Send the incoming commands to serial port and also start a listener
		//which will send the serial port responses to the route after this one.
		from("mina2:tcp://localhost:" + port1 + "?"+tcpMode+"=true&sync=false")
			.process(commandProcessor)
			.process(serialDataTransferProcessor)
			.to("stream:out");

		//Incoming serial port responses. Will be caught in WebServer.java.
		tcpMode = "textline";
		port1 = "6201";
		from("activemq:queue:estcube.hardwaretesting.serialport.response")
			.to("mina2:tcp://localhost:" + port1 + "?"+tcpMode+"=true&sync=false");


        BusinessCard card = new BusinessCard(config.getServiceId(), config.getServiceName());
        card.setPeriod(config.getHeartBeatInterval());
        card.setDescription(String.format("Hardware Testing; version: %s", config.getServiceVersion()));
        from("timer://heartbeat?fixedRate=true&period=" + config.getHeartBeatInterval())
                .bean(card, "touch")
                .process(addHeaders)
                .to(StandardEndpoints.MONITORING);
        // @formatter:on
    }

    public static void main(String[] args) throws Exception {
        LOG.info("Starting hardware testing");
        try {
            AbstractApplicationContext context = new ClassPathXmlApplicationContext("META-INF/spring/camel-context.xml");
            HardwareTesting scriptEngine = context.getAutowireCapableBeanFactory().createBean(HardwareTesting.class);

            Main m = new Main();
            m.setApplicationContext(context);
            m.addRouteBuilder(scriptEngine);
            m.run(args);
        } catch (Exception e) {
            LOG.error("Failed to start " + HardwareTesting.class.getName(), e);
        }
    }
}
