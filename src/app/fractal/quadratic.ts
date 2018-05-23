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

        var z_r = z.re;
        var z_i = z.im;
        var z_r_2 = z_r * z_r; //squared z re
        var z_i_2 = z_i * z_i; //squared z im
        let n = 0;
        for (; n < iterations && (z_r_2 + z_i_2) <= escapeRadius; ++n) {
            z_i = 2 * z_r * z_i + c.im;
            z_r = z_r_2 - z_i_2 + c.re;
            z_r_2 = z_r * z_r;
            z_i_2 = z_i * z_i;
        }

        /*
  * Four more iterations to decrease error term;
  * see http://linas.org/art-gallery/escape/escape.html
  */
        for (let e = 0; e < 4; ++e) {
            z_i = 2 * z_r * z_i + c.im;
            z_r = z_r_2 - z_i_2 + c.re;
            z_r_2 = z_r * z_r;
            z_i_2 = z_i * z_i;
        }

        return [n, z_r_2, z_i_2];
    }


   
    static toString(){
        return "Quadratic: f(z) = z^2 + c";
    }

    getType() {
        return this.fractalType;
    }
}
