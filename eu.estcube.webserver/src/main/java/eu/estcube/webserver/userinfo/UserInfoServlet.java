package eu.estcube.webserver.userinfo;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.domain.UserInfo;
import eu.estcube.webserver.utils.HttpResponseSupport;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 * Servlet to return {@link UserInfo} as JSON string.
 */
@Component
public class UserInfoServlet extends HttpServlet {

    /** Serial version UID. */
    private static final long serialVersionUID = 4108320826258561445L;

    /** To JSON serializer. */
    @Autowired
    private ToJsonProcessor toJson;

    /** {@link UserInfoSupport} to get {@link UserInfo} from {@link HttpSession}. */
    @Autowired
    private UserInfoSupport userInfoSupport;

    /** {@link HttpResponseSupport} to send {@link UserInfo} as JSON string. */
    @Autowired
    private HttpResponseSupport httpResponseSupport;

    /** Server info for GUI */
    private String serviceId;
    private String serviceVersion;
    private String host;
    private int port;

    /** @{inheritDoc . */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        UserInfo userInfo = userInfoSupport.getUserInfo(req.getSession());
        userInfo.setServerInfo(this.serviceId, this.serviceVersion, this.host, this.port);
        try {
            httpResponseSupport.sendAsJson(resp, toJson, userInfo);
        } catch (Exception e) {
            throw new ServletException("Failed to serialize UserInfo (username:" + userInfo.getUsername() + ")to JSON",
                    e);
        }
    }

    // Store server info in the userInfo interface for displaying in GUI
    public void setServerInfo(String serviceId, String serviceVersion, String host, int port) {
        this.serviceId = serviceId;
        this.serviceVersion = serviceVersion;
        this.host = host;
        this.port = port;
    }
}
