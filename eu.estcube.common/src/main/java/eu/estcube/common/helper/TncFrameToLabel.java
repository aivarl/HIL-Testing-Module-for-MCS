/** 
 *
 */
package eu.estcube.common.helper;

import org.apache.camel.Body;
import org.apache.camel.Handler;
import org.apache.camel.Header;
import org.apache.commons.lang3.Validate;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.Label;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.ByteUtil;
import eu.estcube.domain.transport.tnc.TncFrame;

/**
 *
 */
@Component
public class TncFrameToLabel {

    public static final String RELATIVE_PARAMETER_NAME = "TNC Frame";

    public static final String DESCRIPTION = "TNC Frame Dump for debug";

    public static final String HEADER_TIMESTAMP = "jmstimestamp";

    private String groundStationId;

    @Autowired
    private IdBuilder idBuilder;

    public TncFrameToLabel() {
    }

    public TncFrameToLabel(IdBuilder idBuilder, String groundStationId) {
        this.idBuilder = idBuilder;
        this.groundStationId = groundStationId;
    }

    public void setGroundStationId(String groundStationId) {
        this.groundStationId = groundStationId;
    }

    @Handler
    public Label process(@Header(HEADER_TIMESTAMP) Long timestamp,
            @Header(StandardArguments.ISSUED_BY) String issuedBy, @Body TncFrame frame) {
        Validate.notEmpty(groundStationId, "ground station ID is not set");
        String finalParameterId = idBuilder.buildID(groundStationId, RELATIVE_PARAMETER_NAME);
        String value = ByteUtil.toHexString(frame.getData());
        Label label = new Label(finalParameterId, RELATIVE_PARAMETER_NAME);
        label.setTimestamp(timestamp);
        label.setDescription(DESCRIPTION);
        label.setIssuedBy(issuedBy);
        label.setValue(value);
        return label;
    }
}
