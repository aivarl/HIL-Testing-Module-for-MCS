/** 
 *
 */
package eu.estcube.common.json;

import java.lang.reflect.Type;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import eu.estcube.common.ByteUtil;

/**
 * 
 */
public class JsonBinaryToHexSerializer implements JsonSerializer<Object> {

    /** @{inheritDoc . */
    @Override
    public JsonElement serialize(Object object, Type type, JsonSerializationContext context) {
        byte[] bytes = (byte[]) object;
        String hex = ByteUtil.toHexString(bytes);
        return new JsonPrimitive(hex);
    }
}
