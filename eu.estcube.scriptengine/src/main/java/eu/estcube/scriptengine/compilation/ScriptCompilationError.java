package eu.estcube.scriptengine.compilation;

/**
 * Created by Gregor on 7/10/2015.
 */
public class ScriptCompilationError extends Exception {
    public ScriptCompilationError(String message, Throwable cause) {
        super(message, cause);
    }

    public ScriptCompilationError(Throwable cause) {
        super(cause);
    }

    public ScriptCompilationError() {
    }

    public ScriptCompilationError(String message) {
        super(message);
    }
}
