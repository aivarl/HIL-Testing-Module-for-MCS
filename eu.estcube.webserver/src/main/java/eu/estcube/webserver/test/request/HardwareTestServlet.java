package eu.estcube.webserver.test.request;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONTokener;
import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fazecast.jSerialComm.SerialPort;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Component
public class HardwareTestServlet extends HttpServlet {

    /** */
    private static final long serialVersionUID = -4343823849095171602L;

    private static final Logger LOG = LoggerFactory.getLogger(HardwareTestServlet.class);

    @EndpointInject(uri = "activemq:queue:estcube.hardwaretesting.serialport")
    ProducerTemplate serialPortProducer;

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
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException ,IOException {
    	Map<String, Object> data = new HashMap<String, Object>();
    	// determine which serial port to use
    	SerialPort ports[] = SerialPort.getCommPorts();
    	List<List<String>> portsStringList = new ArrayList<List<String>>();
    	for (SerialPort port : ports) {
    		List<String> portList = new ArrayList<String>();
    		portList.add(port.getSystemPortName());
    		portList.add(port.getDescriptivePortName());
    		
			portsStringList.add(portList);
		}
        data.put("ports", portsStringList);

        try {
        	System.out.println("Sending available serial ports.");
			responseSupport.sendAsJson(resp, toJson, data);
		} catch (Exception e) {
			e.printStackTrace();
		}
    };
    /**
     * @{inheritDoc .
     * Get the selected serialport from UI and send it to (HardwareTesting -> SerialPortProcessor).
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


            System.out.println("Received: " + jsonObject.get("port"));
            Map<String, String> data = new HashMap<String, String>();
            data.put("somethingBack", (String) jsonObject.get("port"));
            
            serialPortProducer.sendBody(jsonObject.get("port"));
            responseSupport.sendAsJson(resp, toJson, data);
        } catch (Exception e) {
            LOG.error("Failed to handle Script request", e);
            throw new ServletException("Failed to handle Script request", e);
        }
    }
}
