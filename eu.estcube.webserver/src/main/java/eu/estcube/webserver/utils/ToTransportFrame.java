/** 
 *
 */
package eu.estcube.webserver.utils;

import java.io.Serializable;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.camel.Message;
import org.hbird.exchange.constants.StandardArguments;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.domain.TransportFrame;

/**
 *
 */
@Component
public class ToTransportFrame {

    public static final String PRIMARY_TIMESTAMP = StandardArguments.TIMESTAMP;
    public static final String SECONDARY_TIMESTAMP = "JMSTimestamp";

    @Handler
    public TransportFrame process(Exchange exchange) {
        Message in = exchange.getIn();
        Map<String, Object> headers = in.getHeaders();
        Object timestamp = getTimestamp(headers);
        Serializable frame = in.getBody(Serializable.class);
        return new TransportFrame(frame, headers, timestamp);
    }

    Object getTimestamp(Map<String, Object> headers) {
        Object timestamp;
        timestamp = headers.get(PRIMARY_TIMESTAMP);
        if (timestamp == null) {
            timestamp = headers.get(SECONDARY_TIMESTAMP);
        }
        if (timestamp == null) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }
}
