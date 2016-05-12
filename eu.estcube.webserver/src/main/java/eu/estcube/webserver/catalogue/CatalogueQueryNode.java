package eu.estcube.webserver.catalogue;

import java.util.Map;
import java.util.StringTokenizer;
import java.util.TreeMap;

public class CatalogueQueryNode {

    public interface Op {
        Object getResult(StringTokenizer st, Map<String, String[]> queryParams);
    }

    Map<String, Op> m_options = new TreeMap<String, CatalogueQueryNode.Op>();

    Object runQuery(StringTokenizer st, Map<String, String[]> queryParams) {
        if (!st.hasMoreTokens())
            return null;

        String name = st.nextToken();

        Op op = m_options.get(name);
        if (null != op) {
            return op.getResult(st, queryParams);
        }

        return null;
    }

    protected void addOption(String name, Op operation) {
        m_options.put(name, operation);
    }

}
