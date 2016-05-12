package eu.estcube.common.utils;

import java.security.GeneralSecurityException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.sun.mail.util.MailSSLSocketFactory;

/**
 * Offers email sending methods using values specified in service.properties
 * file
 * 
 * <pre>
 * ### Email configuration in service.properties
 * # beacon email sending properties
 * email.from=
 * email.to=
 * 
 * # outgoing mail (SMTP) server
 * # typical port without authentication: 25
 * # typical port for TLS: 587
 * # typical port for SSL: 465
 * email.host=
 * email.port=
 * # leave these blank if no authentication is used
 * email.authentication.user=
 * email.authentication.password=
 * # use TLS or SSL for TLS/SSL, otherwise leave blank
 * email.authentication.method=
 * </pre>
 * 
 * @author Gregor Eesmaa
 * 
 */
@Component
public class Emailer {

    @Value("${email.from}")
    private String from;

    @Value("${email.host}")
    private String host;

    @Value("${email.port}")
    private String port;

    @Value("${email.authentication.user}")
    private String authUser;

    @Value("${email.authentication.password}")
    private String authPw;

    @Value("${email.authentication.method}")
    private String method;

    private static final String SMTP_HOST = "mail.smtp.host";
    private static final String SMTP_AUTH = "mail.smtp.auth";
    private static final String SMTP_STARTTLS_ENABLE = "mail.smtp.starttls.enable";
    private static final String SMTP_PORT = "mail.smtp.port";
    private static final String SMTP_SSL_SOCKETFACTORY = "mail.smtp.ssl.socketFactory";

    private static final String SMTPS_HOST = "mail.smtps.host";
    private static final String SMTPS_AUTH = "mail.smtps.auth";
    private static final String SMTPS_STARTTLS_ENABLE = "mail.smtps.starttls.enable";
    private static final String SMTPS_PORT = "mail.smtps.port";
    private static final String SMTPS_SSL_SOCKETFACTORY = "mail.smtps.ssl.socketFactory";

    private static final String SSL = "SSL";
    private static final String TLS = "TLS";

    private static final String PROTOCOL_SMTP = "smtp";
    private static final String PROTOCOL_SMTPS = "smtps";

    public void sendEmail(String receiver, String title, String content) throws AddressException,
            MessagingException,
            GeneralSecurityException {
        if (receiver == null || receiver.isEmpty())
            return;
        Session session = getSession(getProperties());
        MimeMessage message = getMessage(session, receiver, title, content);
        send(session, message);
    }

    private Session getSession(Properties properties) {
        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(authUser, authPw);
            }
        });
        return session;
    }

    private Properties getProperties() throws GeneralSecurityException {
        Properties props = new Properties();
        if (method.equalsIgnoreCase(TLS)) {
            MailSSLSocketFactory sf = new MailSSLSocketFactory();
            sf.setTrustAllHosts(true);
            props.put(SMTP_HOST, host);
            props.put(SMTP_PORT, port);
            props.put(SMTP_AUTH, "true");
            props.put(SMTP_STARTTLS_ENABLE, "true");
            props.put(SMTP_SSL_SOCKETFACTORY, sf);
        } else if (method.equalsIgnoreCase(SSL)) {
            MailSSLSocketFactory sf = new MailSSLSocketFactory();
            sf.setTrustAllHosts(true);
            props.put(SMTPS_HOST, host);
            props.put(SMTPS_PORT, port);
            props.put(SMTPS_AUTH, "true");
            props.put(SMTPS_STARTTLS_ENABLE, "true");
            props.put(SMTPS_SSL_SOCKETFACTORY, sf);
        } else {
            props.put(SMTP_HOST, host);
            props.put(SMTP_PORT, port);
        }
        return props;
    }

    private MimeMessage getMessage(Session session, String receiver, String title, String content)
            throws AddressException, MessagingException {
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiver));
        message.setSubject(title);
        message.setText(content);
        return message;
    }

    private void send(Session session, MimeMessage message) throws NumberFormatException, MessagingException {
        if (method.equalsIgnoreCase(SSL) || method.equalsIgnoreCase(TLS)) {
            Transport transport = method.equalsIgnoreCase(SSL) ? session.getTransport(PROTOCOL_SMTPS)
                    : session.getTransport(PROTOCOL_SMTP);
            try {
                transport.connect(host, Integer.parseInt(port), authUser, authPw);
                transport.sendMessage(message, message.getAllRecipients());
                transport.close();
            } catch (NumberFormatException e) {
                transport.close();
                throw e;
            } catch (MessagingException e) {
                transport.close();
                throw e;
            }
        } else {
            Transport.send(message);
        }
    }

}
