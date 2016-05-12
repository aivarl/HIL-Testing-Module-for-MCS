package eu.estcube.webserver.cache;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.core.Label;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.Whitebox;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

public class CacheMessageTest {

    private CacheMessage cacheMessage;
    private EntityInstance telemetryObject;
    private EntityInstance telemetryObject2;
    private EntityInstance telemetryObjectNewer;
    private EntityInstance telemetryObjectOlder;
    private String telObjId = "ID-1";
    private String telObjId2 = "ID-2";
    private String telObjName = "telObjName";
    private String telObjName2 = "telObjName2";
    private Exchange ex;
    private Message message;
    private Object answer;
    private HashMap<String, String> key1;
    private HashMap<String, String> key2;

    @Before
    public void setUp() throws Exception {
        CacheMessage.setCacheLimit(10);
        cacheMessage = new CacheMessage();
        Calendar calendar = Calendar.getInstance();
        calendar.set(2011, 10, 31, 15, 30);
        Date date1 = calendar.getTime();
        calendar.set(2011, 10, 31, 15, 32);
        Date date2 = calendar.getTime();
        calendar.set(2011, 10, 31, 11, 45);
        Date date3 = calendar.getTime();
        calendar.set(2011, 10, 31, 16, 45);
        Date date4 = calendar.getTime();

        telemetryObject = new Label(telObjId, telObjName);
        telemetryObject.setTimestamp(date1.getTime());

        telemetryObject2 = new Label(telObjId2, telObjName2);
        telemetryObject2.setTimestamp(date2.getTime());

        telemetryObjectOlder = new Label(telObjId, telObjName);
        telemetryObjectOlder.setTimestamp(date3.getTime());

        telemetryObjectNewer = new Label(telObjId, telObjName);
        telemetryObjectNewer.setTimestamp(date4.getTime());

        ex = Mockito.mock(Exchange.class);
        message = Mockito.mock(Message.class);

        Mockito.when(ex.getIn()).thenReturn(message);
        Mockito.when(ex.getOut()).thenReturn(message);

        Mockito.doAnswer(new Answer<Object>() {
            public Object answer(InvocationOnMock invocation) {
                answer = invocation.getArguments()[0];
                return answer;
            }
        }).when(message).setBody(Mockito.any());

        key1 = new HashMap<String, String>();
        key1.put("NAME", telemetryObject.getName());
        key1.put("ISSUEDBY", telemetryObject.getIssuedBy());
        key2 = new HashMap<String, String>();
        key2.put("NAME", telemetryObject2.getName());
        key2.put("ISSUEDBY", telemetryObject2.getIssuedBy());
        Whitebox.setInternalState(cacheMessage, "objectCache", new HashMap<String, ArrayList<IEntityInstance>>());
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testAddToCache() {
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObject);
        cacheMessage.addToCache(ex);
        cacheMessage.getCachedElement(ex, key1);
        assertEquals(telemetryObject, ((ArrayList<EntityInstance>) answer).get(0));
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testGetCachedElement() {
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObject);
        cacheMessage.addToCache(ex);
        cacheMessage.getCachedElement(ex, key1);

        assertEquals(telemetryObject, ((ArrayList<EntityInstance>) answer).get(0));

        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObject2);
        cacheMessage.addToCache(ex);
        cacheMessage.getCachedElement(ex, key2);

        assertEquals(telemetryObject2, ((ArrayList<EntityInstance>) answer).get(0));
    }

    @Test
    public void testGetCache() {
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObject);
        cacheMessage.addToCache(ex);

        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObject2);
        cacheMessage.addToCache(ex);

        cacheMessage.getCache(ex);

        assertTrue(((ArrayList<?>) answer).contains(telemetryObject));
        assertTrue(((ArrayList<?>) answer).contains(telemetryObject2));

    }

    @Test
    public void testAddNewer() {
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectOlder);
        cacheMessage.addToCache(ex);
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectNewer);
        cacheMessage.addToCache(ex);

        cacheMessage.getCache(ex);

        /* Answer contains both older and newer version. */
        assertTrue(((ArrayList<?>) answer).contains(telemetryObjectOlder));
        assertTrue(((ArrayList<?>) answer).contains(telemetryObjectNewer));
        /* Newer version is before the older version in the cache list. */
        assertTrue(((ArrayList<?>) answer).indexOf(telemetryObjectNewer) > ((ArrayList<?>) answer)
                .indexOf(telemetryObjectOlder));
    }

    @Test
    public void testRemoveOldEntries() {
        /* Cache limit set to 4. */
        CacheMessage.setCacheLimit(4);
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectOlder);
        cacheMessage.addToCache(ex);

        /* Insert 4 newer objects of the same kind, old one is pushed out. */
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectNewer);
        cacheMessage.addToCache(ex);
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectNewer);
        cacheMessage.addToCache(ex);
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectNewer);
        cacheMessage.addToCache(ex);

        /*
         * Answer still contains older version of the object,
         * it is located before the newer versions in the list.
         */
        cacheMessage.getCache(ex);
        assertTrue(((ArrayList<?>) answer).contains(telemetryObjectOlder));
        assertTrue(((ArrayList<?>) answer).contains(telemetryObjectNewer));
        assertTrue(((ArrayList<?>) answer).indexOf(telemetryObjectNewer) > ((ArrayList<?>) answer)
                .lastIndexOf(telemetryObjectOlder));

        /* Now older version is pushed out. */
        Mockito.when(message.getBody(IEntityInstance.class)).thenReturn(telemetryObjectNewer);
        cacheMessage.addToCache(ex);

        cacheMessage.getCache(ex);
        /* Answer contains only newer versions. */
        assertTrue(!((ArrayList<?>) answer).contains(telemetryObjectOlder));
        assertTrue(((ArrayList<?>) answer).contains(telemetryObjectNewer));
    }
}
