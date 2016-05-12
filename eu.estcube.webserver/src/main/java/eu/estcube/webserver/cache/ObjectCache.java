/** 
 *
 */
package eu.estcube.webserver.cache;

/**
 *
 */
public interface ObjectCache<K, V> extends Cache<K, V> {

    /**
     * Stores given object to cache.
     * 
     * Implementation can reject the value and use existing one. For example in
     * case where
     * new value is actually older than stored value.
     * 
     * Implementation is responsible for calculating the cache key and make
     * decision which value to store.
     * To be able to use this cache in camel routes without side effects the
     * stored value has to be returned.
     * 
     * @param value the value to be stored in cache.
     * @return value stored in cache
     */
    public V putObject(V value);
}
