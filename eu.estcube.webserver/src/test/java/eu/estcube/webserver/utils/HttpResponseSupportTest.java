package eu.estcube.webserver.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.common.json.ToJsonProcessor;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class HttpResponseSupportTest {

    private static final String JSON = "{\"key\":\"value\"}";

    private HttpResponseSupport support;

    @Mock
    private HttpServletResponse response;

    @Mock
    private ToJsonProcessor toJson;

    @Mock
    private Object message;

    @Mock
    private ServletOutputStream sos;

    private Exception exception;

    private IOException ioException;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        support = new HttpResponseSupport();
        exception = new RuntimeException();
        ioException = new IOException();
        inOrder = inOrder(response, toJson, message, sos);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.HttpResponseSupport#sendAsJson(javax.servlet.http.HttpServletResponse, eu.estcube.common.json.ToJsonProcessor, java.lang.Object)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testSendAsJson() throws Exception {
        when(toJson.process(message)).thenReturn(JSON);
        when(response.getOutputStream()).thenReturn(sos);
        support.sendAsJson(response, toJson, message);
        inOrder.verify(toJson, times(1)).process(message);
        inOrder.verify(response, times(1)).setContentType(HttpResponseSupport.CONTENT_TYPE_JSON);
        inOrder.verify(response, times(1)).getOutputStream();
        inOrder.verify(sos, times(1)).println(JSON);
        inOrder.verify(response, times(1)).getOutputStream();
        inOrder.verify(sos, times(1)).flush();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.HttpResponseSupport#sendAsJson(javax.servlet.http.HttpServletResponse, eu.estcube.common.json.ToJsonProcessor, java.lang.Object)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testSendAsJsonWithSerializationException() throws Exception {
        when(toJson.process(message)).thenThrow(exception);
        try {
            support.sendAsJson(response, toJson, message);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(exception, e.getCause());
        }
        inOrder.verify(toJson, times(1)).process(message);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.HttpResponseSupport#sendAsJson(javax.servlet.http.HttpServletResponse, eu.estcube.common.json.ToJsonProcessor, java.lang.Object)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testSendAsJsonWithIoException() throws Exception {
        when(toJson.process(message)).thenReturn(JSON);
        when(response.getOutputStream()).thenReturn(sos);
        doThrow(ioException).when(sos).println(JSON);
        try {
            support.sendAsJson(response, toJson, message);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(ioException, e.getCause());
        }
        inOrder.verify(toJson, times(1)).process(message);
        inOrder.verify(response, times(1)).setContentType(HttpResponseSupport.CONTENT_TYPE_JSON);
        inOrder.verify(response, times(1)).getOutputStream();
        inOrder.verify(sos, times(1)).println(JSON);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void testChop() {
        assertEquals("null", support.chop(null, 10));
        assertEquals("", support.chop("", 10));
        assertEquals(" ", support.chop(" ", 10));
        assertEquals("ABC", support.chop("ABC", 10));
        assertEquals("ABCDEFGHIJ", support.chop("ABCDEFGHIJ", 10));
        assertEquals("ABCDEFGHIJ ...", support.chop("ABCDEFGHIJK", 10));
        assertEquals("ABCDEFGHIJ ...", support.chop("ABCDEFGHIJKLMNOPQRSŠZŽTUVWÕÄÖÜXY", 10));
        assertEquals("ABCDEFGHIJKLMNO ...", support.chop("ABCDEFGHIJKLMNOPQRSŠZŽTUVWÕÄÖÜXY", 15));
    }
}
