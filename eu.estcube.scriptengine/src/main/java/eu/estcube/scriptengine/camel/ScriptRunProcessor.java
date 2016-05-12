package eu.estcube.scriptengine.camel;

import eu.estcube.common.script.Script;
import eu.estcube.common.script.io.ScriptMessage;
import eu.estcube.scriptengine.compilation.ScriptCompilationError;
import eu.estcube.scriptengine.compilation.ScriptCompiler;
import eu.estcube.scriptengine.ScriptContext;
import eu.estcube.scriptengine.base.ScriptBase;
import org.apache.camel.*;
import org.apache.camel.util.AsyncProcessorHelper;
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

/**
 * Created by Joonas on 25.6.2015.
 */
@Component
public class ScriptRunProcessor implements AsyncProcessor {
    private static final Logger LOG = LoggerFactory.getLogger(ScriptRunProcessor.class);

    @Autowired
    private ScriptContext scriptContext;

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

    public void processScriptSync(Message in, Message out) {
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

        ScriptBase scriptBase = null;
        try {
            scriptBase = ScriptCompiler.simpleCompile(script.getCode());
        } catch (ScriptCompilationError e) {
            out.setBody(createCompileErrorMessage(e));
            return;
        }

        scriptBase.setIdentifier(script.getIdentifier());
        scriptBase.setContext(scriptContext);
        try {
            scriptContext.getScriptLogger().log("engine", "Running script...");
            scriptBase.run();
        } catch (Exception e) {
            LOG.error("Error with the script", e);
            out.setBody(new ScriptMessage(ScriptMessage.Type.Error, "Runtime error: " + e.getMessage()));
            return;
        }

        out.setBody(new ScriptMessage(ScriptMessage.Type.Info, "Script done"));
    }

    public void asyncProcess(final Exchange exchange, final AsyncCallback callback) {
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                Message message = exchange.getIn();
                Message out = exchange.getOut();

                try {
                    processScriptSync(message, out);
                } finally {
                    callback.done(false); // false for async
                }
            }
        });
        t.start();
    }

    @Override
    public boolean process(Exchange exchange, AsyncCallback asyncCallback) {
        asyncProcess(exchange, asyncCallback);
        return false; // false for async
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        AsyncProcessorHelper.process(this, exchange); //Wrap synchronous invocations
    }
}
