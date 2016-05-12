package eu.estcube.webserver.domain;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * Pojo for holding user information.
 */
public class UserInfo {

    /** User name. */
    protected String username;

    /** Roles assigned to user. */
    protected Set<String> roles = new HashSet<String>();

    /** Server info for GUI */
    protected String serviceId;
    protected String serviceVersion;
    protected String host;
    protected int port;

    /**
     * Creates new UserInfo.
     */
    public UserInfo() {
    }

    /**
     * Creates new UserInfo.
     * 
     * @param username user name
     * @param roles {@link Set} of roles
     */
    public UserInfo(String username, Set<String> roles) {
        this.username = username;
        this.roles = roles;
    }

    /**
     * Returns username.
     * 
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets username.
     * 
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Returns roles.
     * 
     * @return the roles
     */
    public Set<String> getRoles() {
        return roles;
    }

    /**
     * Sets roles.
     * 
     * @param roles the roles to set
     */
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    /**
     * 
     */
    public void setServerInfo(String serviceId, String serviceVersion, String host, int port) {
        this.serviceId = serviceId;
        this.serviceVersion = serviceVersion;
        this.host = host;
        this.port = port;
    }

    /** @{inheritDoc . */
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
