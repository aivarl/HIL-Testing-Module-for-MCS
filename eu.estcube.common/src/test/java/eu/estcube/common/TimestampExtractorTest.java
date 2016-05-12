/** 
 *
 */
package eu.estcube.common;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.constants.StandardArguments;
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
public class TimestampExtractorTest {

    private static final long NOW = System.currentTimeMillis();

    @Mock
    private Message message;

    private TimestampExtractor extractor;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        extractor = new TimestampExtractor();
        inOrder = inOrder(message);
    }

    @Test
    public void testGetTimestampStandardArgumentsTimestamp() throws Exception {
        when(message.getHeader(StandardArguments.TIMESTAMP)).thenReturn(NOW);
        when(message.getHeader(StandardArguments.TIMESTAMP, Long.class)).thenReturn(NOW);
        assertEquals(NOW, extractor.getTimestamp(message));
        inOrder.verify(message, times(1)).getHeader(StandardArguments.TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(StandardArguments.TIMESTAMP, Long.class);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampExchangeCreatedTimestamp() throws Exception {
        when(message.getHeader(StandardArguments.TIMESTAMP)).thenReturn(null);
        when(message.getHeader(Exchange.CREATED_TIMESTAMP)).thenReturn(NOW);
        when(message.getHeader(Exchange.CREATED_TIMESTAMP, Long.class)).thenReturn(NOW);
        assertEquals(NOW, extractor.getTimestamp(message));
        inOrder.verify(message, times(1)).getHeader(StandardArguments.TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(Exchange.CREATED_TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(Exchange.CREATED_TIMESTAMP, Long.class);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampJmsTimestamp() throws Exception {
        when(message.getHeader(StandardArguments.TIMESTAMP)).thenReturn(null);
        when(message.getHeader(Exchange.CREATED_TIMESTAMP)).thenReturn(null);
        when(message.getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP)).thenReturn(NOW);
        when(message.getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP, Long.class)).thenReturn(NOW);
        assertEquals(NOW, extractor.getTimestamp(message));
        inOrder.verify(message, times(1)).getHeader(StandardArguments.TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(Exchange.CREATED_TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP, Long.class);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testGetTimestampDefault() throws Exception {
        when(message.getHeader(StandardArguments.TIMESTAMP)).thenReturn(null);
        when(message.getHeader(Exchange.CREATED_TIMESTAMP)).thenReturn(null);
        when(message.getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP)).thenReturn(null);
        long timestamp = extractor.getTimestamp(message);
        assertTrue(timestamp >= NOW);
        assertTrue(timestamp <= NOW + 1000L * 60);
        inOrder.verify(message, times(1)).getHeader(StandardArguments.TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(Exchange.CREATED_TIMESTAMP);
        inOrder.verify(message, times(1)).getHeader(TimestampExtractor.HEADER_JMS_TIMESTAMP);
        inOrder.verifyNoMoreInteractions();
    }
}
