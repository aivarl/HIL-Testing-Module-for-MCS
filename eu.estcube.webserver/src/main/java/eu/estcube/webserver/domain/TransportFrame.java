/** 
 *
 */
package eu.estcube.webserver.domain;

import java.io.Serializable;
import java.util.Map;

/**
 * Used to deliver transport frames with headers to client.
 */
public class TransportFrame implements Serializable {

    private static final long serialVersionUID = 2302381075544743387L;

    private final Serializable frame;

    private final Map<String, Object> headers;

    private final Object timestamp;

    public TransportFrame(Serializable frame, Map<String, Object> headers, Object timestamp) {
        this.frame = frame;
        this.headers = headers;
        this.timestamp = timestamp;
    }

    /**
     * Returns frame.
     * 
     * @return the frame
     */
    public Serializable getFrame() {
        return frame;
    }

    /**
     * Returns headers.
     * 
     * @return the headers
     */
    public Map<String, Object> getHeaders() {
        return headers;
    }

    /**
     * Returns timestamp.
     * 
     * @return the timestamp
     */
    public Object getTimestamp() {
        return timestamp;
    }
}
