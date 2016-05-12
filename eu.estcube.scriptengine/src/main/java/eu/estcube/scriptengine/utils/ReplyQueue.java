package eu.estcube.scriptengine.utils;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import com.google.common.collect.TreeMultimap;

import java.util.Collection;
import java.util.Iterator;

/**
 * {@link eu.estcube.scriptengine.io.ScriptIO#poll(String)} requires a few
 * properties, namely:<br>
 * <ol>
 * <li>Need to be able to poll received replies for a specific command name</li>
 * <li>Those replies need to be in FIFO order</li>
 * <li>Replies should "expire" (ie. be removed if not removed within a
 * timeperiod from addition)</li>
 * </ol>
 *
 * It would be possible to do that just with combination of collections, but
 * that makes the code messy
 * and hard to reason, thus ReplyQueue. <br>
 * <br>
 * If ReplyQueue was made using collections, it would look something like
 * <code>{@code Map<String, Queue<T>>}</code> but support concurrency
 */
public class ReplyQueue<T> {
    private int timeoutDelay;
    private final Multimap<String, TimedItem<T>> map = Multimaps.synchronizedMultimap(ArrayListMultimap
            .<String, TimedItem<T>> create());

    /**
     *
     * @param timeoutDelay the amount of time the element should stay in
     *        ReplyQueue before being removed
     */
    public ReplyQueue(int timeoutDelay) {
        this.timeoutDelay = timeoutDelay;
    }

    /**
     * Adds a new item to queue with given key. This method is synchronized.
     * 
     * @param key
     * @param el
     */
    public void offer(String key, T el) {
        map.put(key, new TimedItem(el));
    }

    private boolean hasExpired(TimedItem<T> item) {
        long lifetime = System.currentTimeMillis() - item.timestamp;
        return lifetime >= timeoutDelay;
    }

    /**
     * Retrieves first unexpired item with given key or null if it does not
     * exist. This method is synchronized.
     * 
     * @param key
     * @return
     */
    public T poll(String key) {
        if (!map.containsKey(key))
            return null;

        Collection<TimedItem<T>> col = map.get(key);

        // Only one thread should access same key's collection at once
        synchronized (map) {
            TimedItem<T> obj = null;
            // Find first unexpired item in the queue
            for (Iterator<TimedItem<T>> it = col.iterator(); it.hasNext(); ) {
                obj = it.next();
                it.remove();

                if (!hasExpired(obj))
                    return obj.data;
            }
            return null;
        }
    }

    private static class TimedItem<T> {
        T data;
        long timestamp;

        public TimedItem(T data) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
    }
}
