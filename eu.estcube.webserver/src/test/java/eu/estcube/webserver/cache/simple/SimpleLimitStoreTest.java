/** 
 *
 */
package eu.estcube.webserver.cache.simple;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.Iterator;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Lists;

/**
 *
 */
public class SimpleLimitStoreTest {

    private static final int LIMIT = 10;
    private static final String KEY = "KEY";
    private static final Object VALUE = new Object();

    private SimpleLimitStore<String, Object> store;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        store = new SimpleLimitStore<String, Object>(LIMIT);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.SimpleLimitStore#SimpleLimitStore(int)}
     * .
     */
    @Test
    public void testSimpleLimitStore() {
        for (int i = 0; i < LIMIT + 1; i++) {
            store.put(String.valueOf(i), new Integer(i));
        }
        Iterator<Object> all = store.getAll().iterator();
        List<Object> list = Lists.newArrayList(all);
        assertEquals(LIMIT, list.size());
        for (int i = 1; i < LIMIT; i++) {
            Integer expected = new Integer(i);
            assertEquals(expected, list.get(i - 1));
        }
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.SimpleLimitStore#put(java.lang.Object, java.lang.Object)}
     * .
     */
    @Test
    public void testPut() {
        assertNull(store.get(KEY));
        assertNull(store.put(KEY, VALUE));
        assertEquals(VALUE, store.get(KEY));
        assertEquals(VALUE, store.put(KEY, null));
        assertNull(store.get(KEY));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.SimpleLimitStore#get(java.lang.Object)}
     * .
     */
    @Test
    public void testGet() {
        testPut();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.SimpleLimitStore#getAll()}.
     */
    @Test
    public void testGetAll() {
        for (int i = 0; i < LIMIT + 1; i++) {
            store.put(String.valueOf(i), new Integer(i));
        }
        Iterator<Object> all = store.getAll().iterator();
        for (int i = 0; i < LIMIT + 1; i++) {
            store.remove(String.valueOf(i));
        }
        List<Object> tmp = Lists.newArrayList(store.getAll());
        assertNotNull(tmp);
        assertEquals(0, tmp.size());

        List<Object> list = Lists.newArrayList(all);
        assertEquals(LIMIT, list.size());
        for (int i = 1; i < LIMIT; i++) {
            Integer expected = new Integer(i);
            assertEquals(expected, list.get(i - 1));
        }
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.SimpleLimitStore#remove(java.lang.Object)}
     * .
     */
    @Test
    public void testRemove() {
        assertNull(store.get(KEY));
        assertNull(store.remove(KEY));
        store.put(KEY, VALUE);
        assertEquals(VALUE, store.get(KEY));
        assertEquals(VALUE, store.remove(KEY));
        assertNull(store.get(KEY));
        assertNull(store.remove(KEY));
    }
}
