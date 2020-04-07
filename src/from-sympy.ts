
/**
 * @hidden
 * @packageDocumentation
 */
import { SympyToken, SympyStringify, SympyTokenVisitor, SympyMethod, SympyFunction, SympyString, SympyArray, SympyUserFunction } from "./sympy-parser";
import { getSympyTrigName, unquote } from "./utils";
import { LettersUtils, GreekLetters, MathNode, MathStructure, MathNumber, MathUnaryMinus, MathDivision, MathOr, MathAnd, MathEquality, MathEqualityType, MathPoint, MathSquareRoot, MathRoot, MathPower, MathMinus, MathPlus, MathImplicitMultiply, MathMultiply, MathAbs, MathBracketsType, MathInterval, MathTrigonometryType, MathTrigonometricFunction, MathLogarithm, MathNaturalLogarithm, MathMin, MathMax, MathSum, MathProduct, MathIncludeSet, MathNumericSet, MathNumericSetValues, MathLimitType, MathLimit, MathIndefiniteIntegral, MathAreaIntegral, MathDefiniteIntegral, MathDeterminant, MathPiecewiseFunction, MathExpressionSet, MathUnion, MathIntersection, MathLeibnizDerivative, MathLeibnizDerivativeType, MathDerivative, MathDerivativeType, MathEmptySet, MathConstant, MathConstants, MathUndefined, MathFunction, MathVariable } from "semantic-math-editor";
import { UnsupportedSympyConstruction } from "./model";



export function fromSympy(sympyToken: SympyToken): MathNode {
  try {
    return sympyToken.accept(SympyResponseTranslator.instance);
  }
  catch (e) {
    if(e instanceof UnsupportedSympyConstruction) {
      e.wholeExpression = sympyToken;
    }
    throw e;
  }
}

function str(t: SympyToken): string {
  if (t instanceof SympyString) {
    return t.value;
  }
  throw new Error("Expected string at: " + t.accept(SympyStringify.instance));
}

function bool(t: SympyToken): boolean {
  if (t instanceof SympyString) {
    return t.value === 'true';
  }
  throw new Error("Expected string at: " + t.accept(SympyStringify.instance));
}

function mathNumber(t: SympyToken): MathStructure {
  if (t instanceof SympyString) {
    const val = unquote(t.value);
    if (val[0] === "-") {
      const n = new MathNumber(val.substring(1));
      return new MathUnaryMinus(n);
    }
    else {
      return new MathNumber(val);
    }
  }
  throw new Error("Expected string at: " + t.accept(SympyStringify.instance));
}


const functionProcessors = new Map<string, (args: SympyToken[], visitor: SympyResponseTranslator) => MathStructure>();


functionProcessors.set("Integer", (args, visitor) => {
  return mathNumber(args[0]);
})

functionProcessors.set("Float", (args, visitor) => {
  return mathNumber(args[0]);
})

functionProcessors.set("Rational", (a, v) => {
  let numerator = unquote(str(a[0]));
  let denominator = unquote(str(a[1]));

  let minus = false;

  if (numerator.startsWith("-")) {
    minus = !minus;
    numerator = numerator.substring(1);
  }
  if (denominator.startsWith("-")) {
    minus = !minus;
    denominator = denominator.substring(1);
  }

  const ratio = new MathDivision(new MathNumber(numerator), new MathNumber(denominator));

  if (minus) {
    return new MathUnaryMinus(ratio);
  }
  else {
    return ratio;
  }

})

functionProcessors.set("Or", (args, visitor) => {
  return new MathOr(visitor.accept(args[0]), visitor.accept(args[1]));
})
functionProcessors.set("And", (args, visitor) => {
  return new MathAnd(visitor.accept(args[0]), visitor.accept(args[1]));
})

