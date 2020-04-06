
import { SympyFunction, SympyArray, SympyString, SympyStringify, SympyUserFunction, SympyToken, SympyMethod } from "./sympy-parser";

import { getSympyTrigName, getAnyVariable } from "./utils";
import { AcceptableVisitor, MathNodeVisitor, MathNode, acceptMathNode,  MathVariable, MathAbs, MathAnd, MathAreaIntegral, MathBrackets, MathComma, MathUndefined, MathConstant, MathConstants, MathDefiniteIntegral, MathDerivative, MathDeterminant, MathFunctionDifference, MathNodePrinter, MathDifferential, MathDivision, MathEmptySet, MathEquality, MathEqualityType, MathExpressionSet, MathFunction, MathImplicitMultiply, MathIncludeSet, MathIndefiniteIntegral, MathInfimum, MathIntersection, MathInterval, MathBracketsType, MathLeibnizDerivative, MathLimit, MathLimitType, MathLogarithm, MathMax, MathMin, MathMinus, MathMultiply, MathNaturalLogarithm, MathNumber, MathNumericSet, MathNumericSetValues, MathOr, MathParentheses, MathPiecewiseFunction, MathPlaceholder, MathPlus, MathPoint, MathPower, MathPredicate, MathProduct, MathRawText, MathReversedFunction, MathRoot, MathSquareRoot, MathSubIndex, MathSum, MathSupremum, MathSymbol, MathVerticalBar, MathTransformation, MathSet, MathSystemOfEquations, MathTrigonometricFunction, MathUnaryMinus, MathUnion, SemanticErrorDescription, MathValidationUtils } from "semantic-math-editor";



export class InvalidNodeError extends Error {

  readonly error: SemanticErrorDescription;

  constructor(node: MathNode, message: string) {
    super();
    this.error = new SemanticErrorDescription(MathValidationUtils.collectSymbols(node), message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidNodeError.prototype);
  }
}

function symbol(s: string): SympyFunction {
  return new SympyFunction("Symbol", [new SympyString("'" + s + "'")]);
}

export function integer(n: number): SympyFunction {
  return new SympyFunction("Integer", [new SympyString(n.toString())]);
}

function float(n: number): SympyFunction {
  return new SympyFunction("Float", [new SympyString(n.toString())]);
}



export abstract class BaseSymPyVisitor implements MathNodeVisitor<SympyToken>, AcceptableVisitor<SympyToken> {

  accept(node: MathNode): SympyToken {
    return acceptMathNode(node, this);
  }

  join(nodes: MathNode[]): SympyToken[] {
    const self = this;
    return nodes.map(set => self.accept(set));
  }

  

  visitAbs(mathNode: MathAbs): SympyToken {
    return new SympyFunction("Abs", [this.accept(mathNode.expression)]);
  }
  visitAnd(mathNode: MathAnd): SympyToken {
    return new SympyFunction('And', [this.accept(mathNode.left), this.accept(mathNode.right)]);
  }
  visitAreaIntegral(mathNode: MathAreaIntegral): SympyToken {
    return new SympyFunction('Integral', [
      this.accept(mathNode.expression),
      new SympyArray([this.accept(mathNode.differential), this.accept(mathNode.area)], false)
    ]);
  }
  visitBrackets(mathNode: MathBrackets): SympyToken {
    throw new InvalidNodeError(mathNode, "this operation does not support brackets");
  }

