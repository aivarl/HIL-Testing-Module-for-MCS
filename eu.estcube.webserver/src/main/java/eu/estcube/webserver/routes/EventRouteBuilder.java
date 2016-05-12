/** 
 *
 */
package eu.estcube.webserver.routes;

import org.hbird.exchange.configurator.StandardEndpoints;
import org.hbird.exchange.core.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.NamedIdCache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;

/**
 *
 */
@Component
public class EventRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.events";

    public static final int CACHE_LIMIT_FOR_EVENTS = 200;

    private final Cache<String, Event> eventCache = new NamedIdCache<Event>(new SimpleLimitStore<String, Event>(
            CACHE_LIMIT_FOR_EVENTS));

    @Autowired
    private ToJsonProcessor toJsonProcessor;

    /** @{inheritDoc . */
    @Override
    protected Cache<String, Event> getCache() {
        return eventCache;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return StandardEndpoints.EVENTS;
    }

    /** @{inheritDoc . */
    @Override
    protected String getDestination() {
        return WEBSOCKET;
    }

    /** @{inheritDoc . */
    @Override
    protected Object getSerializer() {
        return toJsonProcessor;
    }
}
