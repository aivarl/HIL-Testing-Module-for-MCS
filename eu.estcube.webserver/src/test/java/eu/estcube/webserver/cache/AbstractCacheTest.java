/** 
 *
 */
package eu.estcube.webserver.cache;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class AbstractCacheTest {

    private static final String KEY = "key";

    @Mock
    private Cache<String, Object> store;

    @Mock
    private Object newValue;

    @Mock
    private Object oldValue;

    @Mock
    private Iterable<Object> allValues;

    private AbstractCache<String, Object> abstractCache;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        abstractCache = new AbstractCache<String, Object>(store) {
            protected String getKey(Object value) {
                return newValue.equals(value) || oldValue.equals(value) ? KEY : null;
            }
        };
        inOrder = inOrder(store, newValue, oldValue, allValues);
        when(store.get(KEY)).thenReturn(oldValue);
        when(store.remove(KEY)).thenReturn(oldValue);
        when(store.getAll()).thenReturn(allValues);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#putObject(java.lang.Object)}
     * .
     */
    @Test
    public void testPutObjectReplaceValue() {
        assertEquals(newValue, abstractCache.putObject(newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verify(store, times(1)).put(KEY, newValue);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#putObject(java.lang.Object)}
     * .
     */
    @Test
    public void testPutObjectNewValue() {
        when(store.get(KEY)).thenReturn(null);
        assertEquals(newValue, abstractCache.putObject(newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verify(store, times(1)).put(KEY, newValue);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#putObject(java.lang.Object)}
     * .
     */
    @Test
    public void testPutObjectNullKey() {
        try {
            abstractCache.putObject(new Object());
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(NullPointerException.class, e.getClass());
        }
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#putObject(java.lang.Object)}
     * .
     */
    @Test
    public void testPutObjectNullValue() {
        try {
            abstractCache.putObject(null);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(NullPointerException.class, e.getClass());
        }
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#putObject(java.lang.Object)}
     * .
     */
    @Test
    public void testPutObjectNewValueNoReplacment() {
        abstractCache = new AbstractCache<String, Object>(store) {
            protected String getKey(Object value) {
                return newValue.equals(value) || oldValue.equals(value) ? KEY : null;
            }

            /** @{inheritDoc . */
            @Override
            protected boolean shouldReplace(Object oldValue, Object newValue) {
                return false;
            }
        };
        assertEquals(oldValue, abstractCache.putObject(newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#get(java.lang.Object)}.
     */
    @Test
    public void testGet() {
        assertEquals(oldValue, abstractCache.get(KEY));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for {@link eu.estcube.webserver.cache.AbstractCache#getAll()}
     * .
     */
    @Test
    public void testGetAll() {
        assertEquals(allValues, abstractCache.getAll());
        inOrder.verify(store, times(1)).getAll();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#remove(java.lang.Object)}
     * .
     */
    @Test
    public void testRemove() {
        assertEquals(oldValue, abstractCache.remove(KEY));
        inOrder.verify(store, times(1)).remove(KEY);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#getKey(java.lang.Object)}
     * .
     */
    @Test
    public void testGetKey() {
        assertEquals(KEY, abstractCache.getKey(newValue));
        assertEquals(KEY, abstractCache.getKey(oldValue));
        assertNull(abstractCache.getKey(null));
        assertNull(abstractCache.getKey(new Object()));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#shouldReplace(java.lang.Object, java.lang.Object)}
     * .
     */
    @Test
    public void testShouldReplace() {
        assertTrue(abstractCache.shouldReplace(oldValue, newValue));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#put(Object, Object)} .
     */
    @Test
    public void testPutReplaceValue() {
        assertEquals(newValue, abstractCache.put(KEY, newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verify(store, times(1)).put(KEY, newValue);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#put(Object, Object)} .
     */
    @Test
    public void testPutNewValue() {
        when(store.get(KEY)).thenReturn(null);
        assertEquals(newValue, abstractCache.put(KEY, newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verify(store, times(1)).put(KEY, newValue);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#put(Object, Object)} .
     */
    @Test
    public void testPutNullKey() {
        try {
            abstractCache.put(null, newValue);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(NullPointerException.class, e.getClass());
        }
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#put(Object, Object)} .
     */
    @Test
    public void testPutNullValue() {
        try {
            abstractCache.put(KEY, null);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(NullPointerException.class, e.getClass());
        }
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.AbstractCache#put(Object, Object)} .
     */
    @Test
    public void testPutNewValueNoReplacment() {
        abstractCache = new AbstractCache<String, Object>(store) {
            protected String getKey(Object value) {
                return newValue.equals(value) || oldValue.equals(value) ? KEY : null;
            }

            /** @{inheritDoc . */
            @Override
            protected boolean shouldReplace(Object oldValue, Object newValue) {
                return false;
            }
        };
        assertEquals(oldValue, abstractCache.put(KEY, newValue));
        inOrder.verify(store, times(1)).get(KEY);
        inOrder.verifyNoMoreInteractions();
    }
}
