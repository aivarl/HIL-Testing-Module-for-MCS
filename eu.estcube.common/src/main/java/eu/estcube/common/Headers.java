package eu.estcube.common;

import org.apache.camel.Message;

/**
 * Common header keys for {@link Message}s.
 */
public class Headers {

    @Deprecated
    public static final String ID = "ID";

    /** Header key for {@link Named#getUuid()}. */
    public static final String UUID = "UUID";

    /** Header key for TNC port. */
    public static final String TNC_PORT = "tncPort";

    /** Header key for TNC prefix. */
    public static final String TNC_PREFIX = "tncPrefix";

    /** Header key for serial port name. */
    public static final String SERIAL_PORT_NAME = "serialPortName";

    /** Header key for the communication link type. */
    public static final String COMMUNICATION_LINK_TYPE = "communicationLinkType";

    /** CDHS source. */
    public static final String CDHS_SOURCE = "CDHSSource";

    /** CDHS block index. */
    public static final String CDHS_BLOCK_INDEX = "CDHSBlockIndex";

}
