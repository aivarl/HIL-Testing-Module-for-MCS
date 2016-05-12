package eu.estcube.webserver.test.upload;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONTokener;
import org.hbird.business.api.IOrbitalDataAccess;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.common.script.Script;
import eu.estcube.webserver.utils.HttpResponseSupport;

/**
 * Servlet to handle testing Script uploads.
 */
@Component
public class HardwareTestSubmitServlet extends HttpServlet {
    /** */
    private static final long serialVersionUID = -4343823849095171602L;

    private static final Logger LOG = LoggerFactory.getLogger(HardwareTestSubmitServlet.class);

    @EndpointInject(uri = "activemq:queue:estcube.hardwaretesting.script")
    ProducerTemplate testingScriptProducer;

    /**
     * To JSON processor for result serialization.
     */
    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Autowired
    private IOrbitalDataAccess dao;

    @Value("${service.id}")
    private String serviceId;

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

            String code = (String) jsonObject.get("code");

            Script script = new Script();
            script.setCode(code);

            script.setIdentifier("hardwaretest");

            LOG.info("Sending hardware test body to scripting engine");
            LOG.info(code);
            testingScriptProducer.sendBody(script);

            Map<String, String> data = new HashMap<String, String>();

            responseSupport.sendAsJson(resp, toJson, data);
        } catch (Exception e) {
            LOG.error("Failed to handle Script submit", e);
            throw new ServletException("Failed to handle Script submit", e);
        }
    }
}
