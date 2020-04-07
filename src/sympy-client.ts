/**
 * @hidden
 * @packageDocumentation
 */

import { SympyStringify, parseSympyExpression, SympyToken } from "./sympy-parser";
import { SympyRESTClient } from "./sympy-rest-client";
import { fromSympy } from "./from-sympy";
import { BaseSymPyVisitor, InvalidNodeError } from "./to-sympy";
import { unquote } from "./utils";
import { SemanticErrorDescription, MathNode, MathNodeVisitor, acceptMathNode, MathDifferential, MathSet, MathSystemOfEquations, HttpClient, MathStructure, MathNumber, MathUnaryMinus, MathVariable } from "semantic-math-editor";
import { PreparedSympyCall, EquivResponse, PlotInterval, Plot2dParams, SympyError, Plot3dParams } from "./model";


class BrowserBasedHttpClient implements HttpClient {

  requestAsync<Request, Response>(
    method: 'GET' | 'POST',
    url: string,
    content?: Request,
    callback?: (response: Response) => void,
    errorCallback?: (err: any) => void) {

    const request = new XMLHttpRequest();
    request.open(method, url, true);
    request.onload = function () {

      if (this.status >= 200 && this.status < 400) {
        // Success!
        const data = JSON.parse(this.response) as Response;
        callback && callback(data);
      } else {
        // We reached our target server, but it returned an error
        errorCallback && errorCallback("bad HTTP status:" + this.status);
      }
    };

    request.onerror = function (err) {
      // There was a connection error of some sort
      errorCallback && errorCallback(err);
    };
    if (method === 'POST') {
      request.setRequestHeader(
        'Content-Type',
        'application/json;charset=UTF-8');
    }
    request.send(JSON.stringify(content));
  }
}

/**
 * A client for [MathProcessor](https://github.com/softaria/math-processor) - simple REST service around [sympy](https://sympy.org)
 * @category API
 */
export class SympyClient {

  /**
   * @hidden
   */
  private readonly client: SympyRESTClient;

  /**
   * 
   * @param serverAddress - http(s) address of the [MathProcessor](https://github.com/softaria/math-processor) to call
   * @param http -  HttpClient. No need to pass it when use from browser. 
   * if use not from broswer you need to implement semantic-math-editor's HttpClient interface as following:
   * ```
   *    export interface HttpClient {
   *       requestAsync<Request, Response>(method: 'GET' | 'POST', url: string, content?: Request, callback?: (response: Response) => void, errorCallback?: (err: any) => void): void;
   *    }
   * ```
   * For your convinience here is the anxious based implementation:
   * <details>
   * <summary> Click to expand</summary>
   * 
   * ```
   * 
   *  class AxiousBasedHttpClient implements HttpClient {
   *   requestAsync<Request, Response>(method: "GET" | "POST", 
   *                                   url: string, 
   *                                   content?: Request, 
   *                                   callback?: (response: Response) => void, 
   *                                   errorCallback?: (err: any) => void
   *                                   ): void {
   *    switch (method) {
   *      case "GET":
   *        axios.get(url).then((result) => {
   *          callback(result.data);
   *        }).catch((error) => {
   *          console.log("ERROR:" + JSON.stringify(error));
   *          errorCallback(error);
   *        });
   *        break;
   *      case "POST":
   *        let axiosConfig = {
   *          headers: {
   *            'Content-Type': 'application/json;charset=UTF-8',
   *            "Access-Control-Allow-Origin": "*",
   *          }
   *        };
   *        axios.post(url, content, axiosConfig).then((result) => {
   *          callback(result.data);
   *        }).catch((error) => {
   *          console.log("ERROR:" + JSON.stringify(error));
   *          errorCallback(error);
   *        });
   *        break;
   *    }
   *   }
   * }  
   * 
   * ```
   * 
   * </details>
   */
  constructor(serverAddress: string, http?: HttpClient) {
    this.client = new SympyRESTClient(serverAddress, http ? http : new BrowserBasedHttpClient());
  }

