/** 
 *
 */
package eu.estcube.webserver;

import java.util.Set;

import org.apache.camel.model.ModelCamelContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.stereotype.Component;

import eu.estcube.webserver.routes.WebserverRouteBuilder;

/**
 *
 */
// TODO: Restore, when updated to Camel 2.12
@Component
public class RouteLoader implements ApplicationListener<ContextStartedEvent> {

    private static final Logger LOG = LoggerFactory.getLogger(RouteLoader.class);

    @Autowired
    private Set<WebserverRouteBuilder> builders;

    // @Autowired
    private ModelCamelContext context;

    /** @{inheritDoc . */
    @Override
    public void onApplicationEvent(ContextStartedEvent event) {

        // LOG.debug("Application context started - adding web server routes");
        // int success = 0;
        // for (RouteBuilder builder : builders) {
        // LOG.debug(" adding builder {}", builder.getClass().getSimpleName());
        // try {
        // context.addRoutes(builder);
        // success++;
        // } catch (Exception e) {
        // LOG.error("Failed to add routes from builder {}",
        // builder.getClass().getSimpleName(), e);
        // }
        // }
        // LOG.debug("Successfully added {} web server routes out of {}.",
        // success, builders.size());
    }
}
