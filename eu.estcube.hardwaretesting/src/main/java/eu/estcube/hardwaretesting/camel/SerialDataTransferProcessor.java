package eu.estcube.hardwaretesting.camel;

import java.io.PrintWriter;
import java.util.Scanner;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.camel.AsyncCallback;
import org.apache.camel.EndpointInject;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fazecast.jSerialComm.SerialPort;

import eu.estcube.common.script.io.HardwareTestingMessage;
import eu.estcube.common.script.io.HardwareTestingMessage.Type;
import eu.estcube.hardwaretesting.HardwareTesting;
/**
 * The class responsible for communication with a serial port.
 * Receives incoming commands from the MCS and sends them to the
 * serial port. Listens to responses from the serial port and sends
 * them back to MCS.
 * 
 * Also logs the communication between the MCS and serial port.
 * 
 * @author Aivar Lobjakas
 */
public class SerialDataTransferProcessor implements Processor{
	private static final Logger LOG = LoggerFactory.getLogger(SerialDataTransferProcessor.class);
	@EndpointInject(uri = "activemq:queue:estcube.hardwaretesting.serialport.response")
    ProducerTemplate serialPortResponseProducer;

	//Send data to the UI
	@EndpointInject(uri = HardwareTesting.SERIALPORT_OUTPUT)
    ProducerTemplate serialPortWebSocketProducer;

	private Thread receiveDataThread;
	private Thread sendDataThread;
	private BlockingQueue<String> sendDataQueue = new LinkedBlockingQueue<String>();
	private SerialPort serialPort;
	private boolean connectionStarted = false;


	public void processPortSelection(Message in, Message out) {
        Object body = in.getBody();


        if (body instanceof String) {

        	LOG.info("Received a command:" + body.toString());
        	// If incoming is "CONNECT:COM4" then open up the port and start the
        	// listening and sending threads.
        	String[] command = body.toString().split(":");


        	//Try to connect to port command[1].
        	boolean portOpened = false;
        	if("CONNECT".equals(command[0]) && 2 == command.length){
        		portOpened = connectToPort(command[1]);
        	}

        	if("DISCONNECT".equals(body.toString()) && serialPort != null && serialPort.isOpen()){
        		sendDataThread.interrupt();
        		receiveDataThread.interrupt();

        		serialPort.closePort();
        		if(!serialPort.isOpen()){
        			LOG.info("Successfully closed port: " + serialPort.getSystemPortName());
        			HardwareTestingMessage htm = new HardwareTestingMessage(Type.ConnectionInfo, "Successfully closed port: " + serialPort.getSystemPortName());
        			serialPortWebSocketProducer.sendBody(htm);
        		}
        	}

        	//If connection is successful.
        	if(portOpened && !connectionStarted){
        		//Port configuration.
	    		serialPort.setComPortTimeouts(SerialPort.TIMEOUT_SCANNER, 0, 0);//TIMEOUT_READ_SEMI_BLOCKING
	    		serialPort.setBaudRate(115200);

	            /**
	             * SERIAL PORT LISTENER THREAD
	             */
	        	receiveDataThread = new Thread(){
	        		@Override public void run() {
	        			// Wait after connecting, so the bootloader can finish.
	        			try {Thread.sleep(100); } catch(Exception e) {}
	        			
	        			LOG.debug("Ready to read serial port: " + serialPort.getSystemPortName());
	        			while(true) {
	        				Scanner data = new Scanner(serialPort.getInputStream());
	        				if(data.hasNextLine()){
	        					try {
	        						String response = data.nextLine();
	        						LOG.info("Response: " + response);
	        						serialPortResponseProducer.sendBody(response);
	        					} catch (Exception e) {
	        					}
	        				}
	        				try {Thread.sleep(100); } catch(Exception e) {}
	        			}
	        		}
	        	};
	        	//Start the serial port listener.
	    		receiveDataThread.start();


	        	/**
	        	 * SERIAL PORT SENDER THREAD
	        	 */
        		sendDataThread = new Thread(){
        			@Override public void run() {
        				System.out.println("SendDataThread started.");
        				// Wait after connecting, so the bootloader can finish.
        				try {Thread.sleep(5000); } catch(Exception e) {}
        				while(true){
        	                try {
        	                    String data = sendDataQueue.take();
        	                    LOG.info("Sending data: " + data);
        	                    HardwareTestingMessage htm = new HardwareTestingMessage(Type.Info, "Sending data: " + data);
        		    			serialPortWebSocketProducer.sendBody(htm);

        	                    //handle the data
        	                    PrintWriter output = new PrintWriter(serialPort.getOutputStream());
        	                    output.print(data);
        	                    output.flush();
        	                } catch (InterruptedException e) {
        	                    LOG.error("Error occurred:" + e);
        	                }
        				}
        			}
        		};
	    		//Start the serial port sender.
	    		sendDataThread.start();

	    		connectionStarted = true;
        	}


        	//At this point, the thread should be up and running and the port should also be open.
        	//Great time to add the incoming message to the queue for the thread to process.
        	if(connectionStarted && !body.toString().startsWith("CONNECT") && !body.toString().startsWith("DISCONNECT")){
        		sendDataQueue.offer(body.toString());
        	}
        }
	}

	/**
	 * Function that tries to open up the specified port.
	 * Return true, if port successfully opened, false otherwise.
	 * @param portNumber
	 * @return
	 */
	private boolean connectToPort(String portNumber){
    	SerialPort ports[] = SerialPort.getCommPorts();
    	for (SerialPort port : ports) {
    		System.out.println("PORT " + port.getSystemPortName() + ":");
    		System.out.println(port.getDescriptivePortName());
        	if(port.getSystemPortName().equals(portNumber)) serialPort = port;
        }

    	//Open the port.
    	if(serialPort == null){
    		HardwareTestingMessage htm = new HardwareTestingMessage(Type.ConnectionError, "Cannot open the specified port. Make sure the hardware device is connected.");
    		serialPortWebSocketProducer.sendBody(htm);
    		return false;
    	}
		if (serialPort != null && serialPort.openPort()) {
			LOG.info("Successfully opened port: " + serialPort.getSystemPortName());
			HardwareTestingMessage htm = new HardwareTestingMessage(Type.ConnectionInfo, "Successfully opened port: " + serialPort.getSystemPortName());
			serialPortWebSocketProducer.sendBody(htm);
			return true;
		} else {
			LOG.error("Unable to open port: " + serialPort.getSystemPortName());
			HardwareTestingMessage htm = new HardwareTestingMessage(Type.ConnectionWarning, "Unable to open port: " + serialPort.getSystemPortName());
			serialPortWebSocketProducer.sendBody(htm);
			return false;
		}
	}


    public void asyncProcess(final Exchange exchange, final AsyncCallback callback) {
    	Message message = exchange.getIn();
        Message out = exchange.getOut();
    	processPortSelection(message, out);
    }

	@Override
	public void process(Exchange exchange) throws Exception {
		Message message = exchange.getIn();
        Message out = exchange.getOut();
    	processPortSelection(message, out);
	}




}
