
import { ColorType } from './color.type';
import { FractalColor } from './fractal.color';
import * as math from 'mathjs';

export class ColorFactory {
    static createColor(colorType:ColorType)
    { 
        debugger
        switch(+colorType){
            case ColorType.BLACK_WHITE:{
                return new FractalColor().pickBlackAndWhite;
            }
            case ColorType.GRAY_SCALE:{
                return new FractalColor().pickColorHSV3;
            }
        }

        console.error('Color Type not found: ' + colorType);
        return null;
    }

}