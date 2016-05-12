package eu.estcube.webserver.routes;

import org.apache.camel.component.websocket.WebsocketConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.TransportFrameCache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;
import eu.estcube.webserver.domain.TransportFrame;
import eu.estcube.webserver.utils.ToTransportFrame;

@Component
public class ArchiverRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final long CACHE_TIMEOUT_FOR_NAMED_OBJECTS = 1000L * 60 * 60 * 12;
    public static final String WEBSOCKET = "websocket://estcube.out.archive";
   
    @Autowired
    private ToTransportFrame toTransportFrame;
    
    @Autowired
    private ToJsonProcessor toJson;
    
    public static final int CACHE_LIMIT_FOR_TRANSPORT_FRAMES = 25;
    
    @Override
    protected void buildRouteToWebsocket() {
	    // @formatter:off
    	
    	   // socket
        from(getSource())
            .bean(toTransportFrame)     
            .bean(getSerializer())
            .to("log:eu.estcube.webserver.stats-ws-" + getName() + "?level=DEBUG&groupInterval=60000&groupDelay=60000&groupActiveOnly=false")
            .setHeader(WebsocketConstants.SEND_TO_ALL, constant(true))
            .inOnly(getDestination());
        
	    // @formatter:on
    }
    
    private final Cache<String, TransportFrame> cache = new TransportFrameCache(
            new SimpleLimitStore<String, TransportFrame>(CACHE_LIMIT_FOR_TRANSPORT_FRAMES));

    @Override
    protected Cache<?, ?> getCache() {
        return cache;
    }

    @Override
    protected Object getSerializer() {
        return toJson;
    }

    @Override
    protected String getSource() {
       return "activemq:queue:customQueryReturn";
    }

    @Override
    protected String getDestination() {
      return WEBSOCKET;
    }

}
