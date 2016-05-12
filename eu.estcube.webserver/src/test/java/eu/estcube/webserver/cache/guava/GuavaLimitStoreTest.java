/** 
 *
 */
package eu.estcube.webserver.cache.guava;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;

/**
 *
 */
public class GuavaLimitStoreTest {

    private static final Long LIMIT = 5L;

    private GuavaLimitStore<String, Integer> guavaLimitStore;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        guavaLimitStore = new GuavaLimitStore<String, Integer>(LIMIT);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaLimitStore#GuavaLimitStore(java.lang.Long)}
     * .
     */
    @Test
    public void testGuavaLimitStore() {
        Iterator<Integer> all = guavaLimitStore.getAll().iterator();
        assertFalse(all.hasNext());
        for (int i = 0; i <= LIMIT; i++) {
            // System.out.printf("put %s %n", i);
            guavaLimitStore.put(String.valueOf(i), new Integer(i));
        }
        all = guavaLimitStore.getAll().iterator();
        int counter = 0;
        while (all.hasNext()) {
            all.next();
            // System.out.printf("%s %n", all.next());
            counter++;
        }
        assertTrue(counter <= LIMIT);

        // the cache size is not predictable
        // also the content of cache is not predictable
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaLimitStore#createCache(java.lang.Long)}
     * .
     */
    @Test
    public void testCreateCacheLong() {
        assertNotNull(guavaLimitStore.createCache(LIMIT));
    }
}
