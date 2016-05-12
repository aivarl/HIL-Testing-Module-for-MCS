package eu.estcube.webserver.cache;

import org.apache.camel.Body;

public abstract class AbstractCache<K, V> implements ObjectCache<K, V> {

    private final Cache<K, V> store;

    public AbstractCache(Cache<K, V> store) {
        this.store = store;
    }

    /** @{inheritDoc . */
    @Override
    public V putObject(@Body V value) {
        if (value == null) {
            throw new NullPointerException("value is null");
        }

        K key = getKey(value);
        if (key == null) {
            throw new NullPointerException("Key null returned for the value: " + value
                    + "; Check the getKey(value) implementation");
        }
        return put(key, value);
    }

    /** @{inheritDoc . */
    @Override
    public V put(K key, V newValue) {
        if (key == null) {
            throw new NullPointerException("Key is null");
        }
        if (newValue == null) {
            throw new NullPointerException("Value is null");
        }
        V oldValue = store.get(key);
        V result = oldValue;
        if (oldValue == null || shouldReplace(oldValue, newValue)) {
            store.put(key, newValue);
            result = newValue;
        }
        return result;
    }

    /** @{inheritDoc . */
    @Override
    public V get(K key) {
        return store.get(key);
    }

    /** @{inheritDoc . */
    @Override
    public Iterable<V> getAll() {
        return store.getAll();
    }

    /** @{inheritDoc . */
    @Override
    public V remove(K key) {
        return store.remove(key);
    }

    protected abstract K getKey(V value);

    protected boolean shouldReplace(V oldValue, V newValue) {
        // by default accept all new values
        // override in subclasses for additional checks. Eg based on timestamp
        // etc.
        return true;
    }
}