functionProcessors.set("Equality", (a, v) => {
  return new MathEquality(MathEqualityType.equals, v.accept(a[0]), v.accept(a[1]));
})
functionProcessors.set("Unequality", (a, v) => {
  return new MathEquality(MathEqualityType.notEquals, v.accept(a[0]), v.accept(a[1]));
})
functionProcessors.set("GreaterThan", (a, v) => {
  return new MathEquality(MathEqualityType.greaterOrEquals, v.accept(a[0]), v.accept(a[1]));
})
functionProcessors.set("LessThan", (a, v) => {
  return new MathEquality(MathEqualityType.lessOrEquals, v.accept(a[0]), v.accept(a[1]));
})
functionProcessors.set("StrictLessThan", (a, v) => {
  return new MathEquality(MathEqualityType.lessThan, v.accept(a[0]), v.accept(a[1]));
})
functionProcessors.set("StrictGreaterThan", (a, v) => {
  return new MathEquality(MathEqualityType.greaterThan, v.accept(a[0]), v.accept(a[1]));
})

functionProcessors.set("Point2D", (a, v) => {
  return new MathPoint(v.join(a));
})

functionProcessors.set("Point3D", (a, v) => {
  return new MathPoint(v.join(a));
})

functionProcessors.set("Pow", (a, v) => {
  const base = v.accept(a[0]);

  const sympy_exp = a[1];
  //replace x^(1/2) with sqrt(x), same for roots of other degrees
  if (sympy_exp instanceof SympyFunction) {
    if (sympy_exp.type === "Rational") {
      const exp_numerator = sympy_exp.args[0];
      const exp_denominator = sympy_exp.args[1];

      if (exp_numerator instanceof SympyString && exp_denominator instanceof SympyString) {
        if (exp_numerator.value === "1") {
          //It is root
          if (exp_denominator.value === "2") {
            //square root
            return new MathSquareRoot(base);
          }
          else {
            //general root
            if (exp_denominator instanceof SympyString) {
              return new MathRoot(base, mathNumber(exp_denominator));
            }
          }
        }
      }
    }
    //replace x^-1 with 1/x
    if (sympy_exp.type === "Integer") {
      const sympy_exp_value = sympy_exp.args[0];
      if (sympy_exp_value instanceof SympyString) {
        if (sympy_exp_value.value === "-1") {
          //Division
          return new MathDivision(new MathNumber("1"), base);
        }
      }
    }

  }
  return new MathPower(base, v.accept(sympy_exp));
})

functionProcessors.set("Add", (a, v) => {
  //Plus or Minus
  const first = v.accept(a[0]);
  const second = v.accept(a[1]);
  //replace x+ -y with x-y
  if (second instanceof MathUnaryMinus) {
    return new MathMinus(first, second.expression);
  }
  else {
    return new MathPlus(first, second);
  }
})

functionProcessors.set("Mul", (a, v) => {
  const first = v.accept(a[0]);
  const second = v.accept(a[1]);

  //replace x* (1/y) with x/y
  if (second instanceof MathDivision) {
    if (second.numerator instanceof MathNumber && second.numerator.value === "1") {
      return new MathDivision(first, second.denominator);
    }
  }
  //replace (1/y)*x with x/y
  if (first instanceof MathDivision) {
    if (first.numerator instanceof MathNumber && first.numerator.value === "1") {
      return new MathDivision(second, first.denominator);
    }
  }

  //replace 3*x with 3x
  if (first instanceof MathNumber) {
    return new MathImplicitMultiply(first, second);
  }

  return new MathMultiply(first, second);

})



functionProcessors.set("Abs", (a, v) => {
  return new MathAbs(v.accept(a[0]));
})

functionProcessors.set("Interval", (a, v) => {
  const left = v.accept(a[0]);
  const right = v.accept(a[1]);
  const openLeft = a.length > 2 ? bool(a[2]) : false;
  const openRight = a.length > 3 ? bool(a[3]) : false;

  let t: MathBracketsType;

  if (openLeft) {
    if (openRight) {
      t = MathBracketsType.open;
    }
    else {
      t = MathBracketsType.rightClosed;
    }
  }
  else {
    if (openRight) {
      t = MathBracketsType.leftClosed;
    }
    else {
      t = MathBracketsType.closed;
    }
  }

  return new MathInterval(t, left, right);
})

