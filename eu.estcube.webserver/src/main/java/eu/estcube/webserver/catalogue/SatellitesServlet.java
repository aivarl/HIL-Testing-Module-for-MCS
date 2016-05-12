/** 
 *
 */
package eu.estcube.webserver.catalogue;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.exchange.navigation.LocationContactEvent;
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
public class SatellitesServlet extends HttpServlet {

    private static final long serialVersionUID = -2655050951676720703L;

    private static final Logger LOG = LoggerFactory.getLogger(SatellitesServlet.class);

    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Value("${service.id}")
    private String serviceId;

    @Autowired
    private IOrbitalDataAccess dao;

    /** @{inheritDoc . */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            LocationContactEvent event = dao.getNextLocationContactEventForGroundStation("ES5EC");
            responseSupport.sendAsJson(resp, toJson, event);
        } catch (Exception e) {
            String message = "Failed to process Satellites request";
            LOG.error(message, e);
            throw new ServletException(message, e);
        }
    }
}
