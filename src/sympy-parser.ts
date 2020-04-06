import { unquote } from "./utils";

export abstract class SympyBaseToken {

}

export abstract class SympyToken extends SympyBaseToken {
  readonly type: string;
  constructor(func: string) {
    super();
    this.type = func;
  }
  abstract accept<T>(visitor: SympyTokenVisitor<T>): T
}

export abstract class SympyContainer extends SympyToken {
  readonly args: SympyToken[];

  constructor(name: string, args: SympyToken[]) {
    super(name);
    this.args = args;
  }
}

export class SympyFunction extends SympyContainer {
  constructor(name: string, args: SympyToken[]) {
    super(name, args);
  }
  accept<T>(visitor: SympyTokenVisitor<T>): T {
    return visitor.visitFunction(this);
  }
}
//It is not supported by the parser. For now I think Sympy never returns this structure, but it can accept it as argument
export class SympyMethod extends SympyContainer {
  readonly method: string;
  readonly object: SympyToken;

  constructor(obj: SympyToken, name: string, args: SympyToken[]) {
    super("$Method", args);
    this.object = obj;
    this.method = name;
  }
  accept<T>(visitor: SympyTokenVisitor<T>): T {
    return visitor.visitMethod(this);
  }
}

export class SympyUserFunction extends SympyContainer {
  readonly name: string;

  constructor(name: string, args: SympyToken[]) {
    super("Function", args);
    this.name = name;
  }
  accept<T>(visitor: SympyTokenVisitor<T>): T {
    return visitor.visitUserFunction(this);
  }
}

export class SympyArray extends SympyContainer {
  readonly square: boolean;

  constructor(args: SympyToken[], square: boolean) {
    super("$Array", args);
    this.square = square;
  }

  accept<T>(visitor: SympyTokenVisitor<T>): T {
    return visitor.visitArray(this);
  }
}

export class SympyString extends SympyToken {
  private v: string = "";

  constructor(s?: string) {
    super("$String");
    if (s) {
      this.v = s;
    }
  }

  append(s: string) {
    this.v += s;
  }

  get value(): string {
    return this.v;
  }

  accept<T>(visitor: SympyTokenVisitor<T>): T {
    return visitor.visitString(this);
  }
}

export interface SympyTokenVisitor<T> {
  visitMethod(m: SympyMethod): T;
  visitUserFunction(uf: SympyUserFunction): T;
  visitFunction(f: SympyFunction): T;
  visitString(s: SympyString): T;
  visitArray(a: SympyArray): T;
}

export class SympyStringify implements SympyTokenVisitor<string> {

  static readonly instance = new SympyStringify();

  visitFunction(f: SympyFunction): string {
    return f.type + "(" + (f.args.map(a => a.accept(this))).join(",") + ")";
  }
  visitString(s: SympyString): string {
    return s.value;
  }
  visitArray(a: SympyArray): string {
    if (a.square) {
      return "[" + (a.args.map(arg => arg.accept(this))).join(",") + "]";
    }
    else {
      return "(" + (a.args.map(arg => arg.accept(this))).join(",") + ")";
    }
  }
  visitUserFunction(uf: SympyUserFunction): string {
    return "Function(" + uf.name + ")(" + uf.args.map(a => a.accept(this)).join(",") + ")";
  }

  visitMethod(m: SympyMethod): string {
    return "(" + m.object.accept(this) + ")." + m.method
      + (m.args.length > 0 ? ("(" + m.args.map(a => a.accept(this)).join(",") + ")") : "");
  }

}

abstract class SympyServiceToken extends SympyBaseToken {

}

class SympyOpenRound extends SympyServiceToken {

}

class SympyOpenSquared extends SympyServiceToken {

}



//FIXME: do not parse within '' !!!!
class SympyParser {

  private readonly stack: SympyBaseToken[] = [];
  private currentString: SympyString = null;
  private inQuote = false;

  private push(token: SympyBaseToken) {
    this.stack.push(token);
    if (token instanceof SympyString) {
      this.currentString = token;
    }
    else {
      this.currentString = null;
    }
  }