//Trigonometry
for (const t of Object.keys(MathTrigonometryType)) {
  const key = MathTrigonometryType[t] as MathTrigonometryType;

  functionProcessors.set(getSympyTrigName(key), (a, v) => {
    return new MathTrigonometricFunction(key, v.accept(a[0]));
  });
}

functionProcessors.set("log", (a, v) => {
  const operand = v.accept(a[0]);
  if (a.length > 1) {
    return new MathLogarithm(v.accept(a[1]), operand);
  }
  else {
    return new MathNaturalLogarithm(operand);
  }
})

functionProcessors.set("Min", (a, v) => {
  return new MathMin(v.join(a));
})

functionProcessors.set("Max", (a, v) => {
  return new MathMax(v.join(a));
})

functionProcessors.set("Sum", (a, v) => {
  const seq = v.accept(a[0]);
  const tuple = a[1];
  if (tuple instanceof SympyFunction && tuple.type === "Tuple") {
    const index = v.accept(tuple.args[0]);
    const lower_b = v.accept(tuple.args[1]);
    const upper_b = v.accept(tuple.args[2]);

    return new MathSum(seq, index, lower_b, upper_b);
  }
  else {
    for (const arg of a) {
      console.log(arg.accept(SympyStringify.instance));
    }
    throw new Error("^ Bad sum ^");
  }
})

functionProcessors.set("Product", (a, v) => {
  const seq = v.accept(a[0]);
  const tuple = a[1];
  if (tuple instanceof SympyFunction && tuple.type === "Tuple") {
    const index = v.accept(tuple.args[0]);
    const lower_b = v.accept(tuple.args[1]);
    const upper_b = v.accept(tuple.args[2]);

    return new MathProduct(seq, index, lower_b, upper_b);
  }
  else {
    for (const arg of a) {
      console.log(arg.accept(SympyStringify.instance));
    }
    throw new Error("^ Bad prod ^");
  }
})

functionProcessors.set("Contains", (a, v) => {
  const fexp = v.accept(a[0]);
  const set = v.accept(a[1]);
  return new MathIncludeSet(fexp, set);
})

//it is a kind of hack for Complexes(ProductSet(Reals,Reals),false)) 
//ComplexRegion(ProductSet(Reals,Reals),false)
const complexFunc: (a: SympyToken[], v: SympyResponseTranslator) => MathStructure = (a, v) => {
  const arg = a[0];
  if (arg instanceof SympyFunction && arg.type === "ProductSet") {
    if (arg.args.length != 2) {
      throw new Error("Usupported complexes: " + a.map(arg => arg.accept(SympyStringify.instance)).join(","));
    }
    for (const r of arg.args) {
      if (!(r instanceof SympyString) || !(r.value === "Reals")) {
        throw new Error("Usupported complexes: " + a.map(arg => arg.accept(SympyStringify.instance)).join(","));
      }
    }
    return new MathNumericSet(MathNumericSetValues.C);
  }

}
functionProcessors.set("Complexes", ()=>new MathNumericSet(MathNumericSetValues.C));
functionProcessors.set("ComplexRegion", complexFunc);

functionProcessors.set("Limit", (a, v) => {

  let type = MathLimitType.unspecified;

  if (a.length > 3) {
    const symbol = a[3] as SympyFunction;
    if (symbol && symbol.type === "Symbol") {
      const plusOrMinus = str(symbol.args[0]);
      if (plusOrMinus === "'+'") {
        type = MathLimitType.right;
      }
      else if (plusOrMinus === "'-'") {
        type = MathLimitType.left;
      }
    }
  }
  return new MathLimit(v.accept(a[0]), v.accept(a[1]), v.accept(a[2]), type);
});

