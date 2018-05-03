import { Quadratic } from './quadratic';
import { FractalConfig } from './fractal.config';
import { FractalEquation } from './fractal.equation';
import { Rectangle } from './rectangle';

import * as math from 'mathjs'

export class FractalImage {

    /** This is a limit for the iteration to break at. Successive iterations will
	 * converge or diverge at a particular rate based on the initial location and iterative
	 * function in the complex plane. The 'velocity' of the iteration escape is the metric used to
	 * map an RGB color for function display **/
    protected escapeRadius = 4.0;

	/** This is a maximum limit on number of iterations if escape radius not met. This is a critical
	 * parameter and directly maps to the runtime memory footprint of the application. Larger values
	 * allow for finer grain detail iteration orbits before they are considered escaped.   **/
    protected maxIterations = 2048;

    protected zoomLevel = 0;

    protected fractal:FractalEquation;

    constructor() {

    }

    setFractal(fractal:FractalEquation) {
        this.fractal = fractal;
    }

    getFractal() {
        return this.fractal;
    }


    getZoom(): any {
        return this.zoomLevel;
    }

    setZoom(zoom): any {
        this.zoomLevel = zoom;
    }

    // Some constants used with smoothColor
    logBase = 1.0 / Math.log(2.0);
    logHalfBase = Math.log(0.5) * this.logBase;
    interiorColor = [0, 0, 0, 255];

    public pickColorGrayscale(steps, n, Tr, Ti) {
        if (n == steps) // converged?
            return this.interiorColor;

        var v = this.smoothColor(steps, n, Tr, Ti);
        v = Math.floor(512.0 * v / steps);
        if (v > 255) v = 255;
        return [v, v, v, 255];
    }

    pickColorGrayscale2(steps, n, Tr, Ti) {
        if (n == steps) { // converged?
            var c = 255 - Math.floor(255.0 * Math.sqrt(Tr + Ti)) % 255;
            if (c < 0) c = 0;
            if (c > 255) c = 255;
            return [c, c, c, 255];
        }

        return this.pickColorGrayscale(steps, n, Tr, Ti);
    }

    public smoothColor(steps, n, Tr, Ti) {
        /*
        * Original smoothing equation is
        *
        * var v = 1 + n - Math.log(Math.log(Math.sqrt(Zr*Zr+Zi*Zi)))/Math.log(2.0);
        *
        * but can be simplified using some elementary logarithm rules to
        */
        return 5 + n - this.logHalfBase - Math.log(Math.log(Tr + Ti)) * this.logBase;
    }

    public getFractalRegion(){
        return this.fractal.getConfig().getFractalRegion();
    }

    public setFractalRegion(rect){
        this.fractal.getConfig().setFractalRegion(rect);
    }

    public generate(fractalImage, width, height, julia) {
        let config:FractalConfig = this.fractal.getConfig();
        let kConvertPixelToRealAxis = this.fractal.getConfig().getFractalRegion().width / width;
        let kConvertPixelToImagAxis = config.getFractalRegion().height / height;

        //final int maxIterations = this.iterableFractal.getInfo().config.getMaxIterations();
        let fractalRegion = config.getFractalRegion();
        let minY = fractalRegion.y;
        let minX = fractalRegion.x;
        //iterationHistogramTotal = 0;
        //for (int i = 0; i < maxIterations; ++i)
        //	this.iterationHistogram[i] = 0;
        // determine number of iterations for each fractal pixel on complex
        // plane.
        // outer loop iterates over imaginary axis of specified region

        let c = config.zConstant;
        let z = config.zOrigin;
        let off = 0;

        debugger

        if (!julia) {
            // mandelbrot iteration
            for (let pixelY = 0; pixelY < height; pixelY++) {
                //console.log('row ' + pixelY);
                // convert pixel y coordinate to imaginary component of zConstant, cy
                c.im = kConvertPixelToImagAxis * pixelY + minY; //top
                // inner loop iterates over real axis of specified region
                for (let pixelX = 0; pixelX < width; pixelX++) {
                    // convert pixel x coordinate to real component of zConstant, cx
                    c.re = kConvertPixelToRealAxis * pixelX + minX; //left
                    //z = math.complex(this.fractalConfig.zOrigin);
                    let p = this.fractal.iterate(z, c, this.maxIterations, this.escapeRadius);
                    var color = this.pickColorGrayscale2(this.maxIterations, p[0], p[1], p[2]);
                    fractalImage.data[off++] = color[0];
                    fractalImage.data[off++] = color[1];
                    fractalImage.data[off++] = color[2];
                    fractalImage.data[off++] = 255;
                    //this.iterationHistogram[numIterations]++;
                    //iterationHistogramTotal++;

                }
            }
        } else {

            // julia iteration
            for (let pixelY = 0; pixelY < height; pixelY++) {
                // convert pixel y coordinate to imaginary component of zConstant, cy
                z.im = kConvertPixelToImagAxis * pixelY + minY; //top
                // inner loop iterates over real axis of specified region
                for (let pixelX = 0; pixelX < width; pixelX++) {
                    // convert pixel x coordinate to real component of zConstant, cx
                    z.re = kConvertPixelToRealAxis * pixelX + minX; //left
                    //c = math.complex(this.fractalConfig.zConstant);
                    let p = this.fractal.iterate(z, c, this.maxIterations, this.escapeRadius);
                    var color = this.pickColorGrayscale2(this.maxIterations, p[0], p[1], p[2]);
                    fractalImage.data[off++] = color[0];
                    fractalImage.data[off++] = color[1];
                    fractalImage.data[off++] = color[2];
                    fractalImage.data[off++] = 255;

                    //this.iterationHistogram[numIterations]++;
                    //iterationHistogramTotal++;
                }
            }
        }

        //		for (int i = 0; i < maxIterations; ++i)
        //			if (this.iterationHistogram[i] > 0)
        //				System.out.println("histogram " + i + " " +this.iterationHistogram[i]);

        return true;
    }
}
