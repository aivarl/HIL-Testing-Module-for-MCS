package eu.estcube.webserver.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;

/**
 *
 */
public class UIErrorHandlerTest {

    public static final String MESSAGE = "Muchos problemos";

    private UIErrorHandler handler;

    private Exception exception;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        handler = new UIErrorHandler();
        exception = new Exception(MESSAGE);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.UIErrorHandler#process(java.lang.Exception)}
     * .
     */
    @Test
    public void testProcess() {
        UIResponse result = handler.process(exception);
        assertNotNull(result);
        assertEquals(Status.ERROR, result.getStatus());
        assertEquals(MESSAGE, result.getValue());
    }
}
