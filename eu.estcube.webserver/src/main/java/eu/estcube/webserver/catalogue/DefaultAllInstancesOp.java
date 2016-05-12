package eu.estcube.webserver.catalogue;

import java.util.ArrayList;
import java.util.List;

import org.hbird.business.api.IDataAccess;
import org.hbird.business.api.exceptions.ArchiveException;
import org.hbird.exchange.core.EntityInstance;

public class DefaultAllInstancesOp<T extends EntityInstance> extends AllInstancesOp {
    protected IDataAccess dao;
    protected Class<T> clazz;

    public DefaultAllInstancesOp(IDataAccess dao, Class<T> clazz) {
        this.dao = dao;
        this.clazz = clazz;
    }

    protected List<T> getAllInstances() throws ArchiveException {
        List<T> lastVersions = dao.getAll(clazz);
        List<T> all = new ArrayList<T>();

        for (T instance : lastVersions) {
            all.addAll(dao.getAllInstancesById(instance.getID(), clazz));
        }

        return all;
    }

    @Override
    protected List<T> queryAll() throws Exception {
        // XXX: Problem: in hbird 0.10.0, dao.getAll returns only the last
        // versions of all IDs

        // This is workaround for now. TODO: Remove when hbird is updated
        // Note: Maybe this functionality could be left as optional query
        // parameter (e.g. ?onlyLastVersions)
        return getAllInstances();
    }

    @Override
    protected List<T> queryByID(String id, long from, long to) throws Exception {
        return AllInstancesOp.filterByTimestamp(dao.getAllInstancesById(id, clazz), from, to);
    }

}
