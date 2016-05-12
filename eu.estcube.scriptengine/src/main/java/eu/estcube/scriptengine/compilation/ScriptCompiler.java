package eu.estcube.scriptengine.compilation;

import com.google.common.io.Files;

import eu.estcube.scriptengine.base.Responses;
import eu.estcube.scriptengine.base.ScriptBase;
import eu.estcube.scriptengine.groovy.BytecodeSpewingClassloader;
import eu.estcube.scriptengine.groovy.transform.InnerClassWrapperTransformer;
import eu.estcube.scriptengine.groovy.transform.SimpleStateTransformer;
import eu.estcube.scriptengine.utils.APIMethodTypeCheckerExtension;
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
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * MCSScript script compiler. If default settings are fine, you can use utility method {@link ScriptCompiler#simpleCompile(String)}
 * to get a compiled {@link ScriptBase}.
 */
public class ScriptCompiler {
    private static final Logger LOG = LoggerFactory.getLogger(ScriptCompiler.class);

    private static boolean shouldBeTypeChecked = true;
    private static boolean shouldSpewBytecode = false;

    public ScriptBase compile(String code) throws ScriptCompilationError {
        CompilerConfiguration compilerConfiguration = new CompilerConfiguration();

        // Note: order of ast transformers matters
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(new SimpleStateTransformer()));
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(
                new InnerClassWrapperTransformer()));

        if (shouldBeTypeChecked) {
            Map annotationParams = new HashMap();
            annotationParams.put("extensions", Collections.singletonList(APIMethodTypeCheckerExtension.class.getName()));
            compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(annotationParams, TypeChecked.class));
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

    public static Class<?> compileClass(String code) throws ScriptCompilationError {
        CompilerConfiguration compilerConfiguration = new CompilerConfiguration();

        // Note: order of ast transformers matters
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(new SimpleStateTransformer()));
        compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(
                new InnerClassWrapperTransformer()));

        if (shouldBeTypeChecked) {
            Map annotationParams = new HashMap();
            annotationParams.put("extensions", Collections.singletonList(APIMethodTypeCheckerExtension.class.getName()));
            compilerConfiguration.addCompilationCustomizers(new ASTTransformationCustomizer(annotationParams, TypeChecked.class));
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
            return (Class<ScriptBase>) scriptClassLoader.loadClass("MCSScript");
        } catch (Exception e) {
            throw new ScriptCompilationError("", e);
        }
    }

    public static boolean isShouldSpewBytecode() {
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

    private static final ScriptCompiler SINGLETON = new ScriptCompiler();

    /**
     * Compiles script using default settings (with typechecking)
     * @param s
     * @return
     * @throws ScriptCompilationError
     */
    public static ScriptBase simpleCompile(String s) throws ScriptCompilationError {
        return SINGLETON.compile(s);
    }
    public static ScriptBase simpleCompile(File f) throws IOException, ScriptCompilationError {
        return simpleCompile(Files.toString(f, Charset.forName("UTF-8")));
    }
}
