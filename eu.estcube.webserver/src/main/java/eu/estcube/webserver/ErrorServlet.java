package eu.estcube.webserver;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.auth.LoginServiceListener;

@Component
public class ErrorServlet extends HttpServlet {

    /** Serial version UID. */
    private static final long serialVersionUID = 3213214971880226603L;

    @Autowired
    private LoginServiceListener listener;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String errorMessage = listener.getThrowable() == null ? "Invalid username or password"
                : "Unable to connect to crowd server";

        resp.addCookie(new Cookie("error-message", errorMessage));

        InputStream page = getServletContext().getResourceAsStream("/MCS/login.html");
        IOUtils.copy(page, resp.getOutputStream());
    }
}
