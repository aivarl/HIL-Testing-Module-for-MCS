package eu.estcube.common.queryParameters;

public class BeaconQueryParameters extends QueryParameters {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String instertedBy = "";
    private String issuedBy = "";

    public String getInstertedBy() {
        return instertedBy;
    }

    public void setInstertedBy(String instertedBy) {
        this.instertedBy = instertedBy;
    }

    public String getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }

    public static String getTable() {
        return "label";
    }

    public static String getDetailsTable() {
        return "raw";
    }
}
