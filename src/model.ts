
/**
 * @hidden
 * @packageDocumentation
 */
import { SympyToken, SympyStringify } from "./sympy-parser";

/**
 * @category API
 */
export enum SympyErrorCode {
  BAD_ARGUMENT = "BAD_ARGUMENT",
  METHOD_FAILURE = "METHOD_FAILURE",
  BAD_METHOD = "BAD_METHOD",
  CONNECTION_ERROR = "CONNECTION_ERROR"
}

/**
 * When calling the async methods of sympy clients, catch this error
 * It will be thrown when sympy REST service is not reachable (CONNECTION_ERROR)
 * When the request has bad format (BAD_ARGUMENT and BAD_METHOD)
 * And when sympy was not able to proceed for some internal reason (METHOD_FAILURE)
 * 
 * @category API
 */
export class SympyError extends Error {
  readonly code: SympyErrorCode;
  readonly message: string;

  constructor(code: SympyErrorCode, message: string) {
    super(message);
    this.code = code;
    this.message = message;

    Object.setPrototypeOf(this, SympyError.prototype);
  }
}
/**
 * When calling the async methods of sympy clients, catch this error.
 * It will be thrown when sympy was able to proceed your request, but we was not able to understand it.
 * Probably we should support some yet unsupported Sympy construction
 * You should also be able to get latex from Sympy for the cinstruction returned
 * 
 * @category API
 */
export class UnsupportedSympyConstruction extends Error {

  readonly name: string;
  wholeExpression: SympyToken;

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
 * @category API
 */
export class PreparedSympyCall {
  readonly token: SympyToken;
  constructor(token: SympyToken) {
    this.token = token;
  }
  stringify(): string {
    return this.token.accept(SympyStringify.instance);
  }
}

/**
 * @category API
 */
export enum Equiv {
  identical = "identical",
  equiv = "equiv",
  equivCalc = "equivCalc",
  different = "different"
}

/**
 * @category API
 */
export enum Simpler {
  first = "first",
  second = "second",
  none = "none",
  unknown = "unknown",
}

/**
 * @category API
 */
export class EquivResponse {
  eq: Equiv;
  si: Simpler;

  constructor(eq: Equiv, si: Simpler) {
    this.eq = eq;
    this.si = si;
  }
}

/**
 * @category API
 */
export class PlotInterval {

  variable: PreparedSympyCall;
  from: PreparedSympyCall;
  to: PreparedSympyCall;

  constructor(variable: PreparedSympyCall, from: PreparedSympyCall, to: PreparedSympyCall) {
    this.variable = variable;
    this.from = from;
    this.to = to;
  }

  asSympyTuple(): string {
    return "(" + [this.variable.stringify(), this.from.stringify(), this.to.stringify()].join() + ")";
  }
}

/**
 * @category API
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
 * @category API
 */
export class Plot3dParams {
  nb_of_points_x?: number;
  nb_of_points_y?: number;
  title?: string;
}


