/** 
 *
 */
package eu.estcube.webserver.cache.guava;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

/**
 * Cache size and content is not predictable. Size is never bigger than limit,
 * but it not straight forward calculation.
 * 
 * This cache is not suitable for implementations where items have to be ordered
 * and evicted by order they where added.
 */
public class GuavaLimitStore<K, V> extends AbstractGuavaStore<K, V, Long> {

    public GuavaLimitStore(Long maxSize) {
        super(maxSize);
    }

    /** @{inheritDoc . */
    @Override
    protected Cache<K, V> createCache(Long maxSize) {
        return CacheBuilder.newBuilder().maximumSize(maxSize).build();
    }
}
