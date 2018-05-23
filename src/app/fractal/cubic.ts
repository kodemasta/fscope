import * as math from 'mathjs'
import { FractalType } from './fractal.type'
import { FractalEquation } from './fractal.equation';
import { FractalConfig } from './fractal.config';



export class Cubic implements FractalEquation {

    fractalType:FractalType;
    fractalConfig:FractalConfig;

    constructor(fractalConfig:FractalConfig) {
        this.fractalType = FractalType.CUBIC
        this.fractalConfig = fractalConfig;
    }

    getConfig() {
        return this.fractalConfig;
    }

    // (x^3 - 3 x y^2 + a) + i (3 x^2 y - y^3 + b) 
    // mag: sqrt((a + x^3 - 3 x y^2)^2 + (b + 3 x^2 y - y^3)^2)
    iterate(z, c, iterations: number, escapeRadius: number) {

        var x = z.re;
        var y = z.im;
        var x2 = x * x; //squared z re
        var y2 = y * y; //squared z im
        var x3 = x * x2; //cubed z re
        var y3 = y * y2; //cubed z im
        var x2y = x * x * y; 
        var xy2 = x * y * y; 
       
        let n = 0;
        for (; n < iterations && (x2 + y2) <= escapeRadius; ++n) {
            y = 3 * x2y - y3 + c.im;
            x = x3 - 3*xy2 + c.re;
            x2 = x * x; //squared z re
            y2 = y * y; //squared z im
            x3 = x * x2; //cubed z re
            y3 = y * y2; //cubed z im
            x2y = x * x * y; 
            xy2 = x * y * y; 
        }

//         /*
//   * Four more iterations to decrease error term;
//   * see http://linas.org/art-gallery/escape/escape.html
//   */
//         for (let e = 0; e < 4; ++e) {
//             y = 2 * x * y + c.im;
//             x = x2 - z_i_2 + c.re;
//             x2 = x * x;
//             z_i_2 = y * y;
//         }

        return [n, x2, x2];
    }


   
    static toString(){
        return "Cubic: f(z) = z^3 + c";
    }

    getType() {
        return this.fractalType;
    }
}
