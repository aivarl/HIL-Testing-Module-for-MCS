package eu.estcube.common.queryParameters;

public class TncQueryParameters extends OracleQueryParameters {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private int command = Integer.MIN_VALUE;

    @Override
    public String toString() {
        return "TncQueryParameters [start=" + start + ", end=" + end + "command=" + command + ", , satelliteName="
                + satelliteName + ", direction=" + direction + "]";
    }

    public int getCommand() {
        return command;
    }

    public void setCommand(int command) {
        this.command = command;
    }

    public static String getTable() {
        return "MCS.TNC_FRAMES";
    }

    public static String getDetailsTable() {
        return "MCS.TNC_FRAME_DETAILS";
    }

    public String getTimestampFunction() {
        return "SYSDATE";
    }

}
