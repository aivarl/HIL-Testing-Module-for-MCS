package eu.estcube.scriptengine.base;

import eu.estcube.common.script.io.ScriptIOPayload;
import eu.estcube.scriptengine.ScriptContext;
import groovy.lang.Script;

import java.lang.reflect.Constructor;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by Joonas on 29.6.2015.
 */
public abstract class ScriptBase extends Script {
    // TODO all state running stuff should probably be refactored into its own
    // class
    private ExecutorService threadPool = Executors.newCachedThreadPool();

    private ScriptContext context;

    private String identifier = "DEFAULT_SCRIPT";

    private State newState(Class<? extends State> cls) throws Exception {
        final State state;

        Constructor init = cls.getConstructors()[0];
        // States are implicitly made sub-class of MCSScript.
        // See
        // eu.estcube.scriptengine.groovy.transform.InnerClassWrapperTransformer
        //
        // Here we try to get the constructor that accepts MCSScript instance
        // TODO what if user defines a constructor, is constructors[0] always a
        // good inner class constructor
        state = (State) init.newInstance(this);

        return state;
    }

    public void setContext(ScriptContext context) {
        this.context = context;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void log(Object o) {
        context.getScriptLogger().log(identifier, o);
    }

    public void error(Object o) {
        context.getScriptLogger().error(identifier, o);
    }

    public Object runStateSync(Class<? extends State> cls) {
        try {
            State s = newState(cls);
            return s.run();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        // return p.waitForResolve();
    }

    public Object gotoState(Class<? extends State> cls) {
        return runStateSync(cls);
    }

    public void send(String name, Map opts) {
        ScriptIOPayload payload = new ScriptIOPayload();

        if (opts != null)
            payload.putAll(opts);

        context.getScriptIO().send(name, payload);
    }

    public void send(String name) {
        send(name, null);
    }

    private static int getIntOr(Map map, Object key, int def) {
        Object o = map.get(key);
        if (o != null)
            return (Integer) o;
        return def;
    }

    public Map listen(String name, Map opts) {
        int timeout = 250000; // TODO move to service.properties
        if (opts != null) {
            timeout = getIntOr(opts, "timeout", timeout);
        }

        final long start = System.currentTimeMillis();
        while (true) {
            ScriptIOPayload pl = context.getScriptIO().poll(name);
            if (pl != null)
                return pl.getMap();

            long elapsed = System.currentTimeMillis() - start;
            if (elapsed > timeout)
                // TODO this should probably be some other exception type
                throw new RuntimeException("timed out");

            try {
                Thread.sleep(10);
            } catch (InterruptedException ignored) {
            }
        }
    }

    public Map listen(String name){
        return listen(name, null);
    }
}
