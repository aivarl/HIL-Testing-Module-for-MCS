package eu.estcube.webserver.domain;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * Pojo for holding TLE upload request values from UI.
 */
public class TleUploadRequest {

    /** Source of the TLE. */
    protected final String tleSource;

    /** Value of the TLE. */
    protected final String tleText;

    /** Name of the Satellite the TLE is related to. */
    protected final String satellite;

    /** User responsible for the TLE upload. */
    protected final String uploader;

    /** Timestamp of the TLE. */
    protected final long timestamp;

    /**
     * Creates new TleUploadRequest.
     * 
     * @param tleSource source of the TLE
     * @param tleText value of the TLE
     * @param satellite satellite of the TLE
     * @param uploader uploader of the TLE
     * @param timestamp timestamp of the TLE
     */
    public TleUploadRequest(String tleSource, String tleText, String satellite, String uploader, long timestamp) {
        this.tleSource = tleSource;
        this.tleText = tleText;
        this.satellite = satellite;
        this.uploader = uploader;
        this.timestamp = timestamp;
    }

    /**
     * Returns tleSource.
     * 
     * @return the tleSource
     */
    public String getTleSource() {
        return tleSource;
    }

    /**
     * Returns tleText.
     * 
     * @return the tleText
     */
    public String getTleText() {
        return tleText;
    }

    /**
     * Returns satellite.
     * 
     * @return the satellite
     */
    public String getSatellite() {
        return satellite;
    }

    /**
     * Returns uploader.
     * 
     * @return the uploader
     */
    public String getUploader() {
        return uploader;
    }

    /**
     * Returns timestamp.
     * 
     * @return the timestamp
     */
    public long getTimestamp() {
        return timestamp;
    }

    /** @{inheritDoc . */
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
