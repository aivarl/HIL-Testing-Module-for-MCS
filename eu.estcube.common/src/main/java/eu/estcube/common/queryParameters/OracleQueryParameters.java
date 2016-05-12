package eu.estcube.common.queryParameters;


public class OracleQueryParameters extends QueryParameters {

    public OracleQueryParameters() {
        // TODO Auto-generated constructor stub
    }

    /**
     * 
     */
    protected static final long serialVersionUID = 1L;

    protected String satelliteName;
    protected String direction;
    protected String groundStationId;
    protected String orbitRange;

    public void setOrbitRange(String parameter) {
        this.orbitRange = parameter;
    }

    public String getOrbitRange() {
        return orbitRange;
    }

    public String getGroundStationName() {
        return groundStationId;
    }

    public void setGroundStationName(String groundStationName) {
        this.groundStationId = groundStationName;
    }

    public String getSatellite() {
        return satelliteName;
    }

    public void setSatellite(String satellite) {
        this.satelliteName = satellite;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    @Override
    public String toString() {
        return "QueryParameters [start=" + start + ", end=" + end + ", satelliteName=" + satelliteName
                + ", direction=" + direction + ", groundStation=" + groundStationId + "]";
    }
}