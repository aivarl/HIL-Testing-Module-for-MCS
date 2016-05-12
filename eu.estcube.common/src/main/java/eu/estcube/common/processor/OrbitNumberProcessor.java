package eu.estcube.common.processor;

import java.util.Date;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.business.navigation.orekit.NavigationUtilities;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Processor to add orbit number header ({@value StandardArguments.ORBIT_NUMBER}
 * ) to current message, using headers with satellite ID and timestamp ({@value
 * StandardArguments.SATELLITE_ID} and {@value StandardArguments.TIMESTAMP}).
 */
@Component
public class OrbitNumberProcessor implements Processor {

    @Autowired
    private IOrbitalDataAccess dao;

    /** @{inheritDoc . */
    @Override
    @Handler
    public void process(Exchange exchange) throws Exception {
        Message in = exchange.getIn();
        Message out = exchange.getOut();
        out.copyFrom(in);

        String base = in.getHeader(StandardArguments.SATELLITE_ID, String.class);
        long ms = in.getHeader(StandardArguments.TIMESTAMP, long.class);

        TleOrbitalParameters top = dao.getTleFor(base);
        if (top == null)
            return;
        TLE tle = new TLE(top.getTleLine1(), top.getTleLine2());
        AbsoluteDate date = new AbsoluteDate(new Date(ms), TimeScalesFactory.getUTC());
        int orbitNumber = NavigationUtilities.calculateOrbitNumber(tle, date);
        out.setHeader(StandardArguments.ORBIT_NUMBER, orbitNumber);
    }
}