  parse(input: string): SympyToken[] {
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if(this.inQuote) {
        //treat all the symbols as part of string
        this.currentString.append(ch);
        if(ch === "'") {
          this.inQuote = false;
        }
        continue;
      }
      else {
        if(ch === "'") {
          this.inQuote = true;
          //go further to start the new string
        }
      }

      switch (ch) {
        case "(":
          this.push(new SympyOpenRound());
          break;
        case "[":
          this.push(new SympyOpenSquared());
          break;
        case ",":
          this.currentString = null;
          break;


        case ")":
          {
            const args: SympyToken[] = [];
            for (; ;) {
              const token = this.stack.pop();
              if (token instanceof SympyToken) {
                args.unshift(token);
              }
              else {
                if (token instanceof SympyOpenRound) {
                  //end
                  const name = this.stack.pop();
                  if (name instanceof SympyString) {
                    const f = new SympyFunction(name.value, args);
                    this.push(f);
                  }
                  else {
                    if (name) {
                      //push it back
                      this.push(name);
                    }
                    const a = new SympyArray(args, false);
                    this.push(a);
                  }
                  break;
                }
                else {
                  throw new Error("Unexpected token: " + JSON.stringify(token));
                }
              }
            }
          }
          break;
        case "]":
          {
            const args: SympyToken[] = [];
            for (; ;) {
              const token = this.stack.pop();
              if (token instanceof SympyToken) {
                args.unshift(token);
              }
              else {
                if (token instanceof SympyOpenSquared) {
                  //end
                  const a = new SympyArray(args, true);
                  this.push(a);
                  break;
                }
                else {
                  throw new Error("Unexpected token: " + JSON.stringify(token));
                }
              }
            }
          }
          break;
        case " ":
        case "\t":
        case "\n":
        case "\r":
          //ignore
          break;
        default:
          if (!this.currentString) {
            this.push(new SympyString());
          }
          this.currentString.append(ch);
          break;

      }
    }


    let broken = false;

    const ret = this.stack.map(el => {
      if (el instanceof SympyToken) {
        return el;
      }
      else {
        broken = true;
      }
    })

    if (!broken) {
      return ret;
    }
    else {
      throw new Error("Invalid expression:" + JSON.stringify(this.stack));
    }

  }

}

class UserFunctionProcessor implements SympyTokenVisitor<void> {

  static readonly instance = new UserFunctionProcessor();

  visitUserFunction(uf: SympyUserFunction): void {
    this.processArray(uf.args);
  }
  visitFunction(f: SympyFunction): void {
    this.processArray(f.args);
  }
  visitString(s: SympyString): void {
  }
  visitArray(a: SympyArray): void {
    this.processArray(a.args);
  }

  visitMethod(m: SympyMethod): void {
    this.processArray(m.args);
  }

  processArray(args: SympyToken[]) {
    for (let i = 0; i < args.length; i++) {
      const userFunc: SympyUserFunction = this.asUserFunction(args[i], i + 1 < args.length ? args[i + 1] : null);
      if (userFunc) {
        args[i] = userFunc;
        if (userFunc.args.length > 0) {
          this.shift(args, i + 1);
        }
      }
    }
    for (const a of args) {
      a.accept(this);
    }
  }

  asUserFunction(first: SympyToken, second: SympyToken | null): SympyUserFunction {
    if (first instanceof SympyFunction && first.type === 'Function') {
      if (first.args.length === 1) {
        const theArg = first.args[0];
        if (theArg instanceof SympyString) {
          const userFunctionName = unquote(theArg.value);

          if (second) {
            if (second instanceof SympyArray) {
              return new SympyUserFunction(userFunctionName, second.args);
            }
          }
          else {
            return new SympyUserFunction(userFunctionName, []);
          }

        }
      }
    }
  }

  shift(args: SympyToken[], index: number) {
    for (let i = index; i < args.length - 1; i++) {
      args[i] = args[i + 1];
    }
    //remove last element
    args.pop();
  }

}



function processUserFunctions(tokens: SympyToken[]): SympyToken[] {

  UserFunctionProcessor.instance.processArray(tokens);

  return tokens;
}

export function rawParseSympyExpression(expression: string): SympyToken[] {
  return new SympyParser().parse(expression);
}

export function parseSympyExpression(expression: string): SympyToken {
  const tokens = new SympyParser().parse(expression);
  const processed = processUserFunctions(tokens);
  if (processed.length === 1) {
    return processed[0];
  }
  throw new Error("More than one token as result: " + JSON.stringify(processed));

}