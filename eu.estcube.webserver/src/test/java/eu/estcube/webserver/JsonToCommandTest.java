package eu.estcube.webserver;

import static org.junit.Assert.assertEquals;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.hbird.exchange.core.Command;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import eu.estcube.common.json.JsonToCommand;

public class JsonToCommandTest {

    private JsonToCommand jsonToCommand;
    private Exchange ex;
    private Message message;
    private Object answer;

    @Before
    public void setUp() throws Exception {
        String json = " {\"name\":\"nimi\",\"device\":\"rotctld\",\"params\":[{\"name\":\"parameeter1\",\"value\":\"2.5\"},"
                + "{\"name\":\"parameeter2\",\"value\":\"50.67\"}]}";
        message = Mockito.mock(Message.class);
        Mockito.when(message.getBody(String.class)).thenReturn(json);

        jsonToCommand = new JsonToCommand();
        ex = Mockito.mock(Exchange.class);

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
        jsonToCommand.process(ex);
        Command tc = (Command) answer;
        assertEquals("nimi", tc.getName());
        assertEquals("rotctld", tc.getDestination());
        assertEquals("2.5", tc.getArgumentValue("parameeter1", Object.class));
        assertEquals("50.67", tc.getArgumentValue("parameeter2", Object.class));
    }
}
