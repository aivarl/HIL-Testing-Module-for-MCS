package eu.estcube.webserver;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;

import java.util.Arrays;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.eclipse.jetty.http.security.Constraint;
import org.eclipse.jetty.security.Authenticator;
import org.eclipse.jetty.security.ConstraintMapping;
import org.eclipse.jetty.security.LoginService;
import org.eclipse.jetty.security.authentication.FormAuthenticator;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.webserver.auth.LoginServiceListener;
import eu.estcube.webserver.auth.crowd.CrowdLoginService;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class WebServerTest {

    private static final String AUTH_NAME = "auth";
    private static final String[] ROLES = { "admin", "op", "user" };
    private static final String PATH = "/path/to/super/secret/servlet/just/for/testing";
    private static final String LOGIN_PAGE = "login";
    private static final String LOGIN_ERROR_PAGE = "login-error";

    private WebServer server;

    private Class<? extends Servlet> servletClass = Servlet.class;

    @Mock
    private ServletContextHandler context;

    @Mock
    private Servlet servlet;

    @Mock
    private Constraint constraint;

    @Mock
    private LoginServiceListener loginServiceListener;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        server = new WebServer();
        inOrder = inOrder(context, servlet, constraint, loginServiceListener);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#createConstraint(java.lang.String, java.lang.String[])}
     * .
     */
    @Test
    public void testCreateConstraint() {
        Constraint c = server.createConstraint(AUTH_NAME, ROLES);
        assertNotNull(c);
        assertTrue(Arrays.equals(ROLES, c.getRoles()));
        assertTrue(c.getAuthenticate());
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#addServlet(org.eclipse.jetty.servlet.ServletContextHandler, java.lang.String, java.lang.Class)}
     * .
     */
    @Test
    public void testAddServletServletContextHandlerStringClassOfQextendsServlet() {
        server.addServlet(context, PATH, servletClass);
        inOrder.verify(context, times(1)).addServlet(servletClass, PATH);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#addServlet(org.eclipse.jetty.servlet.ServletContextHandler, java.lang.String, javax.servlet.Servlet)}
     * .
     * 
     * @throws ServletException
     */
    @Test
    public void testAddServletServletContextHandlerStringServlet() throws ServletException {
        server.addServlet(context, PATH, servlet);
        ArgumentCaptor<ServletHolder> captor = ArgumentCaptor.forClass(ServletHolder.class);
        inOrder.verify(context, times(1)).addServlet(captor.capture(), eq(PATH));
        inOrder.verifyNoMoreInteractions();
        assertEquals(servlet, captor.getValue().getServlet());
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#addServlet(org.eclipse.jetty.servlet.ServletContextHandler, java.lang.String, java.lang.Class, org.eclipse.jetty.http.security.Constraint)}
     * .
     */
    @Test
    public void testAddServletServletContextHandlerStringClassOfQextendsServletConstraint() {
        ConstraintMapping m = server.addServlet(context, PATH, servletClass, constraint);
        assertNotNull(m);
        assertEquals(PATH, m.getPathSpec());
        assertEquals(constraint, m.getConstraint());
        inOrder.verify(context, times(1)).addServlet(servletClass, PATH);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#addServlet(org.eclipse.jetty.servlet.ServletContextHandler, java.lang.String, javax.servlet.Servlet, org.eclipse.jetty.http.security.Constraint)}
     * .
     * 
     * @throws ServletException
     */
    @Test
    public void testAddServletServletContextHandlerStringServletConstraint() throws ServletException {
        ConstraintMapping m = server.addServlet(context, PATH, servlet, constraint);
        assertNotNull(m);
        assertEquals(PATH, m.getPathSpec());
        assertEquals(constraint, m.getConstraint());
        ArgumentCaptor<ServletHolder> captor = ArgumentCaptor.forClass(ServletHolder.class);
        inOrder.verify(context, times(1)).addServlet(captor.capture(), eq(PATH));
        inOrder.verifyNoMoreInteractions();
        assertEquals(servlet, captor.getValue().getServlet());
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#createConstraintMapping(org.eclipse.jetty.http.security.Constraint, java.lang.String)}
     * .
     */
    @Test
    public void testCreateConstraintMapping() {
        ConstraintMapping m = server.createConstraintMapping(constraint, PATH);
        assertNotNull(m);
        assertEquals(PATH, m.getPathSpec());
        assertEquals(constraint, m.getConstraint());
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#createLoginService()}.
     */
    @Test
    public void testCreateLoginService() {
        LoginService l = server.createLoginService(loginServiceListener);
        assertNotNull(l);
        assertEquals(CrowdLoginService.class.getSimpleName(), l.getName());
        assertNotNull(l.getIdentityService());
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.WebServer#createAutenticator(java.lang.String, java.lang.String)}
     * .
     */
    @Test
    public void testCreateAutenticator() {
        Authenticator a = server.createAutenticator(LOGIN_PAGE, LOGIN_ERROR_PAGE);
        assertNotNull(a.getAuthMethod());
        assertEquals(FormAuthenticator.class, a.getClass());
        FormAuthenticator fa = (FormAuthenticator) a;
        assertTrue(fa.isLoginOrErrorPage("/" + LOGIN_PAGE));
        assertTrue(fa.isLoginOrErrorPage("/" + LOGIN_ERROR_PAGE));
        assertFalse(fa.isLoginOrErrorPage(LOGIN_PAGE));
        assertFalse(fa.isLoginOrErrorPage(LOGIN_ERROR_PAGE));
    }
}
