package eu.estcube.scriptengine.base;

/**
 * The point of Responses is to allow states return a standardized return code, which can be then processed
 * in ScriptEngine or whereever. For example you could add Goto response, which can be returned from a state
 * to go to specified state automatically (kind of like having gotoState statement but having it be executed
 * _after_ the state ends rather than just before)
 */
public class Responses {
    public static abstract class Response {
        public abstract boolean isError();
    }

    public static class OkResponse extends Response {
        private final Object obj;

        public OkResponse(Object obj) {
            this.obj = obj;
        }

        @Override
        public boolean isError() {
            return false;
        }
    }
    public static Response Ok(Object obj) {
        return new OkResponse(obj);
    }
    public static Response Ok() {
        return Ok(null);
    }

    public static class GotoResponse extends Response {
        private final Class<? extends State> nextState;

        public GotoResponse(Class<? extends State> nextState) {
            this.nextState = nextState;
        }

        @Override
        public boolean isError() {
            return false;
        }
    }
    public static Response Goto(Class<? extends State> nextState) {
        return new GotoResponse(nextState);
    }

    public static class ErrorResponse extends Response {
        private final Object obj;

        public ErrorResponse(Object obj) {
            this.obj = obj;
        }

        @Override
        public boolean isError() {
            return true;
        }
    }
    public static Object Error(Object obj) {
        return new ErrorResponse(obj);
    }
}
