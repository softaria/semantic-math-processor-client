import * as chai from "chai";
import "./test-helper";
import { SympyClient } from "../src/sympy-client";
import { MathTree, createEditorImpl, HttpClient, MathNode, acceptMathNode, MathNodePrinter, MathFunction, MathVariable, MathNumber, MathDeterminant, MathPiecewiseFunction, MathEquality, MathEqualityType, MathAnd, MathUnaryMinus, MathRawText, MathStructure, SemanticErrorDescription, MathPlus, MathPower, MathTrigonometricFunction, MathTrigonometryType, MathLimit, MathLimitType, MathDerivative, MathDerivativeType, MathNodeType, MathNodeName, MathNumericSet, MathNumericSetValues } from "semantic-math-editor";
import {test as mt} from "semantic-math-editor"
import axios from "axios";
import { SympyError, PreparedSympyCall, UnsupportedSympyConstruction, Equiv, Simpler } from "../src/model";

const expect = chai.expect;
const SERVER_ADDRESS = "https://math-processor.math-editor.com";
//const SERVER_ADDRESS = "http://localhost:5000";

class AxiousBasedHttpClient implements HttpClient {
  requestAsync<Request, Response>(method: "GET" | "POST", url: string, content?: Request, callback?: (response: Response) => void, errorCallback?: (err: any) => void): void {
    switch (method) {
      case "GET":
        axios.get(url).then((result) => {
          callback(result.data);
        }).catch((error) => {
          console.log("ERROR:" + JSON.stringify(error));
          errorCallback(error);
        });
        break;
      case "POST":
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
          }
        };

        axios.post(url, content, axiosConfig).then((result) => {
          callback(result.data);
        }).catch((error) => {
          console.log("ERROR:" + JSON.stringify(error));
          errorCallback(error);
        });;
        break;
    }
  }
}

const client = new SympyClient(SERVER_ADDRESS, new AxiousBasedHttpClient());

async function testSympyClient(node: MathNode) {

  it("tests sympy client " + acceptMathNode(node, MathNodePrinter.instance), async function () {
    this.timeout(20000);
    const preparedCall = client.prepareCompute(node);
    if (preparedCall instanceof PreparedSympyCall) {
      try {
        const result = await client.mirror(preparedCall);

        console.log("SYMPY OUTPUT:" + acceptMathNode(result, MathNodePrinter.instance));
      }
      catch (e) {
        if (e instanceof SympyError) {
          console.log("SYMPY CRASH:" + e.code + "/" + e.message);
        }
        else {

          console.log("SYMPY UNSUPPORTED INPUT as JSON:" + JSON.stringify(node));
          console.log("PREPARED: " + JSON.stringify(preparedCall));
          console.log("WAS SENT TO SYMPY: " + preparedCall.stringify());

          if (e instanceof UnsupportedSympyConstruction) {
            expect.fail("Unsupported construction" + e.name + "/" + e.message + "/" + e.preparedSympyCall.stringify());
          }
          else {
            console.log(e.name+"/"+e.message);
            throw e;
          }
        }
      }
    }
    else {
      if (preparedCall instanceof SemanticErrorDescription) {
        console.log("SYMPY ERROR:" + preparedCall.description);
      }
    }
  });


}

const iterations = process.env.environment_ci ? 1000 : 20;
mt.loadTestFunction().then(ts=>ts(3, 2, iterations, [testSympyClient], []));
testSympyClient(new MathNumericSet(MathNumericSetValues.C));
testSympyClient(new MathNumericSet(MathNumericSetValues.N));
testSympyClient(new MathNumericSet(MathNumericSetValues.Q));
testSympyClient(new MathNumericSet(MathNumericSetValues.R));
testSympyClient(new MathNumericSet(MathNumericSetValues.Z));


async function mirror(node: MathNode, expectedNode?: any, log?: boolean) {
  const preparedCall = client.prepareCompute(node);
  expect(preparedCall).instanceOf(PreparedSympyCall);
  if (log) {
    console.log("PREPARED CALL:" + JSON.stringify(preparedCall));
  }
  const result = await client.mirror(preparedCall as PreparedSympyCall, log);

  expect(JSON.stringify(result)).eq(JSON.stringify(expectedNode ? expectedNode : node));
}

