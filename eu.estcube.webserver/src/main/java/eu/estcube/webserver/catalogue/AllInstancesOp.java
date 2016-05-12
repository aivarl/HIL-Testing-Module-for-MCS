package eu.estcube.webserver.catalogue;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.hbird.exchange.core.EntityInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AllInstancesOp implements CatalogueQueryNode.Op {
    private static Logger LOG = LoggerFactory.getLogger(AllInstancesOp.class);

    public static final String KEY_FROM = "from";
    public static final String KEY_TO = "to";

    protected static long getLongParam(Map<String, String[]> params, String name, long defaultValue) {
        try {
            if (params.containsKey(name)) {
                String[] values = params.get(name);

                if (values.length > 0) {
                    return Long.parseLong(values[0]);
                }
            }
        } catch (NumberFormatException e) {
            LOG.error("Invalid parameter value passed for " + name, e);
        }

        return defaultValue;
    }

    // TODO: Remove when hbird 0.11.0 is released
    protected static <T extends EntityInstance> List<T> filterByTimestamp(List<T> l, long from, long to) {
        List<T> filtered = new LinkedList<T>();

        for (T value : l) {
            if (value.getTimestamp() >= from && value.getTimestamp() <= to) {
                filtered.add(value);
            }
        }

        return filtered;
    }

    protected abstract <T extends EntityInstance> List<T> queryAll() throws Exception;

    protected abstract <T extends EntityInstance> List<T> queryByID(String id, long from, long to) throws Exception;

    @Override
    public List<EntityInstance> getResult(StringTokenizer st, Map<String, String[]> queryParams) {
        long from = getLongParam(queryParams, KEY_FROM, 0);
        long to = getLongParam(queryParams, KEY_TO, Long.MAX_VALUE);

        LOG.info("Returing result in interval [" + from + ", " + to + "]");

        try {
            if (st.hasMoreTokens()) { // querying for concrete parameter
                String objectID = RootNode.decodeID(st.nextToken());

                return queryByID(objectID, from, to);
            } else {
                List<EntityInstance> all = queryAll();

                if (queryParams.containsKey(KEY_FROM) || queryParams.containsKey(KEY_FROM)) {
                    all = filterByTimestamp(all, from, to);
                }

                return all;
            }
        } catch (Exception e) {
            LOG.error("Query failed: ", e);

            return Collections.emptyList();
        }
    }
}
