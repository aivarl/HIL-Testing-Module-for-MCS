package eu.estcube.webserver.ax25;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.ByteUtil;
import eu.estcube.common.Headers;
import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.domain.transport.Uplink;
import eu.estcube.domain.transport.ax25.Ax25UIFrame;
import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;
import eu.estcube.webserver.utils.HttpResponseSupport;

@Component
public class Ax25FrameSubmitServlet extends HttpServlet {
    private static final long serialVersionUID = -3831790918486856827L;

    private static final String POST_PARAMETER_DESTINATION_ADDRESS = "destAddr";
    private static final String POST_PARAMETER_SOURCE_ADDRESS = "sourceAddr";
    private static final String POST_PARAMETER_CTRL = "ctrl";
    private static final String POST_PARAMETER_PID = "pid";
    private static final String POST_PARAMETER_PORT = "port";
    private static final String POST_PARAMETER_INFO = "info";

    @Autowired
    private HttpResponseSupport responseSupport;

    @Autowired
    private ToJsonProcessor toJsonProcessor;

    @EndpointInject(uri = Uplink.AX25_FRAMES)
    ProducerTemplate producer;

    private boolean validate(byte[] src, byte[] dst, byte[] ctrl, byte[] pid, int port, byte[] info) {
        return src.length == Ax25UIFrame.SRC_ADDR_LEN && dst.length == Ax25UIFrame.DEST_ADDR_LEN &&
                port >= 0 && port <= 15 && info.length <= Ax25UIFrame.INFO_MAX_EFFECTIVE_SIZE &&
                ctrl.length == 1 && pid.length == 1;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException {
        UIResponse uiresp;

        try {
            byte[] sourceAddr = ByteUtil.toBytesFromHexString(req.getParameter(POST_PARAMETER_SOURCE_ADDRESS));
            byte[] destAddr = ByteUtil.toBytesFromHexString(req.getParameter(POST_PARAMETER_DESTINATION_ADDRESS));

            byte[] ctrl = ByteUtil.toBytesFromHexString(req.getParameter(POST_PARAMETER_CTRL));
            byte[] pid = ByteUtil.toBytesFromHexString(req.getParameter(POST_PARAMETER_PID));

            int port = Integer.parseInt(req.getParameter(POST_PARAMETER_PORT).trim());

            String infoString = req.getParameter(POST_PARAMETER_INFO);
            if (StringUtils.isBlank(infoString)) {
                throw new IllegalArgumentException("Info field must be non-empty");
            }

            byte[] info = ByteUtil.toBytesFromHexString(infoString);

            if (!validate(sourceAddr, destAddr, ctrl, pid, port, info))
                throw new IllegalArgumentException("Invalid argument values");

            Ax25UIFrame frame = new Ax25UIFrame(destAddr, sourceAddr, ctrl[0], pid[0], info, new byte[] { 0, 0 });

            producer.sendBodyAndHeader(frame, Headers.TNC_PORT, port);

            uiresp = new UIResponse(Status.OK, "ok");
        } catch (Exception e) {
            uiresp = new UIResponse(Status.ERROR, e.getMessage());
        }

        try {
            responseSupport.sendAsJson(resp, toJsonProcessor, uiresp);
        } catch (Exception e) {
            throw new ServletException("Failed to send response to UI");
        }
    }
}
