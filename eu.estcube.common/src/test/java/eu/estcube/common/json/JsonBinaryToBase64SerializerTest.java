package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.inOrder;

import java.lang.reflect.Type;

import org.apache.commons.net.util.Base64;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;

import eu.estcube.common.json.JsonBinaryToBase64Serializer;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonBinaryToBase64SerializerTest {

    private static final byte[] DATA = new byte[] { 0x0C, 0x00, 0x0F, 0x0F, 0x0E, 0x0B, 0x0A, 0x0B, 0x0E };

    private JsonBinaryToBase64Serializer serializer;

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
        serializer = new JsonBinaryToBase64Serializer();
        inOrder = inOrder(type, context);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonBinaryToBase64Serializer#serialize(java.lang.Object, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        JsonElement element = serializer.serialize(DATA, type, context);
        assertNotNull(element);
        assertEquals(Base64.encodeBase64String(DATA), element.getAsString());
        inOrder.verifyNoMoreInteractions();
    }
}
