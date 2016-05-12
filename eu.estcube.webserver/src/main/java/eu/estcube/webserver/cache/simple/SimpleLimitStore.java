/** 
 *
 */
package eu.estcube.webserver.cache.simple;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import eu.estcube.webserver.cache.Cache;

/**
 *
 */
public class SimpleLimitStore<K, V> implements Cache<K, V> {

    protected final Map<K, V> map;
    protected final int maxSize;

    /**
     * Creates new SimpleLimitStore.
     * 
     */
    public SimpleLimitStore(int maxSize) {
        map = Collections.synchronizedMap(new LinkedHashMapWithSizeLimit<K, V>(maxSize));
        this.maxSize = maxSize;
    }

    /** @{inheritDoc . */
    @Override
    public V put(K key, V value) {
        return map.put(key, value);
    }

    /** @{inheritDoc . */
    @Override
    public V get(K key) {
        return map.get(key);
    }

    /** @{inheritDoc . */
    @Override
    public Iterable<V> getAll() {
        List<V> values = new ArrayList<V>(maxSize);
        values.addAll(map.values());
        return values;
    }

    /** @{inheritDoc . */
    @Override
    public V remove(K key) {
        return map.remove(key);
    }
}
