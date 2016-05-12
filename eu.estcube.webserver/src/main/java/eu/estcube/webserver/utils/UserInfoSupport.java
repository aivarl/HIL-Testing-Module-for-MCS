package eu.estcube.webserver.utils;

import java.security.Principal;

import javax.servlet.http.HttpSession;

import org.eclipse.jetty.security.MappedLoginService;
import org.eclipse.jetty.security.authentication.SessionAuthentication;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.auth.crowd.CrowdLoginService.CrowdUser;
import eu.estcube.webserver.domain.UserInfo;

/**
 * Helper methods to work with {@link UserInfo}.
 */
@Component
public class UserInfoSupport {

    /** Session attribute for user identity. */
    public static final String SESSION_ATTRIBUT_USER_IDENTITY = "org.eclipse.jetty.security.UserIdentity";

    /**
     * Retrieves user information from {@link HttpSession}.
     * 
     * @param session {@link HttpSession} to use.
     * @return {@link UserInfo} object with information from the given
     *         {@link HttpSession}
     */
    public UserInfo getUserInfo(HttpSession session) {
        UserInfo userInfo = new UserInfo();
        SessionAuthentication auth = (SessionAuthentication) session.getAttribute(SESSION_ATTRIBUT_USER_IDENTITY);
        if (auth != null) {
            for (Principal p : auth.getUserIdentity().getSubject().getPrincipals()) {
                if (CrowdUser.class.equals(p.getClass())) {
                    userInfo.setUsername(p.getName());
                } else if (MappedLoginService.RolePrincipal.class.equals(p.getClass())) {
                    userInfo.getRoles().add(p.getName());
                }
            }
        }
        return userInfo;
    }
}
