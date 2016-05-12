/** 
 *
 */
package eu.estcube.common;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.constants.StandardArguments;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class UpdateTimestampTest {

    @Mock
    private Exchange exchange;

    @Mock
    private Message in;

    @Mock
    private Message out;

    private UpdateTimestamp processor;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        processor = new UpdateTimestamp();
        inOrder = inOrder(exchange, in, out);
        when(exchange.getIn()).thenReturn(in);
        when(exchange.getOut()).thenReturn(out);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.UpdateTimestamp#process(org.apache.camel.Exchange)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testProcess() throws Exception {
        processor.process(exchange);
        inOrder.verify(exchange, times(1)).getIn();
        inOrder.verify(exchange, times(1)).getOut();
        inOrder.verify(out, times(1)).copyFrom(in);
        ArgumentCaptor<Long> captor = ArgumentCaptor.forClass(Long.class);
        inOrder.verify(out, times(1)).setHeader(eq(StandardArguments.TIMESTAMP), captor.capture());
        inOrder.verifyNoMoreInteractions();
        long diff = System.currentTimeMillis() - captor.getValue();
        assertTrue("diff=" + diff, diff >= 0 && diff <= 1000L * 30);
    }
}
