package eu.estcube.scriptengine.camel;

import eu.estcube.common.script.ScriptCommand;
import eu.estcube.common.script.ScriptReply;
import eu.estcube.scriptengine.io.ScriptIO;
import eu.estcube.common.script.io.ScriptIOPayload;
import eu.estcube.scriptengine.utils.ReplyQueue;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Joonas on 1.7.2015.
 */
@Component
public class CamelScriptIO implements ScriptIO, Processor {
    public static final String SCRIPT_OUT = "activemq:topic:estcube.scriptengine.telecommand";
    public static final String SCRIPT_IN = "activemq:topic:estcube.scriptengine.telemetry";

    private final ProducerTemplate producerTemplate;

    @Autowired
    public CamelScriptIO(ProducerTemplate producerTemplate) {
        this.producerTemplate = producerTemplate;
    }

    @Override
    public void send(String op, ScriptIOPayload payload) {
        ScriptCommand cmd = new ScriptCommand();
        cmd.setCommandName(op);
        cmd.setPayload(payload);

        this.producerTemplate.sendBody(SCRIPT_OUT, cmd);
    }

    private ReplyQueue<ScriptIOPayload> incomingReplies = new ReplyQueue<ScriptIOPayload>(3000);

    @Override
    public ScriptIOPayload poll(String name) {
        return incomingReplies.poll(name);
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        Message m = exchange.getIn();

        ScriptReply reply = (ScriptReply) m.getBody();
        String replyName = reply.getReplyName();

        incomingReplies.offer(replyName, reply.getPayload());
    }
}
