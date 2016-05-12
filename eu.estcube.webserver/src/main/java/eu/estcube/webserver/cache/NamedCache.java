package eu.estcube.webserver.cache;

import org.hbird.exchange.interfaces.IEntityInstance;

/**
 * Caches IEntity instances by ID. Used for example for the Paramters.
 */
// TODO - 02.05.2013; kimmell - rename
public class NamedCache<T extends IEntityInstance> extends AbstractCache<String, T> {

    /**
     * Creates new NamedCache.
     * 
     * @param store
     */
    public NamedCache(Cache<String, T> store) {
        super(store);
    }

    /** @{inheritDoc . */
    @Override
    protected boolean shouldReplace(IEntityInstance oldValue, IEntityInstance newValue) {

        // TODO - 11.04.2013; kimmell - check if comparing ID-s would be good
        // enough

        if (oldValue instanceof IEntityInstance && newValue instanceof IEntityInstance) {
            IEntityInstance oldIssued = (IEntityInstance) oldValue;
            IEntityInstance newIssued = (IEntityInstance) newValue;
            return oldIssued.getTimestamp() <= newIssued.getTimestamp();
        } else {
            // we have INamed
            return true;
        }

    }

    /** @{inheritDoc . */
    @Override
    protected String getKey(T named) {
        return named.getID();
    }
}