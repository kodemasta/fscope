
export class FractalColor {
    static interiorColor = [255, 255, 255, 255];

    pickColorHSV1(steps, n, Tr, Ti) {
        if (n == steps) // converged?
            return FractalColor.interiorColor;

        var v = FractalColor.smoothColor(steps, n, Tr, Ti);
        var c = FractalColor.hsv_to_rgb(360.0 * v / steps, 1.0, 1.0);
        c.push(255); // alpha
        return c;
    }

    pickColorHSV2(steps, n, Tr, Ti) {
        if (n == steps) // converged?
            return FractalColor.interiorColor;

        var v = FractalColor.smoothColor(steps, n, Tr, Ti);
        var c = FractalColor.hsv_to_rgb(360.0 * v / steps, 1.0, 10.0 * v / steps);
        c.push(255); // alpha
        return c;
    }

    pickColorHSV3(steps, n, Tr, Ti) {
        if (n == steps) // converged?
            return FractalColor.interiorColor;

        var v = FractalColor.smoothColor(steps, n, Tr, Ti);
        var c = FractalColor.hsv_to_rgb(360.0 * v / steps, 1.0, 10.0 * v / steps);

        // swap red and blue
        var t = c[0];
        c[0] = c[2];
        c[2] = t;

        c.push(255); // alpha
        return c;
    }

    /*
     * Convert hue-saturation-value/luminosity to RGB.
     *
     * Input ranges:
     *   H =   [0, 360] (integer degrees)
     *   S = [0.0, 1.0] (float)
     *   V = [0.0, 1.0] (float)
     */
    static hsv_to_rgb(h, s, v) {
        if (v > 1.0) v = 1.0;
        var hp = h / 60.0;
        var c = v * s;
        var x = c * (1 - Math.abs((hp % 2) - 1));
        var rgb = [0, 0, 0];

        if (0 <= hp && hp < 1) rgb = [c, x, 0];
        if (1 <= hp && hp < 2) rgb = [x, c, 0];
        if (2 <= hp && hp < 3) rgb = [0, c, x];
        if (3 <= hp && hp < 4) rgb = [0, x, c];
        if (4 <= hp && hp < 5) rgb = [x, 0, c];
        if (5 <= hp && hp < 6) rgb = [c, 0, x];

        var m = v - c;
        rgb[0] += m;
        rgb[1] += m;
        rgb[2] += m;

        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    }
    public pickColorGrayscale(steps, n, Tr, Ti) {
        if (n == steps) // converged?
            return FractalColor.interiorColor;

        var v = FractalColor.smoothColor(steps, n, Tr, Ti);
        v = Math.floor(512.0 * v / steps);
        
        v = 255*n/steps;
        if (v > 255) v = 255;
        return [v, v, v, 255];
    }

    pickColorGrayscale2(steps, n, z_r_2, z_i_2) {
        if (n == steps) { // converged?
            //var c = 255 - Math.floor(255.0 * Math.sqrt(z_r_2 + z_i_2)) % 255;
            //c = c<0?0:(c>255)?255:c;
            //return [c, c, c, 255];
            return [255, 255, 255, 255];
        }

        return this.pickColorGrayscale(steps, n, z_r_2, z_i_2);
    }

    pickBlackAndWhite(steps, n, z_r_2, z_i_2) {
        if (n == steps) { // converged?
            return [255, 255, 255, 255];
        }
        return [0, 0, 0, 255];
    }

    static logBase = 1.0 / Math.log(2.0);
    static logHalfBase = Math.log(0.5) * FractalColor.logBase;
    static smoothColor(steps, n, Tr, Ti) {
        /*
        * Original smoothing equation is
        *
        * var v = 1 + n - Math.log(Math.log(Math.sqrt(Zr*Zr+Zi*Zi)))/Math.log(2.0);
        *
        * but can be simplified using some elementary logarithm rules to
        */
        return 5 + n - FractalColor.logHalfBase - Math.log(Math.log(Tr + Ti)) * FractalColor.logBase;
    }

}