package eu.estcube.webserver;

import org.apache.camel.Body;
import org.hbird.business.api.IPublisher;
import org.hbird.exchange.core.EntityInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class NamedObjectPublisher {
    @Autowired
    private IPublisher publisher;

    private static final Logger LOG = LoggerFactory.getLogger(NamedObjectPublisher.class);

    @Value("${service.id}")
    private String serviceId;

    public EntityInstance publishAndCommit(@Body EntityInstance entityInstance) {
        try {
            publisher.publish(entityInstance);
        } catch (Exception e) {
            LOG.error("Failed to publish {}", entityInstance.toString(), e);
        }
        return entityInstance;
    }
}
