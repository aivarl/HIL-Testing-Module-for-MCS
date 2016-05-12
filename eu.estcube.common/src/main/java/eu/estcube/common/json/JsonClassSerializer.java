/** 
 *
 */
package eu.estcube.common.json;

import java.lang.reflect.Type;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 *
 */
public class JsonClassSerializer implements JsonSerializer<Class<?>> {

    /** @{inheritDoc . */
    @Override
    public JsonElement serialize(Class<?> src, Type typeOfSrc, JsonSerializationContext context) {
        JsonPrimitive result = new JsonPrimitive(src.getName());
        return result;
    }
}
