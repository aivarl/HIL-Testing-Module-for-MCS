/** 
 *
 */
package eu.estcube.webserver.cache;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.hbird.exchange.interfaces.IEntityInstance;
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
public class NamedIdCacheTest {

    private static final String KEY = "teh key";

    @Mock
    private IEntityInstance named;

    @Mock
    private Cache<String, IEntityInstance> store;

    private NamedIdCache<IEntityInstance> cache;

    InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        cache = new NamedIdCache<IEntityInstance>(store);
        inOrder = inOrder(store, named);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.NamedIdCache#getKey(org.hbird.exchange.interfaces.INamed)}
     * .
     */
    @Test
    public void testGetKeyT() {
        when(named.getInstanceID()).thenReturn(KEY);
        assertEquals(KEY, cache.getKey(named));
        inOrder.verify(named, times(1)).getInstanceID();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.NamedIdCache#getKey(org.hbird.exchange.interfaces.INamed)}
     * .
     */
    @Test(expected = NullPointerException.class)
    public void testGetKeyNull() {
        cache.getKey(null);
    }
}
