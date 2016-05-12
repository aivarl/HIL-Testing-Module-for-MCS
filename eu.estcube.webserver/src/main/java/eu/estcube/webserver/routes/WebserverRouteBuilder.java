/** 
 *
 */
package eu.estcube.webserver.routes;

import org.apache.camel.builder.RouteBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public abstract class WebserverRouteBuilder extends RouteBuilder {

    public static final String NAME_SPLIT_REGEX = "(?<=[a-z])(?=[A-Z])";

    private static final Logger LOG = LoggerFactory.getLogger(WebserverRouteBuilder.class);

    protected String getName() {
        return getName(getClass().getSimpleName(), NAME_SPLIT_REGEX);
    }

    protected String getName(String simpleClassName, String regex) {
        String[] parts = null;
        try {
            parts = simpleClassName.split(regex);
        } catch (Exception e) {
            LOG.warn("Failed to extract the name from the input string {}; returning {}", simpleClassName,
                    simpleClassName);
        }
        return parts != null && parts.length > 0 ? parts[0].toLowerCase() : simpleClassName;
    }

    protected abstract String getSource();

    protected abstract String getDestination();
}
