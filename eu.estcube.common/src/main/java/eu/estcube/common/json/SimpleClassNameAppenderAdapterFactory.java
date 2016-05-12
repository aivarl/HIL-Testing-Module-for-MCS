/** 
 *
 */
package eu.estcube.common.json;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;

/**
 *
 */
public class SimpleClassNameAppenderAdapterFactory extends CustomFieldAppenderAdapterFactory {

    /**
     * Creates new SimpleClassNameAppenderAdapterFactory.
     * 
     * @param baseClass
     * @param fieldName
     * @param override
     */
    public SimpleClassNameAppenderAdapterFactory(Class<?> baseClass, String fieldName, boolean override) {
        super(baseClass, fieldName, override);
    }

    /** @{inheritDoc . */
    @Override
    protected <T> JsonElement toCustomValue(T value) {
        return new JsonPrimitive(value.getClass().getSimpleName());
    }
}
