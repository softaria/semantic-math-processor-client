
/**
 * @hidden
 * @packageDocumentation
 */
import { SympyToken, SympyStringify } from "./sympy-parser";

/**
 * Error codes of Sympy client
 * @category Model
 */
export enum SympyErrorCode {
  /**
   * sympy can't parse at least one of the passed expressions
   */
  BAD_ARGUMENT = "BAD_ARGUMENT",
  /**
   * sympy methods or function failed
   */
  METHOD_FAILURE = "METHOD_FAILURE",
  /**
   * No method/function with the given name exists
   */
  BAD_METHOD = "BAD_METHOD",
  /**
   * Internet connectivity error or bad name of the math processor server
   */
  CONNECTION_ERROR = "CONNECTION_ERROR"
}

/**
 * When calling the async methods of sympy clients, catch this error
 * It will be thrown when sympy REST service is not reachable (CONNECTION_ERROR)
 * When the request has bad format (BAD_ARGUMENT and BAD_METHOD)
 * And when sympy was not able to proceed for some internal reason (METHOD_FAILURE)
 * 
 * @category Model
 */
export class SympyError extends Error {
  /**
   * Error code
   */
  readonly code: SympyErrorCode;
  /**
   * Human readable message
   */
  readonly message: string;

  /**
  * @hidden
  */
  constructor(code: SympyErrorCode, message: string) {
    super(message);
    this.code = code;
    this.message = message;

    Object.setPrototypeOf(this, SympyError.prototype);
  }
}
/**
 * When calling the async methods of sympy clients, catch this error.
 * It will be thrown when sympy was able to proceed your request, but we was not able to understand its respond.
 * Probably we should support some yet unsupported Sympy construction
 * You should also be able to get latex from Sympy for the construction returned (as we do not have to understand it in this case)
 * 
 * @category Model
 */
export class UnsupportedSympyConstruction extends Error {
  /**
   * The name of unsupported construction
   */
  readonly name: string;
  /**
   * @hidden
   */
  wholeExpression: SympyToken;

  /**
  * @hidden
  */
  constructor(name: string, message: string) {
    super(message);
    this.name = name;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnsupportedSympyConstruction.prototype);
  }

  get preparedSympyCall(): PreparedSympyCall {
    return new PreparedSympyCall(this.wholeExpression);
  }
}

/**
 * Treat it as a blackbox, contained prepared call for sympy
 * 
 * @category Model
 */
export class PreparedSympyCall {
  /**
   * @hidden
   */
  readonly token: SympyToken;

  /**
  * @hidden
  */
  constructor(token: SympyToken) {
    this.token = token;
  }
  /**
   * @returns the prepared expression in Sympy language
   */
  stringify(): string {
    return this.token.accept(SympyStringify.instance);
  }
}

/**
 * 
 * Reflects if two expressions are eqivalent
 * @category Model
 */
export enum Equiv {
  /**
   * expressions are literally identical
   */
  identical = "identical",
  /**
   * expressions become equal when you do some algebra transformation
   */
  equiv = "equiv",
  /**
   * expression become equal only if you apply calculus transformation (like integrating, differentiating or calculating limit)
   */
  equivCalc = "equivCalc",
  /**
   * expressions are not equivalent
   */
  different = "different"
}

/**
 * Tell which one of two expressions is simpler than the other
 * @category Model
 */
export enum Simpler {
  /**
   * you have to simplify the second expression more than the first in order to make them identical
   */
  first = "first",
  /**
   * you have to simplify the first expression more than the second in order to make them identical
   */
  second = "second",
  /**
   * returned when the expressions are identical
   */
  none = "none",
  /**
   * you have to simplify both expressions to make them identical and these simplifications are both algebraic or both calulus
   */
  unknown = "unknown",
}

/**
 * Return class for checking equivalence of two expressions
 * @category Model
 */
export class EquivResponse {
  /**
   * Reflects if the expressions were equivalent
   */
  eq: Equiv;
  /**
   * Shows which of the expressions is simpler
   */
  si: Simpler;

  /**
   * @hidden
   */
  constructor(eq: Equiv, si: Simpler) {
    this.eq = eq;
    this.si = si;
  }
}

/**
 * Blackbox class for plot intervals use {@link SympyClient.preparePlotInterval} to create it
 * @category Model
 */
export class PlotInterval {
  /**
   * @hidden
   */
  variable: PreparedSympyCall;

  /**
 * @hidden
 */
  from: PreparedSympyCall;

  /**
 * @hidden
 */
  to: PreparedSympyCall;

  /**
 * @hidden
 */
  constructor(variable: PreparedSympyCall, from: PreparedSympyCall, to: PreparedSympyCall) {
    this.variable = variable;
    this.from = from;
    this.to = to;
  }

  /**
   * @returns the interval as a Sympy tuple.
   */
  asSympyTuple(): string {
    return "(" + [this.variable.stringify(), this.from.stringify(), this.to.stringify()].join() + ")";
  }
}

/**
 * Parameters for 2d plots.
 * Please refer to [sympy documentation](https://docs.sympy.org/latest/modules/plotting.html) for details.
 * @category Model
 */
export class Plot2dParams {
  adaptive?: boolean;
  depth?: number;
  nb_of_points?: number;
  line_color?: number;
  title?: string;
  xlabel?: string;
  ylabel?: string;
  xscale?: 'linear' | 'log';
  yscale?: 'linear' | 'log';
  axis_center?: number[];
  xlim?: number[];
  ylim?: number[];
}

/**
 * Parameters for 3d plots.
 * Please refer to [sympy documentation](https://docs.sympy.org/latest/modules/plotting.html) for details.
 * @category Model
 */
export class Plot3dParams {
  nb_of_points_x?: number;
  nb_of_points_y?: number;
  title?: string;
}


