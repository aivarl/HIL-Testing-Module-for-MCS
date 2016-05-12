/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.camel.component.websocket.WebsocketConstants;

import eu.estcube.webserver.cache.Cache;

/**
 *
 */
public abstract class WebsocketWithCacheRouteBuilder extends WebsocketRouteBuilder {

    /** @{inheritDoc . */
    @Override
    public void configure() throws Exception {
        super.configure();
        buildRouteForCache();
    }

    /** @{inheritDoc . */
    @Override
    protected void buildRouteToWebsocket() {
        // @formatter:off
        from(getSource())
            .bean(getCache(), "putObject")
            .bean(getSerializer())
            .to("log:eu.estcube.webserver.stats-ws-" + getName() + "?level=DEBUG&groupInterval=60000&groupDelay=60000&groupActiveOnly=false")
            .setHeader(WebsocketConstants.SEND_TO_ALL, constant(true))
            .inOnly(getDestination());
        // @formatter:on
    }

    protected void buildRouteForCache() {
        // @formatter:off
        from(getDestination())
            .bean(getCache(), "getAll")
            .split(body())
            .bean(getSerializer())
            .to("log:eu.estcube.webserver.stats-cache-" + getName() + "?level=DEBUG&groupInterval=60000&groupDelay=60000&groupActiveOnly=false")
            .inOnly(getDestination());
        // @formatter:on
    }

    protected abstract Cache<?, ?> getCache();
}
