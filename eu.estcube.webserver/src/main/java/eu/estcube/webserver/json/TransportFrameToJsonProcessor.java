/** 
 *
 */
package eu.estcube.webserver.json;

import java.util.Date;

import org.apache.camel.Body;
import org.apache.camel.Handler;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import eu.estcube.common.json.JsonBinaryToHexSerializer;
import eu.estcube.common.json.JsonByteToHexSerializer;
import eu.estcube.common.json.JsonDateSerializer;

/**
 *
 */
@Component
public class TransportFrameToJsonProcessor {

    /** {@link GsonBuilder} instance. */
    private final Gson gson = createBuilder().create();

    /**
     * Serializes {@link TransportFrame} to JSON string.
     * 
     * @param body {@link TransportFrame} to serialize
     * @return {@link TransportFrame} as JSON string
     */
    @Handler
    public String process(@Body Object frame) {
        String json = gson.toJson(frame);
        return json;
    }

    /**
     * Creates new {@link GsonBuilder} to use in serialization.
     * 
     * @return new {@link GsonBuilder}
     */
    static GsonBuilder createBuilder() {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Date.class, new JsonDateSerializer());
        builder.registerTypeAdapter(byte[].class, new JsonBinaryToHexSerializer());
        builder.registerTypeAdapter(Byte.class, new JsonByteToHexSerializer());
        builder.serializeSpecialFloatingPointValues();
        return builder;
    }
}
