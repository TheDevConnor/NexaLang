import Parser from "./FrontEnd/parser.ts";
import Environment from "./Runtime/environments.ts";
import { evaluate } from "./Runtime/interpreter.ts";
//import { NumberVal } from "./Runtime/values.ts";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./Runtime/values.ts";

repl();

function repl() {
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("x", MK_NUMBER(100));
    env.declareVar("true", MK_BOOL(true));
    env.declareVar("false", MK_BOOL(false));
    env.declareVar("null", MK_NULL());

    console.log("\nNexa Repl v0.1");

    while (true) {
        const input = prompt("nexa > ");

        //check for no user input or exit keyword
        if (input == null || input.includes("exit")) {
            Deno.exit(1);
        }

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}