package eu.estcube.common.json;

import java.util.UUID;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.hbird.exchange.core.Command;
import org.hbird.exchange.core.CommandArgument;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component
public class JsonToCommand implements Processor {

    public void process(Exchange ex) throws Exception {

        // TODO - 17.12.2012; kimmell - change this

        Command command;
        String json = ex.getOut().getBody(String.class);

        JsonParser parser = new JsonParser();
        JsonObject o = (JsonObject) parser.parse(json);

        String issuedBy = null;
        String targetDevice = o.get("device").getAsString();
        String commandName = o.get("name").getAsString();
        String description = null;

        command = new Command(UUID.randomUUID().toString(), commandName);
        command.setIssuedBy(issuedBy);
        command.setDescription(description);
        command.setDestination(targetDevice);
        JsonArray params = o.getAsJsonArray("params");

        if (params != null && params.size() > 0) {
            for (int i = 0; i < params.size(); i++) {
                JsonObject parameter = (JsonObject) params.get(i);
                String name = parameter.get("name").getAsString();
                Object value = parameter.get("value").getAsString();
                String argumentDescription = null;
                String unit = null;
                Boolean mandatory = Boolean.TRUE;
                CommandArgument ca = new CommandArgument(name, argumentDescription, Object.class, unit, value,
                        mandatory);
                command.getArguments().put(name, ca);
            }
        }
        ex.getOut().setBody(command);
    }
}
