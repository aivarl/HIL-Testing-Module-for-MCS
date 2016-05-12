package eu.estcube.webserver.cache.guava;

import java.util.concurrent.TimeUnit;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

/**
 *
 */
public class GuavaTimeoutStore<K, V> extends AbstractGuavaStore<K, V, Long> {

    public GuavaTimeoutStore(Long timeoutInMillis) {
        super(timeoutInMillis);
    }

    /** @{inheritDoc . */
    @Override
    protected Cache<K, V> createCache(Long timeoutInMillis) {
        return CacheBuilder.newBuilder()
                .expireAfterWrite(timeoutInMillis, TimeUnit.MILLISECONDS)
                .build();
    }
}
