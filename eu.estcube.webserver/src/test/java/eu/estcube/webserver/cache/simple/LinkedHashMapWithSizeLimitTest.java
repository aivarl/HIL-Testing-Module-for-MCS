/** 
 *
 */
package eu.estcube.webserver.cache.simple;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

/**
 *
 */
public class LinkedHashMapWithSizeLimitTest {

    private static final int LIMIT = 10;
    private LinkedHashMapWithSizeLimit<String, Integer> map;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        map = new LinkedHashMapWithSizeLimit<String, Integer>(LIMIT);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.LinkedHashMapWithSizeLimit#removeEldestEntry(java.util.Map.Entry)}
     * .
     */
    @Test
    public void testRemoveEldestEntryEntryOfKV() {
        for (int i = 0; i < LIMIT + 1; i++) {
            map.put(String.valueOf(i), new Integer(i));
        }
        assertEquals(LIMIT, map.size());
        Collection<Integer> values = map.values();
        assertEquals(LIMIT, values.size());
        List<Integer> list = new ArrayList<Integer>(values.size());
        list.addAll(values);
        for (int i = 1; i < LIMIT + 1; i++) {
            Integer expected = new Integer(i);
            assertEquals(expected, list.get(i - 1));
            assertTrue(values.contains(expected));
            assertEquals(expected, map.get(String.valueOf(i)));
        }
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.simple.LinkedHashMapWithSizeLimit#getMaxSize()}
     * .
     */
    @Test
    public void testGetMaxSize() {
        assertEquals(LIMIT, map.getMaxSize());
    }
}
