package eu.estcube.webserver.tle.request;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

/**
 *
 */
@Component
public class TleServlet extends HttpServlet {

    /** */
    private static final long serialVersionUID = -4343823849095171602L;

    private static final Logger LOG = LoggerFactory.getLogger(TleServlet.class);

    /** To JSON processor for result serialization. */
    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Autowired
    private IOrbitalDataAccess dao;

    @Value("${service.id}")
    private String serviceId;

    /** @{inheritDoc . */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            // FIXME get rid of hardcoded satellite ID
            List<TleOrbitalParameters> data = dao.getTleFor("/ESTCUBE/Satellites/ESTCube-1", 0,
                    System.currentTimeMillis());

            responseSupport.sendAsJson(resp, toJson, data);
        } catch (Exception e) {
            LOG.error("Failed to handle TLE request", e);
            throw new ServletException("Failed to handle TLE request", e);
        }
    }
}
