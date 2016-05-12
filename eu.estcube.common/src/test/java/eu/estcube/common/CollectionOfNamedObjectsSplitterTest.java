package eu.estcube.common;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.apache.camel.Message;
import org.hbird.exchange.core.Label;
import org.hbird.exchange.interfaces.IEntity;
import org.junit.Before;
import org.junit.Test;

public class CollectionOfNamedObjectsSplitterTest {

    private CollectionOfNamedObjectsSplitter splitter;
    private ArrayList<IEntity> namedObjects;
    private String labelId1 = "labelId1";
    private String labelId2 = "labelId2";
    private String labelName1 = "labelName1";
    private String labelName2 = "labelName2";

    @Before
    public void setUp() {
        splitter = new CollectionOfNamedObjectsSplitter();
        IEntity named1 = new Label(labelId1, labelName1);
        IEntity named2 = new Label(labelId2, labelName2);
        namedObjects = new ArrayList<IEntity>();
        namedObjects.add(named1);
        namedObjects.add(named2);
    }

    @Test
    public void testSplitter() {
        List<Message> messages = splitter.splitMessage(namedObjects);
        assertEquals(messages.size(), namedObjects.size());

        for (int i = 0; i < namedObjects.size(); i++) {
            assertEquals(messages.get(i).getBody(IEntity.class), namedObjects.get(i));
        }
    }
}
