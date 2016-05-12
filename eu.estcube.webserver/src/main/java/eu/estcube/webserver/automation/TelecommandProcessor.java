package eu.estcube.webserver.automation;

import eu.estcube.codec.gcp.GcpEncoder;
import eu.estcube.codec.gcp.exceptions.*;
import eu.estcube.codec.gcp.struct.GcpCommand;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.codec.gcp.struct.GcpSubsystem;
import eu.estcube.codec.gcp.struct.GcpSubsystemIdProvider;
import eu.estcube.common.script.ScriptCommand;
import eu.estcube.common.script.io.ScriptMessage;
import org.apache.camel.Body;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.codehaus.jettison.json.JSONObject;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.CalibratedParameter;
import org.hbird.exchange.core.Command;
import org.hbird.exchange.core.Parameter;
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
public class TelecommandProcessor implements Processor {

    private static final Logger LOG = LoggerFactory.getLogger(TelecommandProcessor.class);

    public static final String FILTER_GCP_COMMAND = "${in.header.class} == 'Command'";
    public static final String FILTER_SCRIPT_MESSAGE = "${in.header.class} == 'ScriptMessage'";

    @Autowired
    private GcpStruct struct;

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
        Message out = exchange.getOut();

        LOG.info("TELECOMMANDPROCESSOR!!!!!!!!s");
        ScriptCommand input = in.getBody(ScriptCommand.class);

        String[] data = input.getCommandName().split(":", 2);
        if (data.length != 2) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, "Command name does not contain destination (eg. EPS:)"));
            return;
        }

        String destination = data[0].trim();
        String commandName = data[1].trim();

        int destinationId = -1;
        int commId = -1;
        try {
            destinationId = GcpSubsystemIdProvider.getId(destination);
        } catch (SubsystemNotFoundException snfe) {
            // TODO throw to log
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Subsystem \"%s\" not found", destination)));
            return;
        }

        for (GcpCommand command : struct.getCommands()) {
            if (command.getName().equals(commandName)) {
                commId = command.getId();
                break;
            }
        }
        if (destinationId == -1) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Invalid subsystem ID for \"%s\", check commands.xml file", destination)));
            return;
        }
        if (commId == -1) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Command \"%s\" not found", commandName)));
            return;
        }

        String[] inputs = { "06", Integer.toString(destinationId),
                "0", Integer.toString(commId), "06", "0" };

        // TODO figure out what to do with hardcoded values
        struct.setSatelliteId("/ESTCUBE/Satellites/ESTCube-1");

        Command command;
        try {
            command = new GcpEncoder().encode(inputs, input.getPayload().getMap(), struct, entityId, idBuilder);
        } catch (CommandNotFoundException e) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Command %s not found. Make sure that it exists for %s subsystem", commandName, destination)));
            return;
        } catch (ArgumentsNotNumbersException e) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Invalid arguments to command %s", commandName)));
            return;
        } catch (NotEnoughCommandArgumentsException e) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Invalid amount of arguments given to command %s", commandName)));
            return;
        } catch (TooManyCommandArgumentsException e) {
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, String.format("Invalid amount of arguments given to command %s", commandName)));
            return;
        }

        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put(StandardArguments.GROUND_STATION_ID,
                "/ESTCUBE/GroundStations/ES5EC-lab");
        headers.put(StandardArguments.SATELLITE_ID, "/ESTCUBE/Satellites/ESTCube-1");
        out.setHeaders(headers);
        out.setBody(command);
    }
}
