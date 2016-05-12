/** 
 *
 */
package eu.estcube.webserver.cache;


/**
 *
 */
public interface Cache<K, V> {

    public V put(K key, V value);

    public V get(K key);

    public Iterable<V> getAll();

    public V remove(K key);
}
