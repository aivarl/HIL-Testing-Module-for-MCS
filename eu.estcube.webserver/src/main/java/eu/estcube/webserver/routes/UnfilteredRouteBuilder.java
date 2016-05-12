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
public class UnfilteredRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.all";

    @Autowired
    private ToJsonProcessor toJson;

    // TODO - 07.04.2013; kimmell - 10 minutes time out is probably too short
    // for the parameters
    public static final long CACHE_TIMEOUT_FOR_NAMED_OBJECTS = 1000L * 60 * 10;

    private final Cache<String, IEntityInstance> cache = new NamedCache<IEntityInstance>(
            new GuavaTimeoutStore<String, IEntityInstance>(CACHE_TIMEOUT_FOR_NAMED_OBJECTS));

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return cache;
    }

    /** @{inheritDoc . */
    @Override
    protected Object getSerializer() {
        return toJson;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return WebserverMonitoringDispatcher.DESTINATION_UNFILTERED;
    }

    /** @{inheritDoc . */
    @Override
    protected String getDestination() {
        return WEBSOCKET;
    }
}
