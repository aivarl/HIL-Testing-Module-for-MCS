package eu.estcube.common.lookup;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.Charsets;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.StaxDriver;

/**
 * SatelliteLookup reads the contents of the satellite descriptions file, which
 * describes the correct satellite name according to the Destination and Source
 * handlers. For example, if Destination is ES5EC-1 and Source is ES5E-11, the
 * corresponding satellite name is /ESTCUBE/Satellites/ESTCube-1. The necessity
 * of this class is that if some other satellite is listened to, the satellite
 * real name can be defined in the XML document, rather than add it to the local
 * database, where should only be ESTCube satellite(s)' descriptions stored.
 * 
 * @author Kaarel Hanson
 * @since 20.03.2014
 */
@Component
public class SatelliteLookup {

    public static final String DEFAULT_NAME = "unknown";

    private List<SatelliteDescription> descriptions;

    public SatelliteLookup() throws IOException {
        initDescriptions();
    }

    /**
     * Initializes the satellite descriptions list with the satellite
     * Destination/Source descriptions. The file location is indicated in the VM
     * argument satellite.parameters
     * 
     * @throws IOException
     */
    @SuppressWarnings("unchecked")
    private void initDescriptions() throws IOException {
        String fileName = System.getProperty("satellite.descriptions");
        if (fileName != null && fileName.length() > 0) {
            File satelliteDescriptions = new File(fileName);
            XStream xstream = new XStream(new StaxDriver());
            xstream.alias("satellite", SatelliteDescription.class);
            xstream.alias("satellites", List.class);
            String xml = FileUtils.readFileToString(satelliteDescriptions,
                    Charsets.UTF_8);
            descriptions = (List<SatelliteDescription>) xstream.fromXML(xml);
        } else {
            descriptions = new ArrayList<SatelliteDescription>();
        }
    }

    /**
     * Finds corresponding satellite name for Destination and Source handlers.
     * 
     * @param destination
     * @param source
     * @return
     */
    public String getSatelliteByDestAndSrc(String destination, String source) {
        String satelliteName = DEFAULT_NAME;
        SatelliteDescription satellite = new SatelliteDescription(destination, source);
        for (SatelliteDescription description : descriptions) {
            if (satellite.equals(description)) {
                satelliteName = description.getSatelliteName();
                break;
            }
        }
        return satelliteName;
    }

    /**
     * Finds corresponding satellite name for Norad ID
     * 
     * @param noradID
     * @return
     */
    public String getSatelliteByNoradID(String noradID) {
        String satelliteName = DEFAULT_NAME;
        SatelliteDescription satellite = new SatelliteDescription(noradID);
        for (SatelliteDescription description : descriptions) {
            if (satellite.equals(description)) {
                satelliteName = description.getSatelliteName();
                break;
            }
        }
        return satelliteName;
    }
}
