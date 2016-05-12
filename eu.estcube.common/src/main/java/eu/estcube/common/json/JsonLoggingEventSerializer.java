/** 
 *
 */
package eu.estcube.common.json;

import java.lang.reflect.Type;

import org.apache.log4j.spi.LoggingEvent;
import org.hbird.exchange.constants.StandardArguments;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 *
 */
public class JsonLoggingEventSerializer implements JsonSerializer<LoggingEvent> {

    public static final String LEVEL = "level";
    public static final String LOGGER = "logger";
    public static final String THREAD = "thread";
    public static final String THROWABLE = "throwable";

    /** @{inheritDoc . */
    @Override
    public JsonElement serialize(LoggingEvent event, Type type, JsonSerializationContext context) {
        JsonObject json = new JsonObject();
        json.add(LEVEL, new JsonPrimitive(event.getLevel().toString()));
        json.add(StandardArguments.TIMESTAMP, new JsonPrimitive(event.getTimeStamp()));
        json.add(StandardArguments.VALUE, new JsonPrimitive(event.getRenderedMessage()));
        json.add(LOGGER, new JsonPrimitive(event.getLoggerName()));
        json.add(StandardArguments.ISSUED_BY,
                new JsonPrimitive(String.valueOf(event.getProperties().get(StandardArguments.ISSUED_BY))));
        json.add(THREAD, new JsonPrimitive(event.getThreadName()));
        json.add(THROWABLE, toJsonArray(event.getThrowableStrRep()));
        return json;
    }

    JsonArray toJsonArray(String[] list) {
        JsonArray array = new JsonArray();
        if (list != null) {
            for (String line : list) {
                array.add(new JsonPrimitive(line));
            }
        }
        return array;
    }
}
