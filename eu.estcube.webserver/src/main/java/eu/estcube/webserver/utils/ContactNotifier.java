package eu.estcube.webserver.utils;

import java.security.GeneralSecurityException;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.apache.camel.Handler;
import org.hbird.exchange.groundstation.Track;
import org.hbird.exchange.navigation.LocationContactEvent;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import eu.estcube.common.utils.Emailer;

/**
 * Sends email notification on Track command using specified email data in
 * service.properties
 * 
 * @author Gregor Eesmaa
 * 
 */
@Component
public class ContactNotifier {

    private static final Logger LOG = LoggerFactory.getLogger(ContactNotifier.class);

    @Value("${email.to}")
    private String to;

    @Autowired
    private Emailer emailer;

    @Handler
    public void handle(Track track) {
        LocationContactEvent event = track.getLocationContactEvent();
        LOG.info("Handled new {}", event);
        sendEmails(event);
    }

    private void sendEmails(LocationContactEvent event) {
        if (to.isEmpty())
            return;
        String satID = event.getSatelliteID();
        String gsID = event.getGroundStationID();
        long obtNo = event.getOrbitNumber();
        long startTime = event.getStartTime();
        long endTime = event.getEndTime();

        // nicer than 4 min 59 sec, which we get by calculating, change when
        // needed
        String time = "5 mins";
        String dur = parseDuration(endTime - startTime);

        String title = getComponentName(satID) + " AOS in " + time + " for " + dur + " at "
                + getComponentName(gsID);
        StringBuilder content = new StringBuilder();
        content.append("---AOS notification---").append("\n");
        content.append("Satellite: ").append(satID).append("\n");
        content.append("Ground station: ").append(gsID).append("\n");
        content.append("Contact in: ").append(time).append("\n");
        content.append("Duration: ").append(dur).append("\n");
        content.append("Local AOS time: ").append(new DateTime(startTime).toString("HH:mm:ss")).append("\n");
        content.append("Local LOS time: ").append(new DateTime(endTime).toString("HH:mm:ss")).append("\n");
        content.append("Orbit number: ").append(obtNo).append("\n");

        try {
            emailer.sendEmail(to, title, content.toString());
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        }
    }

    private String parseDuration(long ms) {
        String dur = "";
        long durSecs = (ms / 1000) % 60;
        long durMins = (ms / 60000) % 60;
        long durHrs = ms / 3600000;
        if (durHrs != 0) {
            dur += durHrs + " hr" + (durHrs != 1 ? "s" : "") + " ";
            dur += durMins + " min" + (durMins != 1 ? "s" : "") + " ";
        } else if (durMins != 0) {
            dur += durMins + " min" + (durMins != 1 ? "s" : "") + " ";
        }
        dur += durSecs + " sec" + (durSecs != 1 ? "s" : "");
        return dur;
    }

    private String getComponentName(String id) {
        return id.substring(id.lastIndexOf("/") + 1);
    }
}
