/** 
 *
 */
package eu.estcube.webserver.routes;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.common.script.io.ScriptMessage;
import eu.estcube.webserver.cache.AbstractCache;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class ScriptOutputRouteBuilder extends WebsocketWithCacheRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.script.output";

    private final Cache<String, ScriptMessage> scriptOutputCache = new ScriptOutputCache(new SimpleLimitStore<String, ScriptMessage>(
            1000));

    public static class ScriptOutputCache extends AbstractCache<String, ScriptMessage> {

        public ScriptOutputCache(Cache<String, ScriptMessage> store) {
            super(store);
        }

        @Override
        protected String getKey(ScriptMessage value) {
            return value.getMessage();
        }
    }

    @Autowired
    private ToJsonProcessor toJson;

    /** @{inheritDoc . */
    @Override
    protected Cache<?, ?> getCache() {
        return scriptOutputCache;
    }

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return WebserverMonitoringDispatcher.DESTINATION_SCRIPTOUTPUT;
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
