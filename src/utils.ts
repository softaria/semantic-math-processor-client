/**
 * @hidden
 * @packageDocumentation
 */
import { MathTrigonometryType, MathStructure, MathVariable, traverseStructures, MathNodeName, MathNodePrinter, acceptMathNode } from "semantic-math-editor";

/**
 * @hidden
 */
export function unquote(s: string): string {
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.substring(1, s.length - 1);
  }
  else {
    return s;
  }
}

/**
 * @hidden
 */
export function getSympyTrigName(trig: MathTrigonometryType): string {
  switch (trig) {
    case MathTrigonometryType.sin:
      return "sin";

    case MathTrigonometryType.cos:
      return "cos";

    case MathTrigonometryType.tan:
      return "tan";

    case MathTrigonometryType.csc:
      return "csc";

    case MathTrigonometryType.sec:
      return "sec";

    case MathTrigonometryType.cot:
      return "cot";

    case MathTrigonometryType.arcsin:
      return "asin";

    case MathTrigonometryType.arccos:
      return "acos";

    case MathTrigonometryType.arctan:
      return "atan";

    case MathTrigonometryType.arccsc:
      return "acsc";

    case MathTrigonometryType.arcsec:
      return "asec";

    case MathTrigonometryType.arccot:
      return "acot";

    case MathTrigonometryType.sinh:
      return "sinh";

    case MathTrigonometryType.cosh:
      return "cosh";

    case MathTrigonometryType.tanh:
      return "tanh";

    case MathTrigonometryType.arcsinh:
      return "asinh";

    case MathTrigonometryType.arccosh:
      return "acosh";

    case MathTrigonometryType.arctanh:
      return "atanh";

    default:
      throw new Error("Unsopported trigonometric function:" + trig);
  }
}
  
/**
 * @hidden
 */
export function getAnyVariableFromNodes(nodes: MathStructure[]): MathVariable | undefined {
  for(const n of nodes) {
    const v = getAnyVariable(n);
    if(v) {
      return v;
    }
  }
}
 
/**
 * @hidden
 */
export function getAllVariablesFromNodes(nodes: MathStructure[]): MathVariable[] {
  const ret = new Map<string,MathVariable>();
  for(const n of nodes) {
    getAllVariables(n,ret);
  }
  return [ ...ret.values() ]
}

/**
 * @hidden
 */
export function getAnyVariable(node: MathStructure): MathVariable | undefined {
  let ret: MathVariable | undefined;
  traverseStructures(node, (s) => {
    if (s.name === MathNodeName.variable) {
      ret = s as MathVariable;
    }
  })
  return ret;
}

/**
 * @hidden
 */
export function getAllVariables(node: MathStructure,addTo?:Map<string,MathVariable>): Map<string,MathVariable>{
  const vars = addTo?addTo:new Map<string,MathVariable>();

  traverseStructures(node, (s) => {
    if (s.name === MathNodeName.variable) {
      const v = s as MathVariable;
      const name = acceptMathNode(v,MathNodePrinter.instance);
      vars.set(name,v);
    }
  })
  return vars;
}

