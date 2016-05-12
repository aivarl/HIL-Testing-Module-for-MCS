package eu.estcube.webserver.auth;

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

import eu.estcube.webserver.domain.UserInfo;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class LogoutServletTest {

    private static final String USER = "doomas";

    @InjectMocks
    private LogoutServlet servlet;

    @Mock
    private UserInfoSupport userInfoSupport;

    @Mock
    private HttpServletRequest req;

    @Mock
    private HttpServletResponse resp;

    @Mock
    private HttpSession session;

    private UserInfo user;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        user = new UserInfo();
        user.setUsername(USER);
        inOrder = inOrder(userInfoSupport, req, resp, session);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.auth.LogoutServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
     * .
     * 
     * @throws Exception
     * @throws ServletException
     */
    @Test
    public void testDoGet() throws Exception {
        when(req.getSession(false)).thenReturn(session);
        when(userInfoSupport.getUserInfo(session)).thenReturn(user);
        servlet.doGet(req, resp);
        inOrder.verify(req, times(1)).getSession(false);
        inOrder.verify(userInfoSupport, times(1)).getUserInfo(session);
        inOrder.verify(session, times(1)).invalidate();
        inOrder.verify(resp, times(1)).sendRedirect(LogoutServlet.REDIRECT_AFTER_LOGOUT);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.auth.LogoutServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
     * .
     * 
     * @throws Exception
     * @throws ServletException
     */
    @Test
    public void testDoGetNoSession() throws Exception {
        when(req.getSession(false)).thenReturn(null);
        servlet.doGet(req, resp);
        inOrder.verify(req, times(1)).getSession(false);
        inOrder.verify(resp, times(1)).sendRedirect(LogoutServlet.REDIRECT_AFTER_LOGOUT);
    }
}
