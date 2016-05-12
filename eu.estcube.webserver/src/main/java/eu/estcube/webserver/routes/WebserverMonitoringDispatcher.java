/** 
 *
 */
package eu.estcube.webserver.routes;

import org.hbird.exchange.configurator.StandardEndpoints;
import org.springframework.stereotype.Component;

/**
 * Separates different data and sends them through different routes
 */
@Component
public class WebserverMonitoringDispatcher extends WebserverRouteBuilder {

    public static final String FILTER_BUSINESS_CARDS = "${in.header.class} == 'BusinessCard'";

    public static final String DESTINATION_BUSINESS_CARDS = "direct:businessCards";
    public static final String DESTINATION_UNFILTERED = "direct:unfiltered";
    public static final String DESTINATION_SCRIPTOUTPUT = "direct:scriptoutput";

    /** @{inheritDoc . */
    @Override
    protected String getSource() {
        return StandardEndpoints.MONITORING;
    }

    /** @{inheritDoc . */
    @Override
    protected String getDestination() {
        return null;
    }

    /** @{inheritDoc . */
    @Override
    public void configure() throws Exception {
        // @formatter:off
        from(getSource())
            .choice()
                .when(simple(FILTER_BUSINESS_CARDS)).to(DESTINATION_BUSINESS_CARDS)
                .otherwise().to(DESTINATION_UNFILTERED)
            .end();
        // @formatter:on
    }

}
