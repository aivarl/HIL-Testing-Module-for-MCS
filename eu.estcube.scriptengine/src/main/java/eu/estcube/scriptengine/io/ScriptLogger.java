package eu.estcube.scriptengine.io;

/**
 * Created by Joonas on 6.7.2015.
 */
public abstract class ScriptLogger {
    public abstract void log(String scriptId, Object o);
    public abstract void error(String scriptId, Object o);
}