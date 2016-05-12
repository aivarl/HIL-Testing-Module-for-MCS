package eu.estcube.webserver;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Component
public class VersionInfoToJson implements Processor{

    public void process(Exchange ex) throws Exception {
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();
        
        String json = gson.toJson(ex.getIn().getBody());     
        ex.getOut().setBody(json);
    }
}
