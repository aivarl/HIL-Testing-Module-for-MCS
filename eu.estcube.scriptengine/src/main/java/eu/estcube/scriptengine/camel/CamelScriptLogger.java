package eu.estcube.scriptengine.camel;

import eu.estcube.common.script.io.ScriptMessage;
import eu.estcube.scriptengine.io.ScriptLogger;
import org.apache.camel.ProducerTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Joonas on 6.7.2015.
 */
@Component
public class CamelScriptLogger extends ScriptLogger {
    public static final String SCRIPT_MESSAGE = "activemq:topic:estcube.scriptengine.message";
    private static final Logger LOG = LoggerFactory.getLogger(CamelScriptLogger.class);

    private final ProducerTemplate producerTemplate;

    @Autowired
    public CamelScriptLogger(ProducerTemplate producerTemplate) {
        this.producerTemplate = producerTemplate;
    }

    private void send(String scriptId, String msg, ScriptMessage.Type type) {
        ScriptMessage message = new ScriptMessage();
        message.setScriptIdentifier(scriptId);
        message.setMessage(msg);
        message.setType(type);

        this.producerTemplate.sendBody(SCRIPT_MESSAGE, message);
    }

    @Override
    public void log(String scriptId, Object o) {
        LOG.info(o == null ? "null" : o.toString());
        send(scriptId, o == null ? "null" : o.toString(), ScriptMessage.Type.Info);
    }

    @Override
    public void error(String scriptId, Object o) {
        LOG.error(o == null ? "null" : o.toString());
        send(scriptId, o == null ? "null" : o.toString(), ScriptMessage.Type.Error);
    }
}
