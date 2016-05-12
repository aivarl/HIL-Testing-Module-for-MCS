package eu.estcube.webserver.tle.upload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.camel.Body;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.Metadata;
import org.hbird.exchange.dataaccess.TlePropagationRequest;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.hbird.MetadataFactory;
import eu.estcube.webserver.domain.TleUploadRequest;

/**
 * Converts {@link TleUploadRequest} to {@link TleOrbitalParameters}.
 */
@Component
public class TleUploadRequestConverter {

    /** TLE parameter name. */
    public static final String PARAMTER_TLE = "TLE";

    @Value("${service.id}")
    public String serviceId;

    @Autowired
    MetadataFactory metadataFactory;

    @Autowired
    IdBuilder idBuilder;

    /**
     * Converts {@link TleUploadRequest} to {@link TlePropagationRequest}.
     * 
     * @param request
     *        {@link TleUploadRequest} to convert
     * @return new instance of {@link TlePropagationRequest}
     */
    public List<IEntityInstance> convert(@Body TleUploadRequest request) {
        String satellite = request.getSatellite();
        Long timestamp = request.getTimestamp();
        String[] lines = request.getTleText().trim().split("\n");

        String id = idBuilder.buildID(satellite, PARAMTER_TLE);
        TleOrbitalParameters top = new TleOrbitalParameters(id, PARAMTER_TLE);
        top.setTimestamp(timestamp);
        top.setSatelliteId(satellite);
        top.setTleLine1(lines[0].trim());
        top.setTleLine2(lines[1].trim());
        top.setDescription(TleOrbitalParameters.DESCRIPTION);

        Map<String, Object> data = new HashMap<String, Object>(2);
        data.put(StandardArguments.USERNAME, request.getUploader());
        data.put(StandardArguments.SOURCE, request.getTleSource());
        Metadata meta = metadataFactory.createMetadata(top, data, serviceId);

        List<IEntityInstance> result = new ArrayList<IEntityInstance>(2);
        result.add(top);
        result.add(meta);

        return result;
    }
}
