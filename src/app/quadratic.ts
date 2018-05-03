import * as math from 'mathjs'
import { FractalType } from './fractal.type'
import { FractalEquation } from './fractal.equation';
import { FractalConfig } from './fractal.config';



export class Quadratic implements FractalEquation {

    fractalType:FractalType;
    fractalConfig:FractalConfig;

    constructor(fractalConfig:FractalConfig) {
        this.fractalType = FractalType.QUADRATIC;
        this.fractalConfig = fractalConfig;
    }

    getConfig() {
        return this.fractalConfig;
    }

    iterate(z, c, iterations: number, escapeRadius: number) {

        var Zr = z.re;
        var Zi = z.im;
        var Tr = Zr * Zr; //squared z re
        var Ti = Zi * Zi; //squared z im
        let n = 0;
        for (; n < iterations && (Tr + Ti) <= escapeRadius; ++n) {
            Zi = 2 * Zr * Zi + c.im;
            Zr = Tr - Ti + c.re;
            Tr = Zr * Zr;
            Ti = Zi * Zi;
        }

        /*
  * Four more iterations to decrease error term;
  * see http://linas.org/art-gallery/escape/escape.html
  */
        for (var e = 0; e < 4; ++e) {
            Zi = 2 * Zr * Zi + c.im;
            Zr = Tr - Ti + c.re;
            Tr = Zr * Zr;
            Ti = Zi * Zi;
        }

        return [n, Tr, Ti];
        // for (let i = 0; i < limit; ++i) {
        //     let z2 = math.multiply(z,z)
        //     z = z2.add(c);
        //     z2 = math.square(z);

        //     if (math.norm(z) > escape)
        //         return i;
        // }
        // return limit-1;
    }


   
    public toString(){
        return "Quadratic: f(z) = z^2 + c";
    }

    getType() {
        return this.fractalType;
    }
}
