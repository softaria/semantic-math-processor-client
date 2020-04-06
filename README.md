# semantic-math-processor-client

Semantic Math Processor Client is a plugin for [SemanticMathEditor](https://github.com/softaria/semantic-math-editor) and a client for [MathProcessor](https://github.com/softaria/math-processor).

Being a plugin for SemanticMathEditor **it allows processing math formula created in the online math editor** using MathProcessor - a REST wrapper around [Sympy](https://sympy.org) - open source Computer Algebra System.

As a result you have online web editor, which can do things like integration, taking derivatives, calculating limits, creating plots, comparing if two math expressions are equivalent and so on.

# How to try it

1. Checkout the project
2. Ensure you have [npm](https://www.npmjs.com/get-npm) and [node.js](https://nodejs.org/en/download/)
3. Run following commands
```
npm install
node node_modules/.bin/webpack
```

4. Open testEquiv.html and testSimplify.html in you browser (do not move the html files - open them in place)

# How to install it

```
npm i semantic-math-processor-client
```
