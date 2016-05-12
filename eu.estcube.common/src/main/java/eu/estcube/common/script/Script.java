package eu.estcube.common.script;

import java.io.Serializable;
import java.util.UUID;

public class Script implements Serializable {
    private String code;
    private String identifier;

    public Script() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }
}
