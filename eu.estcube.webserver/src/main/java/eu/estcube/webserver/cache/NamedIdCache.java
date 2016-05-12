/** 
 *
 */
package eu.estcube.webserver.cache;

import org.hbird.exchange.interfaces.IEntityInstance;

/**
 * Caches IEntityInstances by instance ID. Used for example for the Events.
 */
// TODO - 02.05.2013; kimmell - rename
public class NamedIdCache<T extends IEntityInstance> extends AbstractCache<String, T> {

    /**
     * Creates new NamedIdCache.
     * 
     * @param store
     */
    public NamedIdCache(Cache<String, T> store) {
        super(store);
    }

    /** @{inheritDoc . */
    @Override
    protected String getKey(T named) {
        return named.getInstanceID();
    }
}
