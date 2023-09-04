import { RuntimeVal, NumberVal, MK_NULL } from "./values.ts";
import { BinaryExpr, Identifier, /*NodeType,*/ NumericLiteral, Program, Statement } from "../FrontEnd/ast.ts";
import Environment from "./environments.ts";

function eval_program_expr(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

function eval_numerical_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let results: number;

    if (operator == "+") {
        results = lhs.value + rhs.value;
    }
    else if (operator == "-") {
        results = lhs.value - rhs.value;
    }
    else if (operator == "*") {
        results = lhs.value * rhs.value;
    }
    else if (operator == "/") {
        //TODO: Division by zero checks
        results = lhs.value / rhs.value;
    }
    else {
        results = lhs.value % rhs.value;
    }

    return { value: results, type: "number" };
}

function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numerical_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    return MK_NULL();
}

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val =  env.lookupVar(ident.symbol);
    
    return val;
}

export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral": 
            return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberVal;
        
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        
        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);
        
        case "Program":
            return eval_program_expr(astNode as Program, env);

        default: 
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            Deno.exit(1);
    }
}