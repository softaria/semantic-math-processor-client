# semantic-math-processor-client

[![Build](https://github.com/softaria/semantic-math-processor-client/workflows/Build/badge.svg)](https://github.com/softaria/semantic-math-processor-client/actions?query=workflow%3ABuild)
[![Test](https://github.com/softaria/semantic-math-processor-client/workflows/Test/badge.svg)](//github.com/softaria/semantic-math-processor-client/actions?query=workflow%3ATest)
[![npm](https://img.shields.io/npm/v/semantic-math-processor-client)](https://www.npmjs.com/package/semantic-math-processor-client)


Semantic Math Processor Client is a plugin for [SemanticMathEditor](https://github.com/softaria/semantic-math-editor) and a client for [MathProcessor](https://github.com/softaria/math-processor).

Being a plugin for SemanticMathEditor **it allows processing math formula created in the online math editor** using MathProcessor - a REST wrapper around [Sympy](https://sympy.org) - open source Computer Algebra System.

As a result you have online web editor, which can do things like integration, taking derivatives, calculating limits, creating plots, comparing if two math expressions are equivalent and so on.

# See it in action

https://math-editor.com/integrationsDemo.html

# Try it locally

1. Checkout the project
2. Ensure you have [npm](https://www.npmjs.com/get-npm) and [node.js](https://nodejs.org/en/download/)
3. Run following commands
```
npm install
node node_modules/.bin/webpack
```

4. Open testEquiv.html and testSimplify.html in you browser (do not move the html files - open them in place)

By default it communicates with our copy of the MathProcessor installed at https://math-processor.math-editor.com

Feel free to run your own copy of the [MathProcessor](https://github.com/softaria/math-processor) and replace its address in testEquiv.html and testSimplify.html with your host name or localhost. 

To start your own copy of the MathProcessor just run:

```
  docker run -d -p "80:5000" softaria/math-processor
```
where 80 is your local port

# Install it from npm

```
npm i semantic-math-processor-client
```

# Read the documentation

https://softaria.github.io/semantic-math-processor-client


