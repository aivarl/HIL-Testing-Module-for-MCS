package eu.estcube.scriptengine.debugging;

import eu.estcube.scriptengine.io.ScriptIO;
import eu.estcube.common.script.io.ScriptIOPayload;
import org.springframework.stereotype.Component;

/**
 * Debugging IO for testing. Doesn't actually send anything.
 */
@Component
public class DebugScriptIO implements ScriptIO {
    @Override
    public void send(String name, ScriptIOPayload payload) {
        // we dont actually send anything
    }

    @Override
    public ScriptIOPayload poll(String name) {
        ScriptIOPayload pl = new ScriptIOPayload();
        pl.put("a", 32);
        return pl;
    }
}
