/** 
 *
 */
package eu.estcube.hardwaretesting;

import org.hbird.exchange.core.ConfigurationBase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Script engine specific configuration.
 */
@Component
public class ScriptEngineConfig extends ConfigurationBase {

    private static final long serialVersionUID = 7796683996586902758L;

    // TODO - 10.07.2013; kimmell - remove when hbird ConfigurationBase has this
    // field - probably version 0.10.0
    @Deprecated
    @Value("${service.name}")
    private String serviceName;

    /**
     * Returns serviceName.
     * 
     * @return the serviceName
     */
    public String getServiceName() {
        return serviceName;
    }
}
