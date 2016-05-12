package eu.estcube.common.json;

import java.util.Date;

import org.apache.camel.Body;
import org.apache.log4j.spi.LoggingEvent;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.interfaces.IEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapterFactory;

/**
 * Processor to serialize {@link Object}s to JSON strings.
 */
@Component
public class ToJsonProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(ToJsonProcessor.class);

    /** {@link GsonBuilder} instance. */
    private final Gson gson = createBuilder().create();

    /**
     * Serializes {@link Object} to JSON string.
     * 
     * @param body Object to serialize
     * @return Object as JSON string
     */
    public String process(@Body Object body) {
        try {
            String json = gson.toJson(body);
            return json;
        } catch (Exception e) {
            LOG.error("Failed to serialize object of type {}; toString: {}", body.getClass().getName(), body.toString());
            throw new IllegalArgumentException("Failed to serialize object of type " + body.getClass().getName(), e);
        }
    }

    /**
     * Creates new {@link GsonBuilder} to use in serialization.
     * 
     * @return new {@link GsonBuilder}
     */
    static GsonBuilder createBuilder() {
        // this adapter will add filed "class" to all IEntity objects at JSON
        // serialization.
        // Value is set to value.getClass().getSimpleName()
        // For example all serialized Parameter objects will look something like
        // { "class": "Parameter", "name": ... }.
        TypeAdapterFactory taf = new SimpleClassNameAppenderAdapterFactory(IEntity.class, StandardArguments.CLASS, true);
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Class.class, new JsonClassSerializer());
        builder.registerTypeAdapter(Date.class, new JsonDateSerializer());
        builder.registerTypeAdapter(byte[].class, new JsonBinaryToBase64Serializer());
        builder.registerTypeAdapter(LoggingEvent.class, new JsonLoggingEventSerializer());
        builder.serializeSpecialFloatingPointValues();
        builder.registerTypeAdapterFactory(taf);
        return builder;
    }
}