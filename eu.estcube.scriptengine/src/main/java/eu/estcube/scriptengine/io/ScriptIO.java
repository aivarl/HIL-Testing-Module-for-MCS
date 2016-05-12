package eu.estcube.scriptengine.io;

import eu.estcube.common.script.io.ScriptIOPayload;

/**
 * Created by Joonas on 30.6.2015.
 */
public interface ScriptIO {
    /**
     *  Sends a packet with given payload for given op.
     * @param op
     * @param payload
     */
    void send(String op, ScriptIOPayload payload);

    /**
     * Polls for received payload for command with given name. Returns null if there is none.
     * @param name
     * @return
     */
    ScriptIOPayload poll(String name);
}