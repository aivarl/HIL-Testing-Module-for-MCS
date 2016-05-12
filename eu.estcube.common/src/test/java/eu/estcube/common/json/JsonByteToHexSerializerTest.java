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

import eu.estcube.common.ByteUtil;
import eu.estcube.common.json.JsonByteToHexSerializer;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonByteToHexSerializerTest {

    private static final byte BYTE = 0x16;

    private JsonByteToHexSerializer serializer;

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
        serializer = new JsonByteToHexSerializer();
        inOrder = inOrder(type, context);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonByteToHexSerializer#serialize(java.lang.Byte, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        JsonElement result = serializer.serialize(BYTE, type, context);
        assertEquals(ByteUtil.toHexString(BYTE), result.getAsString());
        inOrder.verifyNoMoreInteractions();
    }
}
