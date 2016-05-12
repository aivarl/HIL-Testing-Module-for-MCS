package eu.estcube.common;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.camel.Body;
import org.apache.camel.Message;
import org.apache.camel.impl.DefaultMessage;
import org.hbird.exchange.interfaces.IEntity;
import org.springframework.stereotype.Component;

@Component
public class CollectionOfNamedObjectsSplitter {

    /**
     * The split message method returns something that is iteratable such as a
     * java.util.List.
     * 
     * @param body the payload of the incoming message
     * @return a list containing each part splitted
     */
    public List<Message> splitMessage(@Body Collection<IEntity> objects) {
        List<Message> answer = new ArrayList<Message>();
        for (IEntity object : objects) {
            DefaultMessage message = new DefaultMessage();
            message.setBody(object);
            answer.add(message);
        }
        return answer;
    }
}