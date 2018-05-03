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
    public zConstant = math.complex(0, 0);

    /** The complex starting origin used during iteration **/
    public zOrigin = math.complex(0, 0);

    constructor() {
        this.setFractalRegion(new Rectangle(-2.0, -2.0, 4.0, 4.0));
        this.iterationType = IterationType.MANDELBROT;
    }

    public getMaxIterations() {
        return this.maxIterations;
    }

    public getFractalRegion() {
        return this.fractalRegion;
    }

    public setFractalRegion(region: Rectangle) {
        this.fractalRegion = region;
    }

    public getIterationType() {
        return this.iterationType;
    }

    public setIterationType(type: IterationType) {
        this.iterationType = type;
    }

	/**
	 * For each iteration for the function set the initial values on the complex plane.
	 */
    public setInitialConditions(z0, c) {
        this.zOrigin = z0;
        this.zConstant = c;
    }

    // public iterate(z, c, maxIterations, escapeRadius) {
    //     return this.equation.iterate(z, c, maxIterations, escapeRadius);
    // }
}
