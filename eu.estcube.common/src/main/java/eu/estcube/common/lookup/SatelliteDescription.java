package eu.estcube.common.lookup;

/**
 * Holds description information about a satellite for mapping destination and
 * source handlers to real satellite name
 * 
 * @author Kaarel Hanson
 * 
 */
public class SatelliteDescription {

    private String destAddress;
    private String srcAddress;
    private String satelliteName;
    private String noradID;

    public SatelliteDescription(String destAddress, String srcAddress) {
        this(destAddress, srcAddress, null);
    }

    public SatelliteDescription(String noradID) {
        this(null, null, noradID);
    }

    public SatelliteDescription(String destAddress, String srcAddress, String noradID) {
        this.destAddress = destAddress;
        this.srcAddress = srcAddress;
        this.noradID = noradID;
    }

    public SatelliteDescription() {
        // Default constructor is required for automatic xml parsing
    }

    public String getDestAddress() {
        return destAddress;
    }

    public void setDestAddress(String destAddress) {
        this.destAddress = destAddress;
    }

    public String getSrcAddress() {
        return srcAddress;
    }

    public void setSrcAddress(String srcAddress) {
        this.srcAddress = srcAddress;
    }

    public String getSatelliteName() {
        return satelliteName;
    }

    public void setSatelliteName(String satelliteName) {
        this.satelliteName = satelliteName;
    }

    public String getNoradID() {
        return noradID;
    }

    public void setNoradID(String noradID) {
        this.noradID = noradID;
    }

    @Override
    public boolean equals(Object obj) {
        SatelliteDescription description = (SatelliteDescription) obj;
        if (description.getNoradID() != null && this.getNoradID() != null
                && description.getNoradID().equals(this.getNoradID())) {
            return true;
        }
        if (description.getDestAddress() != null && this.getDestAddress() != null
                && description.getSrcAddress() != null && this.getSrcAddress() != null) {
            if (description.getDestAddress().equals(this.getDestAddress())
                    && description.getSrcAddress().equals(this.getSrcAddress())) {
                return true;
            }
        }
        return false;
    }
}
