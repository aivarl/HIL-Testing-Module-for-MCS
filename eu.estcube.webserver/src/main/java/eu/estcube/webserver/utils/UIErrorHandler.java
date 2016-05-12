package eu.estcube.webserver.utils;

import org.apache.camel.ExchangeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;

/**
 * Error handler to be used in Camel routes.
 * Creates {@link UIResponse} objects from {@link Exception}s.
 */
@Component
public class UIErrorHandler {

    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(UIErrorHandler.class);

    /**
     * Creates {@link UIResponse} object from {@link Exception}.
     * 
     * @param exception {@link Exception} to use
     * @return new {@link UIResponse} instance with {@link Status#ERROR} and
     *         message from {@link Exception}.
     */
    public UIResponse process(@ExchangeException Exception exception) {
        String message = exception.getMessage();
        LOG.error("UI error", message, exception);
        UIResponse result = new UIResponse(Status.ERROR, message);
        return result;
    }
}
