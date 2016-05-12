package eu.estcube.common.queryParameters;

import java.io.Serializable;

public class BeaconObject implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String value;
    private String instertedBy;
    private Long version;
    private String timestamp;
    private String name;
    private String issuedBy;
    private Long requestId;

    public void setValue(String value) {
        this.value = value;
    }

    public void setInstertedBy(String instertedBy) {
        this.instertedBy = instertedBy;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public void setTimestamp(String s) {
        this.timestamp = s;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

}
