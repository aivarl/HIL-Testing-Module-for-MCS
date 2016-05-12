package eu.estcube.hardwaretesting.camel;

import org.apache.camel.AsyncCallback;
import org.apache.camel.AsyncProcessor;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.util.AsyncProcessorHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fazecast.jSerialComm.SerialPort;

import eu.estcube.common.script.io.HardwareTestingMessage;

/**
 * Used to test connection to the serial port.
 * Not used anymore.
 * 
 * @author Aivar Lobjakas
 */

public class SerialPortProcessor implements AsyncProcessor{
	private static final Logger LOG = LoggerFactory.getLogger(SerialPortProcessor.class);
	
	public void processPortSelection(Message in, Message out) {
        Object body = in.getBody();
        LOG.info("Received selected port");

        if (body instanceof String) {

        	SerialPort ports[] = SerialPort.getCommPorts();

        	SerialPort chosenPort = null;
        	for (SerialPort port : ports) {
            	if(body.equals(port.getSystemPortName())) chosenPort = port;
            }
        	if(chosenPort == null){
            	out.setHeader("portNotFound", "Could not find the port specified.");
            	out.setBody(new HardwareTestingMessage(HardwareTestingMessage.Type.Warning, "Could not find the port specified."));
        		return;
        	}
        	if (chosenPort.openPort()) {
            	out.setHeader("portSuccess", "Unable to open the port.");
            	out.setBody(new HardwareTestingMessage(HardwareTestingMessage.Type.Trace, "Port successfully opened!"));
        		// Close the port, this SerialPortProcessor is just for testing the connection.
        		chosenPort.closePort();
        		return;
            } else {
            	out.setHeader("portError", "Unable to open the port.");
            	out.setBody(new HardwareTestingMessage(HardwareTestingMessage.Type.Error, "Unable to open the port."));
            	return;
            }
        }

	}

    public void asyncProcess(final Exchange exchange, final AsyncCallback callback) {
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                Message message = exchange.getIn();
                Message out = exchange.getOut();

                try {
                	processPortSelection(message, out);
                } finally {
                    callback.done(false); // false for async
                }
            }
        });
        t.start();
    }

    @Override
    public boolean process(Exchange exchange, AsyncCallback asyncCallback) {
        asyncProcess(exchange, asyncCallback);
        return false; // false for async
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        AsyncProcessorHelper.process(this, exchange); //Wrap synchronous invocations
    }

}
