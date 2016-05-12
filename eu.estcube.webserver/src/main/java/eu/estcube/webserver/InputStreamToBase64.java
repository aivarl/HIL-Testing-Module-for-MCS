package eu.estcube.webserver;

import java.io.InputStream;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.converter.IOConverter;
import org.apache.commons.net.util.Base64;
import org.springframework.stereotype.Component;

@Component
public class InputStreamToBase64 implements Processor{

    public void process(Exchange ex) throws Exception {
        InputStream is = ex.getIn().getBody(InputStream.class);       
        byte[] result =  IOConverter.toBytes(is);

        String base64image = Base64.encodeBase64String(result);
        ex.getOut().setBody(base64image, String.class);
    }
}
