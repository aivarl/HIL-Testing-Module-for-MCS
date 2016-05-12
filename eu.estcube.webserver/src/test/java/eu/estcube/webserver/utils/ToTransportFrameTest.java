/** 
 *
 */
package eu.estcube.webserver.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.io.Serializable;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
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
public class ToTransportFrameTest {

    private static final Long NOW = System.currentTimeMillis();

    @Mock
    private Exchange exchange;

    @Mock
    private Message in;

    @Mock
    private Map<String, Object> headers;

    @Mock
    private Serializable frame;

    private ToTransportFrame toTransportFrame;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        toTransportFrame = new ToTransportFrame();
        inOrder = inOrder(exchange, in, headers, frame);
        when(exchange.getIn()).thenReturn(in);
        when(in.getHeaders()).thenReturn(headers);
        when(in.getBody(Serializable.class)).thenReturn(frame);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.ToTransportFrame#process(org.apache.camel.Exchange)}
     * .
     */
    @Test
    public void testProcess() {
        TransportFrame transportFrame = toTransportFrame.process(exchange);
        assertNotNull(transportFrame);
        assertEquals(frame, transportFrame.getFrame());
        assertEquals(headers, transportFrame.getHeaders());
        inOrder.verify(exchange, times(1)).getIn();
        inOrder.verify(in, times(1)).getHeaders();
        inOrder.verify(in, times(1)).getBody(Serializable.class);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampPrimeryHeader() {
        when(headers.get(ToTransportFrame.PRIMARY_TIMESTAMP)).thenReturn(NOW);
        assertEquals(NOW, toTransportFrame.getTimestamp(headers));
        inOrder.verify(headers, times(1)).get(ToTransportFrame.PRIMARY_TIMESTAMP);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampSecondaryHeader() {
        when(headers.get(ToTransportFrame.PRIMARY_TIMESTAMP)).thenReturn(null);
        when(headers.get(ToTransportFrame.SECONDARY_TIMESTAMP)).thenReturn(NOW);
        assertEquals(NOW, toTransportFrame.getTimestamp(headers));
        inOrder.verify(headers, times(1)).get(ToTransportFrame.PRIMARY_TIMESTAMP);
        inOrder.verify(headers, times(1)).get(ToTransportFrame.SECONDARY_TIMESTAMP);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampDefaultValue() {
        when(headers.get(ToTransportFrame.PRIMARY_TIMESTAMP)).thenReturn(null);
        when(headers.get(ToTransportFrame.SECONDARY_TIMESTAMP)).thenReturn(null);
        assertTrue(((Long) toTransportFrame.getTimestamp(headers) - NOW) <= 1000L * 30);
        inOrder.verify(headers, times(1)).get(ToTransportFrame.PRIMARY_TIMESTAMP);
        inOrder.verify(headers, times(1)).get(ToTransportFrame.SECONDARY_TIMESTAMP);
        inOrder.verifyNoMoreInteractions();
    }

}
