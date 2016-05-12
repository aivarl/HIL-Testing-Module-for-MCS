package eu.estcube.scriptengine.groovy.transform;

import eu.estcube.scriptengine.base.ScriptBase;
import org.codehaus.groovy.ast.*;
import org.codehaus.groovy.control.CompilePhase;
import org.codehaus.groovy.control.SourceUnit;
import org.codehaus.groovy.transform.ASTTransformation;
import org.codehaus.groovy.transform.GroovyASTTransformation;
import org.codehaus.groovy.transform.trait.Traits;

import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Subclasses created in Groovy scripts do not have access to variables and methods in the top-level
 * script, which means that normally scripts that need classes need to use static methods to communicate
 * with the scripting engine.
 *
 * To bypass this limitation in MCSScript, we create a "wrapper" class to which all members of the script
 * (including classes declared) are stuffed. This allows us to use classes for states but still be able
 * to access script engine context virtually, not statically.
 */
@GroovyASTTransformation(phase = CompilePhase.CONVERSION)
public class InnerClassWrapperTransformer implements ASTTransformation {
    public static final String SCRIPT_CLASSNAME = "MCSScript";
    public static final String DOLLAR = "$";

    @Override
    public void visit(ASTNode[] astNodes, SourceUnit sourceUnit) {
        ModuleNode ast = sourceUnit.getAST();

        // Create the wrapper class
        ClassNode wrapper = new ClassNode(SCRIPT_CLASSNAME, 1, ClassHelper.make(ScriptBase.class));
        wrapper.addInterface(ClassHelper.GROOVY_OBJECT_TYPE);
        ast.addClass(wrapper);

        // Remove all classes from top-level
        List<ClassNode> processNodes = new ArrayList<ClassNode>();
        for (Iterator<ClassNode> it = ast.getClasses().iterator(); it.hasNext();) {
            ClassNode cn = it.next();

            // Don't move the wrapper class we just created inside itself, that'd be silly
            if (cn == wrapper) continue;

            processNodes.add(cn);
            it.remove();
        }

        // Re-add them as inner classes inside our wrapper class
        for (ClassNode proc : processNodes) {
            ClassNode node;

            // Don't convert interfaces or traits into inner classes
            // TODO maybe traits should be converted to have access to methods moved to MCSScript?
            if (proc.isInterface() || Traits.isTrait(proc)) {
                node = proc;
            }
            else {
                InnerClassNode inner = new InnerClassNode(wrapper, SCRIPT_CLASSNAME + DOLLAR + proc.getName(), Modifier.PUBLIC, ClassHelper.OBJECT_TYPE, new ClassNode[] {ClassHelper.GROOVY_OBJECT_TYPE}, MixinNode.EMPTY_ARRAY);

                // TODO find a cleaner way to clone a classnode and clone rest of fields
                inner.setSuperClass(proc.getSuperClass());
                for (MethodNode mn : proc.getMethods()) inner.addMethod(mn);
                for (ClassNode cn : proc.getInterfaces()) inner.addInterface(cn);

                node = inner;
            }

            wrapper.getModule().addClass(node);
        }

        // Copy all fields/methods/code from the script to our generated MCSScript
        for (MethodNode mn : ast.getMethods()) wrapper.addMethod(mn);

        // Create a run method that contains all top-level code in the script
        MethodNode runMethod = new MethodNode("run", 1, ClassHelper.OBJECT_TYPE, Parameter.EMPTY_ARRAY, ClassNode.EMPTY_ARRAY, ast.getStatementBlock());
        wrapper.addMethod(runMethod);
    }
}
