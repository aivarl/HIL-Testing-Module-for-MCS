package eu.estcube.webserver.gcp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.codec.gcp.exceptions.SubsystemNotFoundException;
import eu.estcube.codec.gcp.struct.GcpCommand;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.codec.gcp.struct.GcpSubsystem;
import eu.estcube.codec.gcp.struct.GcpSubsystemIdProvider;

@SuppressWarnings("serial")
@Component
public class GcpCommandsAutoCompleteServlet extends HttpServlet {

    @Autowired
    private GcpStruct struct;

    @EndpointInject(uri = "direct:gcpCommandInput")
    ProducerTemplate producer;

    class RadioBeacon {
        protected Set<String> radioBeaconMessage = new HashSet<String>();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

        JSONObject json = new JSONObject();
        try {
            json.put("status", "ok");
            json.put("identifier", "id");

            List<JSONObject> list = new ArrayList<JSONObject>();
            for (GcpCommand command : struct.getCommands()) {
                for (GcpSubsystem subsys : command.getSubsystems()) {
                    int subsysId = GcpSubsystemIdProvider.getId(subsys.getName());
                    JSONObject com = new JSONObject();
                    com.put("id", command.getId() + "_" + subsysId);
                    com.put("name", command.getName());
                    com.put("subsystem", subsysId);
                    list.add(com);
                }
            }
            json.put("items", list);

        } catch (JSONException e) {
            e.printStackTrace();
        } catch (SubsystemNotFoundException e) {
            throw new ServletException(e);
        }

        response.getWriter().write(json.toString());

    }
}
