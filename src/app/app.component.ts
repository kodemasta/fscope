/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { FractalImage } from './fractal/fractal.image';
import { FractalType } from './fractal/fractal.type';
import { FractalFactory } from './fractal/fractal.factory';
import { FractalEquation } from './fractal/fractal.equation';
import { FractalConfig } from './fractal/fractal.config';
import { IterationType } from './fractal/iteration.type';
//import { FractalColor } from './fractal/fractal.color';
import { ColorFactory } from './fractal/color.factory';
import { Rectangle } from './fractal/rectangle'

import * as $ from 'jquery'
import * as math from 'mathjs';
import { ColorType } from './fractal/color.type';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public name = 'FractalScope';
    public tipe = 'assets/img/fractal.png';
    public url = 'https://fractalscope2.herokuapp.com';
    public showDevModule: boolean = environment.showDevModule;

    private selectedIterationType:IterationType = IterationType.JULIA;
    private selectedColorType:ColorType;
    private selectedFractalType:FractalType;

    private cRe;
    private cIm;
    private region: Rectangle = new Rectangle(0,0,0,0);
    private computing = false;
    private computingJulia = false;
    private maxIterations;
    private escapeRadius;

    private mainFractalImage;
    private juliaPickerFractalImage;
    private iterationTypes = [];
    private fractalTypes = [];
    private colorTypes = [];
   
    private colorFunc;

    constructor(public appState: AppState) {}

    getIterationType(type) {
        return IterationType[type];
    }

    getFractalType(type) {
        return FractalType[type];
    }

    getColorType(type) {
        return ColorType[type];
    }

    onFractalChanged() {
        
        console.log("fractal type changed: " + this.selectedFractalType);
        setTimeout(() => {
            //this will be executed in the next cycle
            this.initFractals();
        });
    }

    onIterationTypeChanged() {
        console.log("iteration type changed: " + this.selectedIterationType);
        setTimeout(() => {
            //this will be executed in the next cycle
            this.initFractals();
        });
    }

    onColorTypeChanged() {
        console.log("color type changed: " + this.selectedColorType);
        this.colorFunc = ColorFactory.createColor(this.selectedColorType);
        setTimeout(() => {
            //this will be executed in the next cycle
            this.initFractals();
        });
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
        for (let item in IterationType) {
            if (!isNaN(Number(item)))
                this.iterationTypes.push(item);
        }
        this.selectedIterationType = IterationType.JULIA;

        for (let type in FractalType) {
            if (!isNaN(Number(type)))
                this.fractalTypes.push(type);
        }
        this.selectedFractalType = FractalType.QUADRATIC;

        for (let type in ColorType) {
            if (!isNaN(Number(type)))
                this.colorTypes.push(type);
        }

        this.selectedColorType = ColorType.BLACK_WHITE;
        this.colorFunc = ColorFactory.createColor(this.selectedColorType);
 
        setTimeout(() => {
            //this will be executed in the next cycle
            this.initFractals();
        });

    }

    public initFractals() {
       
        this.juliaPickerFractalImage = new FractalImage();
        this.juliaPickerFractalImage.setColorFunc(this.colorFunc);
        this.juliaPickerFractalImage.setFractal(FractalFactory.createFractal(this.selectedFractalType, IterationType.MANDELBROT));
        this.cRe = this.juliaPickerFractalImage.getFractal().getConfig().getConstant().re;
        this.cIm = this.juliaPickerFractalImage.getFractal().getConfig().getConstant().im;
        let overlay = this.region2canvas(<HTMLCanvasElement>document.getElementById("julia-picker-image"), this.cRe, this.cIm, this.juliaPickerFractalImage.getFractal().getConfig().getFractalRegion());
        this.renderFractal(this.juliaPickerFractalImage, <HTMLCanvasElement>document.getElementById("julia-picker-image"), overlay);
        
        this.mainFractalImage = new FractalImage();
        this.mainFractalImage.setColorFunc(this.colorFunc);
        this.mainFractalImage.setFractal(FractalFactory.createFractal(this.selectedFractalType, this.selectedIterationType));
        let canvas = <HTMLCanvasElement>document.getElementById('fractal-image');
        this.region = this.mainFractalImage.getFractal().getConfig().getFractalRegion();
        this.escapeRadius = this.mainFractalImage.getFractal().getConfig().getEscapeRadius();
        this.maxIterations = this.mainFractalImage.getFractal().getConfig().getMaxIterations();
        this.renderFractal(this.mainFractalImage, canvas, null);
    }

    handleResetClick(event) {
        let region = this.mainFractalImage.getFractal().getConfig().originalFractalRegion;
        this.mainFractalImage.setFractalRegion(new Rectangle(region.x, region.y, region.width, region.height));
        this.region = new Rectangle(region.x, region.y, region.width, region.height);
        let canvas = <HTMLCanvasElement>document.getElementById('fractal-image');
        this.renderFractal(this.mainFractalImage, canvas, null);
    }

    handleKeyDownRegion(event) {
        if (event.keyCode === 13) {
            this.mainFractalImage.getFractal().getConfig().setFractalRegion(new Rectangle(this.region.x, this.region.y, this.region.width, this.region.width));
            this.renderFractal(this.mainFractalImage, <HTMLCanvasElement>document.getElementById("fractal-image"), null);
            this.renderFractal(this.juliaPickerFractalImage, <HTMLCanvasElement>document.getElementById("julia-picker-image"), [event.offsetX, event.offsetY]);
        }
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) {
            //TODO store original region
            this.mainFractalImage.getFractal().getConfig().setFractalRegion(new Rectangle(-1.5, -1.5, 3, 3));
            let zConstant = this.mainFractalImage.getFractal().getConfig().getConstant();
            console.log("old julia point: (" + zConstant.re + ", " + zConstant.im + ")");
            this.mainFractalImage.getFractal().getConfig().zConstant = math.complex(this.cRe, this.cIm);
            zConstant = this.mainFractalImage.getFractal().getConfig().getConstant();
            console.log("new julia point: (" + zConstant.re + ", " + zConstant.im + ")");
            this.renderFractal(this.mainFractalImage, <HTMLCanvasElement>document.getElementById("fractal-image"), null);

            this.mainFractalImage.getFractal().getConfig().setMaxIterations(this.maxIterations);
            this.mainFractalImage.getFractal().getConfig().setEscapeRadius(this.escapeRadius);
            let p = this.region2canvas(<HTMLCanvasElement>document.getElementById("julia-picker-image"), this.cRe, this.cIm, new Rectangle(-1.6, -1.125, 2.25, 2.25));
            this.renderFractal(this.juliaPickerFractalImage, <HTMLCanvasElement>document.getElementById("julia-picker-image"), p);
        }
    }


    handleKeyDown2(event) {
        if (event.keyCode === 13) {
            //TODO store original region
          
            this.mainFractalImage.getFractal().getConfig().setMaxIterations(this.maxIterations);
            this.mainFractalImage.getFractal().getConfig().setEscapeRadius(this.escapeRadius);
            this.renderFractal(this.mainFractalImage, <HTMLCanvasElement>document.getElementById("fractal-image"), null);

        }
    }

    private toggleCompute(toggle) {
        console.log('toggle compute: ' + toggle);
        var img = document.getElementById('fractal-image');
        var pickerImage = document.getElementById('julia-picker-image');
        if (toggle) {
            this.computing = true;
            //$('#fractal-loading').show();
            $(img).attr("style", 'border: 2px solid #00AA00;cursor:wait;');
            $(img).prop("disabled", true);
            //$(pickerImage).attr("style", 'cursor:wait;');
            // $(pickerImage).prop("disabled", true);
            // $("#size-select").prop("disabled", true);
            // $("#fractal-select").prop("disabled", true);
            // $("#color-select").prop("disabled", true);
            // $('.input-number').prop("disabled", true);
            // $("#reset-button2").prop("disabled", true);
            // $("#equation-select").prop("disabled", true);
        } else {
            this.computing = false;
            //$('#fractal-loading').hide();
            $(img).attr("style", 'cursor:arrow;');
            $(img).prop("disabled", false);
            //$(pickerImage).attr("style", 'cursor:crosshair;');
            // $(pickerImage).prop("disabled", false);
            // $("#size-select").prop("disabled", false);
            // $("#color-select").prop("disabled", false);
            // $("#fractal-select").prop("disabled", false);
            // $('.input-number').prop("disabled", false);
            // $("#reset-button2").prop("disabled", false);
            // $("#equation-select").prop("disabled", false);
        }

        //window.setTimeout(()=>{  this.computing = false;}, 5000);
    }

    private renderFractal(fractalImage, canvas, overlay) {
        if (!canvas) {
            return;
        }
        this.toggleCompute(true);
       // this.notFound = false;
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                let fractalCanvasCtx = canvas.getContext("2d");
                let fractalCanvasData = fractalCanvasCtx.getImageData(0, 0, canvas.width, canvas.height);
                fractalImage.generate(fractalCanvasData, canvas.width, canvas.height);
                fractalCanvasCtx.putImageData(fractalCanvasData, 0, 0);

                if (!!overlay) {
                    fractalCanvasCtx.strokeStyle = "#00FFFF";
                    let length = 10;
                    fractalCanvasCtx.beginPath();
                    fractalCanvasCtx.moveTo(overlay[0] - length, overlay[1]);
                    fractalCanvasCtx.lineTo(overlay[0] + length, overlay[1]);
                    fractalCanvasCtx.moveTo(overlay[0], overlay[1] - length);
                    fractalCanvasCtx.lineTo(overlay[0], overlay[1] + length);
                    fractalCanvasCtx.stroke();
                }
                resolve('DONE');
            }, 10);
        });

        let me = this;
        p.then((result) => {
            me.toggleCompute(false);
            //this.notFound = fractalImage.notFound;
        });
    }

    canvas2region(canvas, e, region) {
        if (!canvas) {

            return [0, 0];
        }
        let offsetX = e.offsetX - (canvas.width / 2);
        let offsetY = e.offsetY - (canvas.height / 2);
        console.log("mouse click: (" + offsetX + "," + offsetY + ")");
        let percentOffsetX = offsetX / canvas.width;
        let percentOffsetY = offsetY / canvas.height;
        let cRe = region.x + region.width / 2 + region.width * percentOffsetX;
        let cIm = region.y + region.height / 2 + region.height * percentOffsetY;

        return [cRe, cIm];
    }

    region2canvas(canvas, cRe, cIm, region) {
        if (!canvas) {

            return [0, 0];
        }
        let percentOffsetX = (cRe - region.x - (region.width / 2)) / region.width;
        let offsetX = percentOffsetX * canvas.width;
        offsetX = offsetX + (canvas.width / 2);

        let percentOffsetY = (cIm - region.y - (region.height / 2)) / region.height;
        let offsetY = percentOffsetY * canvas.height;
        offsetY = offsetY + (canvas.height / 2);

        return [offsetX, offsetY];
    }

    onJuliaPickerImageClicked(e) {
        if (this.computing || this.computingJulia)
            return;
        let canvas = <HTMLCanvasElement>document.getElementById('julia-picker-image');

        console.log("mouse click: (" + e.offsetX + "," + e.offsetY + ")");
        console.log("canvas size: (" + canvas.width + "," + canvas.height + ")");
        let c = this.canvas2region(canvas, e, this.juliaPickerFractalImage.getFractalRegion());

        this.renderFractal(this.juliaPickerFractalImage, <HTMLCanvasElement>document.getElementById("julia-picker-image"), [e.offsetX, e.offsetY]);

        this.cRe = c[0];
        this.cIm = c[1];

        this.mainFractalImage.getFractal().getConfig().setIterationType(IterationType.JULIA);
        let region = this.mainFractalImage.getFractal().getConfig().originalFractalRegion;

        this.mainFractalImage.setFractalRegion(new Rectangle(region.x, region.y, region.width, region.height));
        this.region = new Rectangle(region.x, region.y, region.width, region.height);
        this.mainFractalImage.getFractal().getConfig().setConstant(math.complex(c[0], c[1]));
        console.log("new julia point: (" + this.mainFractalImage.getFractal().getConfig().zConstant.re + ", " + this.mainFractalImage.getFractal().getConfig().zConstant.im + ")");
        canvas = <HTMLCanvasElement>document.getElementById('fractal-image');
        this.renderFractal(this.mainFractalImage, canvas, null);

    };

    onFractalImageClicked(e) {

        if (this.computing || this.computingJulia)
            return;
        let canvas = <HTMLCanvasElement>document.getElementById('fractal-image');
        // console.log('click page:' + e.pageX + ' ' + e.pageY);
        // console.log('click target offset:' + e.target.offsetLeft + ' ' + e.target.offsetTop)
        // console.log('click target offset parent:' + e.target.offsetParent.offsetLeft + ' ' + e.target.offsetParent.offsetTop);
        // console.log('click left:' + (e.pageX - e.target.offsetLeft - e.target.offsetParent.offsetLeft));
        // console.log('click top:' + (e.pageY - e.target.offsetTop - e.target.offsetParent.offsetTop));

        var offsetX = e.pageX - e.target.offsetLeft - e.target.offsetParent.offsetLeft - Number(canvas.width) / 2;
        var offsetY = e.pageY - e.target.offsetTop - e.target.offsetParent.offsetTop - Number(canvas.height) / 2;
        //this.zoomMode = 1;


        let currentFractalRegion = this.mainFractalImage.getFractalRegion();
        this.mainFractalImage.setZoom(this.mainFractalImage.getZoom() + 1);
        let zoom = this.mainFractalImage.getZoom();
        var percentOffsetX = offsetX / canvas.width;
        var percentOffsetY = offsetY / canvas.height;
        if (currentFractalRegion != null) {
            console.log("create % offset " + percentOffsetX * 100 + "% " + percentOffsetY * 100 + "%");
            var fractalOffsetX = currentFractalRegion.width * percentOffsetX;
            var fractalOffsetY = currentFractalRegion.height * percentOffsetY;
            console.log("create fractal offset " + fractalOffsetX + " " + fractalOffsetY);

            currentFractalRegion.x += fractalOffsetX;
            currentFractalRegion.y += fractalOffsetY;

            if (zoom > 0) {
                currentFractalRegion.width /= 2
                currentFractalRegion.height /= 2
                currentFractalRegion.x += currentFractalRegion.width / 2
                currentFractalRegion.y += currentFractalRegion.height / 2
            } else if (zoom < 0) {
                currentFractalRegion.x -= currentFractalRegion.width / 2
                currentFractalRegion.y -= currentFractalRegion.height / 2
                currentFractalRegion.width *= 2
                currentFractalRegion.height *= 2
            }
            this.region = currentFractalRegion;
            this.mainFractalImage.setFractalRegion(currentFractalRegion);
        }

        //$('#zoom-badge').html(this.mainFractalImage.getZoom().toString());
        // var buttonPlus = document.getElementById('plus-button');
        // this.zoomButtonClicked($(buttonPlus));
        //this.renderJuliaNavFractal(0, 0)
        this.renderFractal(this.mainFractalImage, canvas, null);
    };

    resetZoomButtonClicked() {
        if (this.computing || this.computingJulia)
            return;
        var buttonPlus = document.getElementById('plus-button');
        let fieldName = $(buttonPlus).attr('data-field');
        let type = $(buttonPlus).attr('data-type');
        var input = $('#' + fieldName);
        input.val(0).change();
    }
}