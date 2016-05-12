package eu.estcube.webserver.automation;

import eu.estcube.codec.gcp.struct.GcpReply;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.codec.gcp.struct.GcpSubsystemIdProvider;
import eu.estcube.common.Headers;
import eu.estcube.common.script.ScriptReply;
import eu.estcube.common.script.io.ScriptIOPayload;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by Gregor on 7/1/2015.
 */
@Component
public class TelemetryProcessor implements Processor {

    private static final Logger LOG = LoggerFactory.getLogger(TelemetryProcessor.class);

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
        LOG.warn("Adada");
        List<EntityInstance> eis = in.getBody(List.class);
        LOG.warn("Bdada");
        EntityInstance genericMeta = eis.get(0);

        ScriptReply sr = new ScriptReply();
        if (genericMeta instanceof Metadata) {
            Map<String, Object> metamap = ((Metadata) genericMeta).getMetadata();
            int id = (Integer) metamap.get(Headers.ID);
            int source = (Integer) metamap.get(StandardArguments.SOURCE);
            GcpReply com = struct.getReply(id,
                    GcpSubsystemIdProvider.getName(source));
            if (com == null) {
                throw new RuntimeException("[TelemetryProcessor] Reply with id:" + id + " subsystem:" + source
                        + " not found!");
            }
            sr.setReplyName(com.getName());
        }

        ScriptIOPayload siop = new ScriptIOPayload();
        for (EntityInstance ei : eis) {
            if (ei instanceof CalibratedParameter) {
                CalibratedParameter cp = (CalibratedParameter) ei;
                siop.put(cp.getName(), cp.getValue());
            } else if (ei instanceof Binary) {
                Binary binary = (Binary) ei;
                siop.put(binary.getName(), binary.getRawData());
            } else if (ei instanceof Label) {
                Label label = (Label) ei;
                siop.put(label.getName(), label.getValue());
            }
        }
        sr.setPayload(siop);

        out.setBody(sr);
    }
}
