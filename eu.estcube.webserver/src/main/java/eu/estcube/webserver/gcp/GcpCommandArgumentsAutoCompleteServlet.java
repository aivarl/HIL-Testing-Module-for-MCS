package eu.estcube.webserver.gcp;

import java.io.IOException;
import java.util.HashSet;
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

import eu.estcube.codec.gcp.struct.GcpCommand;
import eu.estcube.codec.gcp.struct.GcpParameter;
import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

@SuppressWarnings("serial")
@Component
public class GcpCommandArgumentsAutoCompleteServlet extends HttpServlet {

    @Autowired
    private GcpStruct struct;

    @EndpointInject(uri = "direct:gcpCommandInput")
    ProducerTemplate producer;

    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    class RadioBeacon {
        protected Set<String> radioBeaconMessage = new HashSet<String>();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

        String input = request.getParameter("command");
        int subsys = Integer.parseInt(request.getParameter("subsys"));

        try {
            JSONObject json = new JSONObject();

            GcpCommand command;
            int commandId;
            String defaultArguments = "";
            try {
                commandId = Integer.parseInt(input);
                command = struct.getCommand(commandId, subsys);

            } catch (NumberFormatException e) {
                command = struct.getCommand(input, subsys);
            }

            if (command == null) {
                json.put("status", "error");
                json.put("message", "Command not found!");

            } else {
                for (GcpParameter parameter : command.getParameters()) {
                    parameter.setType(parameter.getClass().getSimpleName().replace("GcpParameter", "")
                            .toLowerCase());
                    if (parameter.getDefaultValue() != null) {
                        if (defaultArguments != "") {
                            defaultArguments += " " + parameter.getDefaultValue();
                        }
                        else {
                            defaultArguments = parameter.getDefaultValue();
                        }
                    }
                }
                json.put("status", "ok");
                try {
                    responseSupport.sendAsJson(response, toJson, command);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                if (defaultArguments != null) {
                    json.put("defaultValue", defaultArguments);
                }
            }
            response.getWriter().write(json.toString());
        } catch (JSONException e1) {
            throw new ServletException(e1);
        }

    }
}
