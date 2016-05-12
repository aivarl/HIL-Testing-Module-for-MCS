/** 
 *
 */
package eu.estcube.webserver.cache;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.webserver.domain.TransportFrame;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class TransportFrameCacheTest {

    public static final String VALUE = "value";

    @Mock
    private Cache<String, TransportFrame> store;

    @Mock
    private TransportFrame frame;

    @Mock
    private Map<String, Object> headers;

    private TransportFrameCache cache;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        cache = new TransportFrameCache(store);
        inOrder = inOrder(store, frame, headers);
        when(frame.getHeaders()).thenReturn(headers);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.TransportFrameCache#getKey(eu.estcube.webserver.domain.TransportFrame)}
     * .
     */
    @Test
    public void testGetKey() {
        when(headers.get(TransportFrameCache.JMS_MESSAGE_ID)).thenReturn(VALUE);
        assertEquals(VALUE, cache.getKey(frame));
        inOrder.verify(frame, times(1)).getHeaders();
        inOrder.verify(headers, times(1)).get(TransportFrameCache.JMS_MESSAGE_ID);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.cache.TransportFrameCache#getKey(eu.estcube.webserver.domain.TransportFrame)}
     * .
     */
    @Test
    public void testGetKeyHeaderNotSet() {
        when(headers.get(TransportFrameCache.JMS_MESSAGE_ID)).thenReturn(null);
        String key = cache.getKey(frame);
        assertTrue(StringUtils.isNotBlank(key));
        try {
            UUID.fromString(key);
        } catch (IllegalArgumentException iae) {
            fail(iae.getMessage());
        }
        inOrder.verify(frame, times(1)).getHeaders();
        inOrder.verify(headers, times(1)).get(TransportFrameCache.JMS_MESSAGE_ID);
        inOrder.verifyNoMoreInteractions();
    }
}
