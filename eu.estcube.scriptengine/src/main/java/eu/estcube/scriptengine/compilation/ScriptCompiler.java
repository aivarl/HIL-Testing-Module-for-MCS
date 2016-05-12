package eu.estcube.scriptengine.compilation;

import com.google.common.io.Files;
import eu.estcube.scriptengine.base.Responses;
import eu.estcube.scriptengine.base.ScriptBase;
import eu.estcube.scriptengine.groovy.BytecodeSpewingClassloader;
import eu.estcube.scriptengine.groovy.transform.InnerClassWrapperTransformer;
import eu.estcube.scriptengine.groovy.transform.SimpleStateTransformer;
import groovy.lang.GroovyShell;
import groovy.transform.TypeChecked;
import org.codehaus.groovy.control.CompilerConfiguration;
import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;
import org.codehaus.groovy.control.customizers.ImportCustomizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;

/**
 * Instance of a script. Handles compilation and execution of a mcsscript file.
 */
public class ScriptCompiler {
    private static final Logger LOG = LoggerFactory.getLogger(ScriptCompiler.class);

    private final String code;

    private boolean shouldBeTypeChecked = true;
    private boolean shouldSpewBytecode = false;

    private ScriptCompiler(String code) {
        this.code = code;
    }

    public ScriptBase compile() throws ScriptCompilationError {
        CompilerConfiguration compilerConfiguration = new CompilerConfiguration();

        // Note: order of ast transformers matters
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(new SimpleStateTransformer()));
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(
                new InnerClassWrapperTransformer()));

        // TODO add a type checking extension to check for eg. send command name
        // and parameters
        // (http://blog.andresteingress.com/2013/01/25/groovy-2-1-type-checking-extensions/)
        if (shouldBeTypeChecked) {
            compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(TypeChecked.class));
        }

        compilerConfiguration.addCompilationCustomizers(
                new ImportCustomizer().addStarImports("eu.estcube.scriptengine.base")
                        .addStaticStars(Responses.class.getName()));

        GroovyShell shell = new GroovyShell(compilerConfiguration);

        ClassLoader scriptClassLoader;
        if (isShouldSpewBytecode()) {
            scriptClassLoader = BytecodeSpewingClassloader.enableFor(shell);
        } else {
            scriptClassLoader = shell.getClassLoader();
        }

        try {
            shell.parse(code);
            return (ScriptBase) scriptClassLoader.loadClass("MCSScript").newInstance();
        } catch (Exception e) {
            throw new ScriptCompilationError("", e);
        }
    }

    public boolean isShouldSpewBytecode() {
        return shouldSpewBytecode;
    }

    public ScriptCompiler setShouldSpewBytecode(boolean shouldSpewBytecode) {
        this.shouldSpewBytecode = shouldSpewBytecode;
        return this;
    }

    public boolean shouldBeTypeChecked() {
        return shouldBeTypeChecked;
    }

    public ScriptCompiler setShouldBeTypeChecked(boolean shouldBeTypeChecked) {
        this.shouldBeTypeChecked = shouldBeTypeChecked;
        return this;
    }

    public static ScriptCompiler from(String s) {
        return new ScriptCompiler(s);
    }

    public static ScriptCompiler from(File f) throws IOException {
        return new ScriptCompiler(Files.toString(f, Charset.forName("UTF-8")));
    }
}