  /**
   * Converts MathTree from the [SemanticMatEditor](https://github.com/softaria/semantic-math-editor) to {@link PreparedSympyCall}
   * Alternatively returns SemanticMathEditor's {SemanticErrorDescription} (if converting is not possible)
   * The SemanticErrorDescription object can be used to decorate problematic node in the SemanticMathEditor
   * @param node
   */
  prepareCompute(node: MathNode): PreparedSympyCall | SemanticErrorDescription {
    return this.prepare(node, ComputeOperation.instance);
  }

  /**
   * The returned expression is equivavlent to entered one (but not equal in genearl case)
   * The goal of this method is to ensure sympy understands the expression
   * It is designed for use with tests. Note: **MathNode** class belongs to the [SemanticMatEditor](https://github.com/softaria/semantic-math-editor)
   * @returns the expression passed as an argument as sympy has understood it
   * @param sympyExpression - the result of one of {@link prepareCompute} methods
   * @param log - if true, writes debug info to the console
   * @throws {@link SympyError}
   * @throws {@link UnsupportedSympyConstruction}
   */
  async mirror(sympyExpression: PreparedSympyCall, log?: boolean): Promise<MathNode> {
    const args = sympyExpression.token.accept(SympyStringify.instance);
    if (log) {
      console.log("RAW EXPRESSION TO SEND TO SYMPY: " + args);
    }
    const sympyResult = await this.client.callCustom<string>("mirror", [args]);
    try {
      if (log) {
        console.log("RAW RESULT FROM SYMPY: " + sympyResult);
      }
      const sympyParsedExpression = parseSympyExpression(sympyResult);
      if (log) {
        console.log("PARSED RESULT FROM SYMPY: " + JSON.stringify(sympyParsedExpression));
      }
      return fromSympy(sympyParsedExpression);
    }
    catch (e) {
      console.log("RAW RESULT FROM SYMPY: " + sympyResult);
      throw e;
    }
  }

  /**
   * Checks if two passed expressions are equivalent
   * Look at {@link Equiv} and {@link Simpler} for details.
   * @param exp1  - the result of {@link prepareCompute}
   * @param exp2  - the result of {@link prepareCompute}
   * @returns an information if the expressions are eqivalent and which one is simpler
   * @throws {@link SympyError}
   * @throws {@link UnsupportedSympyConstruction}
   */
  async checkEquivalence(exp1: PreparedSympyCall, exp2: PreparedSympyCall): Promise<EquivResponse> {
    const args = [exp1.stringify(), exp2.stringify()];
    return this.client.callCustom<EquivResponse>("equiv", args);
  }

  /**
   * @returns the result of sympy [.doit()](https://docs.sympy.org/latest/modules/core.html#sympy.core.basic.Basic.doit) method on the provided expression.
   * @param sympyExpression - the result of one of {@link prepareCompute}
   * @throws {@link SympyError}
   * @throws {@link UnsupportedSympyConstruction}
   */
  async compute(sympyExpression: PreparedSympyCall): Promise<MathNode> {
    const sympyResult = await this.client.callMethod(sympyExpression.token.accept(SympyStringify.instance), "doit", []);
    const sympyParsedExpression = parseSympyExpression(sympyResult);
    return fromSympy(sympyParsedExpression);
  }

  /**
  * @returns the result of sympy [simplify](https://docs.sympy.org/latest/modules/core.html#module-sympy.core.sympify) function on the provided expression.
  * @param sympyExpression - the result of one of {@link prepareCompute}
  * @param log - if true, writes debug info to the console
  * @throws {@link SympyError}
  * @throws {@link UnsupportedSympyConstruction}
  */
  async simplify(sympyExpression: PreparedSympyCall, log?: boolean): Promise<MathNode> {
    const sympyResult = await this.client.callFunction("simplify", [sympyExpression.stringify()],{"doit":false});
    try {
      if (log) {
        console.log("RAW RESULT FROM SYMPY: " + sympyResult);
      }
      const sympyParsedExpression = parseSympyExpression(sympyResult);
      if (log) {
        console.log("PARSED RESULT FROM SYMPY: " + JSON.stringify(sympyParsedExpression));
      }
      return fromSympy(sympyParsedExpression);
    }
    catch (e) {
      console.log("RAW RESULT FROM SYMPY: " + sympyResult);
      throw e;
    }

  }

  /**
   * Get the LaTex representation of Sympy expression. 
   * Note: The latex is generated by Sympy and in most cases this latex can't be pasted to the SemanticMathEditor.
   * It only can be shown using KaTex or some other Latex renderer.
   * @returns the LaTex representation of the given parameter.
   * @param sympyExpression - the result of one of {@link prepareCompute}
   * @throws {@link SympyError}
   * @throws {@link UnsupportedSympyConstruction}
   */
  async latex(sympyExpression: PreparedSympyCall): Promise<string> {
    //The first 8 backslashes means 2 of them, as they are unquoted twice (the second time by the RegExp())
    //The second 2 backslashes means 1 of them as this gets unquoted only once
    //The whole code is here because SymPy returns escaped backslashes, so there is \\left( instead of \left(
    return this.replaceAll(unquote(await this.client.callFunction("latex", [sympyExpression.token.accept(SympyStringify.instance)])), "\\\\\\\\", "\\");
  }

  /**
   * Generates source for image with 2d plot.
   * @param sympyExpressions - One or more expressions to plot. Each is the result of one of {@link prepareCompute}
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param interval - optional interval where we need the plot
   * @param params - additional plot parameters
   * @returns URL to be added to image tag.
   */
  plot2dSrc(sympyExpressions: PreparedSympyCall[], svg: boolean, interval?: PlotInterval, params?: Plot2dParams): string {
    const args: string[] = sympyExpressions.map(e => e.stringify());
    if (interval) {
      args.push(interval.asSympyTuple());
    }
    return this.client.plotSrc("plot", args, svg, params);
  }

  /**
   * Generates source for image with 2d parametric plot.
   * @param expressionPairs - one or more pair of expressions to generate the parametric plot.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param interval - optional interval where we need the plot
   * @param params - additional plot parameters
   * @returns URL to be added to image tag.
   */
  plot2dParametricSrc(expressionPairs: { x: PreparedSympyCall, y: PreparedSympyCall }[], svg: boolean, interval?: PlotInterval, params?: Plot2dParams): string {
    const args: string[] = expressionPairs.map(e => {
      return "(" + e.x.stringify() + "," + e.y.stringify() + ")";
    });
    if (interval) {
      args.push(interval.asSympyTuple());
    }
    return this.client.plotSrc("plot_parametric", args, svg, params);
  }


  /**
   * Generates source for image with 3d plot.
   * @param sympyExpressions - one or more expressions to plot
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param intervals - optional intervals for both dimensions of the 3d plot
   * @param params - additional plot parameters
   * @returns URL to be added to image tag.
   */
  plot3dSrc(sympyExpressions: PreparedSympyCall[], svg: boolean, intervals?: { i1: PlotInterval, i2: PlotInterval }, params?: Plot3dParams): string {
    const args: string[] = sympyExpressions.map(e => e.stringify());
    if (intervals) {
      args.push(intervals.i1.asSympyTuple());
      args.push(intervals.i2.asSympyTuple());
    }
    return this.client.plotSrc("plot3d", args, svg, params);
  }

  /**
   * Creates interval objects for plot generation methods
   * @param v - a variable. Please look at [SemanticMathEditor](https://github.com/softaria/semantic-math-editor) for MathVariable meaning.
   * @param start - a min value
   * @param end  - a max value
   * @returns {@link PlotInterval} object, suitable for passing to plotting methods.
   */
  preparePlotInterval(v: MathVariable, start?: number, end?: number): PlotInterval {
    const self = this;

    if (!start) {
      start = -10;
    }
    if (!end) {
      end = 10;
    }
    return new PlotInterval(this.prepareCompute(v) as PreparedSympyCall, toMathNode(start), toMathNode(end));

    function toMathNode(num: number): PreparedSympyCall {
      if (num < 0) {
        return self.prepareCompute(new MathUnaryMinus(new MathNumber("" + Math.abs(num)))) as PreparedSympyCall;
      }
      else {
        return self.prepareCompute(new MathNumber("" + num)) as PreparedSympyCall;
      }

    }
  }

