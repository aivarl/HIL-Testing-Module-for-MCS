package eu.estcube.common;

import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.interfaces.IEntity;
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
public class PrepareForInjectionTest {

    private static final String UUID = "UUID-asdfasd-fasd-fasdf213-123";
    private static final String NAME = "name";
    private static final String ISSUED_BY = "issuer";
    private static final Long NOW = System.currentTimeMillis();

    @SuppressWarnings("deprecation")
    private PrepareForInjection prep;

    @Mock
    private Exchange exchange;

    @Mock
    private Message in;

    @Mock
    private Message out;

    @Mock
    private IEntityInstance issued;

    @Mock
    private IEntity named;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @SuppressWarnings("deprecation")
    @Before
    public void setUp() throws Exception {
        prep = new PrepareForInjection();
        inOrder = inOrder(exchange, in, out, issued, named);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.PrepareForInjection#process(org.apache.camel.Exchange)}
     * .
     * 
     * @throws Exception
     */
    @SuppressWarnings("deprecation")
    @Test
    public void testProcessIssued() throws Exception {
        when(exchange.getIn()).thenReturn(in);
        when(exchange.getOut()).thenReturn(out);
        when(in.getBody()).thenReturn(issued);
        when(issued.getID()).thenReturn(UUID);
        when(issued.getName()).thenReturn(NAME);
        when(issued.getIssuedBy()).thenReturn(ISSUED_BY);
        when(issued.getTimestamp()).thenReturn(NOW);
        prep.process(exchange);
        inOrder.verify(exchange, times(1)).getIn();
        inOrder.verify(in, times(1)).getBody();
        inOrder.verify(exchange, times(1)).getOut();
        inOrder.verify(out, times(1)).copyFrom(in);

        inOrder.verify(out, times(1)).setHeader(StandardArguments.CLASS, issued.getClass().getSimpleName());
        inOrder.verify(issued, times(1)).getID();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.ENTITY_ID, UUID);
        inOrder.verify(issued, times(1)).getName();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.NAME, NAME);
        // inOrder.verify(named, times(1)).getClass(); // Mockito can't verify
        // final methods
        inOrder.verify(issued, times(1)).getIssuedBy();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.ISSUED_BY, ISSUED_BY);
        inOrder.verify(issued, times(1)).getTimestamp();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.TIMESTAMP, NOW);
        inOrder.verify(exchange, times(1)).getProperty(Exchange.ROUTE_STOP);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.common.PrepareForInjection#process(org.apache.camel.Exchange)}
     * .
     * 
     * @throws Exception
     */
    @SuppressWarnings("deprecation")
    @Test
    public void testProcessNamed() throws Exception {
        when(exchange.getIn()).thenReturn(in);
        when(exchange.getOut()).thenReturn(out);
        when(in.getBody()).thenReturn(named);
        when(named.getID()).thenReturn(UUID);
        when(named.getName()).thenReturn(NAME);
        prep.process(exchange);
        inOrder.verify(exchange, times(1)).getIn();
        inOrder.verify(in, times(1)).getBody();
        inOrder.verify(exchange, times(1)).getOut();
        inOrder.verify(out, times(1)).copyFrom(in);

        inOrder.verify(out, times(1)).setHeader(StandardArguments.CLASS, named.getClass().getSimpleName());
        inOrder.verify(named, times(1)).getID();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.ENTITY_ID, UUID);
        inOrder.verify(named, times(1)).getName();
        inOrder.verify(out, times(1)).setHeader(StandardArguments.NAME, NAME);
        inOrder.verify(exchange, times(1)).getProperty(Exchange.ROUTE_STOP);
        inOrder.verifyNoMoreInteractions();
    }

    @SuppressWarnings("deprecation")
    @Test
    public void testNullBody() throws Exception {
        when(exchange.getIn()).thenReturn(in);
        when(exchange.getOut()).thenReturn(out);
        when(in.getBody()).thenReturn(null);
        prep.process(exchange);
        inOrder.verify(exchange, times(1)).getIn();
        inOrder.verify(in, times(1)).getBody();
        inOrder.verify(exchange, times(1)).getProperty(Exchange.ROUTE_STOP);
        inOrder.verifyNoMoreInteractions();
    }
}
