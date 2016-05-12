package eu.estcube.common.script.io;

import java.io.Serializable;

/**
 * Created by Aivar on 6.7.2015.
 */
public class HardwareTestingMessage implements Serializable {
    public HardwareTestingMessage() {
    }

    public HardwareTestingMessage(Type type, String message) {
        this.type = type;
        this.message = message;
    }

    private Type type;
    private String message;
    private String scriptIdentifier;

    // A generic object that can be used to send data about eg. exceptions
    private Object extraInfo;

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getScriptIdentifier() {
        return scriptIdentifier;
    }

    public void setScriptIdentifier(String scriptIdentifier) {
        this.scriptIdentifier = scriptIdentifier;
    }

    public Object getExtraInfo() {
        return extraInfo;
    }

    public void setExtraInfo(Object extraInfo) {
        this.extraInfo = extraInfo;
    }

    public enum Type {
        Trace,
        Info,
        Warning,
        Error,
        ConnectionInfo,
        ConnectionWarning,
        ConnectionError
    }

    /**
     * Helper class used by ScriptRunProcessor in ScriptEngine to send detailed
     * information
     * about compilation errors to the script editor
     */
    public static class ScriptCompilationInfo implements Serializable {
        public final String type = "compileError"; // required to identify
                                                   // extraInfo type

        public String message;
        public int row, column;
    }
}
