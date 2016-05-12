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
public class JsonByteToHexSerializer implements JsonSerializer<Byte> {

    /** @{inheritDoc . */
    @Override
    public JsonElement serialize(Byte value, Type type, JsonSerializationContext context) {
        String hex = ByteUtil.toHexString(value);
        return new JsonPrimitive(hex);
    }
}
