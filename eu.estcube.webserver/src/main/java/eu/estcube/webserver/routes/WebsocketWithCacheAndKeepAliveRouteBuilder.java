/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.camel.Handler;
import org.apache.camel.component.websocket.WebsocketConstants;

/**
 *
 */
public abstract class WebsocketWithCacheAndKeepAliveRouteBuilder extends WebsocketWithCacheRouteBuilder {

    public static final long DEFAULT_KEEP_ALIVE_INTERVAL = 1000L * 60 * 3L;

    /** @{inheritDoc . */
    @Override
    public void configure() throws Exception {
        super.configure();
        buildRouteForKeepAlive();
    }

    protected void buildRouteForKeepAlive() {
        KeepAlive message = new KeepAlive();

        // @formatter:off
        from("timer:keep-alive-" + getName() + "?fixedRate=true&period=" + getKeepAliveInterval())
            .bean(message)
            .bean(getSerializer())
            .setHeader(WebsocketConstants.SEND_TO_ALL, constant(true))
            .to("log:eu.estcube.webserver.keep-alive-" + getName() + "?level=DEBUG")
            .to(getDestination());
        // @formatter:on
    }

    protected long getKeepAliveInterval() {
        return DEFAULT_KEEP_ALIVE_INTERVAL;
    }

    protected static class KeepAlive {

        @SuppressWarnings("unused")
        private final String message = getClass().getSimpleName();

        @Handler
        public KeepAlive touch() {
            return this;
        }
    }
}