functionProcessors.set("Integral", (a, v) => {
  const expression = v.accept(a[0]);
  const second = a[1];
  if (second instanceof SympyFunction && second.type === "Tuple") {
    const diff = second.args[0];
    if (second.args.length === 1) {
      return new MathIndefiniteIntegral(expression, v.accept(diff));
    } else if (second.args.length === 2) {
      return new MathAreaIntegral(expression, v.accept(diff), v.accept(second.args[1]));
    }
    else {
      return new MathDefiniteIntegral(expression, v.accept(diff), v.accept(second.args[1]), v.accept(second.args[2]))
    }
  }
  else {
    return new MathIndefiniteIntegral(expression, v.accept(second));
  }
})

const matrixFunc: (a: SympyToken[], v: SympyResponseTranslator) => MathStructure = (a, v) => {
  const elements: MathStructure[][] = [];

  const arg = a[0];

  if (arg instanceof SympyArray) {
    for (const row of arg.args) {
      if (row instanceof SympyArray) {
        const retRow = v.join(row.args);
        elements.push(retRow);
      }
    }
    return new MathDeterminant(elements);
  }
}
functionProcessors.set("ImmutableDenseMatrix", matrixFunc);
functionProcessors.set("MutableDenseMatrix", matrixFunc);
functionProcessors.set("Matrix", matrixFunc);


//Piecewise(ExprCondPair(Symbol('x'),StrictGreaterThan(Symbol('x'),Integer(0))),ExprCondPair(Integer(2),true))
functionProcessors.set("Piecewise", (a, v) => {
  let elements: MathStructure[] = [];
  let predicates: MathStructure[] = [];
  for (const arg of a) {
    if (arg instanceof SympyFunction && arg.type === "ExprCondPair") {
      const e = v.accept(arg.args[0]);
      const p = v.accept(arg.args[1]);
      elements.push(e);
      predicates.push(p);
    }
  }
  return new MathPiecewiseFunction(elements, predicates);
})

functionProcessors.set("Heaviside", (a, v) => {
  return new MathPiecewiseFunction(
    [
      new MathNumber("0"),
      new MathNumber("1")
    ],
    [
      new MathEquality(MathEqualityType.lessThan, v.accept(a[0]), new MathNumber("0")),
      new MathEquality(MathEqualityType.greaterOrEquals, v.accept(a[0]), new MathNumber("0"))
    ]);
})

//TODO: AccumBounds(-pi/2,pi/2) - both, range and accumbounds are represented as a Set. Not a great deal.
functionProcessors.set("AccumBounds", (a, v) => {
  
  return new MathExpressionSet([mathNumber(a[0]),mathNumber(a[1])]);
})

functionProcessors.set("Union", (a, v) => {
  return new MathUnion(v.accept(a[0]), v.accept(a[1]));
})

functionProcessors.set("Intersection", (a, v) => {
  return new MathIntersection(v.accept(a[0]), v.accept(a[1]));
})

functionProcessors.set("Derivative", (a, v) => {
  const expression = v.accept(a[0]);

  if (a.length > 1) {

    const varAndDegree = a[1];

    if (varAndDegree instanceof SympyFunction) {
      if (varAndDegree.type === 'Tuple') {
        //tuple with var and degree
        const variable = varAndDegree.args[0];
        const degree = varAndDegree.args[1];

        const n = v.accept(degree) as MathNumber;

        return new MathLeibnizDerivative(Number.parseInt(n.value), expression, v.accept(variable), MathLeibnizDerivativeType.basic);
      }
      else {
        //just var
        return new MathLeibnizDerivative(1, expression, v.accept(varAndDegree), MathLeibnizDerivativeType.withParentheses);
      }
    }
  }
  else {
    return new MathDerivative(expression, 1, MathDerivativeType.prime);
  }

})

functionProcessors.set("Symbol", (a, v) => {
  return v.variableToMathStructure(unquote(str(a[0])));
})
functionProcessors.set("EmptySet", (a, v) => {
  return new MathEmptySet();
})

