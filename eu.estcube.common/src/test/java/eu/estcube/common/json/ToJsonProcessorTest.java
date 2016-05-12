package eu.estcube.common.json;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggingEvent;
import org.hbird.business.core.StartableEntity;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.BusinessCard;
import org.hbird.exchange.core.Command;
import org.hbird.exchange.core.CommandArgument;
import org.hbird.exchange.core.Parameter;
import org.hbird.exchange.core.Part;
import org.hbird.exchange.interfaces.IEntity;
import org.hbird.exchange.interfaces.IStartableEntity;
import org.hbird.exchange.util.Dates;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.google.gson.GsonBuilder;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class ToJsonProcessorTest {

    private static final long NOW = System.currentTimeMillis();

    private ToJsonProcessor toJson;

    @Mock
    private Object object;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        toJson = new ToJsonProcessor();
        inOrder = inOrder(object);
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.ToJsonProcessor#process(java.lang.Object)}
     * .
     */
    @Test
    public void testProcess() {
        String result = toJson.process(object);
        assertNotNull(result);
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.common.json.ToJsonProcessor#createBuilder()}.
     */
    @Test
    public void testCreateBuilder() {
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        assertNotNull(gson);
        assertEquals("\"string\"", gson.create().toJson("string"));
        assertEquals(String.valueOf(NOW), gson.create().toJson(new Long(NOW)));
        assertEquals(String.valueOf(NOW), gson.create().toJson(NOW));
        assertEquals("0.0", gson.create().toJson(0.0D));
        assertEquals("-0.0", gson.create().toJson(-0.0D));
        assertEquals("0.01", gson.create().toJson(0.01D));
        assertEquals("NaN", gson.create().toJson(Double.NaN));
        assertEquals("-Infinity", gson.create().toJson(Double.NEGATIVE_INFINITY));
        assertEquals("Infinity", gson.create().toJson(Double.POSITIVE_INFINITY));
    }

    @Test
    public void testSerializeLoggingEvent() {
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(StandardArguments.ISSUED_BY, "test");
        LoggingEvent le = new LoggingEvent(null, Logger.getLogger("LOGGER"), NOW, Level.DEBUG, "message", "thread",
                null, null, null, properties);
        String expected = "{\"level\":\"DEBUG\",\"timestamp\":"
                + NOW
                + ",\"value\":\"message\",\"logger\":\"LOGGER\",\"issuedBy\":\"test\",\"thread\":\"thread\",\"throwable\":[]}";
        assertEquals(expected, gson.create().toJson(le));
    }

    @Test
    public void testSerializeINamed() {
        MyNamed named = new MyNamed();
        named.setName("INAMED-1");
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        String expected = "{\"class\":\"MyNamed\",\"name\":\"INAMED-1\"}";
        assertEquals(expected, gson.create().toJson(named));
    }

    @Test
    public void testSerilazeINamedWithClass() {
        MyNamedWithClass named = new MyNamedWithClass();
        named.setName("INAMED-1");
        named.setClazz(Parameter.class);
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        String expected = "{\"class\":\"MyNamedWithClass\",\"clazz\":\"org.hbird.exchange.core.Parameter\",\"name\":\"INAMED-1\"}";
        assertEquals(expected, gson.create().toJson(named));
    }

    @Test
    public void testSerializeNamed() {
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        Parameter param = new Parameter("/MISSION/GROUP/ENTITY/PARAM1", "PARAM1");
        param.setIssuedBy("issuer");
        param.setDescription("Parameter description");
        param.setUnit("unknown");

        param.setTimestamp(NOW);
        param.setVersion(NOW);
        param.setValue(8);
        String expected = "{\"class\":\"Parameter\",\"value\":8,\"unit\":\"unknown\",\"version\":"
                + NOW
                + ",\"timestamp\":"
                + NOW
                + ",\"instanceID\":\""
                + param.getInstanceID()
                + "\",\"ID\":\"/MISSION/GROUP/ENTITY/PARAM1\",\"name\":\"PARAM1\",\"description\":\"Parameter description\",\"issuedBy\":\"issuer\"}";
        assertEquals(expected, gson.create().toJson(param));
    }

    @Test
    public void testSerializeCommand() {
        Command cmd = new Noop();
        MyNamed named = new MyNamed();
        named.setName("MYNAMED");

        IStartableEntity part = new StartableEntity("/MISSION/GROUP/ENTITY", "ENTITY");

        cmd.setArgumentValue("First", named);
        cmd.setArgumentValue("Second", part);
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        String result = gson.create().toJson(cmd);
        // the result contains variables like host name and timestamp
        // no easy way to compare - it's too long (~2700 chars) and I'm too lazy
        // to build regex for it
        assertNotNull(result);
    }

    @Test
    public void testSerializeBusinessCard() {
        BusinessCard card = new BusinessCard("Test/Test", "Test");
        card.setIssuedBy("issuer");
        card.setPeriod(5000L);
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        String expected = "\\{\"class\":\"BusinessCard\",\"host\":\".*\",\"period\":5000,\"commandsIn\":\\{\\},\"commandsOut\":\\{\\},\"eventsIn\":\\{\\},\"eventsOut\":\\{\\},\"dataIn\":\\{\\},\"dataOut\":\\{\\},\"version\":.*,\"timestamp\":.*,\"instanceID\":.*,\"ID\":\"Test/Test\",\"name\":\"Test\",\"issuedBy\":\"issuer\"}";
        String result = gson.create().toJson(card);
        System.out.println("Serialized BusinessCard: " + result);
        assertTrue(result.matches(expected));
    }

    @Test
    public void testPart() {
        Part part = new Part("Part-ID", "A");
        part.setDescription("Part description");
        part.setIssuedBy("issuer");
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        String expected = "\\{\"class\":\"Part\",\"version\":.*,\"timestamp\":.*,\"instanceID\":.*,\"ID\":\"Part-ID\",\"name\":\"A\",\"description\":\"Part description\",\"issuedBy\":\"issuer\"\\}";
        String actual = gson.create().toJson(part);
        System.out.printf("P: %s%n", expected);
        System.out.printf("A: %s%n", actual);
        assertTrue(actual.matches(expected));
    }

    @Test
    public void testSerializeBinary() {
        byte[] data = new byte[] { 0x0C, 0x00, 0x0F, 0x0F, 0x0E, 0x0B, 0x0A, 0x0B, 0x0E };
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        assertEquals("\"DAAPDw4LCgsO\\r\\n\"", gson.create().toJson(data));
    }

    @Test
    public void testSerializeDate() {
        GsonBuilder gson = ToJsonProcessor.createBuilder();
        assertEquals("\"" + Dates.toDefaultDateFormat(NOW) + "\"", gson.create().toJson(new Date(NOW)));
    }

    static class MyNamed implements IEntity {

        private String name;

        @Override
        public void setName(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getID() {
            return getName();
        }

        @Override
        public String getDescription() {
            return getName();
        }

        /** @{inheritDoc . */
        @Override
        public String getIssuedBy() {
            return null;
        }
    };

    static class MyNamedWithClass extends MyNamed {
        private Class<?> clazz;

        public void setClazz(Class<?> clazz) {
            this.clazz = clazz;
        }

        public Class<?> getClazz() {
            return clazz;
        }
    }

    static class Noop extends Command {
        private static final long serialVersionUID = -52135596395518233L;

        public Noop() {
            super("NOOP", "NO OP command");
        }

        /** @{inheritDoc . */
        @Override
        protected List<CommandArgument> getArgumentDefinitions(List<CommandArgument> args) {
            args.add(new CommandArgument("First", "First Argument", IEntity.class, Boolean.TRUE));
            args.add(new CommandArgument("Second", "Second Argument", StartableEntity.class, Boolean.TRUE));
            return args;
        }
    };
}
