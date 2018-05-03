/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { FractalImage } from './fractal.image';
import { FractalType } from './fractal.type';
import { FractalFactory } from './fractal.factory';
import { FractalEquation } from './fractal.equation';
import { FractalConfig } from './fractal.config';
import { IterationType } from './iteration.type';

import * as numbers from "numbers";
//import $ from "jquery";

import * as $ from 'jquery'
import {Rectangle} from './rectangle'

import * as math from 'mathjs';

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
    public name = 'Angular Starter';
    public tipe = 'assets/img/tipe.png';
    public twitter = 'https://twitter.com/gdi2290';
    public url = 'https://tipe.io';
    public showDevModule: boolean = environment.showDevModule;

    private selectedIterationType;
    private selectedColor;
    private selectedEquation;
    private fractalData;

    private colorData;
    private equationData;
    private zoomMode = 0;
    // private zoomLevel = 0;
    private cX = 0.0;
    private cY = 0.0;
    private computing = false;
    private computingJulia = false;
    private selectedSize = "512";
    private initFractalType = 1;

    private mainFractalImage;
    private juliaPreviewFractalImage
    ;
    private juliaPickerFractalImage;
    iterationTypes = [];
    equationTypes = [];


    constructor( public appState: AppState) { 
        let config:FractalConfig = new FractalConfig();  
        config.setFractalRegion(new Rectangle(-1.6, -1.125, 2.25, 2.25));
        let fractal:FractalEquation = FractalFactory.createFractal(config, FractalType.QUADRATIC);
        this.mainFractalImage = new FractalImage();
        this.mainFractalImage.setFractal(fractal);

        config = new FractalConfig();  
        config.setIterationType(IterationType.JULIA);
        fractal = FractalFactory.createFractal(config, FractalType.QUADRATIC);
        this.juliaPreviewFractalImage = new FractalImage();
        this.juliaPreviewFractalImage.setFractal(fractal);

        config = new FractalConfig();  
        config.setIterationType(IterationType.JULIA);
        config.setFractalRegion(new Rectangle(-1.6, -1.125, 2.25, 2.25));
        fractal = FractalFactory.createFractal(config, FractalType.QUADRATIC);
        this.juliaPickerFractalImage = new FractalImage();
        this.juliaPickerFractalImage.setFractal(fractal);
    }

    getIterationType(type){
        return IterationType[type];
    }

    onIterationTypeChanged(){
        console.log("iteration type changed: "+ this.selectedIterationType);
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
        for (let item in IterationType) {
            if (!isNaN(Number(item)))
                this.iterationTypes.push(item);
        }
        this.selectedIterationType = this.mainFractalImage.getFractal().getType();
        console.log("iteration type changed: "+ this.selectedIterationType);

        this.equationTypes.push()
        
        let fractalImageElement = <HTMLCanvasElement>document.getElementById("fractal-image");
        let fractalImageCtx = fractalImageElement.getContext("2d");
        let fractalImgData = fractalImageCtx.getImageData(0, 0, fractalImageElement.width, fractalImageElement.height);
        this.mainFractalImage.generate(fractalImgData, fractalImageElement.width, fractalImageElement.height, false);
        fractalImageCtx.putImageData(fractalImgData, 0, 0);

        fractalImageElement = <HTMLCanvasElement>document.getElementById("julia-picker-image");
        fractalImageCtx = fractalImageElement.getContext("2d");
        fractalImgData = fractalImageCtx.getImageData(0, 0, fractalImageElement.width, fractalImageElement.height);
        this.juliaPickerFractalImage.generate(fractalImgData, fractalImageElement.width, fractalImageElement.height, false);
        fractalImageCtx.putImageData(fractalImgData, 0, 0);

        fractalImageElement = <HTMLCanvasElement>document.getElementById("julia-preview-image");
        fractalImageCtx = fractalImageElement.getContext("2d");
        fractalImgData = fractalImageCtx.getImageData(0, 0, fractalImageElement.width, fractalImageElement.height);
        this.juliaPickerFractalImage.generate(fractalImgData, fractalImageElement.width, fractalImageElement.height, true);
        fractalImageCtx.putImageData(fractalImgData, 0, 0);


    }

    private init() {
        this.getEquations(this.initFractalType);
        this.getFractals();
        this.getColors();

        let me = this;
        $("select#size-select").change(function () {
            me.clickSize($(this).children(":selected").val())
        });

        //this.resetZoomButtonClicked();
        $('#fractal-loading').toggle();
        //  $('#julia-picker').hide();
        // this.renderFractal(0, 0);
    }

    private toggleCompute(toggle) {
        var img = document.getElementById('fractal-image');
        var pickerImage = document.getElementById('julia-picker-image');
        if (toggle) {
            this.computing = true;
            jQuery('#fractal-loading').show();
            $(img).attr("style", 'border: 2px solid #00AA00;cursor:wait;');
            $(img).prop("disabled", true);
            $(pickerImage).attr("style", 'cursor:wait;');
            $(pickerImage).prop("disabled", true);
            $("#size-select").prop("disabled", true);
            $("#fractal-select").prop("disabled", true);
            $("#color-select").prop("disabled", true);
            $('.input-number').prop("disabled", true);
            $("#reset-button2").prop("disabled", true);
            $("#equation-select").prop("disabled", true);
        } else {
            this.computing = false;
            jQuery('#fractal-loading').hide();
            $(img).attr("style", 'cursor:crosshair;');
            $(img).prop("disabled", false);
            $(pickerImage).attr("style", 'cursor:crosshair;');
            $(pickerImage).prop("disabled", false);
            $("#size-select").prop("disabled", false);
            $("#color-select").prop("disabled", false);
            $("#fractal-select").prop("disabled", false);
            $('.input-number').prop("disabled", false);
            $("#reset-button2").prop("disabled", false);
            $("#equation-select").prop("disabled", false);
        }
    }

    private toggleJuliaPreviewCompute(toggle) {
        // var fractalImage = document.getElementById('fractal-image');
        // var previewImage = document.getElementById('julia-preview-image');
        // var pickerImage = document.getElementById('julia-picker-image');
        // if (toggle) {
        //     this.computingJulia = true;
        //     jQuery('#julia-fractal-loading').show();
        //     //$(fractalImage).attr("style", 'border: 2px solid #00AA00;');
        //     $(previewImage).attr("style", 'border: 2px solid #00AA00;');
        //     //$(pickerImage).attr("style", 'border: 2px solid #00AA00;');

        //     $(fractalImage).prop("disabled", true);
        //     $(previewImage).prop("disabled", true);
        //     $(pickerImage).prop("disabled", true);
        // } else {
        //     this.computingJulia = false;
        //     jQuery('#julia-fractal-loading').hide();
        //     //$(fractalImage).attr("style", 'cursor:crosshair;');
        //     $(previewImage).attr("style", '');
        //     //$(pickerImage).attr("style", 'cursor:crosshair');

        //     //$(fractalImage).prop("disabled", false);
        //     $(previewImage).prop("disabled", false);
        //     //$(pickerImage).prop("disabled", false);
        // }
    }

    private renderFractal(fractalImage, offsetX, offsetY, canvas, julia) {
        if (this.computing)
            return;
        this.toggleCompute(true)
        console.log("renderFractal offset " + offsetX + " " + offsetY);
   

        let fractalCanvasCtx = canvas.getContext("2d");
        let fractalCanvasData = fractalCanvasCtx.getImageData(0, 0, canvas.width, canvas.height);
        fractalImage.generate(fractalCanvasData, canvas.width, canvas.height, julia);
        fractalCanvasCtx.putImageData(fractalCanvasData, 0, 0);
        //console.log("create updated region " + JSON.stringify(currentFractalRegion));
        this.toggleCompute(false);
    }

    private renderJuliaPreviewFractal() {
        if (this.computingJulia) return;
        // if (this.selectedFractal.id != 2) {
        //     return;
        // }
        this.toggleJuliaPreviewCompute(true);

        let fractalImageElement = <HTMLCanvasElement>document.getElementById("fractal-image");
        let fractalImageCtx = fractalImageElement.getContext("2d");
        let fractalImgData = fractalImageCtx.getImageData(0, 0, fractalImageElement.width, fractalImageElement.height);
        //let fractalImage = new FractalImage();
        // fractalImage.setFractalRegion(this.currentFractalRegion);
        this.juliaPreviewFractalImage.generate(fractalImgData, fractalImageElement.width, fractalImageElement.height, false);
        fractalImageCtx.putImageData(fractalImgData, 0, 0);

        this.toggleJuliaPreviewCompute(false);
    }

    private renderJuliaNavFractal(offsetX, offsetY) {
        //     //console.log("renderJuliaNavFractal " + this.selectedFractal.id)
        //     // if (this.selectedFractal.id != 2) {
        //     //     $('#julia-picker').hide();
        //     //     return;
        //     // }
        //     $('#julia-picker').show();
        //     console.log("renderJuliaNavFractal offset " + offsetX + " " + offsetY);

        //     let fractalImageElement:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('julia-picker-image');
        //     let fractalImageCtx = fractalImageElement.getContext("2d");
        //     let fractalImgData = fractalImageCtx.getImageData(0, 0, fractalImageElement.width, fractalImageElement.height);
        //     let fractalImage = new FractalImage();
        //    // fractalImage.setFractalRegion(this.currentFractalRegion);
        //     fractalImage.generate(fractalImgData, fractalImageElement.width, fractalImageElement.height, true);
        //     fractalImageCtx.putImageData(fractalImgData, 0, 0);
    }

    private setFractal(fractalId) {
        for (var i = 0; i < this.fractalData.fractals.length; i++) {
            if (this.fractalData.fractals[i].id == fractalId) {
                $('#fractal-name').html('<a href="#"><span class="label label-primary">' + this.fractalData.fractals[i].name + '</span></a>')
              //  this.selectedFractal = this.fractalData.fractals[i]

                // this.currentFractalRegion = null;
            }
        }
    }

    private setEquation(equationId) {
        for (var i = 0; i < this.equationData.equations.length; i++) {
            if (this.equationData.equations[i].id == equationId) {
                this.selectedEquation = this.equationData.equations[i];
            }
        }
    }

    private setColor(colorId) {
        for (var i = 0; i < this.colorData.colors.length; i++) {
            if (this.colorData.colors[i].id == colorId) {
                console.log("setColor " + colorId)
                this.selectedColor = this.colorData.colors[i];
            }
        }
    }

    private getFractal(fractalId) {
        for (var i = 0; i < this.fractalData.fractals.length; i++) {
            if (this.fractalData.fractals[i].id == fractalId) {
                return this.fractalData.fractals[i]
            }
        }
    }

    private getColor(colorId) {
        for (var i = 0; i < this.colorData.colors.length; i++) {
            if (this.colorData.colors[i].id == colorId) {
                return this.colorData.colors[i]
            }
        }
    }

    private getFractals() {
        jQuery.ajax({
            type: "GET",
            url: "fractals",
            async: false,
            dataType: "json",
            success: function (data) {
                console.log("GET fractals " + JSON.stringify(data));
                this.fractalData = data
                $("#fractal-select").empty();
                for (var i = 0; i < this.fractalData.fractals.length; i++) {
                    console.log("fractal-select append " + this.fractalData.fractals[i].id + " " + this.fractalData.fractals[i].name);
                    var option = '<option value="' + this.fractalData.fractals[i].id + '" id="fractal-select' + this.fractalData.fractals[i].id + '">' + this.fractalData.fractals[i].name + '</option>';
                    $("#fractal-select").append(option);
                }

                let me = this;
                $("select#fractal-select").change(function () {
                    me.clickFractalType($(this).children(":selected").val())
                });

                this.setFractal(this.initFractalType)

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("GET fractals error " + textStatus + " " + errorThrown);
                console.log("GET fractals error incoming Text " + jqXHR.responseText);
            }
        });
    }

    private getEquations(fractalId) {
        jQuery.ajax({
            type: "GET",
            url: "equations?" + "id=" + fractalId,
            async: false,
            dataType: "json",
            success: function (data) {
                console.log("GET equations " + JSON.stringify(data));
                $("#equation-select").empty();
                this.equationData = data;
                for (var i = 0; i < this.equationData.equations.length; i++) {
                    console.log("equation-select append " + this.equationData.equations[i].id + " " + this.equationData.equations[i].name);
                    var option = '<option value="' + this.equationData.equations[i].id + '" id="equation-select' + this.equationData.equations[i].id + '">' + this.equationData.equations[i].name + '</option>';
                    $("#equation-select").append(option);
                }
                let me = this;
                $("select#equation-select").change(function () {
                    me.clickEquationType($(this).children(":selected").val())
                });

                this.setEquation(this.equationData.equations[0].id) //default
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("GET equations error " + textStatus + " " + errorThrown);
                console.log("GET equations error incoming Text " + jqXHR.responseText);
            }
        });
    }

    private getColors() {
        jQuery.ajax({
            type: "GET",
            url: "colors",
            async: false,
            dataType: "json",
            success: function (data) {
                this.colorData = data
                console.log("GET colors " + JSON.stringify(data));
                for (var i = 0; i < this.colorData.colors.length; i++) {
                    console.log("color-select append " + this.colorData.colors[i].id + " " + this.colorData.colors[i].name);
                    var option = '<option value="' + this.colorData.colors[i].id + '" id="color-select' + this.colorData.colors[i].id + '">' + this.colorData.colors[i].name + '</option>';
                    $("#color-select").append(option);
                }

                let me = this;
                $("select#color-select").change(function () {
                    me.clickColor($(this).children(":selected").val())
                });
                this.setColor(2)
                //var colorOption = document.getElementById('color-select');
                $("#color-select").val(2);
                $("#color-select").change();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("GET colors error " + textStatus + " " + errorThrown);
                console.log("GET colors error incoming Text " + jqXHR.responseText);
            }
        });
    }

    private reset() {
        this.zoomMode = 0;
        // this.zoomLevel = 0;
        // this.currentFractalRegion = null;
        $('#zoom-badge').html(this.mainFractalImage.getZoom().toString);
      //  this.setFractal(this.selectedFractal.id);
    }



    zoomOut() {
        this.mainFractalImage.setZoom(this.mainFractalImage.getZoom() - 1);
        //this.zoomLevel -= 1;
        $('#zoom-badge').html(this.mainFractalImage.getZoom().toString());
        this.zoomMode = -1;
    }

    zoomIn() {
        this.mainFractalImage.setZoom(this.mainFractalImage.getZoom() + 1);

        $('#zoom-badge').html(this.mainFractalImage.getZoom().toString())
        this.zoomMode = 1
    }


    //  clickColor() {

    //     var $this = $(this);
    //     let id = $this.attr("value");
    //     console.log("clickColor1 " + id);
    //     if (this.selectedColor.id == id) return;
    //     this.zoomMode = 0;
    //     this.setColor(id);
    //     this.renderJuliaPreviewFractal();
    //     this.renderFractal(0, 0);
    // }

    private clickColor(id) {

        console.log("clickColor2 " + id);
        if (this.selectedColor.id == id) return;
        this.zoomMode = 0;
        this.setColor(id);
        this.renderJuliaPreviewFractal();
        // this.renderFractal(0, 0);
    }

    clickSize(size) {
        if (this.computing || this.computingJulia)
            return;
        console.log("clickSize " + size);
        if (this.selectedSize == size) return;
        this.selectedSize = size;
        $("#fractal-image").attr("WIDTH", this.selectedSize);
        $("#fractal-image").attr("HEIGHT", this.selectedSize);
        this.zoomMode = 0;
        // this.renderFractal(0, 0);
    }
    /*   $('#fractal-change-menu li').click(function(e) {
      console.log("fractal-change-menu " + $(this).attr("value"));
      reset();
      setFractal($(this).attr("value"));
      cX = -0.8;
      cY = -0.2249;
      resetZoomButtonClicked();
      renderFractal(0,0);
      renderJuliaNavFractal(0,0);
 });*/

    //    function clickFractalType() {
    //        var $this = $(this);
    //        type = $this.attr("value");
    //        console.log("clickFractalType " + type);
    //        if (selectedFractal.id == type) return;
    //        reset();
    //        setFractal(type);
    //        cX = -0.8;
    //        cY = -0.2249;
    //        resetZoomButtonClicked();
    //        renderFractal(0, 0);
    //        renderJuliaPreviewFractal();
    //        renderJuliaNavFractal(0, 0);
    //    }

    clickEquationType(type) {
        console.log("clickEquationType " + type);
        if (this.selectedEquation.id == type) return;
        this.reset();
        this.setEquation(type);
        this.cX = -0.8;
        this.cY = -0.2249;
       // this.resetZoomButtonClicked();
        // this.renderFractal(0, 0);
        this.renderJuliaPreviewFractal();
        this.renderJuliaNavFractal(0, 0);
    }


    private clickFractalType(type) {
        console.log("clickFractalType " + type);
    //    if (this.selectedFractal.id == type) return;
        this.reset();
        this.getEquations(type);
        this.setEquation(1)
        this.setFractal(type);
        this.cX = -0.8;
        this.cY = -0.2249;
        //this.resetZoomButtonClicked();
        // this.renderFractal(0, 0);
        this.renderJuliaPreviewFractal();
        this.renderJuliaNavFractal(0, 0);
    }



    onJuliaPickerImageClicked(e) {
        if (this.computing || this.computingJulia)
            return;
        var canvas = <HTMLCanvasElement>document.getElementById('julia-picker-image');

        var offsetX = e.pageX - e.target.offsetLeft - e.target.offsetParent.offsetLeft - canvas.width / 2;
        var offsetY = e.pageY - e.target.offsetTop - e.target.offsetParent.offsetTop - canvas.height / 2;
        let width = Number(canvas.width);
        let height = width;
        let currentFractalRegion = this.juliaPickerFractalImage.getFractalRegion();
        var percentOffsetX = offsetX / width;
        var percentOffsetY = offsetY / height;
        let cRe = currentFractalRegion.x + currentFractalRegion.width / 2 + currentFractalRegion.width * percentOffsetX;
        let cIm = -(currentFractalRegion.y + currentFractalRegion.height / 2 + currentFractalRegion.height * percentOffsetY);
            //cRe= -0.8;
            //cIm= -0.2249;
         console.log("julia zConstant: (" + cRe + "," + cIm + ")");
        this.juliaPreviewFractalImage.getFractal().getConfig().zConstant = math.complex(cRe, cIm);
        canvas = <HTMLCanvasElement>document.getElementById('julia-preview-image');
        this.renderFractal(this.juliaPreviewFractalImage, offsetX, offsetY, canvas, true);
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

        var offsetX = e.pageX - e.target.offsetLeft - e.target.offsetParent.offsetLeft - Number(this.selectedSize) / 2;
        var offsetY = e.pageY - e.target.offsetTop - e.target.offsetParent.offsetTop - Number(this.selectedSize) / 2;
        //this.zoomMode = 1;

        let width = Number(canvas.width);
        let height = width;
        let currentFractalRegion = this.mainFractalImage.getFractalRegion();
        var percentOffsetX = offsetX / width;
        var percentOffsetY = offsetY / height;
        if (currentFractalRegion != null) {
             console.log("create % offset " + percentOffsetX * 100 + "% " + percentOffsetY * 100 + "%");
            var fractalOffsetX = currentFractalRegion.width * percentOffsetX;
            var fractalOffsetY = currentFractalRegion.height * percentOffsetY;
            console.log("create fractal offset " + fractalOffsetX + " " + fractalOffsetY);

            currentFractalRegion.x += fractalOffsetX;
            currentFractalRegion.y += fractalOffsetY;

            if (this.zoomMode > 0) {
                currentFractalRegion.width /= 2
                currentFractalRegion.height /= 2
                currentFractalRegion.x += currentFractalRegion.width / 2
                currentFractalRegion.y += currentFractalRegion.height / 2
            } else if (this.zoomMode < 0) {
                currentFractalRegion.x -= currentFractalRegion.width / 2
                currentFractalRegion.y -= currentFractalRegion.height / 2
                currentFractalRegion.width *= 2
                currentFractalRegion.height *= 2
            }
            this.mainFractalImage.setFractalRegion(currentFractalRegion);
        }

        this.mainFractalImage.setZoom(this.mainFractalImage.getZoom() + 1);
        $('#zoom-badge').html(this.mainFractalImage.getZoom().toString())
        var buttonPlus = document.getElementById('plus-button');
        this.zoomButtonClicked($(buttonPlus));
        //this.renderJuliaNavFractal(0, 0)
        this.renderFractal(this.mainFractalImage, offsetX, offsetY, canvas, false);
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

    zoomButtonClicked(button) {
        if (this.computing || this.computingJulia)
            return;
        let fieldName = button.attr('data-field');
        let type = button.attr('data-type');
        let input = $('#' + fieldName);
        let currentVal = parseInt(input.val().toString(), 10);
        console.log('zoom clicked ' + currentVal);
        if (!isNaN(currentVal)) {
            if (type == 'minus') {
                if (currentVal.toString() > input.attr('min')) {
                    input.val(currentVal - 1).change();
                    this.zoomOut();
                    return true;
                }
                if (currentVal.toString() == input.attr('min')) {
                    //  $(this).attr('disabled', true);
                    console.log('minus clicked == min');
                }
            } else if (type == 'plus') {
                if (currentVal.toString() < input.attr('max')) {
                    input.val(currentVal + 1).change();
                    this.zoomIn();
                    return true;
                }
                if (currentVal.toString() == input.attr('max')) {
                    //     $(this).attr('disabled', true);
                    console.log('plus clicked == max');
                }
            }
        } else {
            input.val(0);
        }
        return false;
    }

    //   $("#size-select").click(function(e) {
    //     console.log("size-select " + $(this).attr("value"));
    // });
    //   $('#about-icon').click(function(e){
    //      console.log('about-icon clicked');
    //       $("#myModal").modal('show');
    //   });

    //       // ---------------------------
    //       // manage counters on bulk tab
    //   $('.btn-number').click(function(e) {
    //       console.log('btn-number clicked');
    //       e.preventDefault();
    //       if (this.zoomButtonClicked($(this))) this.renderFractal(0, 0);
    //   });
    //   // delete input value if it's 0
    //   $('.input-number').focusin(function() {
    //       $(this).data('oldValue', $(this).val());
    //       if ($(this).val() == 0) {
    //           $(this).val('');
    //       }
    //   });
    //   // if the user didn't enter a number, set it back to 0
    //   $(".input-number").focusout(function() {
    //       if ($(this).val() == '') {
    //           $(this).val(0);
    //       }
    //   });
    //   $('#reset-button').click(function() {
    //     this.reset()
    //     this.renderFractal(0, 0);
    //   });
    //   $('#reset-button2').click(function() {
    //     this.reset()
    //     this.resetZoomButtonClicked();
    //       this.renderFractal(0, 0);
    //   });
    //   $('#zoom-out-button').click(function() {
    //     this.zoomOut();
    //     this.renderFractal(0, 0);
    //   });
    //   $('#zoom-in-button').click(function() {
    //     this.zoomIn();
    //     this.renderFractal(0, 0);
    //   });

    //   // handle min/max values on inputs
    //   $('.input-number').change(function() {
    //       if (this.computing || this.computingJulia)
    //           return;
    //       console.log('input-number clicked');
    //       let minValue = parseInt($(this).attr('min'), 10);
    //       let maxValue = parseInt($(this).attr('max'), 10);
    //       let valueCurrent = parseInt($(this).val().toString(), 10);
    //       let name = $(this).attr('id');
    //       if (valueCurrent >= minValue) {
    //           $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
    //       } else {
    //           console.log('Sorry, the minimum value was reached');
    //           $(this).val($(this).data('oldValue'));
    //           $(".btn-number[data-type='minus'][data-field='" + name + "']").attr('disabled');
    //       }
    //       if (valueCurrent <= maxValue) {
    //           $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
    //       } else {
    //           console.log('Sorry, the maximum value was reached');
    //           $(".btn-number[data-type='plus'][data-field='" + name + "']").attr('disabled');
    //           $(this).val($(this).data('oldValue'));
    //       }
    //   });


    //   $("#ok-button").on("click", function(e) {
    //       console.log("button pressed"); // just as an example...
    //       $("#myModal").modal('hide'); // dismiss the dialog
    //    });


    //   $("#myModal").on("hide", function() { // remove the event listeners when the dialog is dismissed
    //       $("#myModal a.btn").off("click");
    //   });
    //   $("#myModal").on("hidden", function() { // remove the actual elements from the DOM when fully hidden
    //       $("#myModal").remove();
    //   });

    //   $("#myModal").modal({ // wire up the actual modal functionality and show the dialog
    //       "backdrop" : "static",
    //       "keyboard" : true,
    //       "show" : false // ensure the modal is shown immediately
    //   });
    // });
}

/**
 * Please review the https://github.com/AngularClass/angular-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */


