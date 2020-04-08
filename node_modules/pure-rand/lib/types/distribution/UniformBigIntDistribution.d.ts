import Distribution from './Distribution';
import { RandomGenerator } from '../generator/RandomGenerator';
declare function uniformBigIntDistribution(from: any, to: any): Distribution<any>;
declare function uniformBigIntDistribution(from: any, to: any, rng: RandomGenerator): [any, RandomGenerator];
export { uniformBigIntDistribution };
