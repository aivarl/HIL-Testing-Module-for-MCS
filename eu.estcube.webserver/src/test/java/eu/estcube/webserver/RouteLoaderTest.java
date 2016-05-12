/** 
 *
 */
package eu.estcube.webserver;

import static org.mockito.Mockito.inOrder;

import java.util.Iterator;
import java.util.Set;

import org.apache.camel.model.ModelCamelContext;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.context.event.ContextStartedEvent;

import eu.estcube.webserver.routes.WebserverRouteBuilder;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class RouteLoaderTest {

    @Mock
    private WebserverRouteBuilder builder1;

    @Mock
    private WebserverRouteBuilder builder2;

    @Mock
    private Set<WebserverRouteBuilder> builders;

    @Mock
    private Iterator<WebserverRouteBuilder> iterator;

    @Mock
    private ModelCamelContext context;

    @Mock
    private ContextStartedEvent event;

    @InjectMocks
    private RouteLoader loader;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        inOrder = inOrder(builder1, builder2, builders, context, event);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.RouteLoader#onApplicationEvent(org.springframework.context.event.ContextStartedEvent)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testOnApplicationEvent() throws Exception {
        // TODO: When Camel 2.12.0 is ready and the spring 3.2 workaround
        // in Webserver.main is not needed, restore the routeloader
        // functionality and uncomment this test

        // when(builders.iterator()).thenReturn(iterator);
        // when(iterator.hasNext()).thenReturn(true, true, false);
        // when(iterator.next()).thenReturn(builder1, builder2);
        // loader.onApplicationEvent(event);
        // inOrder.verify(context, times(1)).addRoutes(builder1);
        // inOrder.verify(context, times(1)).addRoutes(builder2);
    }
}
