import { Quadratic } from './quadratic';  
import { FractalEquation } from './fractal.equation';  
import { FractalType } from './fractal.type';  
import { FractalConfig } from './fractal.config';  

export class FractalFactory {
    static createFractal(fractalConfig:FractalConfig, type:FractalType): FractalEquation
    { 
        switch(type){
            case FractalType.QUADRATIC:
                return new Quadratic(fractalConfig);
        }

        return null;
    }

}