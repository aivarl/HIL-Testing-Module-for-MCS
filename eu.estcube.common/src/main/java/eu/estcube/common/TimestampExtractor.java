/** 
 *
 */
package eu.estcube.common;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.constants.StandardArguments;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class TimestampExtractor {

    // XXX - 01.08.2013; kimmell - actually this constant is defined in some
    // library; no time to track it down at the moment
    public static final String HEADER_JMS_TIMESTAMP = "JMSTimestamp";

    private static final Logger LOG = LoggerFactory.getLogger(TimestampExtractor.class);

    public long getTimestamp(Message message) {
        long timestamp = System.currentTimeMillis();
        if (message.getHeader(StandardArguments.TIMESTAMP) != null) {
            timestamp = message.getHeader(StandardArguments.TIMESTAMP, Long.class);
        } else if (message.getHeader(Exchange.CREATED_TIMESTAMP) != null) {
            timestamp = message.getHeader(Exchange.CREATED_TIMESTAMP, Long.class);
        } else if (message.getHeader(HEADER_JMS_TIMESTAMP) != null) {
            timestamp = message.getHeader(HEADER_JMS_TIMESTAMP, Long.class);
        } else {
            LOG.info("Timestamp not set in frame header; using current one {}", timestamp);
        }
        return timestamp;
    }
}
