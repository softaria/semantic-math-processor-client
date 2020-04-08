Semantic Math Processor Client is a plugin for [SemanticMathEditor](https://github.com/softaria/semantic-math-editor) and a client for [MathProcessor](https://github.com/softaria/math-processor).

Being a plugin for SemanticMathEditor **it allows processing math formula created in the online math editor** using MathProcessor - a REST wrapper around [Sympy](https://sympy.org) - open source Computer Algebra System.

As a result you have online web editor, which can do things like integration, taking derivatives, calculating limits, creating plots, comparing if two math expressions are equivalent and so on.

# Links

See it in action:

https://math-editor.com/integrationsDemo.html

See it's sources

https://github.com/softaria/semantic-math-processor-client


# Quick start

Install it

```bash
npm i semantic-math-processor-client

```
Install [SemanticMathEditor](https://github.com/softaria/semantic-math-editor)

```bash
npm i semantic-math-editor
```

Import required classes

```typescript
import {
  SympyClient,
  PreparedSympyCall,
  SympyError,
  EquivResponse,
  Equiv,
  Simpler,
  getAllVariablesFromNodes
} from "semantic-math-processor-client";

import { 
  MathVariable, 
  MathNumber, 
  MathPlus, 
  MathPower, 
  MathTrigonometricFunction, 
  MathTrigonometryType
} from "semantic-math-editor";

```

Create new client:

```typescript
 const sympyClient = new SympyClient("https://math-processor.math-editor.com");

```

Feel free to use your own installation of the [MathProcessor](https://github.com/softaria/math-processor) instead of oe installed at https://math-processor.math-editor.com

Simplify sum of squared sinus and squared cosinus:

```typescript
 const expression = new MathPlus(
  new MathPower(new MathTrigonometricFunction(MathTrigonometryType.sin, new MathVariable("x", false)), new MathNumber("2")),
  new MathPower(new MathTrigonometricFunction(MathTrigonometryType.cos, new MathVariable("x", false)), new MathNumber("2")),
);

const preparedCall = client.prepareCompute(expression);

if (preparedCall instanceof PreparedSympyCall) {
  sympyClient.simplify(preparedCall).then(
    (simplified) => {
      console.log(JSON.stringify(simplified));
    }
  ).catch(
    (error) => {
      console.log("ERROR:" + JSON.stringify(error));
      alert("Sympy error. See log for details");
    }
  );
}
else {
  alert("Can't convert the expression to sympy");
}
```
# Detailed documentation

Please click on the module name below.



