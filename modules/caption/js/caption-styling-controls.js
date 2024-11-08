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
    
    var captionStylingControl = function( options ) {
        var defaultOptions = {};
		this.options = {};
        this.options = $.extend( {}, defaultOptions, options );
        this.captions;
        this.captionCount;
        
        // caption index (current index, starts at 0)
        this.CI;
        
        // caption ID collection (used to get caption ID at a given index)
        this.CIC;
        this.form;
        this.slideId;
        this.caMarkup;
    };
    
    captionStylingControl.prototype = {
        
        constructor: captionStylingControl,
        
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
        
        // show form in the overlay
        open: function() {
            var options = {
                width: 94,
                height: 85,
                title: captionStylingLocale.overlayTitle,
                content: spinner,
            };
            $.cnhkOverlay( options );
            $.cnhkOverlay( 'show' );
            this.loadForm();
            if ( undefined !== this.form ) {
                this.populate();
            }
        },
        
        // load the form markup, via AJAX or retrieve it from #wpwrap
        loadForm: function() {
            var form = $( '#wpwrap' ).data( 'captionStylingForm' );
            
            if ( form ) {
                // form already loaded, just use the backup
                this.form = form.clone();
                this.caMarkup = $( '#wpwrap' ).data( 'captionStylingCaMarkup' ).clone();
            } else {
                // first type using the caption styling form, load it (AJAX)
                var that = this;
                
                var formData = {
                    nonce : cnhkAjaxNonce,
                    action : 'cnhk_caption_styling_form',
                };
                
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: formData,
                    success: function ( resp, textStatus, XHR ) {
                        // form loaded, save it in #wpwrap
                        var $resp = $( '<div id="caption-styling-form"></div>' ).html( resp );
                        var caMarkup = $resp.find( '.styling-block-wrap' ).remove();
                        $( '#wpwrap' ).data( 'captionStylingForm', $resp );
                        $( '#wpwrap' ).data( 'captionStylingCaMarkup', caMarkup );
                        that.form = $resp.clone();
                        that.caMarkup = caMarkup.clone();
                        
                        // bind all event handler (one time, hence bind it only on the first time using the form)
                        that.evt();
                        
                        // event handler in place, say now that the form is loaded
                        $( document ).trigger( 'captionStylingFormLoaded' );
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
            $( document ).on( 'captionStylingFormLoaded', function (){
                that.populate();
            } );
            
            // resize
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
            } );
            
            // grid checkbox clicked
            $( document ).on( 'click', '#caption-styling-form #styling-preview-grid #grid-hndle', function ( ev ) {
                ev.stopPropagation();
                that.toggleGridForm();
            } );
            
            // hide the grid form when clicked (it's shown)
            $( document ).on( 'click', '#caption-styling-form #styling-preview-grid.shown', function ( ev ) {
                that.toggleGridForm();
            } );
            
            // stop event bubbling for a click on an input, otherwise it will fall into the previous handler (then hide the grid form)
            $( document ).on( 'click', '#caption-styling-form #styling-preview-grid #enable-grid,#styling-preview-grid #preview-grid-size', function ( ev ) {
                ev.stopPropagation();
            } );
            
            // apply left position from the number input
            $( document ).on( 'click', '#caption-styling-form .apply-pos-left', function () {
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' ).draggable( 'widget' ).css({
                    left: parseInt( $( this ).siblings( '.pos-left' ).val() ),
                } );
            } );
            
            // apply top position from the number input
            $( document ).on( 'click', '#caption-styling-form .apply-pos-top', function () {
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' ).draggable( 'widget' ).css({
                    top: parseInt( $( this ).siblings( '.pos-top' ).val() ),
                } );
            } );
            
            // apply width from the number input
            $( document ).on( 'click', '#caption-styling-form .apply-size-w', function () {
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' ).draggable( 'widget' ).css({
                    width: parseInt( $( this ).siblings( '.size-w' ).val() ),
                } );
            } );
            
            // apply height from the number input
            $( document ).on( 'click', '#caption-styling-form .apply-size-h', function () {
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' ).draggable( 'widget' ).css({
                    height: parseInt( $( this ).siblings( '.size-h' ).val() ),
                } );
            } );
            
            // line height changed
            $( document ).on( 'change', '#caption-styling-form .le', function () {
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var le = ( parseFloat( $( this ).val() ) )?  parseFloat( $( this ).val() ) : 32;
                $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' ).css( 'line-height', le + 'px' );
            } );
            
            // prev/next caption
            $( document ).on( 'click', '.style-com', function( ev ){
                if ( $( this ).hasClass( 'stop' ) ) return;
                if ( $( this ).hasClass( 'prev-field' ) ) {
                    that.setCurrentCI( '-' );
                }
                if ( $( this ).hasClass( 'next-field' ) ) {
                    that.setCurrentCI( '+' );
                }
            } );
            
            // show bounds
            $( document ).on( 'click', '#caption-styling-form .show-bounds', function( ev ){
                var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var thePreview = $( '#styling-preview-area .ca-preview[data-id="' + caId + '"]' );
                if ( $( this ).prop( 'checked' ) ) {
                    var fgColor = $( this ).parents( '.styling-block-wrap' ).find( '.fg-color' ).val();
                    if ( ! fgColor ) fgColor = '#222222';
                    thePreview.css( 'border', '1px dashed ' + fgColor );
                } else {
                    thePreview.css( 'border', 'none' );
                }
            } );
            
            // color input change
            $( document ).on( 'caColorChange', '#caption-styling-form .styling-block-wrap', function( ev, color, type ){
                var id = $( this ).attr( 'data-id' );
                var thePreview = $( '.ca-preview[data-id="' + id + '"]' );
                if ( 'bg-color' == type ) {
                    // background color
                    var bgOpacity = $( this ).find( '.bg-opacity' ).slider( 'value' );
                    
                    if ( '' != color ) {
                        var rgb = jssorFunc.hexToRgb( color );
                        thePreview.find( '.ca-preview-border' ).css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + bgOpacity + ')' );
                    } else {
                        thePreview.find( '.ca-preview-border' ).css( 'background-color', 'transparent' );
                    }
                    
                } else if ( 'fg-color' == type ) {
                    // foreground color
                    thePreview.css( 'color', color );
                } else if ( 'border-color' == type ) {
                    // border color
                    that._updateBorderProp( id );
                }
                
            } );
            
            // slider input change
            $( document ).on( 'caSliderChange', '#caption-styling-form .styling-block-wrap', function( ev, value, type ) {
                var id = $( this ).attr( 'data-id' );
                
                if ( 'bg-opacity' == type ) {
                    // background opacity
                    var thePreview = $( '.ca-preview[data-id="' + id + '"]' );
                    var color = $( this ).find( '.bg-color' ).wpColorPicker( 'color' );
                    if ( '' != color ) {
                        var rgb = jssorFunc.hexToRgb( color );
                        thePreview.find( '.ca-preview-border' ).css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + value + ')' );
                    } else {
                        thePreview.find( '.ca-preview-border' ).css( 'background-color', 'transparent' );
                    }
                }
                if ( 'border-width' == type ) {
                    // border
                   that._updateBorderProp( id );
                }
                if ( 'pad-vert' == type || 'pad-horz' == type ) {
                    // padding
                    that._updatePaddingProp( id );
                }
                
            } );
            
            // font family change
            $( document ).on( 'change', '#caption-styling-form .font', function() {
                var id = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                var thePreview = $( '.ca-preview[data-id="' + id + '"]' );
                var ff = $( this ).find( 'option:selected' ).attr( 'data-ff' );
                if ( ff ) {
                    thePreview.css( 'font-family', ff );
                } else {
                    thePreview.css( 'font-family', 'Arial, Helvetica Neue, Helvetica, sans-serif, serif' );
                }
            } );
            
            // border style, border radius change
            $( document ).on( 'change', '#caption-styling-form .styling-block-wrap .border-style,#caption-styling-form .styling-block-wrap .bdr', function( ev ){
                var id = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                that._updateBorderProp( id );
            } );
            
            // apply changes (from the popup form in overlay to the edit post page)
            $( document ).on( 'click', '#apply-caption-styling', function( ev ) {
                $( '.styling-block-wrap' ).each( function() {
                    var id = $( this ).attr( 'data-id' );
                    var thePreview = $( '.ca-preview[data-id="' + id + '"]' );
                    var theForm = $( '.styling-block-wrap[data-id="' + id + '"]' );
                    var slideId = that.options.slide.find( '.slide-id' ).val();
                    
                    var scale = $( '#slide-container' ).cnhkSlideWrap( 'getScale' );
                    
                    var stObj = {};
                    
                    stObj.left = parseInt( thePreview.position().left / scale );
                    stObj.top = parseInt( thePreview.position().top / scale );
                    stObj.w = thePreview.width();
                    stObj.h = thePreview.height();
                    stObj.le = theForm.find( '.le' ).val();
                    stObj.font = theForm.find( '.font' ).val();
                    
                    stObj.pad = theForm.find( '.pad-horz' ).slider( 'value' ) + '_' + theForm.find( '.pad-vert' ).slider( 'value' );
                    
                    stObj.bgColor = theForm.find( '.bg-color' ).val();
                    stObj.fgColor = theForm.find( '.fg-color' ).val();
                    stObj.bgOpacity = theForm.find( '.bg-opacity' ).slider( 'value' );
                    stObj.bdStyle = theForm.find( '.border-style' ).val();
                    stObj.bdColor = theForm.find( '.border-color' ).val();
                    stObj.bdWidth = theForm.find( '.border-width' ).slider( 'value' );
                    stObj.bdRadius =    ( ( theForm.find( '.bdr-tl' ).val() )? theForm.find( '.bdr-tl' ).val() : '0' ) + '_' + 
                                        ( ( theForm.find( '.bdr-tr' ).val() )? theForm.find( '.bdr-tr' ).val() : '0' ) + '_' +
                                        ( ( theForm.find( '.bdr-bl' ).val() )? theForm.find( '.bdr-bl' ).val() : '0' ) + '_' +
                                        ( ( theForm.find( '.bdr-br' ).val() )? theForm.find( '.bdr-br' ).val() : '0' );
                    
                    that.options.slide.find( '.caption-id[value="' + id + '"] + .parent-slide-id[value="' + slideId + '"] ~ .ca-styling' ).val( JSON.stringify( stObj ) );
                    $.cnhkOverlay( 'hide', true );
                } );
            } );
            
        },
        
        // update padding properties on the peview
        _updatePaddingProp( id ) {
            var block = $( '.styling-block-wrap[data-id="' + id + '"]' );
            var padHorz = block.find( '.pad-horz' ).slider( 'value' );
            var padVert = block.find( '.pad-vert' ).slider( 'value' );
            $( '.ca-preview[data-id="' + id + '"] .ca-preview-padding' ).css({
                paddingLeft: padHorz + '%',
                paddingRight: padHorz + '%',
                paddingTop: padVert + '%',
                paddingBottom: padVert + '%',
            }); 
        },
        
        // update border properties on the peview
        _updateBorderProp( id ) {
            var block = $( '.styling-block-wrap[data-id="' + id + '"]' );
            var border = {};
            border.style = block.find( '.border-style' ).val();
            border.color = block.find( '.border-color' ).wpColorPicker( 'color' );
            if ( '' == border.color ) {
                border.color = 'transparent';
            }
            border.width = block.find( '.border-width' ).slider( 'value' );
            var theBorder = $( '.ca-preview[data-id="' + id + '"] .ca-preview-border' );
            if ( 'none' == border.style || 'transparent' == border.color ) {
                theBorder.css( 'border', 'none' );
            } else {
                theBorder.css( 'border', border.width + 'px ' + border.style + ' ' + border.color );
            }
            theBorder.css( 'border-top-left-radius', ( ( block.find( '.bdr-tl' ).val() )? parseInt( block.find( '.bdr-tl' ).val() ) : 0 ) + 'px' );
            theBorder.css( 'border-top-right-radius', ( ( block.find( '.bdr-tr' ).val() )? parseInt( block.find( '.bdr-tr' ).val() ) : 0 ) + 'px' );
            theBorder.css( 'border-bottom-left-radius', ( ( block.find( '.bdr-bl' ).val() )? parseInt( block.find( '.bdr-bl' ).val() ) : 0 ) + 'px' );
            theBorder.css( 'border-bottom-right-radius', ( ( block.find( '.bdr-br' ).val() )? parseInt( block.find( '.bdr-br' ).val() ) : 0 ) + 'px' );
            this._updatePaddingProp( id );
        },
        
        // toggle grid form position
        toggleGridForm: function(){
            var form = this.form.find( '#styling-preview-grid' );
            if ( form.hasClass( 'shown' ) ) {
                form.animate( {left: '100%'},500, 'swing', function(){ form.removeClass( 'shown' )} );
            } else {
                form.animate( {left: '85%'},500, 'swing', function(){ form.addClass( 'shown' )} );
            }
        },
        
        /**
         *  set the current caption index
         *  
         *  @param [int] Ci, the new caption index
         */
        setCurrentCI( CI ) {
            if ( '+' === CI ) {
                var currentCI = this.CI;
                
                if ( this.captionCount - 1 > currentCI ) {
                    this.CI = currentCI + 1;
                    if ( 0 != this.captionCount ) {
                        $( '.style-com.prev-field' ).removeClass( 'stop' );
                    }
                    if ( this.captionCount - 1 == this.CI ) {
                        $( '.style-com.next-field' ).addClass( '.stop' );
                    }
                }
            } else if ( '-' === CI ) {
                var currentCI = this.CI;
                if ( 0 < currentCI ) {
                    this.CI = currentCI - 1;
                    if ( 0 != this.captionCount ) {
                        $( '.style-com.next-field' ).removeClass( 'stop' );
                    }
                    if ( 0 == this.CI ) {
                        $( '.style-com.prev-field' ).addClass( '.stop' );
                    }
                }
            } else {
                this.CI = CI;
            }
            
            if ( 0 == this.CI ) {
                $( '.style-com.prev-field' ).addClass( 'stop' );
            }
            if ( this.captionCount - 1 == this.CI ) {
                $( '.style-com.next-field' ).addClass( 'stop' );
            }
            
            var id = this.CIC[this.CI];
            // preview area
            var thePreview = $( '#styling-preview-area' ).find( '.ca-preview[data-id="' + id + '"]' );
            thePreview.css( 'z-index', 12 ).draggable( 'enable' ).resizable( 'enable' ).css({cursor: 'move', opacity: 1});
            // $( '#styling-preview-area' ).find( '.ca-preview' ).not( thePreview ).each(function(){
            $( '#styling-preview-area' ).find( '.ca-preview' ).each(function(){
                var notId = $( this ).attr( 'data-id' );
                if ( id != notId ) {
                    $( this ).css( 'z-index', 10 ).draggable( 'disable' ).resizable( 'disable' ).css( 'cursor', 'default' );
                    var theForm = $( '.styling-block-wrap[data-id="' + notId + '"]' );
                    if ( ! theForm.find( '.always-visible' ).prop( 'checked' ) ) {
                        $( this ).css( 'opacity', 0 );
                    }
                }
            });
            $( '#styling-form-scroll' ).animate( { 'margin-left': - ( this.CI * ( SIDEBAR_WIDTH - 1 ) ) }, 500 );
        },
        
        // populate the overlay
        populate: function() {
            var that = this;
            this.CI = 0;
            this.CIC = [];
            this.captions = {};
            
            var count = 0;
            
            this.form.find( '#styling-form-scroll' ).empty();
            this.options.slide.find( '.caption' ).each(function(){
                var $this = $( this );
                var id = $this.find( '.caption-id' ).val();
                that.CIC.push( id );
                var ca = {};
                var stylingObj = JSON.parse( $this.find( '.ca-styling' ).val() );
                ca['name'] = $this.find( '.caption-name' ).val();
                ca['html'] = $this.find( '.caption-html' ).val();
                ca['left'] = stylingObj.left;
                ca['top'] = stylingObj.top;
                ca['width'] = stylingObj.w;
                ca['height'] = stylingObj.h;
                ca['le'] = stylingObj.le;
                ca['padHorz'] = parseFloat( stylingObj.pad.split( '_' )[0] );
                ca['padVert'] = parseFloat( stylingObj.pad.split( '_' )[1] );
                ca['font'] = stylingObj.font;
                ca['fgColor'] = stylingObj.fgColor;
                ca['bgColor'] = stylingObj.bgColor;
                ca['bgOpacity'] = stylingObj.bgOpacity;
                ca['borderColor'] = stylingObj.bdColor;
                ca['borderWidth'] = stylingObj.bdWidth;
                ca['borderStyle'] = stylingObj.bdStyle;
                ca['bdrTL'] = parseInt( stylingObj.bdRadius.split( '_' )[0] );
                ca['bdrTR'] = parseInt( stylingObj.bdRadius.split( '_' )[1] );
                ca['bdrBL'] = parseInt( stylingObj.bdRadius.split( '_' )[2] );
                ca['bdrBR'] = parseInt( stylingObj.bdRadius.split( '_' )[3] );
                
                that.captions[id] = ca;
                
                
                var markup = that.caMarkup.clone();
                
                markup.find( '.caption-name-head' ).text( ca.name );
                markup.find( '.pos-left' ).val( parseInt( ca.left ) );
                markup.find( '.pos-top' ).val( parseInt( ca.top ) );
                markup.find( '.size-w' ).val( parseInt( ca.width ) );
                markup.find( '.size-h' ).val( parseInt( ca.height ) );
                markup.find( '.font' ).val( ca.font );
                markup.find( '.le' ).val( ca.le );
                markup.find( '.fg-color' ).val( ca.fgColor );
                markup.find( '.bg-color' ).val( ca.bgColor );
                markup.find( '.bg-opacity' ).attr( 'data-val', ca.bgOpacity );
                markup.find( '.pad-horz' ).attr( 'data-val', ca.padHorz );
                markup.find( '.pad-vert' ).attr( 'data-val', ca.padVert );
                markup.find( '.border-style' ).val( ca.borderStyle );
                markup.find( '.border-width' ).attr( 'data-val', ca.borderWidth );
                markup.find( '.border-color' ).val( ca.borderColor );
                markup.find( '.bdr-tl' ).val( ca.bdrTL );
                markup.find( '.bdr-tr' ).val( ca.bdrTR );
                markup.find( '.bdr-bl' ).val( ca.bdrBL );
                markup.find( '.bdr-br' ).val( ca.bdrBR );
                markup.attr( 'data-id', id );
                
                that.form.find( '#styling-form-scroll' ).append( markup );
                
                count++;
            });
            
            this.captionCount = count;
            $.cnhkOverlay( { content: this.form } );
            
            this.setup();
            this.setCurrentCI( this.options.activeCI );
            this.resize();
        },
        
        // initialize form (input, color picker etc)
        setup: function() {
            var that = this;
            
            // Setup style fields in sidebar
            $( '#styling-form-scroll .styling-block-relwrap' ).each(function(){
                
                // color inputs
                $( this ).find( '.color-input' ).each(function(){
                    var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                    var type = $( this ).attr( 'class' ).split( ' ' )[1];
                    $( this ).wpColorPicker({
                        defaultColor: '',
                        change: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + caId + '"]' ).trigger( 'caColorChange', [ui.color.toString(), type] );
                        },
                        clear: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + caId + '"]' ).trigger( 'caColorChange', ['', type] );
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
                    var caId = $( this ).parents( '.styling-block-wrap' ).attr( 'data-id' );
                    $( this ).slider({
                        value: ( ( $( this ).attr( 'data-val' ) )? parseFloat( $( this ).attr( 'data-val'  ) ) : parseFloat( $( this ).attr( 'data-min' ) ) ),
                        min: parseFloat( $( this ).attr( 'data-min' ) ),
                        max: parseFloat( $( this ).attr( 'data-max' ) ),
                        step: parseFloat( $( this ).attr( 'data-step' ) ),
                        change: function( ev, ui ) {
                            $( '.styling-block-wrap[data-id="' + caId + '"]' ).trigger( 'caSliderChange', [ui.value, type] );
                        },
                    });
                });
                
            });
            
            var slideContent;
            var slideType = this.options.slide.find( '.slide-type' ).val();
            var captionHandler = this.options.slide.find( '.caption-handler' ).val();
            slideContent = cnhkSlideHandler[ slideType ].getSlideContent( this.slideId );
            
            var slideContainer = this.form.find( '#slide-container' );
            slideContainer.empty().append( $( slideContent ).attr( 'id', 'slide-' + this.slideId ) );
            
            for ( var id in this.captions ) {
                
                var style = 'position:absolute;' + cnhkCaptionHandler[ captionHandler ].boxToString( this.captions[id] );
                var caDiv = $( '<div />' ).addClass( 'ca-preview no-select' ).attr({
                    'data-id': id,
                    'style' : style,
                });
                var caBorder = $( '<div />' ).addClass( 'ca-preview-border' ).attr( 'style', cnhkCaptionHandler[ captionHandler ].styleToString( this.captions[id] ) ).css({width:'100%',height:'100%'});
                var caInner = $( '<div />' ).addClass( 'ca-preview-padding' ).html( this.captions[id]['html'] ).attr( 'style', cnhkCaptionHandler[ captionHandler ].paddingToString( this.captions[id] ) );
                slideContainer.append( caDiv.append( caBorder.append( caInner ) ) );
            }
            
            slideContainer.cnhkSlideWrap({
                fillMode: $( '#options-_FillMode' ).val(),
                boxWidth: $( '#options-w' ).val(),
                boxHeight: $( '#options-h' ).val(),
            });
            slideContainer.cnhkSlideWrap( 'init' );
            
            $( '#slide-container .slidewrap-abs-container' ).append( $( '<div />' ).attr( 'id', 'drag-bounds' ).css({
                position: 'absolute',
                zIndex: -1,
            }) ).css({
                border: '1px dashed #222',
            });
            
            for ( var id in this.captions ) {
                var caPreview = slideContainer.find( '.ca-preview[data-id="' + id + '"]' );
                
                caPreview.draggable({
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
                        var caId = ui.helper.attr( 'data-id' );
                        $( '.styling-block-wrap[data-id="' + caId + '"]' ).find( '.pos-left' ).val( parseInt( ui.position.left ) );
                        $( '.styling-block-wrap[data-id="' + caId + '"]' ).find( '.pos-top' ).val( parseInt( ui.position.top ) );
                    },
                });
                
                caPreview.draggable( 'disable' );
                
                // resizable
                
                caPreview.resizable({
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
                        var caId = ui.helper.attr( 'data-id' );
                        $( '.styling-block-wrap[data-id="' + caId + '"]' ).find( '.size-w' ).val( parseInt( ui.size.width ) );
                        $( '.styling-block-wrap[data-id="' + caId + '"]' ).find( '.size-h' ).val( parseInt( ui.size.height ) );
                    }
                });
                
                caPreview.resizable( 'disable' );
                
            }
        },
        
        // resize function
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
                width: ( SIDEBAR_WIDTH - 1 ) * this.captionCount,
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
    $.captionStylingControl = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'captionStylingControl' );
        if ( ! data ) {
            data = new captionStylingControl( option );
            $( '#wpwrap' ).data( 'captionStylingControl', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.captionStylingControl has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})( jQuery );
