package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.TimeZone;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.core.Label;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

public class NamedObjectToJsonTest {

    private NamedObjectToJson telemetryObjectToJson;
    private EntityInstance telemetryObject;
    private String id = "ID";
    private String telObjName = "telObjName";
    private Exchange ex;
    private Message message;
    private Object answer;
    private String issuedBy = "issuer";
    private String description = "description";

    @Before
    public void setUp() throws Exception {

        telemetryObject = new Label(id, telObjName);
        telemetryObject.setIssuedBy(issuedBy);
        telemetryObject.setDescription(description);

        telemetryObjectToJson = new NamedObjectToJson();
        message = Mockito.mock(Message.class);
        ex = Mockito.mock(Exchange.class);

        Mockito.when(ex.getIn()).thenReturn(message);
        Mockito.when(ex.getOut()).thenReturn(message);

        Mockito.doAnswer(new Answer<Object>() {
            public Object answer(InvocationOnMock invocation) {
                answer = invocation.getArguments()[0];
                return answer;
            }
        }).when(message).setBody(Mockito.any());
    }

    @Test
    public void testProcess() throws Exception {

        Mockito.when(message.getBody(EntityInstance.class)).thenReturn(telemetryObject);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-DD HH:mm:ss.SSSZ");
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        formatter.format(telemetryObject.getTimestamp());

        telemetryObjectToJson.process(ex);

        // TODO - 17.12.2012; kimmell - complete the test case

        // assertEquals("{\"name\":\"" + telObjName + "\",\"time\":\"" +
        // dateString +
        // "\",\"params\":[{\"name\":\"" + telParName + "\",\"value\":\""
        // + value + "\"},{\"name\":\"" + telParName2 + "\",\"value\":" + value2
        // +
        // "}]}", (String) answer);
        assertEquals("", "");
    }
}
