/** 
 *
 */
package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.JsonElement;

import eu.estcube.common.json.SimpleClassNameAppenderAdapterFactory;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class SimpleClassNameAppenderAdapterFactoryTest {

    public static final String FIELD_NAME = "name";

    private SimpleClassNameAppenderAdapterFactory factory;

    private Object object;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        factory = new SimpleClassNameAppenderAdapterFactory(Object.class, FIELD_NAME, true);
        object = new Object();
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.SimpleClassNameAppenderAdapterFactory#toCustomValue(java.lang.Object)}
     * .
     */
    @Test
    public void testToCustomValue() {
        JsonElement element = factory.toCustomValue(object);
        assertNotNull(element);
        assertEquals(Object.class.getSimpleName(), element.getAsString());
    }
}
