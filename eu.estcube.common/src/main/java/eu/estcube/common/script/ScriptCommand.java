package eu.estcube.common.script;

import eu.estcube.common.script.io.ScriptIOPayload;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Joonas on 1.7.2015.
 */
public class ScriptCommand implements Serializable {
    public ScriptCommand() {}

    private String commandName;
    private ScriptIOPayload payload;

    public String getCommandName() {
        return commandName;
    }

    public void setCommandName(String commandName) {
        this.commandName = commandName;
    }

    public ScriptIOPayload getPayload() {
        return payload;
    }

    public void setPayload(ScriptIOPayload payload) {
        this.payload = payload;
    }
}