  /**
   * Generates source for image with 3d parametric plot.
   * @param expressions - one or more triplet of the expressions. Each with its own iterval.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param params - additional plot parameters
   * @returns URL to be added to image tag.
   */
  plot3dParametricLineSrc(expressions: { x: PreparedSympyCall, y: PreparedSympyCall, z: PreparedSympyCall, interval: PlotInterval }[], svg: boolean, params?: Plot3dParams): string {
    const args: string[] = expressions.map(e => {
      return "(" + e.x.stringify() + "," + e.y.stringify() + "," + e.z.stringify() + "," + e.interval.asSympyTuple() + ")";
    });
    return this.client.plotSrc("plot3d_parametric_line", args, svg, params);
  }

  /**
   * Generates source for image with 3d parametric plot.
   * @param expressions - one or more triplet of the expressions. Each with its own pair of the itervals.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param params - additional plot parameters
   * @returns URL to be added to image tag.
   */
  plot3dParametricSurfaceSrc(expressions: { x: PreparedSympyCall, y: PreparedSympyCall, z: PreparedSympyCall, r_u: PlotInterval, r_v: PlotInterval }[], svg: boolean, params?: Plot3dParams): string {
    const args: string[] = expressions.map(e => {
      return "(" + e.x.stringify() + "," + e.y.stringify() + "," + e.z.stringify() + "," + e.r_u.asSympyTuple() + "," + e.r_v.asSympyTuple() + ")";
    });
    return this.client.plotSrc("plot3d_parametric_surface", args, svg, params);
  }

  /**
   * Generates an image with 2d plot.
   * @param sympyExpressions - One or more expressions to plot. Each is the result of one of {@link prepareCompute}
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param onError - callback to call in case of error
   * @param interval - optional interval where we need the plot
   * @param params - additional plot parameters
   * @returns image element.
   */
  plot2d(sympyExpressions: PreparedSympyCall[], svg: boolean, onError?: (err: SympyError) => void, interval?: PlotInterval, params?: Plot2dParams): HTMLImageElement {
    const img = document.createElement("img");
    const self = this;
    if (onError) {
      img.onerror = () => {
        const args: string[] = sympyExpressions.map(e => e.stringify());
        if (interval) {
          args.push(interval.asSympyTuple());
        }
        self.client.checkPlotValidity("plot", args, svg, params).catch(
          (err: SympyError) => {
            onError(err);
          }
        );
      }
    }
    img.src = this.plot2dSrc(sympyExpressions, svg, interval, params);
    return img;
  }

   /**
   * Generates source for image with 3d plot.
   * @param sympyExpressions - one or more expressions to plot
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param onError - callback to call in case of error
   * @param intervals - optional intervals for both dimensions of the 3d plot
   * @param params - additional plot parameters
   * @returns image element.
   */
  plot3d(sympyExpressions: PreparedSympyCall[], svg: boolean, onError?: (err: SympyError) => void, intervals?: { i1: PlotInterval, i2: PlotInterval }, params?: Plot3dParams): HTMLImageElement {
    const img = document.createElement("img");
    const self = this;
    if (onError) {
      img.onerror = () => {
        const args: string[] = sympyExpressions.map(e => e.stringify());
        if (intervals) {
          args.push(intervals.i1.asSympyTuple());
          args.push(intervals.i2.asSympyTuple());
        }
        self.client.checkPlotValidity("plot3d", args, svg, params).catch(
          (err: SympyError) => {
            onError(err);
          }
        );
      }
    }
    img.src = this.plot3dSrc(sympyExpressions, svg, intervals, params);
    return img;
  }

