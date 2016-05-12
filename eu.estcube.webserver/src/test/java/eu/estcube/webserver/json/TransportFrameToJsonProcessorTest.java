/** 
 *
 */
package eu.estcube.webserver.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

import com.google.gson.GsonBuilder;

import eu.estcube.domain.transport.ax25.Ax25UIFrame;
import eu.estcube.domain.transport.tnc.TncFrame;
import eu.estcube.domain.transport.tnc.TncFrame.TncCommand;
import eu.estcube.webserver.domain.TransportFrame;

/**
 *
 */
public class TransportFrameToJsonProcessorTest {

    private static final byte[] BYTES = new byte[] { 0x0C, 0x0E, 0x0E, 0x0F, 0x01, 0x09 };
    private static final Long NOW = System.currentTimeMillis();

    private TransportFrameToJsonProcessor processor;

    private TransportFrame transportFrame;

    private TncFrame tncFrame;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        processor = new TransportFrameToJsonProcessor();
        tncFrame = new TncFrame(TncCommand.DATA, 0, BYTES);
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("from", "test");
        headers.put("timestamp", NOW);
        transportFrame = new TransportFrame(tncFrame, headers, NOW);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.json.TransportFrameToJsonProcessor#process(eu.estcube.webserver.domain.TransportFrame)}
     * .
     */
    @Test
    public void testProcess() {
        String json = processor.process(transportFrame);
        assertNotNull(json);
        assertTrue(json.contains(String.valueOf(NOW.longValue())));
        assertTrue(json.contains("0C 0E 0E 0F 01 09"));
        assertTrue(json.contains("from"));
        assertTrue(json.contains("test"));
        assertTrue(json.contains("timestamp"));
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.json.TransportFrameToJsonProcessor#createBuilder()}
     * .
     */
    @Test
    public void testCreateBuilder() {
        GsonBuilder builder = TransportFrameToJsonProcessor.createBuilder();
        assertNotNull(builder);
    }

    @Test
    public void testSerializeAx25UiFrame() {
        Ax25UIFrame frame = new Ax25UIFrame();
        frame.setDestAddr(new byte[] { 0x01, 0x02, 0x03 });
        frame.setSrcAddr(new byte[] { 0x04, 0x05, 0x06 });
        frame.setCtrl((byte) 0x0F);
        frame.setPid((byte) 0x03);
        frame.setInfo(new byte[] { 0x00, 0x01, 0x02, 0x03, 0x42 });
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("key", "value");
        headers.put("byte", (byte) 0x0E);
        TransportFrame tf = new TransportFrame(frame, headers, NOW);
        String expected = "{\"frame\":{\"destAddr\":\"01 02 03\",\"srcAddr\":\"04 05 06\",\"ctrl\":\"0F\",\"pid\":\"03\",\"info\":\"00 01 02 03 42\","
                + "\"status\":{\"errorUnstuffedBits\":false,\"errorTooLong\":false,\"errorTooShort\":false,\"errorUnAligned\":false,\"errorFcs\":false}},"
                + "\"headers\":{\"byte\":\"0E\",\"key\":\"value\"},\"timestamp\":" + NOW + "}";
        assertEquals(expected, processor.process(tf));
    }
}
