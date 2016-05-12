/** 
 *
 */
package eu.estcube.webserver.catalogue;

import java.io.IOException;
import java.util.Map;
import java.util.StringTokenizer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hbird.business.api.ICatalogue;
import org.hbird.business.api.IDataAccess;
import org.hbird.business.api.IOrbitalDataAccess;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

/**
 *
 */
@Component
public class CatalogueServlet extends HttpServlet {

    private static final long serialVersionUID = -2655050951676720703L;

    private static final Logger LOG = LoggerFactory.getLogger(CatalogueServlet.class);

    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Autowired
    private ICatalogue catalogue;

    @Autowired
    private IDataAccess d_dao;

    @Autowired
    private IOrbitalDataAccess o_dao;

    @Value("${service.id}")
    private String serviceId;

    /** @{inheritDoc . */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Map<String, String[]> params = req.getParameterMap();
            StringTokenizer st = new StringTokenizer(req.getPathInfo(), "/");
            RootNode rootNode = new RootNode(catalogue, o_dao, d_dao);
            Object queryResult = rootNode.runQuery(st, params);
            responseSupport.sendAsJson(resp, toJson, queryResult);
        } catch (Exception e) {
            String message = "Failed to process Satellites request";
            System.err.println(message);
            LOG.error(message, e);
            throw new ServletException(message, e);
        }
    }
}