functionProcessors.set("Range", (a, v) => {
  const nodes: MathStructure[] = a.map((arg) => {
    if (arg instanceof SympyString) {
      return mathNumber(arg);
    }
    else {
      return v.accept(arg);
    }
  });
  return new MathExpressionSet(nodes);
})

functionProcessors.set("exp", (a, v) => {
  return new MathPower(new MathConstant(MathConstants.e), v.accept(a[0]));
})


const stringProcessors = new Map<string, (visitor: SympyResponseTranslator) => MathStructure>();

stringProcessors.set("nan", (v) => {
  return new MathUndefined();
});

stringProcessors.set("I", (v) => {
  return new MathConstant(MathConstants.imaginaryUnit);
});

stringProcessors.set("zoo", (v) => {
  return new MathConstant(MathConstants.complexInfinity);
});

stringProcessors.set("oo", (v) => {
  return new MathConstant(MathConstants.infinity);
});
stringProcessors.set("pi", (v) => {
  return new MathConstant(MathConstants.pi);
});
stringProcessors.set("E", (v) => {
  return new MathConstant(MathConstants.e);
});
stringProcessors.set("-E", (v) => {
  return new MathUnaryMinus(new MathConstant(MathConstants.e));
});
stringProcessors.set("-oo", (v) => {
  return new MathUnaryMinus(new MathConstant(MathConstants.infinity));
});
stringProcessors.set("-pi", (v) => {
  return new MathUnaryMinus(new MathConstant(MathConstants.pi));
});

stringProcessors.set("Naturals", (v) => {
  return new MathNumericSet(MathNumericSetValues.N);
});
stringProcessors.set("Complexes", (v) => {
  return new MathNumericSet(MathNumericSetValues.C);
});
stringProcessors.set("Reals", (v) => {
  return new MathNumericSet(MathNumericSetValues.R);
});
stringProcessors.set("Integers", (v) => {
  return new MathNumericSet(MathNumericSetValues.Z);
});
stringProcessors.set("true", (v) => {
  return new MathNumber("1");
});
stringProcessors.set("false", (v) => {
  return new MathNumber("0");
});
stringProcessors.set("EmptySet", (v) => {
  return new MathEmptySet();
});


class SympyResponseTranslator implements SympyTokenVisitor<MathStructure>{

  static readonly instance = new SympyResponseTranslator();

  join(args: SympyToken[]): MathStructure[] {
    const self = this;
    return args.map(a => a.accept(self));
  }

  accept(arg: SympyToken): MathStructure {
    return arg.accept(this);
  }

  visitMethod(m: SympyMethod): MathStructure {
    throw new Error("Method in sumpy respone: " + m.accept(SympyStringify.instance));
  }

  visitUserFunction(uf: SympyUserFunction): MathStructure {
    const operator = this.variableToMathStructure(uf.name);
    return new MathFunction(operator, this.join(uf.args));
  }

  visitFunction(f: SympyFunction): MathStructure {
    const processor = functionProcessors.get(f.type);
    if (processor) {
      return processor(f.args, this);
    }
    else {
      throw new UnsupportedSympyConstruction(f.type, "Unknown function: " + f.accept(SympyStringify.instance));
    }
  }
  visitString(s: SympyString): MathStructure {
    const processor = stringProcessors.get(s.value);
    if (processor) {
      return processor(this);
    }
    else {
      throw new UnsupportedSympyConstruction(s.value, "Unknown string: " + s.value);
    }
  }
  visitArray(a: SympyArray): MathStructure {
    throw new Error("Standalone array found: " + a.accept(SympyStringify.instance));
  }

  variableToMathStructure(name: string): MathVariable {
    const parts = name.split("_");
    const base = parts[0];

    const greek = LettersUtils.getByValue(base, GreekLetters) as GreekLetters;

    const indexes: MathStructure[] = parts.length == 1 ? undefined : [];

    for (let i = 1; i < parts.length; i++) {
      const index = this.variableToMathStructure(parts[i]);
      indexes.push(index);
    }

    return new MathVariable(base, !!greek, indexes);
  }


}