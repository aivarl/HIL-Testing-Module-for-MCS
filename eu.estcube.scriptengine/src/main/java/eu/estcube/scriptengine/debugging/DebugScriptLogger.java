package eu.estcube.scriptengine.debugging;

import eu.estcube.scriptengine.io.ScriptLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Joonas on 6.7.2015.
 */
public class DebugScriptLogger extends ScriptLogger {
    private static final Logger LOG = LoggerFactory.getLogger(DebugScriptLogger.class);

    @Override
    public void log(String scriptId, Object o) {
        LOG.info(String.format("[%s] %s", scriptId, o));
    }

    @Override
    public void error(String scriptId, Object o) {
        LOG.error(String.format("[%s] %s", scriptId, o));
    }
}
