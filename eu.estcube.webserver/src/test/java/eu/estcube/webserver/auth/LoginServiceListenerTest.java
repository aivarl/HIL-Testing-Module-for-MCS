package eu.estcube.webserver.auth;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.eclipse.jetty.util.component.LifeCycle;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class LoginServiceListenerTest {

    private LoginServiceListener listener;

    @Mock
    private Throwable throwable;

    @Mock
    private LifeCycle service;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        listener = new LoginServiceListener();
        inOrder = Mockito.inOrder(throwable, service);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.auth.LoginServiceListener#lifeCycleFailure(org.eclipse.jetty.util.component.LifeCycle, java.lang.Throwable)}
     * .
     */
    @Test
    public void testLifeCycleFailureLifeCycleThrowable() {
        assertNull(listener.getThrowable());
        listener.lifeCycleFailure(service, throwable);
        assertEquals(throwable, listener.getThrowable());
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.auth.LoginServiceListener#lifeCycleStarted(org.eclipse.jetty.util.component.LifeCycle)}
     * .
     */
    @Test
    public void testLifeCycleStartedLifeCycle() {
        assertNull(listener.getThrowable());
        listener.lifeCycleFailure(service, throwable);
        assertEquals(throwable, listener.getThrowable());
        listener.lifeCycleStarted(service);
        assertNull(listener.getThrowable());
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.auth.LoginServiceListener#getThrowable()}.
     */
    @Test
    public void testGetThrowable() {
        testLifeCycleStartedLifeCycle();
    }
}
