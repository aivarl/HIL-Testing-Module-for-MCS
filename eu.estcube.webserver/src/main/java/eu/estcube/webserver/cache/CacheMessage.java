package eu.estcube.webserver.cache;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import org.apache.camel.Exchange;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.springframework.stereotype.Component;

/**
 * Bean for caching telemetryobjects from messages that are passed through it
 * and returning cached elements by request in the message body.
 * 
 * @author Kaupo Kuresson
 */
@Component
public class CacheMessage {

    static final Comparator<IEntityInstance> TIME_ORDER = new Comparator<IEntityInstance>() {
        public int compare(IEntityInstance t1, IEntityInstance t2) {
            return Long.valueOf(t1.getTimestamp()).compareTo(t2.getTimestamp());
        }
    };

    private static int cacheLimit;

    /**
     * HashMap containing cached TelemetryObjects as values and their
     * names(String) as keys.
     */
    private static HashMap<String, ArrayList<IEntityInstance>> objectCache = new HashMap<String, ArrayList<IEntityInstance>>();

    /**
     * Takes a TelemetryObject from the body of a passing message and adds it to
     * the cache.
     * 
     * @param ex
     *        Camel automatically binds the Exchange to this parameter.
     * @see <a
     *      href="http://camel.apache.org/maven/current/camel-core/apidocs/org/apache/camel/Exchange.html">Exchange</a>
     */
    public void addToCache(Exchange ex) {
        IEntityInstance named = ex.getIn().getBody(IEntityInstance.class);
        String key = named.getIssuedBy() + named.getName();
        if (!objectCache.containsKey(key)) {
            ArrayList<IEntityInstance> newList = new ArrayList<IEntityInstance>();
            newList.add(named);
            objectCache.put(key, newList);
        } else {
            ArrayList<IEntityInstance> list = objectCache.get(key);
            list.add(named);
            Collections.sort(list, TIME_ORDER); // list will start with older
                                                // entries, end with newer
            if (list.size() > cacheLimit) {
                list.remove(0); // remove oldest entry
            }
        }
    }

    /**
     * Gets a specific element from the cache and returns it in the message
     * body.
     * 
     * @param ex
     *        Camel automatically binds the Exchange to this parameter.
     * @param param
     *        Source, device, name of the TelemetryObject to get out of the
     *        cache.
     * @see <a
     *      href="http://camel.apache.org/maven/current/camel-core/apidocs/org/apache/camel/Exchange.html">Exchange</a>
     */
    public void getCachedElement(Exchange ex, HashMap<String, String> param) {
        String key = param.get("ISSUEDBY") + param.get("NAME");
        ex.getOut().setBody(objectCache.get(key));
    }

    /**
     * Returns the whole cache in the message body.
     * 
     * @param ex
     *        Camel automatically binds the Exchange to this parameter.
     * @see <a
     *      href="http://camel.apache.org/maven/current/camel-core/apidocs/org/apache/camel/Exchange.html">Exchange</a>
     */
    public void getCache(Exchange ex) {
        List<IEntityInstance> list = new ArrayList<IEntityInstance>();

        for (String key : objectCache.keySet()) {
            for (IEntityInstance obj : objectCache.get(key))
                list.add(obj);
        }
        ex.getOut().setBody(list);
    }

    public static int getCacheLimit() {
        return cacheLimit;
    }

    public static void setCacheLimit(int cacheLimit) {
        CacheMessage.cacheLimit = cacheLimit;
    }
}
