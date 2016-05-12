package eu.estcube.common.json;

import java.lang.reflect.Type;
import java.util.Date;

import org.hbird.exchange.util.Dates;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * JSON serializer for {@link Date} objects.
 */
public class JsonDateSerializer implements JsonSerializer<Date> {

    /**
     * @{inheritDoc .
     */
    @Override
    public JsonElement serialize(Date date, Type type, JsonSerializationContext context) {
        String dateString = Dates.toDefaultDateFormat(date.getTime());
        return new JsonPrimitive(dateString);
    }
}
