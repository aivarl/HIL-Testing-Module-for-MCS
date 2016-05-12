/** 
 *
 */
package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.hbird.exchange.core.Parameter;
import org.hbird.exchange.interfaces.IEntity;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.TypeAdapter;
import com.google.gson.reflect.TypeToken;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class CustomFieldAppenderAdapterFactoryTest {

    private static final String FIELD_NAME = "TEH-FIELD";

    @Mock
    private IEntity named;

    private Gson gson;

    private TypeToken<?> typeToken;

    private CustomFieldAppenderAdapterFactory factory;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        factory = new CustomFieldAppenderAdapterFactory(IEntityInstance.class, FIELD_NAME, true) {

            @Override
            protected <T> JsonElement toCustomValue(T value) {
                return new JsonPrimitive(value.toString());
            }
        };
        gson = new GsonBuilder().registerTypeAdapterFactory(factory).create();
        typeToken = TypeToken.get(Parameter.class);
    }

    @Test
    public void testCreate() {
        TypeAdapter<?> adapter = factory.create(gson, typeToken);
        assertNotNull(adapter);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.CustomFieldAppenderAdapterFactory#toCustomValue(java.lang.Object)}
     * .
     */
    @Test
    public void testToCustomValue() {
        JsonElement result = factory.toCustomValue(named);
        assertNotNull(result);
        assertEquals(named.toString(), result.getAsString());
    }
}
