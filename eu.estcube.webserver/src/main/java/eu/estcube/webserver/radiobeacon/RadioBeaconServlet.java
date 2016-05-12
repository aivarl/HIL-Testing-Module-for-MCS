package eu.estcube.webserver.radiobeacon;

import java.io.IOException;
import java.util.HashMap;
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
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.core.EntityInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.codec.radiobeacon.RadioBeaconDateInputParser;
import eu.estcube.codec.radiobeacon.RadioBeaconTranslator;
import eu.estcube.common.Constants;

@SuppressWarnings("serial")
@Component
public class RadioBeaconServlet extends HttpServlet {

    @Autowired
    private IdBuilder idBuilder;

    @EndpointInject(uri = "direct:radioBeaconInput")
    ProducerTemplate producer;

    RadioBeaconTranslator translator = new RadioBeaconTranslator();

    RadioBeaconDateInputParser parser = new RadioBeaconDateInputParser();

    class RadioBeacon {
        protected Set<String> radioBeaconMessage = new HashSet<String>();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

        String datetime = extractDateTimeFromRequest(request);
        String issuedBy = extractSourceFromRequest(request);
        String data = extractDataFromRequest(request);
        String lineNumber = extractLineNumberFromRequest(request);
        String insertedBy = extractOperatorFromRequest(request);

        try {
            JSONObject json = getJson(datetime, issuedBy, data, insertedBy);
            addLineNumberToJson(json, lineNumber);
            response.getWriter().write(json.toString());
        } catch (JSONException e1) {
            throw new ServletException(e1);
        }
    }

    public String extractDateTimeFromRequest(HttpServletRequest request) {
        return request.getParameter("datetime").trim();
    }

    public String extractSourceFromRequest(HttpServletRequest request) {
        return request.getParameter("source").trim();
    }

    public String extractDataFromRequest(HttpServletRequest request) {
        return request.getParameter("data").trim();
    }

    public String extractLineNumberFromRequest(HttpServletRequest request) {
        String lineNumber = request.getParameter("lineNumber");
        if (lineNumber != null)
            lineNumber = lineNumber.trim();
        return lineNumber;
    }

    public String extractOperatorFromRequest(HttpServletRequest request) {
        return request.getParameter("insertedBy");
    }

    public JSONObject getJson(String datetime, String issuedBy, String data, String insertedBy) throws JSONException {

        if (!isIssuedByLengthOk(issuedBy)) {
            return getErrorJson("Issuer name too long. Max " + getIssuedByMaxLength() + " chars.");
        }

        HashMap<String, EntityInstance> parameters;
        try {
            parameters = translator.toParameters(data,
                    parser.parse(datetime), issuedBy, insertedBy, idBuilder);
        } catch (Exception e) {
            return getErrorJson("There were problems with parsing the data! Nothing sent! " + e.getMessage());
        }

        if (!areParametersOk(parameters)) {
            return getErrorJson("Possible errors: incorrect beacon length, invalid symbols, incorrect callsign");
        }

        sendEntityInstancesToAmq(parameters);

        return getOkJson("Data sent!");

    }

    public void sendEntityInstancesToAmq(HashMap<String, EntityInstance> parameters) {
        for (EntityInstance key : parameters.values()) {
            producer.sendBody(key);
        }
    }

    public JSONObject getOkJson(String message) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("status", "ok");
        json.put("message", message);
        return json;
    }

    public JSONObject getErrorJson(String errorMessage) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("status", "error");
        json.put("message", errorMessage);
        json.put("exceptionMessage", errorMessage);
        return json;
    }

    public void addLineNumberToJson(JSONObject json, String lineNumber) throws JSONException {
        json.put("lineNumber", lineNumber);
    }

    public boolean areParametersOk(HashMap<String, EntityInstance> parameters) {
        return parameters.values().size() != 0;
    }

    public boolean isIssuedByLengthOk(String source) {
        return source.length() <= getIssuedByMaxLength();
    }

    public int getIssuedByMaxLength() {
        return Constants.DATABASE_BEACON_ISSUEDBY_LENGTH;
    }

    public IdBuilder getIdBuilder() {
        return idBuilder;
    }

}
