/** 
 *
 */
package eu.estcube.webserver.cache.guava;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.Collection;
import java.util.concurrent.ConcurrentMap;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.common.cache.Cache;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class AbstractGuavaStoreTest {

    private static final Long LIMIT = 5L;
    private static final String KEY = "KEY";
    private static final Object VALUE = new Object();

    private AbstractGuavaStore<String, Object, Long> abstractGuavaStore;

    @Mock
    private Cache<String, Object> cache;

    @Mock
    private Collection<Object> all;

    @Mock
    private ConcurrentMap<String, Object> map;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        // assertNotNull(cache);
        abstractGuavaStore = new AbstractGuavaStore<String, Object, Long>(LIMIT) {
            @Override
            protected Cache<String, Object> createCache(Long c) {
                return AbstractGuavaStoreTest.this.cache;
            }
        };
        inOrder = inOrder(cache, all, map);
        when(cache.getIfPresent(KEY)).thenReturn(VALUE);
        when(cache.asMap()).thenReturn(map);
        when(map.values()).thenReturn(all);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.AbstractGuavaStore#createCache(java.lang.Object)}
     * .
     */
    @Test
    public void testCreateCache() {
        assertEquals(cache, abstractGuavaStore.createCache(LIMIT));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.AbstractGuavaStore#get(java.lang.Object)}
     * .
     */
    @Test
    public void testGet() {
        assertEquals(VALUE, abstractGuavaStore.get(KEY));
        inOrder.verify(cache, times(1)).getIfPresent(KEY);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.AbstractGuavaStore#getAll()}.
     */
    @Test
    public void testGetAll() {
        assertEquals(all, abstractGuavaStore.getAll());
        inOrder.verify(cache, times(1)).asMap();
        inOrder.verify(map, times(1)).values();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.AbstractGuavaStore#remove(java.lang.Object)}
     * .
     */
    @Test
    public void testRemove() {
        assertEquals(VALUE, abstractGuavaStore.remove(KEY));
        inOrder.verify(cache, times(1)).getIfPresent(KEY);
        inOrder.verify(cache, times(1)).invalidate(KEY);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.guava.AbstractGuavaStore#put(java.lang.Object, java.lang.Object)}
     * .
     */
    @Test
    public void testPut() {
        assertEquals(VALUE, abstractGuavaStore.put(KEY, VALUE));
        inOrder.verify(cache, times(1)).put(KEY, VALUE);
        inOrder.verifyNoMoreInteractions();
    }
}
