/** 
 *
 */
package eu.estcube.webserver.cache.simple;

import java.util.LinkedHashMap;

/**
 *
 */
public class LinkedHashMapWithSizeLimit<K, V> extends LinkedHashMap<K, V> {

    private static final long serialVersionUID = 9167133327849949510L;

    protected final int maxSize;

    public LinkedHashMapWithSizeLimit(int maxSize) {
        super();
        this.maxSize = maxSize;
    }

    /** @{inheritDoc . */
    @Override
    protected boolean removeEldestEntry(java.util.Map.Entry<K, V> eldest) {
        return size() > maxSize;
    }

    public int getMaxSize() {
        return maxSize;
    }
}
