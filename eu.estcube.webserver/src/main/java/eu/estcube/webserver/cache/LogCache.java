/** 
 *
 */
package eu.estcube.webserver.cache;

import org.apache.log4j.spi.LoggingEvent;
import org.hbird.exchange.constants.StandardArguments;

/**
 *
 */
public class LogCache extends AbstractCache<String, LoggingEvent> {

    /**
     * Creates new ComponentAndTimeBasedCache.
     * 
     * @param store
     */
    public LogCache(Cache<String, LoggingEvent> store) {
        super(store);
    }

    /** @{inheritDoc . */
    @Override
    protected String getKey(LoggingEvent event) {
        StringBuilder sb = new StringBuilder();
        sb.append(event.getProperties().get(StandardArguments.ISSUED_BY))
                .append(event.getTimeStamp())
                .append(event.getThreadName());
        return sb.toString();
    }
}
