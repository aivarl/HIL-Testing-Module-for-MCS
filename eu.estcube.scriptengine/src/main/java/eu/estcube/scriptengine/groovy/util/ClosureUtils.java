package eu.estcube.scriptengine.groovy.util;

import groovy.lang.Closure;
import org.codehaus.groovy.runtime.MethodClosure;

import java.util.Arrays;

/**
 * Created by test on 15.06.2015.
 */
public class ClosureUtils {
    /**
     * Makes sure that params length is equal or less than maximum closure parameter count.
     * This allows in-Groovy closures to omit variables from closures that do not need them.
     *
     * @param closure
     * @param params
     * @return
     */
    public static Object safeCallWithParams(Closure closure, Object... params) {
        if (params.length > closure.getMaximumNumberOfParameters()) {
            params = Arrays.copyOf(params, closure.getMaximumNumberOfParameters());
        }

        return closure.call(params);
    }

    public static boolean alwaysTrue(Object... o) { return true; }
    public static Closure alwaysTrueClosure = new MethodClosure(ClosureUtils.class, "alwaysTrue");

    public static boolean isTrue(Object o) {
        return Boolean.TRUE.equals(o);
    }

}
