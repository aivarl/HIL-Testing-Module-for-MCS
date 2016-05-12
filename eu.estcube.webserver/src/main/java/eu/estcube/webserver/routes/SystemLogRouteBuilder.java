/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.log4j.spi.LoggingEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.LogCache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;

/**
 *
 */
@Component
public class SystemLogRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String SOURCE = "activemq:topic:systemlog";
    public static final String WEBSOCKET = "websocket://hbird.out.systemlog";

    public static final int CACHE_LIMIT_FOR_LOGS = 200;

    private final Cache<String, LoggingEvent> logCache = new LogCache(new SimpleLimitStore<String, LoggingEvent>(
            CACHE_LIMIT_FOR_LOGS));

    @Autowired
    private ToJsonProcessor toJson;

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return logCache;
    }

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
}
