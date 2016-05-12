/** 
 *
 */
package eu.estcube.webserver.cache.guava;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;

import eu.estcube.webserver.cache.guava.GuavaTimeoutStore;

/**
 *
 */
public class GuavaTimeoutStoreTest {

    private static final long TIMEOUT = 1000L;

    private static final String KEY_1 = "A";
    private static final String KEY_2 = "B";
    private static Object VALUE_1 = new Object();
    private static Object VALUE_2 = new Object();

    private GuavaTimeoutStore<String, Object> cache;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        cache = new GuavaTimeoutStore<String, Object>(TIMEOUT);
    }

    @Test
    public void testTimeout() throws InterruptedException {
        cache.put(KEY_1, VALUE_1);
        assertEquals(VALUE_1, cache.get(KEY_1));
        Thread.sleep(TIMEOUT + 100);
        assertNull(cache.get(KEY_1));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaTimeoutStore#get(java.lang.Object)}.
     */
    @Test
    public void testGet() {
        testPutKV();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaTimeoutStore#getAll()}.
     */
    @Test
    public void testGetAll() {
        Iterator<Object> all = cache.getAll().iterator();
        assertFalse(all.hasNext());

        cache.put(KEY_1, VALUE_1);
        all = cache.getAll().iterator();
        assertTrue(all.hasNext());
        assertEquals(VALUE_1, all.next());
        assertFalse(all.hasNext());

        cache.put(KEY_1, VALUE_1);
        cache.put(KEY_2, VALUE_2);
        all = cache.getAll().iterator();
        assertTrue(all.hasNext());
        assertEquals(VALUE_1, all.next());
        assertTrue(all.hasNext());
        assertEquals(VALUE_2, all.next());
        assertFalse(all.hasNext());
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaTimeoutStore#remove(java.lang.Object)}
     * .
     */
    @Test
    public void testRemove() {
        testPutKV();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.GuavaTimeoutStore#put(java.lang.Object, java.lang.Object)}
     * .
     */
    @Test
    public void testPutKV() {
        assertNull(cache.get(KEY_1));
        assertNull(cache.get(KEY_2));

        cache.put(KEY_1, VALUE_1);
        assertEquals(VALUE_1, cache.get(KEY_1));
        assertNull(cache.get(KEY_2));

        cache.put(KEY_2, VALUE_2);
        assertEquals(VALUE_1, cache.get(KEY_1));
        assertEquals(VALUE_2, cache.get(KEY_2));

        cache.put(KEY_1, VALUE_2);
        assertEquals(VALUE_2, cache.get(KEY_1));
        assertEquals(VALUE_2, cache.get(KEY_2));

        cache.remove(KEY_1);
        assertNull(cache.get(KEY_1));
        assertEquals(VALUE_2, cache.get(KEY_2));

        cache.remove(KEY_2);
        assertNull(cache.get(KEY_1));
        assertNull(cache.get(KEY_2));

        cache.remove(KEY_1);
        cache.remove(KEY_2);
        assertNull(cache.get(KEY_1));
        assertNull(cache.get(KEY_2));

        cache.put(KEY_1, VALUE_2);
        cache.put(KEY_2, VALUE_1);
        assertEquals(VALUE_2, cache.get(KEY_1));
        assertEquals(VALUE_1, cache.get(KEY_2));
    }

    @Test(expected = NullPointerException.class)
    public void testPutNullValue() {
        cache.put(KEY_1, null);
    }
}
