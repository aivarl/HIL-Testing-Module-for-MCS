package eu.estcube.webserver.auth;

import org.eclipse.jetty.security.LoginService;
import org.eclipse.jetty.util.component.AbstractLifeCycle.AbstractLifeCycleListener;
import org.eclipse.jetty.util.component.LifeCycle;
import org.springframework.stereotype.Component;

/**
 * Listener to hold {@link LoginService} state.
 */
@Component
public class LoginServiceListener extends AbstractLifeCycleListener {

    /** {@link Throwable} from the service. */
    private Throwable throwable;

    /** @{inheritDoc . */
    @Override
    public void lifeCycleFailure(LifeCycle event, Throwable cause) {
        throwable = cause;
    }

    /** @{inheritDoc . */
    @Override
    public void lifeCycleStarted(LifeCycle event) {
        throwable = null;
    }

    /**
     * Returns {@link Throwable} from the {@link LoginService}.
     * 
     * In case {@link LoginService} is up and running returns null.
     * 
     * @return {@link Throwable} from the {@link LoginService} or null
     */
    public Throwable getThrowable() {
        return throwable;
    }
}
