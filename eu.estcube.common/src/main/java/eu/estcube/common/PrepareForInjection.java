package eu.estcube.common;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.hbird.business.core.AddHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Wraps {@link AddHeaders} to enable Spring's auto wire capability.
 * 
 * Needed until the {@link AddHeaders} class is improved in the HBird.
 * 
 * @Deprecated wait for {@link AddHeaders} improvements in Hbird. Probably in
 *             next version 0.10.0.
 */
@Deprecated
@Component
public class PrepareForInjection implements Processor {

    private static final Logger LOG = LoggerFactory.getLogger(PrepareForInjection.class);

    private AddHeaders addHeaders = new AddHeaders();

    /** @{inheritDoc . */
    @Override
    public void process(Exchange exchange) throws Exception {
        addHeaders.process(exchange);
        if (Boolean.TRUE.equals(exchange.getProperty(Exchange.ROUTE_STOP))) {
            LOG.warn("Exchange body is null; dropping exchange");
        }
    }
}
