package eu.estcube.common.script.io;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Contains payload for either a command or a reply. ScriptIOPayload is a fairly high level
 * class that stores the parameters in a map
 */
public class ScriptIOPayload implements Serializable {
    private Map<String, Object> map = new HashMap<String, Object>();

    public ScriptIOPayload() {}

    public Object get(String key) {
        return map.get(key);
    }

    public Object put(String key, Object value) {
        return map.put(key, value);
    }

    public boolean containsKey(String key) {
        return map.containsKey(key);
    }

    public void putAll(Map<String, Object> other) {
        map.putAll(other);
    }

    public Map<String, Object> getMap() {
        return map;
    }
}
