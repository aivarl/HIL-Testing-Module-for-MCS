/** 
 *
 */
package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
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

import eu.estcube.common.json.JsonBinaryToHexSerializer;

/**
 * 
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonBinaryToHexSerializerTest {

    private static final byte[] BYTES = new byte[] { 0x0C, 0x00, 0x0D, 0x0E, 0x0D, 0x0A, 0x01 };

    private JsonBinaryToHexSerializer serializer;

    @Mock
    private Type type;

    @Mock
    private JsonSerializationContext context;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        serializer = new JsonBinaryToHexSerializer();
        inOrder = inOrder(type, context);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonBinaryToHexSerializer#serialize(java.lang.Object, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        JsonElement json = serializer.serialize(BYTES, type, context);
        assertEquals("0C 00 0D 0E 0D 0A 01", json.getAsString());
        inOrder.verifyNoMoreInteractions();
    }
}
