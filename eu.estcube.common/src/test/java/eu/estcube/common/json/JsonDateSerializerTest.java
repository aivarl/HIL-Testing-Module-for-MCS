package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.lang.reflect.Type;
import java.util.Date;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;

import eu.estcube.common.json.JsonDateSerializer;

/**
 * 
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonDateSerializerTest {

    private JsonDateSerializer serializer;

    @Mock
    private Date date;

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
        serializer = new JsonDateSerializer();
        inOrder = inOrder(date, type, context);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonDateSerializer#serialize(java.util.Date, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        when(date.getTime()).thenReturn(0L, 1357226728365L);
        JsonElement e = serializer.serialize(date, type, context);
        assertNotNull(e);
        assertEquals(JsonPrimitive.class, e.getClass());
        assertEquals("1970-001 00:00:00.000", e.getAsString());
        e = serializer.serialize(date, type, context);
        assertNotNull(e);
        assertEquals(JsonPrimitive.class, e.getClass());
        assertEquals("2013-003 15:25:28.365", e.getAsString());
        inOrder.verify(date, times(2)).getTime();
        inOrder.verifyNoMoreInteractions();
    }
}
