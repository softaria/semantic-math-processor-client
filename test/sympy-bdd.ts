import * as chai from "chai";
import "./test-helper";
import { parseSympyExpression, SympyStringify, SympyFunction } from "../src/sympy-parser";
import { fromSympy } from "../src/from-sympy";
import { UnsupportedSympyConstruction } from "../src/model";

const expect = chai.expect;

describe("Sympy parser:", () => {
  it("Test unknown construction",()=>{

    const exp = "Point2D(UnknownConstruction('w_Integer(62)_Float(86.29)'),log(Symbol('Xi')))";
    const token = parseSympyExpression(exp);
    expect(token.accept(SympyStringify.instance)).eq(exp);
    try {
      fromSympy(token);

      expect.fail();
    }
    catch(e) {
      if(e instanceof UnsupportedSympyConstruction) {
        expect(e.name).eq("UnknownConstruction");
      }
      else {
        expect.fail();
      }
    }

  })

  it("tests special symbols within quotes",()=>{
    const exp = "Point2D(Symbol('w_Integer(62)_Float(86.29)'),log(Symbol('Xi')))";
    const token = parseSympyExpression(exp);
    expect(token.accept(SympyStringify.instance)).eq(exp);
  })

  it("tests parser", () => {
    const token = parseSympyExpression("Add(Pow(Integer(2), Symbol('x')), Mul(Symbol('x'), Symbol('y')))");
    expect(JSON.stringify(token)).eq(JSON.stringify(
      {
        "type": "Add",
        "args": [
          {
            "type": "Pow",
            "args": [
              {
                "type": "Integer",
                "args": [
                  {
                    "type": "$String",
                    "v": "2"
                  }
                ]
              },
              {
                "type": "Symbol",
                "args": [
                  {
                    "type": "$String",
                    "v": "'x'"
                  }
                ]
              }
            ]
          },
          {
            "type": "Mul",
            "args": [
              {
                "type": "Symbol",
                "args": [
                  {
                    "type": "$String",
                    "v": "'x'"
                  }
                ]
              },
              {
                "type": "Symbol",
                "args": [
                  {
                    "type": "$String",
                    "v": "'y'"
                  }
                ]
              }
            ]
          }
        ]
      }
      ));
  });

  it("parses manual integration result", () => {
    const manualIntegrationResult = "(Add(Pow(Symbol('x'), Integer(4)), Mul(Integer(6), Pow(Symbol('x'), Integer(2))), Integer(9)), ([(Symbol('x'), Integer(4), Pow(Symbol('x'), Integer(4)), Symbol('x')), (Integer(6), Pow(Symbol('x'), Integer(2)), (Symbol('x'), Integer(2), Pow(Symbol('x'), Integer(2)), Symbol('x')), Mul(Integer(6), Pow(Symbol('x'), Integer(2))), Symbol('x')), (Integer(9), Integer(9), Symbol('x'))], Add(Pow(Symbol('x'), Integer(4)), Mul(Integer(6), Pow(Symbol('x'), Integer(2))), Integer(9)), Symbol('x')), Pow(Add(Pow(Symbol('x'), Integer(2)), Integer(3)), Integer(2)), Symbol('x'))";
    const token = parseSympyExpression(manualIntegrationResult);
    expect(JSON.stringify(token)).eq(JSON.stringify({"type":"$Array","args":[{"type":"Add","args":[{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"4"}]}]},{"type":"Mul","args":[{"type":"Integer","args":[{"type":"$String","v":"6"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]}]},{"type":"Integer","args":[{"type":"$String","v":"9"}]}]},{"type":"$Array","args":[{"type":"$Array","args":[{"type":"$Array","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"4"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"4"}]}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false},{"type":"$Array","args":[{"type":"Integer","args":[{"type":"$String","v":"6"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]},{"type":"$Array","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false},{"type":"Mul","args":[{"type":"Integer","args":[{"type":"$String","v":"6"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false},{"type":"$Array","args":[{"type":"Integer","args":[{"type":"$String","v":"9"}]},{"type":"Integer","args":[{"type":"$String","v":"9"}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false}],"square":true},{"type":"Add","args":[{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"4"}]}]},{"type":"Mul","args":[{"type":"Integer","args":[{"type":"$String","v":"6"}]},{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]}]},{"type":"Integer","args":[{"type":"$String","v":"9"}]}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false},{"type":"Pow","args":[{"type":"Add","args":[{"type":"Pow","args":[{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]},{"type":"Integer","args":[{"type":"$String","v":"3"}]}]},{"type":"Integer","args":[{"type":"$String","v":"2"}]}]},{"type":"Symbol","args":[{"type":"$String","v":"'x'"}]}],"square":false}));

  });

  it("parses function", () => {
    const manualIntegrationResult = "Add(Function('f')(Integer(3)),Integer(5))";
    const token = parseSympyExpression(manualIntegrationResult);
    
    expect(JSON.stringify(token)).eq(JSON.stringify({"type":"Add","args":[{"type":"Function","args":[{"type":"Integer","args":[{"type":"$String","v":"3"}]}],"name":"f"},{"type":"Integer","args":[{"type":"$String","v":"5"}]}]} ));
  });

  it("parses Complexes",()=>{
    const c = fromSympy(new SympyFunction("Complexes",[]));
    expect(JSON.stringify(c)).eq(JSON.stringify({"type":"structure","name":"numericSet","symbols":{},"errors":[],"value":"C"}));
  })
  
});
