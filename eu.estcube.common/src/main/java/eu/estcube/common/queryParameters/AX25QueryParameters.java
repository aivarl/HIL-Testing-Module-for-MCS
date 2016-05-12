package eu.estcube.common.queryParameters;

public class AX25QueryParameters extends OracleQueryParameters {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private int subsystem = Integer.MIN_VALUE;

    public int getSubsystem() {
        return subsystem;
    }

    public void setSubsystem(int subsystem) {
        this.subsystem = subsystem;
    }

    public static String getTable() {
        return "MCS.AX25_FRAMES";
    }

    public static String getDetailsTable() {
        return "MCS.AX25_FRAME_DETAILS";
    }

    public static String getTimestampFunction() {
        return "SYSDATE";
    }

    @Override
    public String toString() {
        return "AX25QueryParameters [orbitRange=" + orbitRange + ", subsystem=" + subsystem + ", start=" + start
                + ", end=" + end + ", satelliteName=" + satelliteName + ", direction=" + direction + ", groundStation="
                + groundStationId + "]";
    }
}
