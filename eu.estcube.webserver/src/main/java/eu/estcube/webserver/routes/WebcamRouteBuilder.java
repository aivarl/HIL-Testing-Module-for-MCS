/** 
 *
 */
package eu.estcube.webserver.routes;

import org.hbird.exchange.interfaces.IEntityInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.NamedCache;
import eu.estcube.webserver.cache.guava.GuavaTimeoutStore;

/**
 *
 */
@Component
public class WebcamRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String SOURCE = "activemq:topic:webcamSend";
    public static final String WEBSOCKET = "websocket://hbird.out.binary";

    public static final long CACHE_TIMEOUT_FOR_NAMED_OBJECTS = 1000L * 60 * 10;

    private final Cache<String, IEntityInstance> binaryCache = new NamedCache<IEntityInstance>(
            new GuavaTimeoutStore<String, IEntityInstance>(CACHE_TIMEOUT_FOR_NAMED_OBJECTS));

    @Autowired
    private ToJsonProcessor toJson;

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return SOURCE;
    }

    /** @{inheritDoc . */
    @Override
    protected String getDestination() {
        return WEBSOCKET;
    }

    /** @{inheritDoc . */
    @Override
    protected Object getSerializer() {
        return toJson;
    }

    @Override
    protected Cache<?, ?> getCache() {
        // TODO Auto-generated method stub
        return binaryCache;
    }
}
