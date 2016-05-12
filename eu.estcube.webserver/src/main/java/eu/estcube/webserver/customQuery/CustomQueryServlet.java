package eu.estcube.webserver.customQuery;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import eu.estcube.common.queryParameters.AX25QueryParameters;
import eu.estcube.common.queryParameters.BeaconQueryParameters;
import eu.estcube.common.queryParameters.OracleQueryParameters;
import eu.estcube.common.queryParameters.QueryParameters;
import eu.estcube.common.queryParameters.TncQueryParameters;

@Component
public class CustomQueryServlet extends HttpServlet {

	/**
     * 
     */
	Logger log = LoggerFactory.getLogger(CustomQueryServlet.class);
	private static final long serialVersionUID = 1L;

	@EndpointInject(uri = "direct:customQuery")
	private ProducerTemplate producer;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) {

		try {

			QueryParameters params = null;
			if (req.getParameter("tableName").equals("AX25")) {
				params = new AX25QueryParameters();
				params.setReqId(Long.valueOf(req.getHeader("requestId")));
				if (req.getHeader("startDate") != null)
					params.setStart(new DateTime(Long.valueOf(
							req.getHeader("startDate")).longValue()));
				if (req.getHeader("endDate") != null)
					params.setEnd(new DateTime(Long.valueOf(
							req.getHeader("endDate")).longValue()));
				((OracleQueryParameters) params).setDirection(req.getParameter("direction"));
				((OracleQueryParameters) params).setSatellite(req.getParameter("satellite"));
				((OracleQueryParameters) params).setOrbitRange(req.getParameter("orbitRange"));
				((OracleQueryParameters) params).setGroundStationName(req.getParameter("groundStation"));
				if (!req.getParameter("subSystem").isEmpty())
					((AX25QueryParameters) params).setSubsystem(Integer
							.parseInt(req.getParameter("subSystem")));
			} else if (req.getParameter("tableName").equals("TNC")) {
				params = new TncQueryParameters();
				params.setReqId(Long.valueOf(req.getHeader("requestId")));
				if (req.getHeader("startDate") != null)
					params.setStart(new DateTime(Long.valueOf(
							req.getHeader("startDate")).longValue()));
				if (req.getHeader("endDate") != null)
					params.setEnd(new DateTime(Long.valueOf(
							req.getHeader("endDate")).longValue()));
				((OracleQueryParameters) params).setSatellite(req.getParameter("satellite"));
				((OracleQueryParameters) params).setDirection(req.getParameter("direction"));
				((OracleQueryParameters) params).setOrbitRange(req.getParameter("orbitRange"));
				((OracleQueryParameters) params).setGroundStationName(req.getParameter("groundStation"));
			}else{
				params = new BeaconQueryParameters();
				params.setReqId(Long.valueOf(req.getHeader("requestId")));
				if (req.getHeader("startDate") != null)
					params.setStart(new DateTime(Long.valueOf(
							req.getHeader("startDate")).longValue()));
				if (req.getHeader("endDate") != null)
					params.setEnd(new DateTime(Long.valueOf(
							req.getHeader("endDate")).longValue()));
				if (!req.getParameter("issuedBy").isEmpty()){
					((BeaconQueryParameters)params).setIssuedBy(req.getParameter("issuedBy"));
				}
				if (!req.getParameter("insertedBy").isEmpty()){
					((BeaconQueryParameters)params).setInstertedBy(req.getParameter("insertedBy"));
				}
				
			}
			log.debug("Parameters: " + params.toString());
			resp.setContentType("application/json");
	        JSONObject json = new JSONObject();
	        json.put("status", "ok");
	        resp.getWriter().write(json.toString());
	        resp.flushBuffer();
			producer.sendBodyAndHeader(params, "table",
					req.getParameter("tableName"));

		} catch (Exception e) {
			if (e.getClass() == IOException.class) {
				log.error("I/O exception: " + e.getMessage());
				e.printStackTrace();
			} if (e.getClass() == NullPointerException.class) {
				JSONObject json = new JSONObject();
		        try {
					json.put("status", "Problem parsing params");
			        resp.getWriter().write(json.toString());
			        resp.flushBuffer();
				} catch (JSONException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}else
				log.error(e.toString());
		}
	}
}
