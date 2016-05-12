package eu.estcube.common.queryParameters;

import java.io.Serializable;

import org.joda.time.DateTime;

public class QueryParameters implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    protected DateTime start;
    protected DateTime end;
    protected long reqId;

    public Long getReqId() {
        return reqId;
    }

    public void setReqId(Long reqId) {
        this.reqId = reqId;
    }

    public DateTime getStart() {
        return start;
    }

    public void setStart(DateTime start) {
        this.start = start;
    }

    public DateTime getEnd() {
        return end;
    }

    public void setEnd(DateTime end) {
        this.end = end;
    }

}
