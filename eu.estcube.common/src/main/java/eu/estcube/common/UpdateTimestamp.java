/** 
 *
 */
package eu.estcube.common;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.hbird.exchange.constants.StandardArguments;
import org.springframework.stereotype.Component;

/**
 * Processor to update header {@value StandardArguments.TIMESTAMP} value to
 * current moment.
 */
@Component
public class UpdateTimestamp implements Processor {

    /** @{inheritDoc . */
    @Override
    @Handler
    public void process(Exchange exchange) throws Exception {
        Message in = exchange.getIn();
        Message out = exchange.getOut();
        out.copyFrom(in);
        out.setHeader(StandardArguments.TIMESTAMP, System.currentTimeMillis());
    }
}
