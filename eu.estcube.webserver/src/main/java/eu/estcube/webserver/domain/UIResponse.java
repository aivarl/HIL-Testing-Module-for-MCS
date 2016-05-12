package eu.estcube.webserver.domain;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * Basic UI response object.
 * Typically serialized as JSON response and sent to UI.
 */
public class UIResponse {

    /** Response status enum. */
    public enum Status {
        OK,
        ERROR,
    }

    /** Response status value. */
    protected final Status status;

    /**
     * Response value.
     * 
     * Can't use Java generic here because of Gson limitations.
     */
    protected final Object value;

    /**
     * Creates new UIResponse.
     * 
     * @param status response status
     * @param value response value
     */
    public UIResponse(Status status, Object value) {
        this.status = status;
        this.value = value;
    }

    /**
     * Returns status.
     * 
     * @return the status
     */
    public Status getStatus() {
        return status;
    }

    /**
     * Returns the value.
     * 
     * @return the value
     */
    public Object getValue() {
        return value;
    }

    /** @{inheritDoc . */
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
