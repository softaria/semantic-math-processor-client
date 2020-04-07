[semantic-math-processor-client](../README.md) › ["model"](../modules/_model_.md) › [UnsupportedSympyConstruction](_model_.unsupportedsympyconstruction.md)

# Class: UnsupportedSympyConstruction

When calling the async methods of sympy clients, catch this error.
It will be thrown when sympy was able to proceed your request, but we was not able to understand it.
Probably we should support some yet unsupported Sympy construction
You should also be able to get latex from Sympy for the cinstruction returned

## Hierarchy

* [Error](_model_.sympyerror.md#static-error)

  ↳ **UnsupportedSympyConstruction**

## Index

### Constructors

* [constructor](_model_.unsupportedsympyconstruction.md#constructor)

### Properties

* [message](_model_.unsupportedsympyconstruction.md#message)
* [name](_model_.unsupportedsympyconstruction.md#name)
* [stack](_model_.unsupportedsympyconstruction.md#optional-stack)
* [wholeExpression](_model_.unsupportedsympyconstruction.md#wholeexpression)
* [Error](_model_.unsupportedsympyconstruction.md#static-error)

### Accessors

* [preparedSympyCall](_model_.unsupportedsympyconstruction.md#preparedsympycall)

## Constructors

###  constructor

\+ **new UnsupportedSympyConstruction**(`name`: string, `message`: string): *[UnsupportedSympyConstruction](_model_.unsupportedsympyconstruction.md)*

*Defined in [src/model.ts:44](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`message` | string |

**Returns:** *[UnsupportedSympyConstruction](_model_.unsupportedsympyconstruction.md)*

## Properties

###  message

• **message**: *string*

*Inherited from [UnsupportedSympyConstruction](_model_.unsupportedsympyconstruction.md).[message](_model_.unsupportedsympyconstruction.md#message)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Overrides [SympyError](_model_.sympyerror.md).[name](_model_.sympyerror.md#name)*

*Defined in [src/model.ts:43](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L43)*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [SympyError](_model_.sympyerror.md).[stack](_model_.sympyerror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

###  wholeExpression

• **wholeExpression**: *SympyToken*

*Defined in [src/model.ts:44](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L44)*

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:984

## Accessors

###  preparedSympyCall

• **get preparedSympyCall**(): *[PreparedSympyCall](_model_.preparedsympycall.md)*

*Defined in [src/model.ts:54](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L54)*

**Returns:** *[PreparedSympyCall](_model_.preparedsympycall.md)*