  visitComma(mathNode: MathComma): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected comma");
  }

  visitUndefined(mathNode: MathUndefined): SympyToken {
    return new SympyString("nan");
  }

  visitConstant(mathNode: MathConstant): SympyToken {
    switch (mathNode.value) {
      case MathConstants.e:
        return new SympyString("E");
      case MathConstants.pi:
        return new SympyString('pi');
      case MathConstants.infinity:
        return new SympyString("oo");
      case MathConstants.imaginaryUnit:
        return new SympyString('I');
      case MathConstants.complexInfinity:
        return new SympyString('zoo');

      default:
        throw new Error("Unknown constant:" + mathNode.value);
    }
  }
  visitDefiniteIntegral(mathNode: MathDefiniteIntegral): SympyToken {
    return new SympyFunction('Integral', [
      this.accept(mathNode.expression),
      new SympyArray(this.join([mathNode.differential, mathNode.lowerBound, mathNode.upperBound]), false)
    ]);
  }
  visitDerivative(mathNode: MathDerivative): SympyToken {
    if (mathNode.degree == 1) {
      return new SympyFunction('Derivative', [this.accept(mathNode.base)]);
    }
    else {
      //Sympy needs variable name when we want to pass degree
      const variable: MathVariable = getAnyVariable(mathNode.base);
      if (!variable) {
        throw new InvalidNodeError(mathNode, "Can't find any variable to derive");
      }
      return new SympyFunction('Derivative', [this.accept(mathNode.base), symbol(variable.value), integer(mathNode.degree)]);
    }
  }
  visitDeterminant(mathNode: MathDeterminant): SympyToken {
    return new SympyFunction('Matrix', [new SympyArray(
      mathNode.elements.map(row => {
        return new SympyArray(this.join(row), true);
      })
      , true)]);
  }

  visitFunctionDifference(mathNode: MathFunctionDifference): SympyToken {
    let v: MathVariable;
    if (!mathNode.downLimitVariable) {
      v = getAnyVariable(mathNode);
    }
    else {
      if (mathNode.downLimitVariable instanceof MathVariable && mathNode.upLimitValue instanceof MathVariable) {
        const v1AsString = acceptMathNode(mathNode.downLimitVariable, MathNodePrinter.instance);
        const v2AsString = acceptMathNode(mathNode.upLimitVariable, MathNodePrinter.instance);
        if (v1AsString !== v2AsString) {
          throw new InvalidNodeError(mathNode, "Up and down limits have different variables");
        }
        else {
          v = mathNode.downLimitVariable;
        }
      }
      else {
        throw new InvalidNodeError(mathNode, "Invalid limit variable");
      }
    }

    if (!v) {
      throw new InvalidNodeError(mathNode, "The function contains no variable");
    }

    const up = new SympyMethod(this.accept(mathNode.func), "subs", [this.accept(v), this.accept(mathNode.upLimitValue)]);
    const down = new SympyMethod(this.accept(mathNode.func), "subs", [this.accept(v), this.accept(mathNode.downLimitValue)]);

    return new SympyFunction("Add", [up, new SympyFunction("Mul", [integer(-1), down])]);
  }

  //No structure for separated differential in sympy
  abstract visitDifferential(mathNode: MathDifferential): SympyToken;

  visitDivision(mathNode: MathDivision): SympyToken {
    return new SympyFunction("Mul", [this.accept(mathNode.numerator), new SympyFunction("Pow", [this.accept(mathNode.denominator), integer(-1)])]);
  }

  visitEmptySet(mathNode: MathEmptySet): SympyToken {
    return new SympyString("EmptySet");
  }

  visitEquality(mathNode: MathEquality): SympyToken {
    let sign: string;
    switch (mathNode.equalityType) {
      case MathEqualityType.equals:
        sign = 'Eq';
        break;
      case MathEqualityType.lessThan:
        sign = 'Lt';
        break;
      case MathEqualityType.greaterThan:
        sign = 'Gt';
        break;
      case MathEqualityType.lessOrEquals:
        sign = 'Le';
        break;
      case MathEqualityType.greaterOrEquals:
        sign = "Ge";
        break;
      case MathEqualityType.notEquals:
        sign = "Ne";
        break;
      case MathEqualityType.approxEquals:
        throw new InvalidNodeError(mathNode, "SymPy does not support approximate equality");
    }
    return new SympyFunction(sign, this.join([mathNode.left, mathNode.right]));

  }

  visitExpressionSet(mathNode: MathExpressionSet): SympyToken {
    return new SympyFunction("Range", this.join(mathNode.set));
  }

  visitFunction(mathNode: MathFunction): SympyFunction {
    const symbol = this.accept(mathNode.operator);
    if (symbol instanceof SympyFunction && symbol.type === 'Symbol') {
      const name = symbol.args[0].accept(SympyStringify.instance);
      return new SympyUserFunction(name, this.join(mathNode.operands));
    }

  }

  visitImplicitMultiply(mathNode: MathImplicitMultiply): SympyToken {
    return new SympyFunction("Mul", this.join([mathNode.left, mathNode.right]));
  }

  visitIncludeSet(mathNode: MathIncludeSet): SympyToken {
    return new SympyMethod(this.accept(mathNode.set), "contains", [this.accept(mathNode.fexp)]);
  }

  visitIndefiniteIntegral(mathNode: MathIndefiniteIntegral): SympyToken {
    return new SympyFunction("Integral", this.join([mathNode.expression, mathNode.differential]));
  };

  visitInfimum(mathNode: MathInfimum): SympyToken {
    return new SympyMethod(this.accept(mathNode.operand), "inf", []);
  };

  visitIntersection(mathNode: MathIntersection): SympyToken {
    return new SympyMethod(this.accept(mathNode.left), "intersect", [this.accept(mathNode.right)]);
  };
  visitInterval(mathNode: MathInterval): SympyToken {
    let type: string;
    switch (mathNode.intervalType) {
      case MathBracketsType.open:
        type = '.open';
        break;
      case MathBracketsType.closed:
        type = '';
        break;
      case MathBracketsType.leftClosed:
        type = '.Ropen';
        break;
      case MathBracketsType.rightClosed:
        type = '.Lopen';
        break;
      default:
        throw Error("Unknown interval type " + mathNode.intervalType);
    }
    return new SympyFunction("Interval" + type, this.join([mathNode.leftBound, mathNode.rightBound]));
  }

  visitLeibnizDerivative(mathNode: MathLeibnizDerivative): SympyToken {
    return new SympyFunction("Derivative", [this.accept(mathNode.operand), this.accept(mathNode.variable), integer(mathNode.degree)]);
  }

  visitLimit(mathNode: MathLimit): SympyFunction {
    let lt: SympyString | undefined;

    switch (mathNode.limitType) {
      case MathLimitType.unspecified:
        break;
      case MathLimitType.left:
        lt = new SympyString("'-'");
        break;
      case MathLimitType.right:
        lt = new SympyString("'+'");
        break;
    }

    const args: SympyToken[] = this.join([mathNode.func, mathNode.input, mathNode.value]);

    if (lt) {
      args.push(lt);
    }

    return new SympyFunction('Limit', args);

  }

  visitLogarithm(mathNode: MathLogarithm): SympyToken {
    return new SympyFunction("log", this.join([mathNode.operand, mathNode.base]));
  }
  visitMax(mathNode: MathMax): SympyToken {
    return new SympyFunction('Max', this.join(mathNode.operands));
  }
  visitMin(mathNode: MathMin): SympyToken {
    return new SympyFunction('Min', this.join(mathNode.operands));
  }
  visitMinus(mathNode: MathMinus): SympyToken {
    return new SympyFunction("Add", [this.accept(mathNode.left), new SympyFunction("Mul", [integer(-1), this.accept(mathNode.right)])]);
  }
  visitMultiply(mathNode: MathMultiply): SympyToken {
    return new SympyFunction("Mul", this.join([mathNode.left, mathNode.right]));
  }
  visitNaturalLogarithm(mathNode: MathNaturalLogarithm): SympyToken {
    return new SympyFunction('log', [this.accept(mathNode.operand)]);
  }
  visitNumber(mathNode: MathNumber): SympyToken {
    const n: number = +mathNode.value;
    if (Number.isInteger(n)) {
      return integer(n);
    }
    else {
      return float(n);
    }
  }
  visitNumericSet(mathNode: MathNumericSet): SympyToken {
    switch (mathNode.value) {
      case MathNumericSetValues.C:
        return new SympyMethod(new SympyString("S"), "Complexes", []);
      case MathNumericSetValues.N:
        return new SympyMethod(new SympyString("S"), "Naturals", []);
      case MathNumericSetValues.Q:
        throw new InvalidNodeError(mathNode, 'SymPy does not support numeric set ' + mathNode.value);
      case MathNumericSetValues.R:
        return new SympyMethod(new SympyString("S"), "Reals", []);
      case MathNumericSetValues.Z:
        return new SympyMethod(new SympyString("S"), "Integers", []);
      default:
        throw Error('Unsupported numeric set ' + mathNode.value);
    }
  }
  visitOr(mathNode: MathOr): SympyToken {
    return new SympyFunction("Or", this.join([mathNode.left, mathNode.right]));
  }
  visitParentheses(mathNode: MathParentheses): SympyToken {
    //parentheses are skipped!
    return this.accept(mathNode.expression);
  }

  visitPiecewiseFunction(mathNode: MathPiecewiseFunction): SympyToken {
    return new SympyFunction("Piecewise",
      mathNode.elements.map((element, rowIndex) => {
        return new SympyArray([this.accept(element), this.accept(mathNode.predicates[rowIndex])], false);
      })
    );
  }
  visitPlaceholder(mathNode: MathPlaceholder): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected empty space");
  }
  visitPlus(mathNode: MathPlus): SympyToken {
    return new SympyFunction("Add", this.join([mathNode.left, mathNode.right]));
  }
  visitPoint(mathNode: MathPoint): SympyToken {
    if (mathNode.terms.length === 2) {
      return new SympyFunction("Point2D", this.join(mathNode.terms));
    }
    if (mathNode.terms.length === 3) {
      return new SympyFunction("Point3D", this.join(mathNode.terms));
    }
    throw new InvalidNodeError(mathNode, "We only support 2D and 3D points");
  }
  visitPower(mathNode: MathPower): SympyToken {
    return new SympyFunction("Pow", this.join([mathNode.base, mathNode.exponent]));
  }
  visitPredicate(mathNode: MathPredicate): SympyToken {
    throw new InvalidNodeError(mathNode, "this operation does not support predicates");
  }

  visitProduct(mathNode: MathProduct): SympyToken {

    return new SympyFunction("Product", [this.accept(mathNode.sequence),
    new SympyArray(this.join([mathNode.index, mathNode.lowerBound, mathNode.upperBound]), false)]);
  }
  visitRawText(mathNode: MathRawText): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected raw text");
  }
  visitReversedFunction(mathNode: MathReversedFunction): SympyToken {
    throw new InvalidNodeError(mathNode, "this operation does not support reversed function");
  }

  visitRoot(mathNode: MathRoot): SympyToken {
    return new SympyFunction("Pow", [this.accept(mathNode.base), new SympyFunction("Rational", [integer(1), this.accept(mathNode.degree)])]);
  }

  visitSquareRoot(mathNode: MathSquareRoot): SympyToken {
    return new SympyFunction("Pow", [this.accept(mathNode.base), new SympyFunction("Rational", [integer(1), integer(2)])]);
  }
  visitSubIndex(mathNode: MathSubIndex): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected low index");
  }
  visitSum(mathNode: MathSum): SympyToken {
    return new SympyFunction("Sum", [this.accept(mathNode.sequence),
    new SympyArray(this.join([mathNode.index, mathNode.lowerBound, mathNode.upperBound]), false)]);
  }

  visitSupremum(mathNode: MathSupremum): SympyToken {
    return new SympyMethod(this.accept(mathNode.operand), 'sup', []);
  }

  visitSymbol(mathNode: MathSymbol): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected standalone symbol");
  }

  visitVerticalBar(mathNode: MathVerticalBar): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected vertical bar");
  }

  visitTransformation(mathNode: MathTransformation): SympyToken {
    throw new InvalidNodeError(mathNode, "unexpected symbol");
  }


  abstract visitSet(mathNode: MathSet): SympyToken;

  abstract visitSystemOfEquations(mathNode: MathSystemOfEquations): SympyToken;

  visitTrigonometricFunction(mathNode: MathTrigonometricFunction): SympyToken {

    const fn = getSympyTrigName(mathNode.funcName);

    return new SympyFunction(fn, [this.accept(mathNode.operand)]);
  }
  visitUnaryMinus(mathNode: MathUnaryMinus): SympyToken {
    return new SympyFunction("Mul", [integer(-1), this.accept(mathNode.expression)])
  }

  visitUnion(mathNode: MathUnion): SympyToken {
    return new SympyFunction("Union", this.join([mathNode.left, mathNode.right]));
  }

  visitVariable(mathNode: MathVariable): SympyToken {
    let vn = mathNode.value;

    if (mathNode.indexes.length > 0) {
      const sympyIndexes = this.join(mathNode.indexes);
      vn += "_" + sympyIndexes.map(i => i.accept(SympyStringify.instance)).join("_");
    }
    return symbol(vn);
  }


}

