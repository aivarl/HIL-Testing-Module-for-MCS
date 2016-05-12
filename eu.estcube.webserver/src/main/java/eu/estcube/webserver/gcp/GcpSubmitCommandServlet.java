package eu.estcube.webserver.gcp;

import java.io.IOException;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import eu.estcube.codec.gcp.struct.GcpCommand;
import eu.estcube.codec.gcp.struct.GcpParameter;
import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.Command;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.codec.gcp.GcpEncoder;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.webserver.utils.CamelSender;

@SuppressWarnings("serial")
@Component
public class GcpSubmitCommandServlet extends HttpServlet {

    @Produce(uri = "direct:gcpCommandInput")
    private CamelSender camel;

    @Autowired
    private GcpStruct struct;

    @Autowired
    private IdBuilder idBuilder;

    @EndpointInject(uri = "direct:gcpCommandInput")
    ProducerTemplate producer;

    @Value("${gcp.entityId}")
    String entityId;

    class RadioBeacon {
        protected Set<String> radioBeaconMessage = new HashSet<String>();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        String[] input = { request.getParameter("source"), request.getParameter("destination"),
                request.getParameter("priority"), request.getParameter("id"), request.getParameter("CDHSSource"),
                request.getParameter("CDHSBlockIndex"), request.getParameter("arguments") };


        System.out.println(Arrays.toString(input));
        try {
            JSONObject json = new JSONObject();

            try {
                System.out.println(request.getParameter(StandardArguments.SATELLITE_ID));
                System.out.println(request.getParameter(StandardArguments.GROUND_STATION_ID));
                struct.setSatelliteId(request.getParameter(StandardArguments.SATELLITE_ID));

                Command command = new GcpEncoder().encode(input, struct, entityId, idBuilder);
                Map<String, Object> headers = new HashMap<String, Object>();
                headers.put(StandardArguments.GROUND_STATION_ID,
                        request.getParameter(StandardArguments.GROUND_STATION_ID));
                headers.put(StandardArguments.SATELLITE_ID, request.getParameter(StandardArguments.SATELLITE_ID));
                producer.sendBodyAndHeaders(command, headers);
                json.put("status", "ok");
                json.put("message", "Command sent!");

            } catch (Exception e) {
                json.put("status", "error");
                json.put("message", e.getClass().getSimpleName() + ": " + e.getMessage());
            }

            response.getWriter().write(json.toString());

        } catch (JSONException e1) {
            throw new ServletException(e1);
        }

    }
}
