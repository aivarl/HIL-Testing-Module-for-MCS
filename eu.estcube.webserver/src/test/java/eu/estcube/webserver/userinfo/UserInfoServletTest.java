package eu.estcube.webserver.userinfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.domain.UserInfo;
import eu.estcube.webserver.utils.HttpResponseSupport;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class UserInfoServletTest {

    @InjectMocks
    private UserInfoServlet servlet;

    @Mock
    private ToJsonProcessor toJson;

    @Mock
    private UserInfoSupport userInfoSupport;

    @Mock
    private HttpResponseSupport responseSupport;

    @Mock
    private HttpServletRequest req;

    @Mock
    private HttpServletResponse resp;

    @Mock
    private HttpSession session;

    @Mock
    private UserInfo userInfo;

    private InOrder inOrder;

    private Exception exception;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        inOrder = inOrder(toJson, userInfoSupport, responseSupport, req, resp, session, userInfo);
        exception = new Exception();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.userinfo.UserInfoServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testDoGet() throws Exception {
        when(req.getSession()).thenReturn(session);
        when(userInfoSupport.getUserInfo(session)).thenReturn(userInfo);
        servlet.doGet(req, resp);
        inOrder.verify(req, times(1)).getSession();
        inOrder.verify(userInfoSupport, times(1)).getUserInfo(session);
        inOrder.verify(responseSupport, times(1)).sendAsJson(resp, toJson, userInfo);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.userinfo.UserInfoServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
     * .
     * 
     * @throws Exception
     */
    @Test
    public void testDoGetWithException() throws Exception {
        when(req.getSession()).thenReturn(session);
        when(userInfoSupport.getUserInfo(session)).thenReturn(userInfo);
        doThrow(exception).when(responseSupport).sendAsJson(resp, toJson, userInfo);
        try {
            servlet.doGet(req, resp);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(ServletException.class, e.getClass());
            assertEquals(exception, e.getCause());
        }
        inOrder.verify(req, times(1)).getSession();
        inOrder.verify(userInfoSupport, times(1)).getUserInfo(session);
        inOrder.verify(responseSupport, times(1)).sendAsJson(resp, toJson, userInfo);
        inOrder.verify(userInfo, times(1)).getUsername();
        inOrder.verifyNoMoreInteractions();
    }
}
