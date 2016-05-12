/** 
 *
 */
package eu.estcube.webserver.routes;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.common.script.io.HardwareTestingMessage;
import eu.estcube.webserver.cache.AbstractCache;
import eu.estcube.webserver.cache.Cache;
import eu.estcube.webserver.cache.simple.SimpleLimitStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class HardwareTestingOutputRouteBuilder extends WebsocketWithCacheRouteBuilder {

    public static final String WEBSOCKET = "websocket://hbird.out.hardwaretesting.output";

    private final Cache<String, HardwareTestingMessage> scriptOutputCache = new ScriptOutputCache(new SimpleLimitStore<String, HardwareTestingMessage>(
            1000));

    public static class ScriptOutputCache extends AbstractCache<String, HardwareTestingMessage> {

        public ScriptOutputCache(Cache<String, HardwareTestingMessage> store) {
            super(store);
        }

        @Override
        protected String getKey(HardwareTestingMessage value) {
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
        return WebserverMonitoringDispatcher.DESTINATION_HARDWARETESTINGOUTPUT;
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
