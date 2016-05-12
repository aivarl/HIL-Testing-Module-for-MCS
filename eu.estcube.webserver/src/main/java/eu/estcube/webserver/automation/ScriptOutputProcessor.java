package eu.estcube.webserver.automation;

import eu.estcube.codec.gcp.GcpEncoder;
import eu.estcube.codec.gcp.exceptions.SubsystemNotFoundException;
import eu.estcube.codec.gcp.struct.GcpCommand;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.codec.gcp.struct.GcpSubsystemIdProvider;
import eu.estcube.common.script.ScriptCommand;
import eu.estcube.common.script.io.ScriptMessage;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Gregor on 7/1/2015.
 */
@Component
public class ScriptOutputProcessor implements Processor {

    private static final Logger LOG = LoggerFactory.getLogger(ScriptOutputProcessor.class);

    @Autowired
    private IdBuilder idBuilder;

    @Value("${gcp.entityId}")
    String entityId;

    /**
     * @{inheritDoc .
     */
    @Override
    public void process(Exchange exchange) throws Exception {
        Message in = exchange.getIn();
        //Message out = exchange.getOut();

        ScriptMessage input = in.getBody(ScriptMessage.class);
        String message = input.getMessage();

        switch (input.getType()) {
            case Info:
                LOG.info(message);
                break;
            case Warning:
                LOG.warn(message);
                break;
            case Error:
                LOG.error(message);
                break;
            case Trace:
                LOG.trace(message);
                break;
        }
    }
}
