package eu.estcube.webserver.tle.upload;

import org.apache.camel.Body;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.domain.TleUploadRequest;

/**
 * Validates {@link TleUploadRequest} values.
 */
@Component
public class TleUploadRequestValidator {

    /**
     * Validates {@link TleUploadRequest} values.
     * 
     * @param request {@link TleUploadRequest} to validate
     * @return {@link TleUploadRequest} in case it's valid
     * @throws IllegalArgumentException in case input is invalid
     */
    public TleUploadRequest validate(@Body TleUploadRequest request) throws IllegalArgumentException {
        Validate.isTrue(StringUtils.isNotBlank(request.getSatellite()), "Satellite invalid or empty");
        Validate.isTrue(StringUtils.isNotBlank(request.getUploader()), "Uploader invalid or empty");
        Validate.isTrue(StringUtils.isNotBlank(request.getTleSource()), "TLE source invalid or empty");
        Long timestamp = request.getTimestamp();
        Validate.isTrue(timestamp > 0, "TLE timestamp invalid", timestamp);
        String tleText = request.getTleText();
        Validate.isTrue(StringUtils.isNotBlank(tleText), "TLE value is empty");
        Validate.isTrue(tleText.trim().split("\n").length == 2, "TLE value has to have exactly two lines");
        return request;
    }
}
