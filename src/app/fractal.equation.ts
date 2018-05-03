import { FractalType } from './fractal.type'
import { FractalConfig } from './fractal.config';

export interface FractalEquation {
    iterate(z, c, limit: number, escape: number);
    getConfig():FractalConfig;
    getType():FractalType;
}
