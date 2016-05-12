package eu.estcube.webserver.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.security.Principal;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.security.auth.Subject;
import javax.servlet.http.HttpSession;

import org.eclipse.jetty.security.MappedLoginService;
import org.eclipse.jetty.security.authentication.SessionAuthentication;
import org.eclipse.jetty.server.UserIdentity;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.webserver.auth.crowd.CrowdLoginService;
import eu.estcube.webserver.auth.crowd.CrowdLoginService.CrowdUser;
import eu.estcube.webserver.domain.UserInfo;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class UserInfoSupportTest {

    private static final String USER = "Caur";

    private static final String ROLE_1 = "editor";
    private static final String ROLE_2 = "manager";

    private UserInfoSupport support;

    @Mock
    private HttpSession session;

    @Mock
    private SessionAuthentication auth;

    @Mock
    private UserIdentity userIdentity;

    private Subject subject;

    private Set<Principal> principals = new HashSet<Principal>();

    @Mock
    private CrowdLoginService crowdLoginService;

    private CrowdUser crowdUser;

    private MappedLoginService.RolePrincipal role1;

    private MappedLoginService.RolePrincipal role2;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        support = new UserInfoSupport();
        inOrder = inOrder(session, auth, userIdentity, crowdLoginService);
        crowdUser = crowdLoginService.new CrowdUser(USER);
        role1 = new MappedLoginService.RolePrincipal(ROLE_1);
        role2 = new MappedLoginService.RolePrincipal(ROLE_2);
        principals.add(crowdUser);
        principals.add(role1);
        principals.add(role2);
        subject = new Subject(true, principals, Collections.emptySet(), Collections.emptySet());
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.UserInfoSupport#getUserInfo(javax.servlet.http.HttpSession)}
     * .
     */
    @Test
    public void testGetUserInfo() {
        when(session.getAttribute(UserInfoSupport.SESSION_ATTRIBUT_USER_IDENTITY)).thenReturn(auth);
        when(auth.getUserIdentity()).thenReturn(userIdentity);
        when(userIdentity.getSubject()).thenReturn(subject);

        UserInfo userInfo = support.getUserInfo(session);
        assertNotNull(userInfo);
        assertEquals(USER, userInfo.getUsername());
        assertEquals(2, userInfo.getRoles().size());
        assertEquals(ROLE_1, userInfo.getRoles().toArray()[0]);
        assertEquals(ROLE_2, userInfo.getRoles().toArray()[1]);

        inOrder.verify(session, times(1)).getAttribute(UserInfoSupport.SESSION_ATTRIBUT_USER_IDENTITY);
        inOrder.verify(auth, times(1)).getUserIdentity();
        inOrder.verify(userIdentity, times(1)).getSubject();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.utils.UserInfoSupport#getUserInfo(javax.servlet.http.HttpSession)}
     * .
     */
    @Test
    public void testGetUserInfoNoIdentityFound() {
        when(session.getAttribute(UserInfoSupport.SESSION_ATTRIBUT_USER_IDENTITY)).thenReturn(null);

        UserInfo userInfo = support.getUserInfo(session);
        assertNotNull(userInfo);
        assertNull(userInfo.getUsername());
        assertEquals(0, userInfo.getRoles().size());

        inOrder.verify(session, times(1)).getAttribute(UserInfoSupport.SESSION_ATTRIBUT_USER_IDENTITY);
        inOrder.verifyNoMoreInteractions();
    }
}