   /**
   * Generates image with 2d parametric plot.
   * @param expressionPairs - one or more pair of expressions to generate the parametric plot.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param onError - callback to call in case of error
   * @param interval - optional interval where we need the plot
   * @param params - additional plot parameters
   * @returns image element
   */
  plot2d_parametric(expressionPairs: { x: PreparedSympyCall, y: PreparedSympyCall }[], svg: boolean, onError?: (err: SympyError) => void, interval?: PlotInterval, params?: Plot2dParams): HTMLImageElement {
    const img = document.createElement("img");
    const self = this;
    if (onError) {
      img.onerror = () => {
        const args: string[] = expressionPairs.map(e => {
          return "(" + e.x.stringify() + "," + e.y.stringify() + ")";
        });
        if (interval) {
          args.push(interval.asSympyTuple());
        }
        self.client.checkPlotValidity("plot_parametric", args, svg, params).catch(
          (err: SympyError) => {
            onError(err);
          }
        );
      }
    }
    img.src = this.plot2dParametricSrc(expressionPairs, svg, interval, params);
    return img;
  }

   /**
   * Generates image with 3d parametric plot.
   * @param expressions - one or more triplet of the expressions. Each with its own iterval.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param params - additional plot parameters
   * @param onError - callback to call in case of error
   * @returns image element.
   */
  plot3d_parametric_line(expressions: { x: PreparedSympyCall, y: PreparedSympyCall, z: PreparedSympyCall, interval: PlotInterval }[], svg: boolean, onError?: (err: SympyError) => void, params?: Plot3dParams): HTMLImageElement {
    const img = document.createElement("img");
    const self = this;
    if (onError) {
      img.onerror = () => {
        const args: string[] = expressions.map(e => {
          return "(" + e.x.stringify() + "," + e.y.stringify() + "," + e.z.stringify() + "," + e.interval.asSympyTuple() + ")";
        });
        self.client.checkPlotValidity("plot3d_parametric_line", args, svg, params).catch(
          (err: SympyError) => {
            onError(err);
          }
        );
      }
    }
    img.src = this.plot3dParametricLineSrc(expressions, svg, params);
    return img;
  }

  /**
   * Generates image with 3d parametric plot.
   * @param expressions - one or more triplet of the expressions. Each with its own pair of the itervals.
   * @param svg - if the result must be in SVG (if not, PNG is used)
   * @param params - additional plot parameters
   * @param onError - callback to call in case of error
   * @returns image lement.
   */
  plot3d_parametric_surface(expressions: { x: PreparedSympyCall, y: PreparedSympyCall, z: PreparedSympyCall, r_u: PlotInterval, r_v: PlotInterval }[], svg: boolean, onError?: (err: SympyError) => void, params?: Plot3dParams): HTMLImageElement {
    const img = document.createElement("img");
    const self = this;
    if (onError) {
      img.onerror = () => {
        const args: string[] = expressions.map(e => {
          return "(" + e.x.stringify() + "," + e.y.stringify() + "," + e.z.stringify() + "," + e.r_u.asSympyTuple() + "," + e.r_v.asSympyTuple() + ")";
        });
        self.client.checkPlotValidity("plot3d_parametric_surface", args, svg, params).catch(
          (err: SympyError) => {
            onError(err);
          }
        );
      }
    }
    img.src = this.plot3dParametricSurfaceSrc(expressions, svg, params);
    return img;
  }

  private replaceAll(target: string, search: string, replacement: string) {
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  protected prepare(node: MathNode, operation: MathNodeVisitor<SympyToken>): PreparedSympyCall | SemanticErrorDescription {
    try {
      return new PreparedSympyCall(acceptMathNode(node, operation));
    }
    catch (e) {
      if (e instanceof InvalidNodeError) {
        return e.error;
      }
      throw e;
    }
  }
}

class ComputeOperation extends BaseSymPyVisitor {

  static readonly instance = new ComputeOperation();

  visitDifferential(mathNode: MathDifferential): SympyToken {
    throw new InvalidNodeError(mathNode, "compute operation does not support standalone differential");
  }
  visitSet(mathNode: MathSet): SympyToken {
    throw new InvalidNodeError(mathNode, "compute operation does not support sets");
  }
  visitSystemOfEquations(mathNode: MathSystemOfEquations): SympyToken {
    throw new InvalidNodeError(mathNode, "compute operation does not support system of equations");
  }

}