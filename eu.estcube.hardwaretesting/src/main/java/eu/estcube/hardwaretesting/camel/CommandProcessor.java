package eu.estcube.hardwaretesting.camel;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.springframework.stereotype.Component;

import eu.estcube.common.script.ScriptCommand;

/**
 * Receives the ScriptCommand object when ScriptEngine executes
 * the script and extracts the command name.
 * @author Aivar Lobjakas
 *
 */
@Component
public class CommandProcessor implements Processor{
	

	public CommandProcessor() {
	}

	public void process(Exchange exchange) throws Exception {

		Message m = exchange.getIn();
        ScriptCommand cmd = (ScriptCommand) m.getBody();
        m.setBody(cmd.getCommandName());
        exchange.setOut(m);
	}

}




