/** 
 *
 */
package eu.estcube.webserver.cache;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import eu.estcube.webserver.domain.TransportFrame;

/**
 *
 */
public class TransportFrameCache extends AbstractCache<String, TransportFrame> {

    private static final Logger LOG = LoggerFactory.getLogger(TransportFrameCache.class);

    // TODO - 07.04.2013; kimmell - find out where is this constant defined in
    // JMS / AMQ?
    public static final String JMS_MESSAGE_ID = "JMSMessageID";

    /**
     * Creates new TransportFrameCache.
     * 
     * @param store
     */
    public TransportFrameCache(Cache<String, TransportFrame> store) {
        super(store);
    }

    /** @{inheritDoc . */
    @Override
    protected String getKey(TransportFrame frame) {
        Object key = frame.getHeaders().get(JMS_MESSAGE_ID);
        if (key == null) {
            key = UUID.randomUUID().toString();
            LOG.warn("Received TransportFrame without header {} value; falling back to generated random UUID: {}",
                    JMS_MESSAGE_ID, key);
        }
        return String.valueOf(key);
    }
}
