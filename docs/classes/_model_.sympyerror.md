[semantic-math-processor-client](../README.md) › ["model"](../modules/_model_.md) › [SympyError](_model_.sympyerror.md)

# Class: SympyError

When calling the async methods of sympy clients, catch this error
It will be thrown when sympy REST service is not reachable (CONNECTION_ERROR)
When the request has bad format (BAD_ARGUMENT and BAD_METHOD)
And when sympy was not able to proceed for some internal reason (METHOD_FAILURE)

## Hierarchy

* [Error](_model_.sympyerror.md#static-error)

  ↳ **SympyError**

## Index

### Constructors

* [constructor](_model_.sympyerror.md#constructor)

### Properties

* [code](_model_.sympyerror.md#code)
* [message](_model_.sympyerror.md#message)
* [name](_model_.sympyerror.md#name)
* [stack](_model_.sympyerror.md#optional-stack)
* [Error](_model_.sympyerror.md#static-error)

## Constructors

###  constructor

\+ **new SympyError**(`code`: [SympyErrorCode](../enums/_model_.sympyerrorcode.md), `message`: string): *[SympyError](_model_.sympyerror.md)*

*Defined in [src/model.ts:23](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`code` | [SympyErrorCode](../enums/_model_.sympyerrorcode.md) |
`message` | string |

**Returns:** *[SympyError](_model_.sympyerror.md)*

## Properties

###  code

• **code**: *[SympyErrorCode](../enums/_model_.sympyerrorcode.md)*

*Defined in [src/model.ts:22](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L22)*

___

###  message

• **message**: *string*

*Overrides [UnsupportedSympyConstruction](_model_.unsupportedsympyconstruction.md).[message](_model_.unsupportedsympyconstruction.md#message)*

*Defined in [src/model.ts:23](https://github.com/softaria/semantic-math-processor-client/blob/569d001/src/model.ts#L23)*

___

###  name

• **name**: *string*

*Inherited from [SympyError](_model_.sympyerror.md).[name](_model_.sympyerror.md#name)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [SympyError](_model_.sympyerror.md).[stack](_model_.sympyerror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:984
