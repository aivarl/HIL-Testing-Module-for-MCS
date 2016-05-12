package eu.estcube.webserver.tle.upload;

import java.util.List;

import org.apache.camel.Body;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.dataaccess.TlePropagationRequest;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;

/**
 * Creates {@link UIResponse} from {@link TlePropagationRequest}.
 */
@Component
public class TleUploadResponseCreator {

    /**
     * Creates {@link UIResponse} from {@link TleOrbitalParameters}.
     * 
     * @param tle
     *        {@link TlePropagationRequest} to use
     * @return new {@link UIResponse} instance
     */
    public UIResponse create(@Body List<EntityInstance> parameters) {
        return new UIResponse(Status.OK, parameters);
    }
}
