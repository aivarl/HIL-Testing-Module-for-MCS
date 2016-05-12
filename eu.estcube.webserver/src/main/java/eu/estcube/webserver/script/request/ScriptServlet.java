package eu.estcube.webserver.script.request;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONTokener;
import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Component
public class ScriptServlet extends HttpServlet {

    /** */
    private static final long serialVersionUID = -4343823849095171602L;

    private static final Logger LOG = LoggerFactory.getLogger(ScriptServlet.class);

    /**
     * To JSON processor for result serialization.
     */
    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Value("${service.id}")
    private String serviceId;


    /**
     * @{inheritDoc .
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = req.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);

            JSONObject jsonObject = new JSONObject(new
                    JSONTokener(jb.toString()));


            System.out.println("Received: " + jsonObject.get("something"));
            Map<String, String> data = new HashMap<String, String>();
            data.put("somethingBack", jsonObject.getString("something").replace("a", "A"));

            responseSupport.sendAsJson(resp, toJson, data);
        } catch (Exception e) {
            LOG.error("Failed to handle Script request", e);
            throw new ServletException("Failed to handle Script request", e);
        }
    }
}
