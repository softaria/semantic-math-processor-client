import { IRawProperty } from '../property/IRawProperty';
import { QualifiedParameters } from './configuration/QualifiedParameters';
/** @hidden */
declare type MinimalQualifiedParameters<Ts> = Pick<QualifiedParameters<Ts>, 'unbiased' | 'timeout' | 'skipAllAfterTimeLimit' | 'interruptAfterTimeLimit'>;
/** @hidden */
export declare function decorateProperty<Ts>(rawProperty: IRawProperty<Ts>, qParams: MinimalQualifiedParameters<Ts>): IRawProperty<Ts, boolean>;
export {};
