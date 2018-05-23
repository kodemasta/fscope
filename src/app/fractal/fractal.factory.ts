import { Quadratic } from './quadratic';  
import { Cubic } from './cubic';  
import { FractalEquation } from './fractal.equation';  
import { FractalType } from './fractal.type';  
import { FractalConfig } from './fractal.config';  
import { Rectangle } from './rectangle'
import { IterationType } from './iteration.type';
import * as math from 'mathjs';

export class FractalFactory {
    static createFractal(fractalType:FractalType, iterationType:IterationType): FractalEquation
    { 
        switch(+fractalType){
            case FractalType.QUADRATIC:{
                let config = new FractalConfig();
                config.setIterationType(iterationType);
                switch(+iterationType){
                    case IterationType.MANDELBROT:
                        config.setFractalRegion(new Rectangle(-1.6, -1.125, 2.25, 2.25));
                        break;
                    case IterationType.JULIA:
                        config.setFractalRegion(new Rectangle(-1.6, -1.6, 3.2, 3.2));
                        break;
                }
                return new Quadratic(config);
            }
            case FractalType.CUBIC:{
                let config = new FractalConfig();
                config.setFractalRegion(new Rectangle(-1.5, -1.5, 3, 3));
                config.setIterationType(iterationType);
                config.setConstant(math.complex(0,0));
                console.log("new julia point: (" + config.getConstant().re + ", " + config.getConstant().im + ")");
                return new Cubic(config);
            }
        }

        console.error('Fractal Type not found: ' + fractalType);
        return null;
    }

}