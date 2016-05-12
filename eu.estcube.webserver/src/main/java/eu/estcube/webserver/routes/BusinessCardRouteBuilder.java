/** 
 *
 */
package eu.estcube.webserver.routes;

import org.hbird.exchange.core.BusinessCard;
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
public class BusinessCardRouteBuilder extends WebsocketWithCacheRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.businesscards";

    public static final long CACHE_TIMEOUT_FOR_BUSINESS_CARDS = 1000L * 60;

    private final Cache<String, BusinessCard> businessCardCache = new NamedCache<BusinessCard>(
            new GuavaTimeoutStore<String, BusinessCard>(CACHE_TIMEOUT_FOR_BUSINESS_CARDS));

    @Autowired
    private ToJsonProcessor toJson;

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return businessCardCache;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return WebserverMonitoringDispatcher.DESTINATION_BUSINESS_CARDS;
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
