package eu.estcube.webserver.radiobeacon;

import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hbird.business.api.ICatalogue;
import org.hbird.business.api.IDataAccess;
import org.hbird.exchange.core.Label;
import org.hbird.exchange.core.Metadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.utils.HttpResponseSupport;

@Component
public class BeaconListServlet extends HttpServlet {
    private static final long serialVersionUID = -2807674879565161210L;
    private static final Logger LOG = LoggerFactory.getLogger(BeaconListServlet.class);

    @Autowired
    private ToJsonProcessor toJson;

    @Autowired
    private HttpResponseSupport responseSupport;

    @Value("${service.id}")
    private String serviceId;

    @Autowired
    private IDataAccess dao;

    @Autowired
    private ICatalogue catalogue;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException {
        try {
            List<Label> labels = dao.getAllInstancesById("/ESTCUBE/Satellites/ESTCube-1/beacon/raw", Label.class);
            Object[] listToSend = new Object[labels.size() * 2];

            // make an array of Labels and Metadata with structure:
            // listToSend = {Label1, Metadata1, Label2, Metadata2,...}
            // where beacon1 = Label1 + Metadata1
            int index = 0;
            for (Label label : labels) {
                List<Metadata> metadata = dao.getApplicableTo(label.getInstanceID(), Metadata.class);
                listToSend[index] = label;
                if (!metadata.isEmpty()) {
                    listToSend[index + 1] = metadata.get(0);
                }
                index += 2;
            }
            responseSupport.sendAsJson(resp, toJson, listToSend);
        } catch (Exception e) {
            String message = "Failed to process beacon list request";
            LOG.error(message, e);
            throw new ServletException(message, e);
        }
    }
}
