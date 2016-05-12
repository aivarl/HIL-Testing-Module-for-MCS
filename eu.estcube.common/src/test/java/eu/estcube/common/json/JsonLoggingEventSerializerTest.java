/** 
 *
 */
package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.lang.reflect.Type;
import java.util.Map;

import org.apache.log4j.Level;
import org.apache.log4j.spi.LoggingEvent;
import org.hbird.exchange.constants.StandardArguments;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;

import eu.estcube.common.json.JsonLoggingEventSerializer;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class JsonLoggingEventSerializerTest {

    private static final Level LEVEL = Level.ALL;
    private static final String MESSAGE = "Log message.";
    private static final String LOGGER = "Logger name";
    private static final String ISSUER = "component id";
    private static final String THREAD = "thread name";

    private JsonLoggingEventSerializer serializer;

    @Mock
    private LoggingEvent event;

    @Mock
    private Type type;

    @Mock
    private JsonSerializationContext context;

    @SuppressWarnings("rawtypes")
    @Mock
    private Map properties;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        serializer = new JsonLoggingEventSerializer();
        inOrder = inOrder(event, type, context, properties);
        when(event.getLevel()).thenReturn(LEVEL);
        // timestamp is final, can't mock it
        when(event.getRenderedMessage()).thenReturn(MESSAGE);
        when(event.getLoggerName()).thenReturn(LOGGER);
        when(event.getProperties()).thenReturn(properties);
        when(properties.get(StandardArguments.ISSUED_BY)).thenReturn(ISSUER);
        when(event.getThreadName()).thenReturn(THREAD);
        when(event.getThrowableStrRep()).thenReturn(null);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonLoggingEventSerializer#serialize(org.apache.log4j.spi.LoggingEvent, java.lang.reflect.Type, com.google.gson.JsonSerializationContext)}
     * .
     */
    @Test
    public void testSerialize() {
        JsonElement result = serializer.serialize(event, type, context);
        JsonObject json = result.getAsJsonObject();
        assertEquals(LEVEL.toString(), json.get(JsonLoggingEventSerializer.LEVEL).getAsString());
        assertTrue(json.get(StandardArguments.TIMESTAMP).getAsLong() <= System.currentTimeMillis());
        assertEquals(MESSAGE, json.get(StandardArguments.VALUE).getAsString());
        assertEquals(LOGGER, json.get(JsonLoggingEventSerializer.LOGGER).getAsString());
        assertEquals(ISSUER, json.get(StandardArguments.ISSUED_BY).getAsString());
        assertEquals(THREAD, json.get(JsonLoggingEventSerializer.THREAD).getAsString());
        JsonArray array = json.get(JsonLoggingEventSerializer.THROWABLE).getAsJsonArray();
        assertNotNull(array);
        assertEquals(0, array.size());
        inOrder.verify(event, times(1)).getLevel();
        inOrder.verify(event, times(1)).getRenderedMessage();
        inOrder.verify(event, times(1)).getLoggerName();
        inOrder.verify(event, times(1)).getProperties();
        inOrder.verify(properties, times(1)).get(StandardArguments.ISSUED_BY);
        inOrder.verify(event, times(1)).getThreadName();
        inOrder.verify(event, times(1)).getThrowableStrRep();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.JsonLoggingEventSerializer#toJsonArray(org.apache.log4j.spi.LoggingEvent)}
     * .
     */
    @Test
    public void testToJsonArray() {
        JsonArray array = serializer.toJsonArray(null);
        assertNotNull(array);
        assertEquals(0, array.size());
        array = serializer.toJsonArray(new String[] {});
        assertNotNull(array);
        assertEquals(0, array.size());
        array = serializer.toJsonArray(new String[] { "A", "B", "C" });
        assertNotNull(array);
        assertEquals(3, array.size());
        assertEquals("A", array.get(0).getAsString());
        assertEquals("B", array.get(1).getAsString());
        assertEquals("C", array.get(2).getAsString());
    }
}
