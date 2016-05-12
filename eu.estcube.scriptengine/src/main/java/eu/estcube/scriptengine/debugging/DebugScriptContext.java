package eu.estcube.scriptengine.debugging;

import eu.estcube.scriptengine.ScriptContext;

/**
 * Created by Gregor on 10.07.2015.
 */
public class DebugScriptContext extends ScriptContext {

    public DebugScriptContext() {
        setScriptIO(new DebugScriptIO());
        setScriptLogger(new DebugScriptLogger());
    }
}
