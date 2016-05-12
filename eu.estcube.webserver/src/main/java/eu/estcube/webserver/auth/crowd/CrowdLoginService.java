package eu.estcube.webserver.auth.crowd;

import java.io.IOException;
import java.rmi.RemoteException;
import java.security.Principal;

import javax.security.auth.Subject;

import org.codehaus.xfire.XFireRuntimeException;
import org.eclipse.jetty.http.security.Credential;
import org.eclipse.jetty.security.LoginService;
import org.eclipse.jetty.security.MappedLoginService;
import org.eclipse.jetty.server.UserIdentity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.crowd.exception.ApplicationAccessDeniedException;
import com.atlassian.crowd.exception.ExpiredCredentialException;
import com.atlassian.crowd.exception.InactiveAccountException;
import com.atlassian.crowd.exception.InvalidAuthenticationException;
import com.atlassian.crowd.exception.InvalidAuthorizationTokenException;
import com.atlassian.crowd.exception.UserNotFoundException;
import com.atlassian.crowd.service.soap.client.SecurityServerClient;

/**
 * {@link LoginService} implementation to integrate with Crowd server.
 */
public class CrowdLoginService extends MappedLoginService {

    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(CrowdLoginService.class);

    /** Crowd client instance to use. */
    private final SecurityServerClient crowdClient;

    /**
     * Creates new CrowdLoginService.
     * 
     * @param crowdClient {@link SecurityServerClient} to use
     */
    public CrowdLoginService(SecurityServerClient crowdClient) {
        this.crowdClient = crowdClient;
        setName(getClass().getSimpleName());
    }

    /**
     * @{inheritDoc .
     */
    @Override
    protected void doStart() {
        try {
            super.doStart();
        } catch (Exception e) {
            LOG.error("Failed to start {}", getName(), e);
        }
    }

    /**
     * Notifies {@link Listener}s about service failures.
     * 
     * @param th Throwable to report
     */
    void setFailed(Throwable th) {
        LOG.warn("{} failed", getName(), th);
        for (Listener listener : _listeners) {
            listener.lifeCycleFailure(this, th);
        }
    }

    /**
     * Notifies {@link Listener}s about working service.
     */
    void setWorking() {
        for (Listener listener : _listeners) {
            listener.lifeCycleStarted(this);
        }
    }

    /**
     * Loads user information from Crowd.
     */
    @Override
    protected UserIdentity loadUser(String username) {
        // If user was found, finds the groups it belongs to and creates a user
        // identity using putUser method
        try {
            String[] groups = crowdClient.findGroupMemberships(username);
            setWorking();
            return putUser(username, null, groups);
        } catch (UserNotFoundException e) {
            LOG.warn("User {} not found", username);
        } catch (RemoteException e) {
            setFailed(e);
            LOG.info("Possible exception in Crowd server.");
            LOG.info("* Check Crowd server.");
        } catch (InvalidAuthenticationException e) {
            setFailed(e);
            LOG.info("Failed to authenticate application in Crowd server.");
            LOG.info("* Check crowd.properties file - are application.name & application.password OK?");
        } catch (InvalidAuthorizationTokenException e) {
            setFailed(e); // <- remove this in case exception is user related
            LOG.info("Not exactly sure about origin of this excpetion.");
            LOG.info("1. can be problem with applcation authorization token.");
            LOG.info("   * Restart can help in this case.");
            LOG.info("2. can be problem with user authorization token.");
            LOG.info("   * New user login should help in this case.");
            LOG.info("Either case notify developers and give background information as much as possible.");
        } catch (XFireRuntimeException e) {
            setFailed(e);
            LOG.info("Can't connect to the Crowd server.");
            LOG.info("* Check crowd.properties file - is crowd.server.url OK?");
            LOG.info("* Check connection to Crowd server specified by crowd.server.url.");
            LOG.info("* Crowd server license can be expired. Check Crowd server.");
        }
        // Returns null if an exception is caught
        return null;
    }

    /**
     * Creates a useridentity for the user.
     */
    @Override
    public synchronized UserIdentity putUser(String userName, Credential credential, String[] roles) {
        Principal userPrincipal = new CrowdUser(userName);
        Subject subject = new Subject();
        subject.getPrincipals().add(userPrincipal);
        subject.getPrivateCredentials().add(credential);

        if (roles != null) {
            for (String role : roles) {
                subject.getPrincipals().add(new RolePrincipal(role));
            }
        }

        subject.setReadOnly();
        UserIdentity identity = _identityService.newUserIdentity(subject, userPrincipal, roles);
        _users.put(userName, identity);
        return identity;
    }

    /**
     * @{inheritDoc .
     */
    @Override
    protected void loadUsers() throws IOException {
        // Unimportant
    }

    /**
     * Class to store Crowd user objects.
     */
    @SuppressWarnings("serial")
    public class CrowdUser extends KnownUser {

        /**
         * Token returned from the Crowd server after successful login to
         * identify user later.
         */
        private String crowdToken;

        /**
         * Creates new CrowdUser.
         * 
         * @param username
         */
        public CrowdUser(String username) {
            super(username, null);
        }

        /**
         * Returns Crowd token.
         * 
         * @return Crowd token
         */
        public String getCrowdToken() {
            return crowdToken;
        }

        /**
         * Sets the Crowd token
         * 
         * @param crowdToken Crowd token to set
         */
        public void setCrowdToken(String crowdToken) {
            this.crowdToken = crowdToken;
        }

        @Override
        /*
         * Tries to authenticate the user with the given credentials. In case of
         * success, returns true. If
         * authentication fails or a an exception is caught, returns null
         */
        public boolean authenticate(Object credentials) {
            try {
                crowdToken = crowdClient.authenticatePrincipalSimple(getName(), String.valueOf(credentials));
                LOG.info("Login successful for the user {}", getName());
                setWorking();
                return isAuthenticated();
            } catch (InvalidAuthenticationException e) {
                LOG.warn("Login failed for the user {}; invalid username or password.", getName());
            } catch (InactiveAccountException e) {
                LOG.warn("Login failed for the user {}; account inactive.", getName());
            } catch (ExpiredCredentialException e) {
                LOG.warn("Login failed for the user {}; credentials expired.", getName());
            } catch (RemoteException e) {
                setFailed(e);
                LOG.info("Possible exception in Crowd server.");
                LOG.info("* Check Crowd server");
            } catch (InvalidAuthorizationTokenException e) {
                setFailed(e); // <- remove this in case exception is user
                              // related
                LOG.info("Not exactly sure about origin of this excpetion.");
                LOG.info("1. can be problem with applcation authorization token.");
                LOG.info("   * Restart can help in this case.");
                LOG.info("2. can be problem with user authorization token.");
                LOG.info("   * New user login should help in this case.");
                LOG.info("Either case notify developers and give background information as much as possible.");
            } catch (ApplicationAccessDeniedException e) {
                setFailed(e);
                LOG.info("Access denied for the application in Crowd server.");
                LOG.info("* Check configuration in Crowd server.");
            } catch (XFireRuntimeException e) {
                setFailed(e);
                LOG.info("Can't connect to the Crowd server.");
                LOG.info("* Check crowd.properties file - is crowd.server.url OK?");
                LOG.info("* Check connection to Crowd server specified by crowd.server.url.");
                LOG.info("* Crowd server license can be expired. Check Crowd server.");
            }
            return false;
        }

        /**
         * @{inheritDoc .
         */
        @Override
        public boolean isAuthenticated() {
            return crowdToken != null;
        }
    }
}
