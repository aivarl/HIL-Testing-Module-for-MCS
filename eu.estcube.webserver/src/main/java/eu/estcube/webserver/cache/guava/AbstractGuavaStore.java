/** 
 *
 */
package eu.estcube.webserver.cache.guava;

import eu.estcube.webserver.cache.Cache;

/**
 *
 */
public abstract class AbstractGuavaStore<K, V, C> implements Cache<K, V> {

    protected final com.google.common.cache.Cache<K, V> cache;

    public AbstractGuavaStore(C config) {
        this.cache = createCache(config);
    }

    protected abstract com.google.common.cache.Cache<K, V> createCache(C c);

    /** @{inheritDoc . */
    @Override
    public V get(K key) {
        return cache.getIfPresent(key);
    }

    /** @{inheritDoc . */
    @Override
    public Iterable<V> getAll() {
        return cache.asMap().values();
    }

    /** @{inheritDoc . */
    @Override
    public V remove(K key) {
        V value = cache.getIfPresent(key);
        cache.invalidate(key);
        return value;
    }

    /** @{inheritDoc . */
    @Override
    public V put(K key, V value) {
        cache.put(key, value);
        return value;
    }
}
