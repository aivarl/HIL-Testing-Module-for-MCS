package eu.estcube.webserver.auth;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.domain.UserInfo;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 * {@link Servlet} to handle logout requests.
 */
@Component
public class LogoutServlet extends HttpServlet {

    /** Redirect response to this URL after logout. */
    public static final String REDIRECT_AFTER_LOGOUT = "/";

    /** Serial version UID. */
    private static final long serialVersionUID = -6484277271382732078L;

    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(LogoutServlet.class);

    /** {@link UserInfoSupport} to use. */
    @Autowired
    private UserInfoSupport userInfoSupport;

    /**
     * @{inheritDoc .
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session != null) {
            UserInfo userInfo = userInfoSupport.getUserInfo(session);
            session.invalidate();
            LOG.info("Successful logout of the user {}", userInfo.getUsername());
        }
        response.sendRedirect(REDIRECT_AFTER_LOGOUT);
    }
}
