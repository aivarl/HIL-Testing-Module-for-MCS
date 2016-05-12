package eu.estcube.common.json;

import java.lang.reflect.Type;

import org.apache.commons.net.util.Base64;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * Serializes byte array as base 64 encoded {@link String}.
 */
public class JsonBinaryToBase64Serializer implements JsonSerializer<Object> {

    /** @{inheritDoc . */
    @Override
    public JsonElement serialize(Object object, Type type, JsonSerializationContext context) {
        byte[] data = (byte[]) object;
        String base64String = Base64.encodeBase64String(data);
        return new JsonPrimitive(base64String);
    }
}
