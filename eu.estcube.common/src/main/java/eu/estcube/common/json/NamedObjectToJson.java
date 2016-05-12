package eu.estcube.common.json;

import java.util.Date;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.hbird.exchange.interfaces.IEntity;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Component
public class NamedObjectToJson implements Processor {

    public void process(Exchange ex) throws Exception {
        IEntity named = ex.getIn().getBody(IEntity.class);

        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(Date.class, new JsonDateSerializer());

        Gson gson = gsonBuilder.create();
        String json = gson.toJson(named);

        ex.getOut().setBody(json);
    }
}
