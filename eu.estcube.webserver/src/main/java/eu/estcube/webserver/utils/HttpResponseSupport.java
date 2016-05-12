package eu.estcube.webserver.utils;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;

/**
 * Helper methods for working with {@link HttpServletResponse}.
 */
@Component
public class HttpResponseSupport {

    /** Content type for JSON response. */
    public static final String CONTENT_TYPE_JSON = "application/json";

    static final int DEBUG_LENGTH = 100;

    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(HttpResponseSupport.class);

    /**
     * Serializes given {@link Object} to JSON and sends it to the response's
     * output stream using correct content type.
     * 
     * @param response {@link HttpServletResponse} to use
     * @param toJsonProcessor JSON serializer
     * @param valueToSend {@link Object} to send
     * @throws Exception in case of failures
     */
    public void sendAsJson(HttpServletResponse response, ToJsonProcessor toJsonProcessor, Object valueToSend)
            throws Exception {
        try {
            String json = toJsonProcessor.process(valueToSend);
            LOG.debug("Serialized object: {}", chop(json, DEBUG_LENGTH));
            response.setContentType(CONTENT_TYPE_JSON);
            response.getOutputStream().println(json);
            response.getOutputStream().flush();
        } catch (Exception e) {
            LOG.error("Failed to serialize " + valueToSend + " to response as JSON", e);
            throw new Exception("Failed to serialize " + valueToSend + " to response as JSON", e);
        }
    }

    String chop(String str, int maxLength) {
        return str == null ? "null" : (str.length() <= maxLength ? str : (str.substring(0, maxLength) + " ..."));
    }
}
