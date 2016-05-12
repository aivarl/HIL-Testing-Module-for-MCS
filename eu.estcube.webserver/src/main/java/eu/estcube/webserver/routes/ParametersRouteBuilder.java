/** 
 *
 */
package eu.estcube.webserver.routes;

import org.hbird.business.core.AddHeaders;
import org.hbird.exchange.configurator.StandardEndpoints;
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
public class ParametersRouteBuilder extends WebsocketWithCacheAndKeepAliveRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.parameters";

    public static final long CACHE_TIMEOUT_FOR_NAMED_OBJECTS = 1000L * 60 * 60 * 12;

    private final Cache<String, IEntityInstance> cache = new NamedCache<IEntityInstance>(
            new GuavaTimeoutStore<String, IEntityInstance>(CACHE_TIMEOUT_FOR_NAMED_OBJECTS));

    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private AddHeaders addHeaders;

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return cache;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return "direct:parameters";
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

    /** @{inheritDoc . */
    @Override
    public void configure() throws Exception {
        // A hack to split the parameters and handle them separately
        super.configure();

        // @formatter:off
        from(StandardEndpoints.CALIBRATED_PARAMETERS)
            .split(body())
                .bean(addHeaders)
                .to(getSource());
        // @formatter:on
    }
}
