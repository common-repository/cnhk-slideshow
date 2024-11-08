/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
    
    "use strict";
    
    var spinner = $( '<p class="preloader" style="text-align:center;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></p>' );
    
    var SIDEBAR_WIDTH = 320;
    
    var layerStylingControl = function( options ) {
        var defaultOptions = {};
		this.options = {};
        this.options = $.extend( {}, defaultOptions, options );
        this.layers;
        this.layerCount;
        this.LI;
        this.LIC;
        this.form;
        this.slideId;
        this.laMarkup;
    };
    
    layerStylingControl.prototype = {
        
        constructor: layerStylingControl,
        
        option: function() {
            var name;
            if ( arguments.length === 0 ) {
                return this.options;
            }
            if ( arguments.length === 2 ) {
                this.options[ arguments[0] ] = arguments[1];
            }
            if ( arguments.length === 1 ) {
                if ( typeof arguments[0] === 'string' ) {
                    return this.options[ arguments[0] ];
                }
                if ( typeof arguments[0] === 'object' ) {
                    for( name in arguments[0] ) {
                        if ( arguments[0].hasOwnProperty( name ) ) {
                            this.options[ name ] = arguments[0][ name ];
                        }
                    }
                }
            }
            this.slideId = this.options.slide.find( '.slide-id' ).val();
            this.open();
            return this;
        },
        
        open: function() {
            var options = {
                width: 94,
                height: 85,
                title: layerStylingLocale.overlayTitle,
                content: spinner,
            };
            $.cnhkOverlay( options );
            $.cnhkOverlay( 'show' );
            this.loadForm();
            if ( undefined !== this.form ) {
                this.populate();
            }
        },
        
        // load form from server of from #wpwrap
        loadForm: function() {
            var form = $( '#wpwrap' ).data( 'layerStylingForm' );
            
            if ( form ) {
                this.form = form.clone();
                this.laMarkup = $( '#wpwrap' ).data( 'layerStylingLaMarkup' ).clone();
            } else {
                // load form from the server and store it in #wpwrap
                
                var that = this;
                
                var formData = {
                    nonce : cnhkAjaxNonce,
                    action : 'cnhk_layer_styling_form',
                };
                
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: formData,
                    success: function ( resp, textStatus, XHR ) {
                        var $resp = $( '<div id="layer-styling-form"></div>' ).html( resp );
                        var laMarkup = $resp.find( '.styling-block-wrap' ).remove();
                        $( '#wpwrap' ).data( 'layerStylingForm', $resp );
                        $( '#wpwrap' ).data( 'layerStylingLaMarkup', laMarkup );
                        that.form = $resp.clone();
                        that.laMarkup = laMarkup.clone();
                        that.evt();
                        $( document ).trigger( 'layerStylingFormLoaded' );
                    },
                    error: function ( request, textStatus, err ) {
                        console.error( 'ajax request failed - markup loading in styling controls' );
                        $.cnhkOverlay( 'hide', true );
                    }
                });
            }
        },
        
        // event handlers
        evt: function() {
            var that = this;
            // form loaded for the first time
            $( document ).on( 'layerStylingFormLoaded', function (){
                that.populate();
            } );
            
            // resize
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
            } );
            
            // grid
            $( document ).on( 'click', '#layer-styling-form #styling-preview-grid #grid-hndle', function ( ev ) {
                ev.stopPropagation();
                that.toggleGridForm();
            } );
            
            // hide the grid form on click
            $( document ).on( 'click', '#layer-styling-form #styling-preview-grid.shown', function () {
                that.toggleGridForm();
            } );
            
            // stop event bubbling when clicking input fields (prevent from falling to the case above)
            $( document ).on( 'click', '#layer-styling-form #styling-preview-grid #enable-grid,#layer-styling-form #styling-preview-grid #preview-grid-size', function ( ev ) {
                ev.stopPropagation();
            } );
            
            // apply position left from number input in the form
            $( document ).on( 'click', '#layer-styling-form .apply-pos-left', function () {
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' ).draggable( 'widget' ).css({
                    left: parseInt( $( this ).siblings( '.pos-left' ).val() ),
                } );
            } );
            
            // apply position top from number input in the form
            $( document ).on( 'click', '#layer-styling-form .apply-pos-top', function () {
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' ).draggable( 'widget' ).css({
                    top: parseInt( $( this ).siblings( '.pos-top' ).val() ),
                } );
            } );
            
            // apply width from number input in the form
            $( document ).on( 'click', '#layer-styling-form .apply-size-w', function () {
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' ).draggable( 'widget' ).css({
                    width: parseInt( $( this ).siblings( '.size-w' ).val() ),
                } );
            } );
            
            // apply height from number input in the form
            $( document ).on( 'click', '#layer-styling-form .apply-size-h', function () {
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' ).draggable( 'widget' ).css({
                    height: parseInt( $( this ).siblings( '.size-h' ).val() ),
                } );
            } );
            
            // line height changed
            $( document ).on( 'change', '#layer-styling-form .le', function () {
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var le = ( parseFloat( $( this ).val() ) )?  parseFloat( $( this ).val() ) : 32;
                $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' ).css( 'line-height', le + 'px' );
            } );
            
            // prev/next layer
            $( document ).on( 'click', '#layer-styling-form .style-com', function(){
                if ( $( this ).hasClass( 'stop' ) ) return;
                if ( $( this ).hasClass( 'prev-field' ) ) {
                    that.setCurrentLI( '-' );
                }
                if ( $( this ).hasClass( 'next-field' ) ) {
                    that.setCurrentLI( '+' );
                }
            } );
            
            // show bounds
            $( document ).on( 'click', '#layer-styling-form .show-bounds', function( ev ){
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var thePreview = $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' );
                if ( $( this ).prop( 'checked' ) ) {
                    var fgColor = $( this ).parents( '.styling-block-wrap' ).find( '.fg-color' ).val();
                    if ( ! fgColor ) fgColor = '#222222';
                    thePreview.css( 'border', '1px dashed ' + fgColor );
                } else {
                    thePreview.css( 'border', 'none' );
                }
            } );
            
            // color input change
            $( document ).on( 'laColorChange', '#layer-styling-form .styling-block-wrap', function( ev, color, type ){
                var id = $( this ).attr( 'data-id' );
                var thePreview = $( '.la-preview[data-id="' + id + '"]' );
                if ( 'bg-color' == type ) {
                    var bgOpacity = $( this ).find( '.bg-opacity' ).slider( 'value' );
                    if ( '' != color ) {
                        var rgb = jssorFunc.hexToRgb( color );
                        thePreview.find( '.la-preview-border' ).css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + bgOpacity + ')' );
                    } else {
                        thePreview.find( '.la-preview-border' ).css( 'background-color', 'transparent' );
                    }
                } else if ( 'fg-color' == type ) {
                    thePreview.css( 'color', color );
                } else if ( 'border-color' == type ) {
                    that._updateBorderProp( id );
                }
                
            } );
            
            // slider input change
            $( document ).on( 'laSliderChange', '#layer-styling-form .styling-block-wrap', function( ev, value, type) {
                var id = $( this ).attr( 'data-id' );
                
                if ( 'bg-opacity' == type ) {
                    var thePreview = $( '.la-preview[data-id="' + id + '"]' );
                    var color = $( this ).find( '.bg-color' ).wpColorPicker( 'color' );
                    if ( '' != color ) {
                        var rgb = jssorFunc.hexToRgb( color );
                        thePreview.find( '.la-preview-border' ).css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + value + ')' );
                    } else {
                        thePreview.find( '.la-preview-border' ).css( 'background-color', 'transparent' );
                    }
                }
                if ( 'border-width' == type || 'border-radius' == type ) {
                   that. _updateBorderProp( id );
                }
                if ( 'pad-vert' == type || 'pad-horz' == type ) {
                    that._updatePaddingProp( id );
                }
                
            } );
            
            // border style change
            $( document ).on( 'change', '#layer-styling-form .styling-block-wrap .border-style', function( ev ){
                var id = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                that._updateBorderProp( id );
            } );
            
            // border radius
            $( document ).on( 'change', '#layer-styling-form .styling-block-wrap .bdr', function( ev ){
                var id = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                that._updateBorderProp( id );
            } );
            
            // font change
            $( document ).on( 'change', '#layer-styling-form .styling-block-wrap .font', function( ev ){
                var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var thePreview = $( '#styling-preview-area .la-preview[data-id="' + laId + '"]' );
                var ff = $( this ).find( 'option:selected' ).attr( 'data-ff' );
                if ( ff ) {
                    thePreview.css( 'font-family', ff );
                } else {
                    thePreview.css( 'font-family', 'Arial, Helvetica Neue, Helvetica, sans-serif, serif' );
                }
            } );
            
            // apply change (from th overlay to the edit post page)
            $( document ).on( 'click', '#apply-layer-styling', function( ev ) {
                var slideId = that.options.slide.find( '.slide-id' ).val();
                $( '.styling-block-wrap' ).each( function() {
                    var id = $( this ).attr( 'data-id' );
                    var thePreview = $( '.la-preview[data-id="' + id + '"]' );
                    var theForm = $( '.styling-block-wrap[data-id="' + id + '"]' );
                    
                    var scale = $( '#slide-container' ).cnhkSlideWrap( 'getScale' );
                    
                    var stObj = {
                        w: thePreview.width(),
                        h: thePreview.height(),
                        le: ( theForm.find( '.le' ).val() )? parseInt( theForm.find( '.le' ).val() ) : 32,
                        left: parseInt( thePreview.position().left / scale ),
                        top: parseInt( thePreview.position().top / scale ),
                        
                        padh: parseFloat( theForm.find( '.pad-horz' ).slider( 'value' ) ),
                        padv: parseFloat( theForm.find( '.pad-vert' ).slider( 'value' ) ),
                        
                        font: theForm.find( '.font' ).val(),
                        fgColor: theForm.find( '.fg-color' ).val(),
                        bgColor: theForm.find( '.bg-color' ).val(),
                        bgOpacity: parseFloat( theForm.find( '.bg-opacity' ).slider( 'value' ) ),
                        bdStyle: theForm.find( '.border-style' ).val(),
                        bdWidth: parseFloat( theForm.find( '.border-width' ).slider( 'value' ) ),
                        bdColor: theForm.find( '.border-color' ).val(),
                        bdrTL: ( theForm.find( '.bdr-tl' ).val() )?  parseFloat( theForm.find( '.bdr-tl' ).val() ) : 0,
                        bdrTR: ( theForm.find( '.bdr-tr' ).val() )?  parseFloat( theForm.find( '.bdr-tr' ).val() ) : 0,
                        bdrBL: ( theForm.find( '.bdr-bl' ).val() )?  parseFloat( theForm.find( '.bdr-bl' ).val() ) : 0,
                        bdrBR: ( theForm.find( '.bdr-br' ).val() )?  parseFloat( theForm.find( '.bdr-br' ).val() ) : 0,
                    };
                    
                    var laDiv = that.options.slide.find( '.layer-id[value="' + id + '"] + .parent-slide-id[value="' + slideId + '"]' ).parents( '.layer' );
                    laDiv.find( '.layer-style' ).val( JSON.stringify( stObj ) );
                    $.cnhkOverlay( 'hide', true );
                } );
                $( document ).trigger( 'htmlSlideUpdated', [slideId] );
            } );
            
        },
        
        // update padding in the preview
        _updatePaddingProp( id ) {
            var block = $( '.styling-block-wrap[data-id="' + id + '"]' );
            var padHorz = block.find( '.pad-horz' ).slider( 'value' );
            var padVert = block.find( '.pad-vert' ).slider( 'value' );
            $( '.la-preview[data-id="' + id + '"] .la-preview-padding' ).css({
                paddingLeft: padHorz + '%',
                paddingRight: padHorz + '%',
                paddingTop: padVert + '%',
                paddingBottom: padVert + '%',
            }); 
        },
        
        // update border in the preview
        _updateBorderProp( id ) {
            var block = $( '.styling-block-wrap[data-id="' + id + '"]' );
            var border = {};
            border.style = block.find( '.border-style' ).val();
            border.color = block.find( '.border-color' ).wpColorPicker( 'color' );
            if ( '' == border.color ) {
                border.color = 'transparent';
            }
            border.width = block.find( '.border-width' ).slider( 'value' );
            var theBorder = $( '.la-preview[data-id="' + id + '"] .la-preview-border' );
            if ( 'none' == border.style || 'transparent' == border.color ) {
                theBorder.css( 'border', 'none' );
            } else {
                theBorder.css( 'border', border.width + 'px ' + border.style + ' ' + border.color );
            }
            theBorder.css({
                borderTopLeftRadius: parseFloat( block.find( '.bdr-tl' ).val() ),
                borderTopRightRadius: parseFloat( block.find( '.bdr-tr' ).val() ),
                borderBottomLeftRadius: parseFloat( block.find( '.bdr-bl' ).val() ),
                borderBottomRightRadius: parseFloat( block.find( '.bdr-br' ).val() ),
            });
            this._updatePaddingProp( id );
        },
        
        toggleGridForm: function(){
            var form = this.form.find( '#styling-preview-grid' );
            if ( form.hasClass( 'shown' ) ) {
                form.animate( {left: '100%'},500, 'swing', function(){ form.removeClass( 'shown' )} );
            } else {
                form.animate( {left: '85%'},500, 'swing', function(){ form.addClass( 'shown' )} );
            }
        },
        
        // set current layer index (set up correct preview, and scroll to the riqgh form)
        setCurrentLI( LI ) {
            if ( '+' === LI ) {
                var currentLI = this.LI;
                
                if ( this.layerCount - 1 > currentLI ) {
                    this.LI = currentLI + 1;
                    if ( 0 != this.layerCount ) {
                        $( '.style-com.prev-field' ).removeClass( 'stop' );
                    }
                    if ( this.layerCount - 1 == this.LI ) {
                        $( '.style-com.next-field' ).addClass( '.stop' );
                    }
                }
            } else if ( '-' === LI ) {
                var currentLI = this.LI;
                if ( 0 < currentLI ) {
                    this.LI = currentLI - 1;
                    if ( 0 != this.layerCount ) {
                        $( '.style-com.next-field' ).removeClass( 'stop' );
                    }
                    if ( 0 == this.LI ) {
                        $( '.style-com.prev-field' ).addClass( '.stop' );
                    }
                }
            } else {
                this.LI = LI;
            }
            
            if ( 0 == this.LI ) {
                $( '.style-com.prev-field' ).addClass( 'stop' );
            }
            if ( this.layerCount - 1 == this.LI ) {
                $( '.style-com.next-field' ).addClass( 'stop' );
            }
            
            var id = this.LIC[this.LI];
            // preview area
            var thePreview = $( '#styling-preview-area' ).find( '.la-preview[data-id="' + id + '"]' );
            thePreview.css( 'z-index', 12 ).draggable( 'enable' ).resizable( 'enable' ).css({cursor: 'move', opacity: 1});
            // $( '#styling-preview-area' ).find( '.la-preview' ).not( thePreview ).each(function(){
            $( '#styling-preview-area' ).find( '.la-preview' ).each(function(){
                var notId = $( this ).attr( 'data-id' );
                if ( id != notId ) {
                    $( this ).css( 'z-index', 10 ).draggable( 'disable' ).resizable( 'disable' ).css( 'cursor', 'default' );
                    var theForm = $( '.styling-block-wrap[data-id="' + notId + '"]' );
                    if ( ! theForm.find( '.always-visible' ).prop( 'checked' ) ) {
                        $( this ).css( 'opacity', 0 );
                    }
                }
            });
            $( '#styling-form-scroll' ).animate( { 'margin-left': - ( this.LI * ( SIDEBAR_WIDTH - 1 ) ) }, 500 );
        },
        
        // pick layer data from edit post page
        populate: function() {
            var that = this;
            this.LI = 0;
            this.LIC = [];
            this.layers = {};
            
            var count = 0;
            
            this.form.find( '#styling-form-scroll' ).empty();
            this.options.slide.find( '.layer' ).each(function(){
                var $this = $( this );
                var id = $this.find( '.layer-id' ).val();
                that.LIC.push( id );
                var la = {};
                la['name'] = $this.find( '.layer-name' ).val();
                
                var stObj = JSON.parse( $this.find( '.layer-style' ).val() );
                
                la['left'] = stObj.left;
                la['top'] = stObj.top;
                la['width'] = stObj.w;
                la['height'] = stObj.h;
                la['le'] = stObj.le;
                la['font'] = stObj.font;
                la['padHorz'] = stObj.padh;
                la['padVert'] = stObj.padv;
                la['fgColor'] = stObj.fgColor;
                la['bgColor'] = stObj.bgColor;
                la['bgOpacity'] = stObj.bgOpacity;
                la['borderColor'] = stObj.bdColor;
                la['borderWidth'] = stObj.bdWidth;
                la['borderStyle'] = stObj.bdStyle;
                la['bdrTL'] = stObj.bdrTL;
                la['bdrTR'] = stObj.bdrTR;
                la['bdrBL'] = stObj.bdrBL;
                la['bdrBR'] = stObj.bdrBR;
                
                la['html'] = $this.find( '.layer-html' ).val();
                la['index'] = count;
                
                that.layers[id] = la;
                
                var markup = that.laMarkup.clone();
                
                markup.find( '.layer-name-head' ).text( la.name );
                markup.find( '.pos-left' ).val( parseInt( la.left ) );
                markup.find( '.pos-top' ).val( parseInt( la.top ) );
                markup.find( '.size-w' ).val( parseInt( la.width ) );
                markup.find( '.size-h' ).val( parseInt( la.height ) );
                markup.find( '.font' ).val( la.font );
                markup.find( '.le' ).val( la.le );
                markup.find( '.fg-color' ).val( la.fgColor );
                markup.find( '.bg-color' ).val( la.bgColor );
                markup.find( '.bg-opacity' ).attr( 'data-val', la.bgOpacity );
                markup.find( '.pad-horz' ).attr( 'data-val', la.padHorz );
                markup.find( '.pad-vert' ).attr( 'data-val', la.padVert );
                markup.find( '.border-style' ).val( la.borderStyle );
                markup.find( '.border-width' ).attr( 'data-val', la.borderWidth );
                markup.find( '.border-color' ).val( la.borderColor );
                
                markup.find( '.bdr-tl' ).val( la.bdrTL );
                markup.find( '.bdr-tr' ).val( la.bdrTR );
                markup.find( '.bdr-bl' ).val( la.bdrBL );
                markup.find( '.bdr-br' ).val( la.bdrBR );
                
                markup.attr( 'data-id', id );
                
                that.form.find( '#styling-form-scroll' ).append( markup );
                
                count++;
            });
            
            this.layerCount = count;
            $.cnhkOverlay( { content: this.form } );
            
            this.setup();
            this.setCurrentLI( this.options.activeLI );
            this.resize();
        },
        
        // fill the form
        setup: function() {
            var that = this;
            
            // Setup style fields in sidebar
            $( '#styling-form-scroll .styling-block-relwrap' ).each(function(){
                
                // color inputs
                $( this ).find( '.color-input' ).each(function(){
                    var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                    var type = $( this ).attr( 'class' ).split( ' ' )[1];
                    $( this ).wpColorPicker({
                        defaultColor: '',
                        change: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + laId + '"]' ).trigger( 'laColorChange', [ui.color.toString(), type] );
                        },
                        clear: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + laId + '"]' ).trigger( 'laColorChange', ['', type] );
                        },
                    });
                });
                
                // slider inputs
                $( this ).find( '.slider-input' ).each(function(){
                    $( this ).css({
                        width: '85%',
                        marginLeft: '5%',
                    });
                    var type = $( this ).attr( 'class' ).split( ' ' )[1];
                    var laId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                    $( this ).slider({
                        value: ( ( $( this ).attr( 'data-val' ) )? parseFloat( $( this ).attr( 'data-val'  ) ) : parseFloat( $( this ).attr( 'data-min' ) ) ),
                        min: parseFloat( $( this ).attr( 'data-min' ) ),
                        max: parseFloat( $( this ).attr( 'data-max' ) ),
                        step: parseFloat( $( this ).attr( 'data-step' ) ),
                        change: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + laId + '"]' ).trigger( 'laSliderChange', [ui.value, type] );
                        },
                    });
                });
                
            });
            
            var slideContentRaw = cnhkSlideHandler['html'].getSlideContent( this.options.slideId );
            var slideContent = $( slideContentRaw );
            
            slideContent.find( '.layer-wrap' ).remove();
            
            var slideContainer = this.form.find( '#slide-container' );
            
            for ( var id in this.layers ) {
                var layerContent = cnhkSlideHandler['html'].getLayerMarkup( this.options.slideId, id );
                var theLayer = $( layerContent ).addClass( 'la-preview no-select' ).attr( 'data-id', id );
                
                if ( theLayer.find( '.layer-border' ) ){
                    theLayer.find( '.layer-border' ).removeClass( 'layer-border' ).addClass( 'la-preview-border' );
                }
                
                if ( theLayer.find( '.layer-padding' ) ){
                    theLayer.find( '.layer-padding' ).removeClass( 'layer-padding' ).addClass( 'la-preview-padding' );
                }
                
                slideContent.append( theLayer );
            }
            slideContainer.append( slideContent );
            slideContainer.cnhkSlideWrap({
                fillMode: $( '#options-_FillMode' ).val(),
                boxWidth: $( '#options-w' ).val(),
                boxHeight: $( '#options-h' ).val(),
            });
            slideContainer.cnhkSlideWrap( 'init' );
            
            $( '#slide-container .slidewrap-abs-container' ).append( $( '<div />' ).attr( 'id', 'drag-bounds' ).css({ position: 'absolute', zIndex: -1}) ).css( 'border', '1px dashed #444' );
            
            for ( var id in this.layers ) {
                var laPreview = slideContainer.find( '.la-preview[data-id="' + id + '"]' );
                
                laPreview.draggable({
                    scroll: false,
                    start: function ( ev, ui ) {
                        var scale = $( '#slide-container' ).cnhkSlideWrap( 'getScale' );
                        var dragBounds = $( '#drag-bounds' ).css({
                            width: ( $( '#styling-preview-area .slidewrap-abs-container' ).width() * scale ) + ( Math.floor( ui.helper.width() ) * ( 1 - scale ) ),
                            height:( $( '#styling-preview-area .slidewrap-abs-container' ).height() * scale ) + ( Math.floor( ui.helper.height() ) * ( 1 - scale ) ),
                            position: 'absolute',
                        });
                        var grid = false;
                        if ( $( '#enable-grid' ).prop( 'checked' ) ) {
                            grid = [parseInt( $( '#preview-grid-size' ).val() ), parseInt( $( '#preview-grid-size' ).val() )];
                        }
                        ui.helper.draggable( 'option', 'containment', dragBounds );
                        ui.helper.draggable( 'option', 'grid', grid );
                        ui.position.left = 0;
                        ui.position.top = 0;
                    },
                    drag: function ( ev, ui ) {
                        var scale = $( '#slide-container' ).cnhkSlideWrap( 'getScale' );
                        ui.position.left = ui.originalPosition.left + ( ui.position.left - ui.originalPosition.left ) / scale;
                        ui.position.top = ui.originalPosition.top + ( ui.position.top - ui.originalPosition.top ) / scale;
                    },
                    stop: function ( ev, ui ) {
                        var laId = ui.helper.attr( 'data-id' );
                        $( '.styling-block-wrap[data-id="' + laId + '"]' ).find( '.pos-left' ).val( parseInt( ui.position.left ) );
                        $( '.styling-block-wrap[data-id="' + laId + '"]' ).find( '.pos-top' ).val( parseInt( ui.position.top ) );
                    },
                });
                
                laPreview.draggable( 'disable' );
                
                // resizable
                
                laPreview.resizable({
                    resize: function ( ev, ui ) {
                        var scale = $( '#slide-container' ).cnhkSlideWrap( 'getScale' );
                        ui.size.width = ui.originalSize.width + ( ui.size.width - ui.originalSize.width ) / scale; 
                        ui.size.height = ui.originalSize.height + ( ui.size.height - ui.originalSize.height ) / scale;
                    },
                    start: function( ev, ui ) {
                        var grid = false;
                        if ( $( '#enable-grid' ).prop( 'checked' ) ) {
                            grid = [parseInt( $( '#preview-grid-size' ).val() ), parseInt( $( '#preview-grid-size' ).val() )];
                        }
                        ui.helper.resizable( 'option', 'grid', grid );
                    },
                    stop: function( ev, ui ) {
                        var laId = ui.helper.attr( 'data-id' );
                        $( '.styling-block-wrap[data-id="' + laId + '"]' ).find( '.size-w' ).val( parseInt( ui.size.width ) );
                        $( '.styling-block-wrap[data-id="' + laId + '"]' ).find( '.size-h' ).val( parseInt( ui.size.height ) );
                    }
                });
                
                laPreview.resizable( 'disable' );
                
            }
        },
        
        // window resized
        resize: function() {
            var previewArea = this.form.find( '#styling-preview-area' );
            var fieldsArea = this.form.find( '#styling-fields-area' );
            var applyDiv = this.form.find( '#apply-styling-div' );
            var prevNext = this.form.find( '#styling-fields-com' );
            var ah = $( '.cnhk-overlay-content' ).height() - 50;
            var aw = $( '.cnhk-overlay-content' ).width() - SIDEBAR_WIDTH;
            
            fieldsArea.css({
                marginLeft: aw,
                height: ah,
            });
            previewArea.css({
                width: aw,
                height: ah,
            });
            this.form.find( '#styling-fields-wrap' ).css({
                width: ( SIDEBAR_WIDTH - 1 ) * this.layerCount,
                height: '100%',
            });
            var index = 0;
            this.form.find( '.styling-block-wrap' ).each(function(){
                $( this ).css({
                    height: ah - prevNext.innerHeight() - 1,
                    marginLeft: index * ( SIDEBAR_WIDTH - 1 ),
                });
                index++;
            });
        },
        
    };
    
    // extend jQuery
    $.layerStylingControl = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'layerStylingControl' );
        if ( ! data ) {
            data = new layerStylingControl( option );
            $( '#wpwrap' ).data( 'layerStylingControl', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.layerStylingControl has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})( jQuery );
