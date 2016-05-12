package eu.estcube.scriptengine;

import eu.estcube.codec.gcp.struct.GcpStruct;
import eu.estcube.scriptengine.io.ScriptIO;
import eu.estcube.scriptengine.io.ScriptLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Gregor on 7/10/2015.
 */
@Component
public class ScriptContext {

    @Autowired
    private ScriptIO scriptIO;

    @Autowired
    private ScriptIO hardwareTestingScriptIO;

    @Autowired
    private ScriptLogger scriptLogger;

    public ScriptIO getScriptIO() {
        return scriptIO;
    }

    public void setScriptIO(ScriptIO scriptIO) {
        this.scriptIO = scriptIO;
    }

    public ScriptIO getHardwareTestingScriptIO() {
		return hardwareTestingScriptIO;
	}

	public void setHardwareTestingScriptIO(ScriptIO hardwareTestingScriptIO) {
		this.hardwareTestingScriptIO = hardwareTestingScriptIO;
	}

	public ScriptLogger getScriptLogger() {
        return scriptLogger;
    }

    public void setScriptLogger(ScriptLogger scriptLogger) {
        this.scriptLogger = scriptLogger;
    }

}
