package eu.estcube.common.script;

import eu.estcube.common.script.io.ScriptIOPayload;

import java.io.Serializable;

/**
 * Created by Joonas on 1.7.2015.
 */
public class ScriptReply implements Serializable {
    public ScriptReply() {}

    private String replyName;
    private ScriptIOPayload payload;

    public String getReplyName() {
        return replyName;
    }

    public void setReplyName(String replyName) {
        this.replyName = replyName;
    }

    public ScriptIOPayload getPayload() {
        return payload;
    }

    public void setPayload(ScriptIOPayload payload) {
        this.payload = payload;
    }
}
