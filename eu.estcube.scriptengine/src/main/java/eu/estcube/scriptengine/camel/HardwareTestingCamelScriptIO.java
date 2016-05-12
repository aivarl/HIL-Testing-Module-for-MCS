package eu.estcube.scriptengine.camel;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.script.ScriptCommand;
import eu.estcube.common.script.io.ScriptIOPayload;
import eu.estcube.scriptengine.io.ScriptIO;
import eu.estcube.scriptengine.utils.ReplyQueue;

/**
 * Created by Aivar on 16.04.2016.
 */
@Component
public class HardwareTestingCamelScriptIO implements ScriptIO, Processor {

    public static final String TESTINGSCRIPT_OUT = "activemq:topic:estcube.hardwaretesting.command";
    public static final String TESTINGSCRIPT_IN = "activemq:topic:estcube.hardwaretesting.response";

    private final ProducerTemplate producerTemplate;

    @Autowired
    public HardwareTestingCamelScriptIO(ProducerTemplate producerTemplate) {
        this.producerTemplate = producerTemplate;
    }

    @Override
    public void send(String op, ScriptIOPayload payload) {
        ScriptCommand cmd = new ScriptCommand();
        cmd.setCommandName(op);
        cmd.setPayload(payload);

        this.producerTemplate.sendBody(TESTINGSCRIPT_OUT, cmd);
    }

    private ReplyQueue<ScriptIOPayload> incomingReplies = new ReplyQueue<ScriptIOPayload>(3000);

    @Override
    public ScriptIOPayload poll(String name) {
        return incomingReplies.poll(name);
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        Message m = exchange.getIn();
        String replyName = "sensor";
        ScriptIOPayload replyPayload = new ScriptIOPayload();
        String[] keyValue = ((String) m.getBody()).split(";");
        replyPayload.put("response", keyValue[0]);

        incomingReplies.offer(replyName, replyPayload);
    }

}
