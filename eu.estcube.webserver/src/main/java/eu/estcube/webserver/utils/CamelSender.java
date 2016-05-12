package eu.estcube.webserver.utils;

import org.apache.camel.InOnly;
import org.apache.camel.InOut;

import eu.estcube.webserver.domain.UIResponse;

/**
 * Interface to send messages to Camel routes from POJOs.
 * 
 * Code below will send input objects to Camel route "direct:input" and return
 * {@link UIResponse} object as result.
 * 
 * <pre>
 * &#064;Component
 * class Demo {
 * 
 *     &#064;Produce(uri = &quot;direct:input&quot;)
 *     private CamelSender camel;
 * 
 *     public UIResponse handleInput(Object o) throws Exception {
 *         UIResponse response = camel.send(o);
 *         return response;
 *     }
 * }
 * </pre>
 */
public interface CamelSender {

    /**
     * Sends message to Camel route without waiting response.
     * 
     * @param message {@link Object} to send
     * @throws Exception in case message sending fails
     */
    @InOnly
    void sendAsync(Object message) throws Exception;

    /**
     * Sends message to Camel route and waits {@link UIResponse} as result.
     * 
     * @param message {@link Object} to send
     * @return {@link UIResponse} as result
     * @throws Exception in case message sending fails
     */
    @InOut
    UIResponse send(Object message) throws Exception;
}
