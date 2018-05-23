import { Quadratic } from './quadratic';
import { FractalConfig } from './fractal.config';
import { FractalEquation } from './fractal.equation';
import { Rectangle } from './rectangle';

import * as math from 'mathjs'
import { IterationType } from './iteration.type';
//import { FractalColor } from './fractal.color';


export class FractalImage {

    /** This is a limit for the iteration to break at. Successive iterations will
	 * converge or diverge at a particular rate based on the initial location and iterative
	 * function in the complex plane. The 'velocity' of the iteration escape is the metric used to
	 * map an RGB color for function display **/
    //protected escapeRadius = 4.0;

	/** This is a maximum limit on number of iterations if escape radius not met. This is a critical
	 * parameter and directly maps to the runtime memory footprint of the application. Larger values
	 * allow for finer grain detail iteration orbits before they are considered escaped.   **/
    //protected maxIterations = 2048;

    protected zoomLevel = 0;

    protected fractal: FractalEquation;

    protected notFound = true;

    protected colorFunc;

    constructor() {

    }

    setColorFunc(colorFunc){
        this.colorFunc = colorFunc;
    }


    setFractal(fractal: FractalEquation) {
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

    public getFractalRegion() {
        return this.fractal.getConfig().getFractalRegion();
    }

    public setFractalRegion(rect) {
        this.fractal.getConfig().setFractalRegion(rect);
    }

    public generate(imageData, width, height) {
        debugger
        let julia = this.getFractal().getConfig().getIterationType() == IterationType.JULIA ? true : false;
        let maxIterations = this.getFractal().getConfig().getMaxIterations();
        let escapeRadius = this.getFractal().getConfig().getEscapeRadius();
        //let config: FractalConfig = this.fractal.getConfig();
        let kConvertPixelToRealAxis = this.fractal.getConfig().getFractalRegion().width / width;
        let kConvertPixelToImagAxis = this.fractal.getConfig().getFractalRegion().height / height;

        //final int maxIterations = this.iterableFractal.getInfo().config.getMaxIterations();
        //let fractalRegion = this.fractal.getConfig().getFractalRegion();
        let minY = this.fractal.getConfig().getFractalRegion().y;
        let minX = this.fractal.getConfig().getFractalRegion().x;
        //iterationHistogramTotal = 0;
        //for (int i = 0; i < maxIterations; ++i)
        //	this.iterationHistogram[i] = 0;
        // determine number of iterations for each fractal pixel on complex
        // plane.
        // outer loop iterates over imaginary axis of specified region

        let c = this.fractal.getConfig().getConstant();
        let z = this.fractal.getConfig().zOrigin;
        let off = 0;
        this.notFound = true;

       // let testLimit = maxIterations/2;
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
                    let p:number[] = this.fractal.iterate(z, c, maxIterations, escapeRadius);
                    var color = this.colorFunc(maxIterations, p[0], p[1], p[2]);
                    imageData.data[off++] = color[0];
                    imageData.data[off++] = color[1];
                    imageData.data[off++] = color[2];
                    imageData.data[off++] = 255;
                    // if (!!this.notFound && (!!p && p[0]>testLimit)){
                        
                    //     this.notFound = false;
                    // }

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
                    let p = this.fractal.iterate(z, c, maxIterations, escapeRadius);
                    var color = this.colorFunc(maxIterations, p[0], p[1], p[2]);

                    imageData.data[off++] = color[0];
                    imageData.data[off++] = color[1];
                    imageData.data[off++] = color[2];
                    imageData.data[off++] = 255;

                    // if (!!this.notFound && (!!p && p[0]>testLimit)){
                        
                    //     this.notFound = false;
                    // }
                }
            }
        }

        //		for (int i = 0; i < maxIterations; ++i)
        //			if (this.iterationHistogram[i] > 0)
        //				System.out.println("histogram " + i + " " +this.iterationHistogram[i]);

        return true;
    }
}
