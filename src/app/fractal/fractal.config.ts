import * as math from 'mathjs'
import { Rectangle } from './rectangle'
import { IterationType } from './iteration.type';

export class FractalConfig {

    public iterationType:IterationType;

	/** This is a limit for the iteration to break at. Successive iterations will
	 * converge or diverge at a particular rate based on the initial location and iterative
	 * function in the complex plane. The 'velocity' of the iteration escape is the metric used to
	 * map an RGB color for function display **/
    protected escapeRadius = 4.0;

	/** This is a maximum limit on number of iterations if escape radius not met. This is a critical
	 * parameter and directly maps to the runtime memory footprint of the application. Larger values
	 * allow for finer grain detail iteration orbits before they are considered escaped.   **/
    protected maxIterations = 2048;

    /** complex plane region iterated over **/
    protected fractalRegion;

    /** The complex quadratic constant used during iteration **/
    private zConstant = math.complex(-1.0, 0);

    /** The complex starting origin used during iteration **/
    public zOrigin = math.complex(0, 0);

    public originalFractalRegion;

    constructor() {
        //this.setFractalRegion(new Rectangle(-2.0, -2.0, 4.0, 4.0));
        this.iterationType = IterationType.MANDELBROT;
    }

    public getEscapeRadius() {
        return this.escapeRadius;
    }

    public setEscapeRadius(radius) {
        return this.escapeRadius = radius;
    }

    public setMaxIterations(max) {
        return this.maxIterations = max;
    }


    public getConstant() {
        return this.zConstant;
    }

    public setConstant(zConstant) {
        return this.zConstant = zConstant;
    }

    public getMaxIterations() {
        return this.maxIterations;
    }

    public getFractalRegion() {
        //TODO look at issue around returning direct ref to region
        return new Rectangle(this.fractalRegion.x, this.fractalRegion.y, this.fractalRegion.width, this.fractalRegion.height);
    }

    public setFractalRegion(region: Rectangle) {
       
        if(!this.fractalRegion){
            this.originalFractalRegion = new Rectangle(region.x,region.y, region.width, region.height);
        }
        this.fractalRegion = region;
    }

    public getIterationType() {
        return this.iterationType;
    }

    public setIterationType(type: IterationType) {
        this.iterationType = type;
    }

}
