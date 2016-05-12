/** 
 *
 */
package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;

import java.lang.reflect.Type;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;

import eu.estcube.common.json.JsonClassSerializer;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonClassSerializerTest {

    @Mock
    private Type type;

    @Mock
    private JsonSerializationContext context;

    private JsonClassSerializer serializer;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        serializer = new JsonClassSerializer();
        inOrder = inOrder(type, context);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonClassSerializer#serialize(java.lang.Class, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        JsonElement json = serializer.serialize(Object.class, type, context);
        assertNotNull(json);
        assertTrue(json.isJsonPrimitive());
        assertEquals(Object.class.getName(), json.getAsString());
        inOrder.verifyNoMoreInteractions();
    }
}
