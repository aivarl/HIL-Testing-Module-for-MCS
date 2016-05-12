package eu.estcube.webserver.tle.upload;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.Produce;
import org.hbird.business.api.IPublisher;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;
import eu.estcube.webserver.utils.CamelSender;
import eu.estcube.webserver.utils.HttpResponseSupport;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 * Servlet to handle TLE uploads.
 */
@Component
public class TleSubmitServlet extends HttpServlet {

    /** POST parameter name for TLE source. */
    public static final String POST_PARAMETER_TLE_SOURCE = "tleSource";

    /** POST parameter name for TLE value. */
    public static final String POST_PARAMETER_TLE_TEXT = "tleText";

    public static final String POST_PARAMETER_TLE_SATELLITE_ID = "satelliteId";

    /** Serial version UID. */
    private static final long serialVersionUID = -3212154839166522652L;

    /** Logger */
    private static final Logger LOG = LoggerFactory.getLogger(TleSubmitServlet.class);

    /** To JSON processor for result serialization. */
    @Autowired
    private ToJsonProcessor toJson;

    /** CamelSender to send messages to the Camel route. */
    @Produce(uri = "direct:tle-submit")
    private CamelSender camel;

    @Autowired
    private UserInfoSupport userInfoSupport;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Autowired
    private IPublisher publisher;

    @Autowired
    private IdBuilder idBuilder;

    /** @{inheritDoc . */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String tleSource = req.getParameter(POST_PARAMETER_TLE_SOURCE);
        String tleText = req.getParameter(POST_PARAMETER_TLE_TEXT);
        String satellite = req.getParameter(POST_PARAMETER_TLE_SATELLITE_ID);

        UIResponse result;

        try {
            String[] tleLines = tleText.split("\n");

            TleOrbitalParameters tle = new TleOrbitalParameters(idBuilder.buildID(satellite, "TLE"), "TLE");
            tle.setTleLine1(tleLines[0]);
            tle.setTleLine2(tleLines[1]);
            tle.setSatelliteId(satellite);
            tle.setIssuedBy(tleSource);

            publisher.publish(tle);

            result = new UIResponse(Status.OK, "Tle upload successful");
        } catch (Exception e) {
            LOG.error("Failed to handle TLE upload request", e);
            result = new UIResponse(Status.ERROR, e.getMessage());
        }

        try {
            responseSupport.sendAsJson(resp, toJson, result);
        } catch (Exception e) {
            throw new ServletException("Failed to send response", e);
        }
    }
}