function oneAsTrig(): PreparedSympyCall {
  const e = client.prepareCompute(new MathPlus(
    new MathPower(new MathTrigonometricFunction(MathTrigonometryType.sin, new MathVariable("x", false)), new MathNumber("2")),
    new MathPower(new MathTrigonometricFunction(MathTrigonometryType.cos, new MathVariable("x", false)), new MathNumber("2")),
  )) as PreparedSympyCall;
  expect(e).instanceOf(PreparedSympyCall);
  return e;
}

function oneAsPlain(): PreparedSympyCall {
  const e = client.prepareCompute(new MathNumber("1")) as PreparedSympyCall;
  expect(e).instanceOf(PreparedSympyCall);
  return e;
}

function twoAsPlain(): PreparedSympyCall {
  const e = client.prepareCompute(new MathNumber("2")) as PreparedSympyCall;
  expect(e).instanceOf(PreparedSympyCall);
  return e;
}

function oneAsLim(): PreparedSympyCall {
  const e = client.prepareCompute(
    new MathLimit(new MathVariable("x", false), new MathVariable("x", false), new MathNumber("1"), MathLimitType.unspecified)
  ) as PreparedSympyCall;
  expect(e).instanceOf(PreparedSympyCall);
  return e;
}

function oneAsDer(): PreparedSympyCall {
  const e = client.prepareCompute(new MathDerivative(new MathVariable("x",false),1,MathDerivativeType.prime)) as PreparedSympyCall;
  expect(e).instanceOf(PreparedSympyCall);
  return e;
}

