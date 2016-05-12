/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.camel.component.websocket.WebsocketConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public abstract class WebsocketRouteBuilder extends WebserverRouteBuilder {
    private Logger LOG = LoggerFactory.getLogger(WebsocketRouteBuilder.class);

    /** @{inheritDoc . */
    @Override
    public void configure() throws Exception {
        buildRouteToWebsocket();
    }

    protected void buildRouteToWebsocket() {
        // @formatter:off
        from(getSource())
            .bean(getSerializer())
            .to("log:eu.estcube.webserver.stats-ws-" +  getName() + "?level=DEBUG&groupInterval=60000&groupDelay=60000&groupActiveOnly=false")
            .setHeader(WebsocketConstants.SEND_TO_ALL, constant(true))
            .inOnly(getDestination());
        // @formatter:on
    }

    protected abstract Object getSerializer();
}
