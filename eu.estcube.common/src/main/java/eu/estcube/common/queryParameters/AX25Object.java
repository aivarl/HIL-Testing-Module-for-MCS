package eu.estcube.common.queryParameters;

import java.io.Serializable;

public class AX25Object implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private int id;
    private String direction;
    private String receptionTime;
    private String satellite;
    private String destAddr;
    private String srcAddr;
    private int ctrl;
    private int pid;
    private String info;
    private String fcs;
    private int errorBitmask;
    private String created;
    private Long requestId;
    private String target;
    private int orbitNumber;

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getReceptionTime() {
        return receptionTime;
    }

    public void setReceptionTime(String receptionTime) {

        this.receptionTime = receptionTime;
    }

    public void setSatellite(String satellite) {
        this.satellite = satellite;

    }

    public String getSatellite() {
        return satellite;
    }

    public String getDestAddr() {
        return destAddr;
    }

    public void setDestAddr(String destAddr) {
        this.destAddr = destAddr;
    }

    public String getSrcAddr() {
        return srcAddr;
    }

    public void setSrcAddr(String srcAddr) {
        this.srcAddr = srcAddr;
    }

    public int getCtrl() {
        return ctrl;
    }

    public void setCtrl(int ctrl) {
        this.ctrl = ctrl;
    }

    public int getPid() {
        return pid;
    }

    public void setPid(int pid) {
        this.pid = pid;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getFcs() {
        return fcs;
    }

    public void setFcs(String fcs) {
        this.fcs = fcs;
    }

    public int getErrorBitmask() {
        return errorBitmask;
    }

    public void setErrorBitmask(int errorBitmask) {
        this.errorBitmask = errorBitmask;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public int getOrbitNumber() {
        return orbitNumber;
    }

    public void setOrbitNumber(int orbitNumber) {
        this.orbitNumber = orbitNumber;
    }

}