describe("Sympy client:", () => {


  it("check equivalence", async function () {
    this.timeout(20000);
    const trig = oneAsTrig();
    const plain = oneAsPlain();
    const two = twoAsPlain();
    const lim = oneAsLim();
    const der = oneAsDer();

    let result = await client.checkEquivalence(trig, plain);
    expect(result.eq).eq(Equiv.equiv);
    expect(result.si).eq(Simpler.second);

    result = await client.checkEquivalence(plain,trig);
    expect(result.eq).eq(Equiv.equiv);
    expect(result.si).eq(Simpler.first);

    result = await client.checkEquivalence(trig, lim);
    expect(result.eq).eq(Equiv.equivCalc);
    expect(result.si).eq(Simpler.second);
    
    result = await client.checkEquivalence(lim, plain);
    expect(result.eq).eq(Equiv.equivCalc);
    expect(result.si).eq(Simpler.second);
    
    result = await client.checkEquivalence(trig, trig);
    expect(result.eq).eq(Equiv.identical);
    expect(result.si).eq(Simpler.none);

    result = await client.checkEquivalence(lim, der);
    expect(result.eq).eq(Equiv.equivCalc);
    expect(result.si).eq(Simpler.first);
    

    const notTrue = await client.checkEquivalence(trig, two);
    expect(notTrue.eq).eq(Equiv.different);
    expect(notTrue.si).eq(Simpler.unknown);



  })

  it("check simplify", async function () {
    this.timeout(20000);

    const result = await client.simplify(oneAsTrig());

    expect(JSON.stringify(result)).eq(JSON.stringify({ "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "1" }));

    const result3 = await client.compute(oneAsLim());

    expect(JSON.stringify(result3)).eq(JSON.stringify({ "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "1" }));

    const result2 = await client.simplify(oneAsLim());

    expect(JSON.stringify(result2)).eq(JSON.stringify({ "type": "structure", "name": "limit", "symbols": {}, "errors": [], "func": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "input": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "value": { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "1" }, "limitType": "right" }));



  })

  it("tests user function", async function () {
    this.timeout(20000);
    const node = new MathFunction(new MathVariable("x", false), [new MathNumber("1.2")]);
    await mirror(node);

  })

  it("tests right limit", async function () {
    this.timeout(20000);
    const node = new MathLimit(new MathVariable("x",false),new MathVariable("x",false),new MathNumber("1"),MathLimitType.right);
    await mirror(node);

  })


  it("tests latex", async function () {
    this.timeout(2000);
    const call = client.prepareCompute(new MathFunction(new MathVariable("x", false), [new MathNumber("1.2")]));
    expect(call).instanceOf(PreparedSympyCall);
    const latex = await client.latex(call as PreparedSympyCall);
    expect(latex).eq("x{\\left(1.2 \\right)}");
  })

  it("tests matrix", async function () {
    this.timeout(20000);
    await mirror(new MathDeterminant([
      [new MathNumber("1"), new MathNumber("2")],
      [new MathNumber("3"), new MathNumber("4")]
    ]));
  })

  it("tests piecewise", async function () {
    this.timeout(20000);


    const expected = { "type": "structure", "name": "piecewiseFunction", "symbols": {}, "errors": [], "elements": [{ "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "2" }, { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "5" }], "predicates": [{ "type": "structure", "name": "equality", "symbols": {}, "errors": [], "equalityType": "greaterThan", "left": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "right": { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "0" } }, { "type": "structure", "name": "equality", "symbols": {}, "errors": [], "equalityType": "greaterThan", "left": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "right": { "type": "structure", "name": "unaryMinus", "symbols": {}, "errors": [], "expression": { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "2" } } }, { "type": "structure", "name": "equality", "symbols": {}, "errors": [], "equalityType": "lessThan", "left": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "right": { "type": "structure", "name": "unaryMinus", "symbols": {}, "errors": [], "expression": { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "2" } } }] };

    await mirror(new MathPiecewiseFunction(
      [new MathVariable("x", false), new MathNumber("2"), new MathNumber("5")],
      [
        new MathEquality(MathEqualityType.greaterThan, new MathVariable("x", false), new MathNumber("0")),
        new MathAnd(
          new MathEquality(MathEqualityType.lessOrEquals, new MathVariable("x", false), new MathNumber("0")),
          new MathEquality(MathEqualityType.greaterThan, new MathVariable("x", false), new MathUnaryMinus(new MathNumber("2")))
        ),
        new MathEquality(MathEqualityType.lessThan, new MathVariable("x", false), new MathUnaryMinus(new MathNumber("2")))
      ]), expected)
  })

  it("tests piecewise with True", async function () {
    this.timeout(20000);


    const expected = { "type": "structure", "name": "piecewiseFunction", "symbols": {}, "errors": [], "elements": [{ "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "2" }], "predicates": [{ "type": "structure", "name": "equality", "symbols": {}, "errors": [], "equalityType": "greaterThan", "left": { "type": "structure", "name": "variable", "symbols": { "comma": [] }, "errors": [], "indexes": [], "value": "x", "isGreek": false }, "right": { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "0" } }, { "type": "structure", "name": "number", "symbols": { "symbols": [] }, "errors": [], "value": "1" }] }

    await mirror(new MathPiecewiseFunction(
      [new MathVariable("x", false), new MathNumber("2")],
      [
        new MathEquality(MathEqualityType.greaterThan, new MathVariable("x", false), new MathNumber("0")),
        new MathEquality(MathEqualityType.lessOrEquals, new MathVariable("x", false), new MathNumber("0"))
      ]), expected)
  })

  it("test approach", async function () {
    this.timeout(20000);

    const editor = createEditorImpl();

    editor.paste("\\int_{0}^{1} {2x} d x");

    const tree = new MathTree(editor); 
    const node = tree.getTree();

    const preparedCall = client.prepareCompute(node);
    if (preparedCall instanceof PreparedSympyCall) {
      const result = await client.compute(preparedCall);
      const r = result as MathRawText;
      console.log(r.text);
    }
    else {
      throw new Error();
    }
  })

  it("test low indexes", () => {
    const editor = createEditorImpl();

    editor.paste("{\\Psi }_{2,36}");

    const tree = new MathTree(editor);
    const node = tree.getTree();

    const token = client.prepareCompute(node);
    if (token instanceof PreparedSympyCall) {
      console.log(token.stringify());
      console.log(acceptMathNode(node, MathNodePrinter.instance));
    }
  })

 
  
  
});

