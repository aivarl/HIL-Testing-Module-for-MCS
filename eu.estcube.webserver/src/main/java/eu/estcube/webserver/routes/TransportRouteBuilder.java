/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.camel.component.websocket.WebsocketConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.domain.transport.Downlink;
import eu.estcube.domain.transport.Uplink;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.TransportFrameCache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;
import eu.estcube.webserver.domain.TransportFrame;
import eu.estcube.webserver.json.TransportFrameToJsonProcessor;
import eu.estcube.webserver.utils.ToTransportFrame;

/**
 *
 */
@Component
public class TransportRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String WEBSOCKET = "websocket://estcube.out.transport";

    public static final String FILTER_AX25 = "${in.header.class} == 'Ax25UIFrame'";

    public static final int CACHE_LIMIT_FOR_TRANSPORT_FRAMES = 25;

    @Autowired
    private ToTransportFrame toTransportFrame;

    @Autowired
    private TransportFrameToJsonProcessor transportFrameToJson;

    private final Cache<String, TransportFrame> transportCache = new TransportFrameCache(
            new SimpleLimitStore<String, TransportFrame>(CACHE_LIMIT_FOR_TRANSPORT_FRAMES));

    /** @{inheritDoc . */
    @Override
    protected void buildRouteToWebsocket() {
        // @formatter:off
        // TNC downlink frames
        from(Downlink.FROM_TNC)
                .to("direct:estcubeTransport");

        // AX.25 downlink frames
        from(Downlink.AX25_FRAMES)
                .to("direct:estcubeTransport");

        // TNC uplink frames
        from(Uplink.TNC_FRAMES_LOG)
                .to("direct:estcubeTransport");

        // AX.25 uplink frames
        from(Uplink.AX25_FRAMES_LOG)
                .to("direct:estcubeTransport");

         // socket
         from("direct:estcubeTransport")
             .bean(toTransportFrame)      
             .choice().when(simple(FILTER_AX25)).bean(transportCache, "putObject").end()
             .bean(transportFrameToJson)
             .to("log:eu.estcube.webserver.stats-ws-" + getName() + "?level=DEBUG&groupInterval=60000&groupDelay=60000&groupActiveOnly=false")
             .setHeader(WebsocketConstants.SEND_TO_ALL, constant(true))
             .inOnly(getDestination());
         
         
         // @formatter:on
    }

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return transportCache;
    }

    /** @{inheritDoc . */
    @Override
    protected Object getSerializer() {
        return transportFrameToJson;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return null;
    }

    /** @{inheritDoc . */
    @Override
    protected String getDestination() {
        return WEBSOCKET;
    }
}
