package eu.estcube.scriptengine.groovy.transform;

import eu.estcube.scriptengine.base.State;
import org.codehaus.groovy.ast.ASTNode;
import org.codehaus.groovy.ast.ClassNode;
import org.codehaus.groovy.ast.Parameter;
import org.codehaus.groovy.ast.expr.*;
import org.codehaus.groovy.ast.stmt.ExpressionStatement;
import org.codehaus.groovy.ast.stmt.Statement;
import org.codehaus.groovy.control.CompilePhase;
import org.codehaus.groovy.control.SourceUnit;
import org.codehaus.groovy.control.messages.LocatedMessage;
import org.codehaus.groovy.syntax.Token;
import org.codehaus.groovy.transform.ASTTransformation;
import org.codehaus.groovy.transform.GroovyASTTransformation;

import java.lang.reflect.Modifier;
import java.util.List;
import java.util.ListIterator;

/**
 * This class transforms syntatic sugar state declaration to a normal OOP Class, which will extend {@link State}.
 *
 * For example:
 * <pre>{@code
 * state(Test) {
 *   println "Hello"
 * }
 * }</pre>
 * transforms into
 * <pre>{@code
 * class Test extends State {
 *     def run() {
 *         println "Hello"
 *     }
 * }
 * }</pre>
 * automatically.
 */
@GroovyASTTransformation(phase = CompilePhase.CONVERSION)
public class SimpleStateTransformer implements ASTTransformation {
    private static boolean isStateDeclaration(MethodCallExpression call) {
        Expression method = call.getMethod();
        if (!(method instanceof ConstantExpression)) return false;
        if (!("state".equals(method.getText()))) return false;

        return true;
    }

    private static Token simpleOffsetToken(Expression expr, int offset) {
        return Token.newString(expr.getText(), expr.getLineNumber(), expr.getColumnNumber() + offset);
    }
    private static Token simpleToken(Expression expr) {
        return simpleOffsetToken(expr, 0);
    }
    private static LocatedMessage checkSyntaxDeclValidity(MethodCallExpression call, SourceUnit sourceUnit) {
        Expression args = call.getArguments();
        if (args == null)
            return new LocatedMessage("State identifier expected", simpleToken(call), sourceUnit);

        if (!(args instanceof ArgumentListExpression))
            return new LocatedMessage("State identifier expected", simpleToken(args), sourceUnit);

        List<Expression> expressions = ((ArgumentListExpression) args).getExpressions();

        if (expressions.size() < 1)
            return new LocatedMessage("State identifier expected", simpleToken(args), sourceUnit);

        Expression firstExpr = expressions.get(0);
        if (!(firstExpr instanceof VariableExpression))
            return new LocatedMessage("State identifier expected. Got " + firstExpr, simpleToken(firstExpr), sourceUnit);

        if (expressions.size() < 2)
            return new LocatedMessage("State body expected", simpleOffsetToken(firstExpr, firstExpr.getText().length()), sourceUnit);

        Expression sndExpr = expressions.get(1);
        if (!(sndExpr instanceof ClosureExpression))
            return new LocatedMessage("State body expected. Got " + sndExpr, simpleToken(sndExpr), sourceUnit);

        return null;
    }

    @Override
    public void visit(ASTNode[] astNodes, SourceUnit sourceUnit) {
        ListIterator<Statement> stmtIter = sourceUnit.getAST().getStatementBlock().getStatements().listIterator();

        for (Statement stmt = null; stmtIter.hasNext(); stmt = stmtIter.next()) {
            if (!(stmt instanceof ExpressionStatement)) continue;

            Expression expr = ((ExpressionStatement)stmt).getExpression();
            if (!(expr instanceof MethodCallExpression)) continue;

            MethodCallExpression call = (MethodCallExpression) expr;
            if (isStateDeclaration(call)) {
                try {
                    LocatedMessage err = checkSyntaxDeclValidity(call, sourceUnit);
                    if (err != null) {
                        sourceUnit.getErrorCollector().addError(err);
                        continue;
                    }
                }
                finally {
                    stmtIter.remove();
                }

                ArgumentListExpression args = ((ArgumentListExpression) call.getArguments());
                String stateName = ((VariableExpression) args.getExpression(0)).getName();
                Statement body = ((ClosureExpression) args.getExpression(1)).getCode();

                ClassNode node = new ClassNode(stateName, Modifier.PUBLIC, new ClassNode(State.class));
                node.addMethod("run", Modifier.PUBLIC, new ClassNode(Object.class), Parameter.EMPTY_ARRAY, ClassNode.EMPTY_ARRAY, body);

                sourceUnit.getAST().addClass(node);
            }
        }
    }
}
