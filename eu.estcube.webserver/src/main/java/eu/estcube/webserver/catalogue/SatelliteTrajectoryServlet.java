package eu.estcube.webserver.catalogue;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jettison.json.JSONException;
import org.hbird.business.api.IDataAccess;
import org.hbird.business.api.IOrbitDataCalculator;
import org.hbird.exchange.groundstation.GroundStation;
import org.hbird.exchange.navigation.LocationContactEvent;
import org.hbird.exchange.navigation.PointingData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

@Component
public class SatelliteTrajectoryServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Autowired
    HttpResponseSupport responseSupport;

    @Autowired
    ToJsonProcessor toJsonProcessor;

    @Autowired
    private IDataAccess dao;

    @Autowired
    private IOrbitDataCalculator orbitDataCalculator;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

        try {
            String instanceId = request.getParameter("instanceId");

            LocationContactEvent locationContactEvent = dao.getByInstanceId(instanceId, LocationContactEvent.class);
            GroundStation gs = dao.getById(locationContactEvent.getGroundStationID(), GroundStation.class);
            List<PointingData> trajectory = orbitDataCalculator.calculateContactData(locationContactEvent, gs, true, 40000);

            responseSupport.sendAsJson(response, toJsonProcessor, trajectory);

        } catch (JSONException e1) {
            throw new ServletException(e1);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}