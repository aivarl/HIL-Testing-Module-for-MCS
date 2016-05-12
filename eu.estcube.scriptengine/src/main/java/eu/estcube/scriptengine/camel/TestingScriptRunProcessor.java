package eu.estcube.scriptengine.camel;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.codehaus.groovy.ast.ASTNode;
import org.codehaus.groovy.control.CompilationFailedException;
import org.codehaus.groovy.control.ErrorCollector;
import org.codehaus.groovy.control.MultipleCompilationErrorsException;
import org.codehaus.groovy.control.messages.SyntaxErrorMessage;
import org.codehaus.groovy.syntax.SyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.common.script.Script;
import eu.estcube.common.script.io.ScriptMessage;
import eu.estcube.scriptengine.ScriptContext;
import eu.estcube.scriptengine.base.ScriptBase;
import eu.estcube.scriptengine.compilation.ScriptCompilationError;
import eu.estcube.scriptengine.compilation.ScriptCompiler;


/**
 * Created by Aivar on 23.04.2015.
 */
@Component
public class TestingScriptRunProcessor implements Processor {
    private static final Logger LOG = LoggerFactory.getLogger(TestingScriptRunProcessor.class);

    @Autowired
    private ScriptContext scriptContext;
    
    private Thread scriptRunnerThread;

    private ScriptMessage createCompileErrorMessage(Throwable e) {
        if (!(e.getCause() instanceof CompilationFailedException)) {

            ScriptMessage msg = new ScriptMessage();
            msg.setType(ScriptMessage.Type.Error);
            msg.setMessage("Compilation failed: " + e.getMessage());
            return msg;
        }

        CompilationFailedException cfe = (CompilationFailedException) e.getCause();
        String errorMsg;
        int row = 0, col = 0;

        ASTNode node = cfe.getNode();
        if (node != null) {
            col = node.getColumnNumber();
            row = node.getLineNumber();
        }

        if (cfe instanceof MultipleCompilationErrorsException) {
            ErrorCollector c = ((MultipleCompilationErrorsException) cfe).getErrorCollector();

            org.codehaus.groovy.control.messages.Message firstError = c.getError(0);
            if (firstError instanceof SyntaxErrorMessage) {
                SyntaxException cause = ((SyntaxErrorMessage) firstError).getCause();
                errorMsg = cause.getOriginalMessage();
                row = cause.getLine();
                col = cause.getStartColumn();
            } else {
                errorMsg = ((MultipleCompilationErrorsException) cfe).getMessage();
            }
        } else {
            errorMsg = cfe.getMessageWithoutLocationText();
        }
        ScriptMessage msg = new ScriptMessage();
        msg.setType(ScriptMessage.Type.Error);
        msg.setMessage("Compilation error: " + errorMsg);

        ScriptMessage.ScriptCompilationInfo smei = new ScriptMessage.ScriptCompilationInfo();
        smei.message = errorMsg;
        smei.column = col;
        smei.row = row;
        msg.setExtraInfo(smei);

        return msg;
    }

    public void processScriptSync(Message in, final Message out) {
        Object body = in.getBody();
        LOG.info("Received script body");

        // for debugging
        if (body instanceof String) {
            Script script = new Script();
            script.setIdentifier("testscript");
            script.setCode((String) body);

            body = script;
        }

        Script script = (Script) body;
        LOG.info("Received script object with length " + script.getCode().length());
        LOG.info(script.getCode());
        if("SCRIPT_STOP".equals(script.getCode())){
        	LOG.info("Interrupting the scriptRunnerThread.");
        	scriptRunnerThread.interrupt();
        }

        ScriptBase scriptBase = null;
        try {
            scriptBase = ScriptCompiler.simpleCompile(script.getCode());
        } catch (ScriptCompilationError e) {
            out.setBody(createCompileErrorMessage(e));
            return;
        }

        scriptBase.setIdentifier(script.getIdentifier());
        scriptBase.setContext(scriptContext);
        
        final ScriptBase runScriptBase = scriptBase;

		//Catching Groovy exceptions for test failure detection.
		Thread.UncaughtExceptionHandler h = new Thread.UncaughtExceptionHandler() {
		    public void uncaughtException(Thread th, Throwable ex) {
		    	StringWriter sw = new StringWriter();
                ex.printStackTrace(new PrintWriter(sw));
                String stacktrace = sw.toString();
                
                System.out.println(stacktrace);
                scriptContext.getScriptLogger().log("exceptionhandler", formatTestError(stacktrace) + ";" + ex.getMessage());
                scriptContext.getScriptLogger().log("Info", "Script done.");
		    }
		};
        scriptRunnerThread = new Thread(){
        	@Override public void run() {
        		try {
        			scriptContext.getScriptLogger().log("engine", "Running script...");
        			runScriptBase.run();
        		} catch (Exception e) {
        			LOG.error("Error with the script", e);
        			out.setBody(new ScriptMessage(ScriptMessage.Type.Error, "Runtime error: " + e.getMessage()));
        			return;
        		}
              scriptContext.getScriptLogger().log("Info", "Script done.");
        		
        	}
        };
        scriptRunnerThread.setUncaughtExceptionHandler(h);
        scriptRunnerThread.start();
    }


	@Override
	public void process(Exchange exchange) throws Exception {
        Message message = exchange.getIn();
        Message out = exchange.getOut();

        processScriptSync(message, out);		
	}

	/**
	 * Returns the state in which the error occurred and the line number.
	 * @param stacktrace
	 * @return
	 */
	private String formatTestError(String stacktrace){
		String errorInfo = "";
		
	    Pattern statePattern = Pattern.compile("MCSScript\\$(.*?).run");
	    Matcher matcher = statePattern.matcher(stacktrace);
	    while (matcher.find()) {
	    	errorInfo = matcher.group(1);
	    }
		
	    Pattern codeLinePattern = Pattern.compile("MCSScript\\$"+errorInfo+".run\\(Script1.groovy:(.*?)\\)");
	    matcher = codeLinePattern.matcher(stacktrace);
	    while (matcher.find()) {
	    	errorInfo += ";" + matcher.group(1);
	    }
		return errorInfo;
	}
}
