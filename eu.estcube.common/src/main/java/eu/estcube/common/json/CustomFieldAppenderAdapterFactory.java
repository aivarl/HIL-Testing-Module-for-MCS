/** 
 *
 */
package eu.estcube.common.json;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.internal.Streams;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

public abstract class CustomFieldAppenderAdapterFactory implements TypeAdapterFactory {

    private static final Logger LOG = LoggerFactory.getLogger(CustomFieldAppenderAdapterFactory.class);

    protected final Class<?> baseClass;
    protected final String fieldName;
    protected final boolean override;

    public CustomFieldAppenderAdapterFactory(Class<?> baseClass, String fieldName, boolean override) {
        this.baseClass = baseClass;
        this.fieldName = fieldName;
        this.override = override;
    }

    protected abstract <T> JsonElement toCustomValue(T value);

    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {

        if (!baseClass.isAssignableFrom(type.getRawType())) {
            return null;
        }

        final TypeAdapter<T> delegate = gson.getDelegateAdapter(this, type);
        return new TypeAdapter<T>() {

            @Override
            public T read(JsonReader in) throws IOException {
                return delegate.read(in);
            }

            @Override
            public void write(JsonWriter out, T value) throws IOException {
                // Accept null values!
                // Do not return null here - will end up with hard to track
                // IllegalArgumentException
                // waisted 2h here :|
                try {
                    JsonElement jsonElement = delegate.toJsonTree(value);
                    JsonObject jsonWithClass = null;
                    if (jsonElement.isJsonObject()) {
                        JsonObject jsonObject = jsonElement.getAsJsonObject();
                        if (!jsonObject.has(fieldName) || override) {
                            jsonWithClass = new JsonObject();
                            // add should be possible even if the value is
                            // already set; old value is replaced with the new
                            // one
                            jsonWithClass.add(fieldName, toCustomValue(value));
                            for (Map.Entry<String, JsonElement> e : jsonObject.entrySet()) {
                                jsonWithClass.add(e.getKey(), e.getValue());
                            }
                        }
                    }
                    Streams.write(jsonWithClass == null ? jsonElement : jsonWithClass, out);
                } catch (Exception e) {
                    LOG.error("Failed to serialize {}; exception: ", value, e);
                    throw new IOException("Failed to serialize " + value, e);
                }
            }
        };
    }
}