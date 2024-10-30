/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var templateHandlerIMAGE = function() {
        this.slider = null;
        
        var that = this;
        // scale slider on overlay resized
        $( document ).on( 'cnhkOverlayResized', function() {
            that.scaleSlider();
        } );
        
        // delete sliders on overlay closed
        $( document ).on( 'beforeHideKaiOverlay', function() {
            that.slider = null;
        } )
    };
    
    templateHandlerIMAGE.prototype = {
        
        constructor: templateHandlerIMAGE,
        
        /**
         *  make the slider for caption timing preview
         *  
         *  @param [string] previewSelector, selector for the preview area (where to append the preview slider)
         *  @param [object] caFx, the caption effect array to use in on the preview jssor format
         *  @param [jQuery] slideobject, the slide ( content w/o captions ) in its jQuery form
         *  @param [int] du, auto play interval in ms
         */
        timingPreview: function( previewSelector, caFx, slideObject, du ) {
            var ss = $( '<div />' ).attr( 'id', 'ss' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
            });
            
            var sls = $( '<div />' ).attr( 'data-u', 'slides' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
            });
            
            var sliderOptions = {
                $FillMode: $( '#options-_FillMode' ).val(),
                $AutoPlay: true,
                $PauseOnHover: 0,
                $AutoPlayInterval: 1.5 * du,
                $MinDragOffsetToSlide: 20,
                $PlayOrientation: parseFloat( $( '#options-_PlayOrientation' ).val() ),
                $DragOrientation: 0,
                $CaptionSliderOptions: {
                    $Class: $JssorCaptionSlider$,
                    $CaptionTransitions: caFx,
                    $PlayInMode: 1,
                    $PlayOutMode: 1,
                },
            };
            
            var previewDiv = $( previewSelector );
            
            slideObject.css( 'cursor', 'move' );
            sls.append( slideObject.clone() ).append( slideObject );
            ss.append( sls );
            
            previewDiv.append( ss );
            
            var slider = new $JssorSlider$( 'ss' , sliderOptions );
            return slider;
        },
        
        /**
         *  make a slider with single slide and display it in the overlay
         *  
         *  @param [string] id, the ID of the slide to display
         *  @param [bool] display, if FALSE return the slide (with caption markup) in its jQuery form
         */
        previewSingleSlide: function( id, display ) {
            if ( undefined === display ) {
                display = true;
            }
            var form = $( '.slide' ).has( '.slide-id[value="' + id + '"]' );
            var sH = cnhkSlideHandler['image'];
            var slideContent = sH.getSlideContent( id );
            var cH = cnhkCaptionHandler[ form.find( '.caption-handler' ).val() ];
            
            var slide = $( '<div />' ).html( slideContent );
            if ( slide.find( '>img' ).length ) {
                slide.find( '>img' ).attr( 'data-u', 'image' );
            }
            
            var caFx;
            var autoPlayDelay = $( '#options-_AutoPlayInterval' ).val();
            
            if ( form.find( '.captions-list .caption' ).length ) {
                var du = form.find( '.slide-du' ).val();
                var du2 = form.find( '.slide-du2' ).val();
                var du3 = form.find( '.slide-du3' ).val();
                var caMarkup = cH.getMarkup( id, cH.getCaObject( id ), cH.getFxCodes( id ), du, du2, du3 );
                caFx = cH.getFxArray( id );
                slide.append( caMarkup );
            }
            
            var slFx = form.find( '.slfx' ).val();
            if ( '' == slFx ) {
                slFx = $( '#options-ssfx' ).val()
            }
            
            var sldu = ( form.find( '.sldu' ).val() )?  form.find( '.sldu' ).val() : $( '#options-ssdu' ).val();
            sldu = parseFloat( sldu );
            if ( NaN === sldu ) sldu = 1500;
            var slFx_json = window.jssorFunc.convert( slFx, 'json' );
            if ( sldu && slFx_json ) {
                if ( undefined !== slFx_json['$Brother'] ) {
                    // is twin effect
                    var $D1 = slFx_json['$Duration'];
                    var ratio = parseFloat( $D1 ) / sldu;
                    slFx_json['$Duration'] = sldu;
                    slFx_json['$Brother']['$Duration'] = slFx_json['$Brother']['$Duration'] / ratio;
                } else {
                    slFx_json['$Duration'] = sldu;
                }
                slFx = window.jssorFunc.convert( slFx_json, 'jssor' );
            }
            
            var ssFx = ( slFx_json )? window.jssorFunc.convert( slFx, 'fx' ) : null;
            
            var ssfxArray = [ ssFx, ssFx ];
            
            var $SlideDuration = parseFloat( $( '#options-ssdu' ).val() );
            
            if ( ! $SlideDuration ) {
                $SlideDuration = 1500;
            }
            
            var sliderOptions = {
                $FillMode: parseFloat( $( '#options-_FillMode' ).val() ),
                $AutoPlay: true,
                $AutoPlayInterval: parseFloat( autoPlayDelay ),
                $PlayOrientation: parseFloat( $( '#options-_PlayOrientation' ).val() ),
                $DragOrientation: 0,
                $SlideDuration: $SlideDuration,
                $PauseOnHover: parseFloat( $( '#options-_PauseOnHover' ).val() ),
            };
            if ( caMarkup ) {
                sliderOptions['$CaptionSliderOptions'] = {
                    $Class: $JssorCaptionSlider$,
                    $CaptionTransitions: caFx,
                    $PlayInMode: 1,
                    $PlayOutMode: 1,
                };
            }
            if ( slFx ) {
                sliderOptions['$SlideshowOptions'] = {
                    $Class: $JssorSlideshowRunner$,
                    $Transitions: ssfxArray,
                    $TransitionsOrder: 1,
                };
            }
            
            var slidesContainer = $( '<div />' ).attr( 'data-u', 'slides' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
            });
            
            slidesContainer.append( slide.clone() ).append( slide );
            
            var ss = $( '<div />' ).attr( 'id', 'ss' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
            }).append( slidesContainer );
            
            if ( display ) {
                $.cnhkOverlay({
                    width: 94,
                    height: 85,
                    title: cnhkTemplateHandlerImageLocale.singlePreview,
                    content: ss,
                });
                $.cnhkOverlay( 'show' );
                this.slider = new $JssorSlider$( 'ss' , sliderOptions );
                this.scaleSlider();
            } else {
                return {
                    slide: slide,
                    ssFx: ssFx,
                    caFx: ( caFx )? caFx : false,
                };
            }
        },
        
        // preview the slider
        previewSlideshow: function () {
            var caFx = {};
            var ssFx = [];
            
            var ssw = parseFloat( $( '#options-w' ).val() );
            var ssh = parseFloat( $( '#options-h' ).val() );
            
            var slidesContainer = $( '<div />' ).attr( 'data-u', 'slides' ).css({
                width: ssw,
                height: ssh,
                position: 'absolute',
                overflow: 'hidden',
            });
            
            var ss = $( '<div />' ).attr( 'id', 'ss' ).css({
                width: ssw,
                height: ssh,
                position: 'absolute',
                overflow: 'hidden',
            }).append( slidesContainer );
            
            var useArrows = cnhkNavHandler['arrows'].isUsed();
            var useThumb = cnhkNavHandler['thumb'].isUsed();
            
            var thumbSettings = false;
            if ( useThumb ) {
                thumbSettings = {
                    width: parseFloat( $( '#navs-thumb-width' ).val() ) || 120,
                    height: parseFloat( $( '#navs-thumb-height' ).val() ) || 90,
                    lane: parseInt( $( '#navs-thumb-lane' ).val() ) || 1,
                    pieces: parseInt( $( '#navs-thumb-pieces' ).val() ) || 1,
                    position: $( '#navs-thumb-position' ).val(),
                }
            }
            
            var that = this;
            
            var hasCaptions = false;
            $( '.slide-id' ).each(function(){
                var result = that.previewSingleSlide( $( this ).val(), false );
                if ( useThumb ) {
                    var src = result.slide.find( 'img' ).attr( 'src' );
                    var thumbUrl = cnhkNavHandler['thumb'].getThumbImage( src, thumbSettings.width, thumbSettings.height );
                    result.slide.append( '<img data-u="thumb" src="' + thumbUrl + '" />' );
                }
                slidesContainer.append( result.slide );
                
                
                ssFx.push( result.ssFx );
                if ( result.caFx ) {
                    hasCaptions = true;
                    $.extend( caFx, result.caFx );
                }
            });
            
            if ( $( '#use-nav-progress' ).prop( 'checked' ) ) {
                var progressPosition = $( '#navs-progress-position' ).val();
                var progressSize = $( '#navs-progress-size' ).val();
                
                var progressBar = $( '<div />' ).addClass( 'slider-progress-bar' ).css({
                    position: 'absolute',
                    backgroundColor: $( '#navs-progress-color' ).val(),
                    opacity: parseFloat( $( 'input[name="navs[progress][opacity]"]' ).val() ),
                }).attr( 'data-u', 'any' );
                
                var progressProp, progressThick;
                
                switch ( progressPosition ) {
                    case 'left' :
                        progressProp = 'height';
                        progressThick = 'width';
                        progressBar.css({
                            bottom: 0,
                            left: 0,
                            height: 0,
                            width: progressSize,
                        });
                        break;
                    case 'right' :
                        progressProp = 'height';
                        progressThick = 'width';
                        progressBar.css({
                            bottom: 0,
                            right: 0,
                            height: 0,
                            width: progressSize,
                        });
                        break;
                    case 'bottom' :
                        progressProp = 'width';
                        progressThick = 'height';
                        progressBar.css({
                            bottom: 0,
                            left: 0,
                            width: 0,
                            height: progressSize,
                        });
                        break;
                    default: // top
                        progressProp = 'width';
                        progressThick = 'height';
                        progressBar.css({
                            top: 0,
                            left: 0,
                            width: 0,
                            height: progressSize,
                        });
                }
                
                slidesContainer.append( progressBar );
            }
            
            var $SlideDuration = parseFloat( $( '#options-ssdu' ).val() );
            
            if ( ! $SlideDuration ) {
                $SlideDuration = 1500;
            }
            
            var sliderOptions = {
                $FillMode: parseFloat( $( '#options-_FillMode' ).val() ),
                $AutoPlay: $( '#options-_AutoPlay' ).prop( 'checked' ),
                $AutoPlayInterval: parseFloat( $( '#options-_AutoPlayInterval' ).val() ),
                $PlayOrientation: parseFloat( $( '#options-_PlayOrientation' ).val() ),
                $DragOrientation: 0,
                $SlideDuration: $SlideDuration,
                $PauseOnHover: parseFloat( $( '#options-_PauseOnHover' ).val() ),
                $SlideshowOptions: {
                    $Class: $JssorSlideshowRunner$,
                    $Transitions: ssFx,
                    $TransitionsOrder: 1,
                },
            };
            
            if ( hasCaptions ) {
                sliderOptions['$CaptionSliderOptions'] = {
                    $Class: $JssorCaptionSlider$,
                    $CaptionTransitions: caFx,
                    $PlayInMode: 1,
                    $PlayOutMode: 1,
                };
            }
            
            if ( useArrows ) {
                var offset = {top: 0, left: 0};
                if ( useThumb ) {
                    var thumbOffset = cnhkNavHandler['thumb'].getSize( thumbSettings );
                    if ( 'left' == thumbSettings.position ) {
                        offset.left = thumbOffset.width;
                    }
                    if ( 'top' == thumbSettings.position ) {
                        offset.top = thumbOffset.height;
                    }
                }
                var arrowMarkup = cnhkNavHandler['arrows'].getMarkup( offset );
                sliderOptions['$ArrowNavigatorOptions'] = {
                    $Class: $JssorArrowNavigator$,
                    $ChanceToShow: parseFloat( $( '#navs-arrows-_ChanceToShow').val() ),
                    $AutoCenter: 0,
                    $Steps: 1,
                };
                ss.append( $( arrowMarkup ) );
            }
            
            if ( useThumb ) {
                sliderOptions['$ThumbnailNavigatorOptions']= {
                    $Class: $JssorThumbnailNavigator$,
                    $ChanceToShow: 2,
                    $ActionMode: 1,
                    $Lanes: thumbSettings.lane,
                    $DisplayPieces: thumbSettings.pieces,
                    $Orientation: ( 'left' == thumbSettings.position ||  'right' == thumbSettings.position )? 2 : 1,
                    $SpacingX: 0.05 * thumbSettings.width,
                    $SpacingY: 0.05 * thumbSettings.height,
                }
                var thumbAreaSize = cnhkNavHandler['thumb'].getSize( thumbSettings );
                var thumbMarkup = cnhkNavHandler['thumb'].getMarkup( thumbSettings, ssw, ssh );
                switch ( thumbSettings.position ) {
                    case 'left':
                        slidesContainer.css({left: thumbAreaSize.width});
                    case 'right':
                        ss.css({width: ssw + thumbAreaSize.width});
                        break;
                    case 'top':
                        slidesContainer.css({top: thumbAreaSize.height});
                    default: // bottom
                        ss.css({height: ssh + thumbAreaSize.height});
                }
                ss.append( $( thumbMarkup ) );
            }
            
            $.cnhkOverlay({
                width: 94,
                height: 85,
                title: cnhkTemplateHandlerImageLocale.ssPreview,
                content: ss,
            });
            
            $.cnhkOverlay( 'show' );
            this.slider = new $JssorSlider$( 'ss' , sliderOptions );
            
            if ( $( '#use-nav-progress' ).prop( 'checked' ) ) {
                this.slider.$On($JssorSlider$.$EVT_PROGRESS_CHANGE, function( slideIndex, progress, progressBegin, idleBegin, idleEnd, progressEnd ) {
                    $( '.slider-progress-bar' ).css( progressProp, ( progress * 100 / progressEnd ) + '%' );
                });
            }
            
            // nav arrow background
            if ( useArrows ) {
                var bgColor = $( 'input[name="navs[arrows][bgColor]"]' ).val();
                var bgOpacity = parseFloat( $( 'input[name="navs[arrows][bgOpacity]"]' ).val() );
                bgColor = jssorFunc.hexToRgb( bgColor );
                $( this.slider.$Elmt ).on( 'mouseenter', function() {
                    $( this ).find( '.navarrow' ).css({
                        opacity: 1,
                    });
                    if ( 'use' == $( 'input[name="navs[arrows][bg]"]' ).val() ) {
                        $( this ).find( '.navarrow' ).css({
                            backgroundColor: 'rgba(' + bgColor.r + ',' + bgColor.g + ',' + bgColor.b + ',' + bgOpacity + ')',
                        });
                    }
                } ).on( 'mouseleave', function() {
                    $( this ).find( '.navarrow' ).css({
                        opacity: 0.4,
                        backgroundColor: 'transparent',
                    });
                } );
            }
            
            this.scaleSlider();
            
        },
        
        // scale the slider (single slide or entire preview)
        scaleSlider: function() {
            if ( null === this.slider ) return; 
            var aw = $( '.cnhk-overlay-content' ).width() * 0.90;
            var ah = $( '.cnhk-overlay-content' ).height() * 0.90;
            
            var ssWidth = $( this.slider.$Elmt ).width();
            var ssHeight = $( this.slider.$Elmt ).height();
            
            if ( $( this.slider.$Elmt ).find( '.jssor-bullet-nav' ).length ) {
                var bulletWrapSize = cnhkNavHandler['bullet'].getSize();
                var bulletSpacing = cnhkNavHandler['bullet'].getSpacing();
                ssHeight = parseFloat( ssHeight ) + bulletWrapSize + ( 2 * bulletSpacing );
            }
            
            var scaleHorz = ( aw / ssWidth );
            var scaleVert = ( ah / ssHeight );
            this.slider.$ScaleWidth( ssWidth * Math.min( scaleHorz, scaleVert ) );
            
            $( this.slider.$Elmt ).css( 'left', ( $( '.cnhk-overlay-content' ).width() - ( ssWidth * Math.min( scaleHorz, scaleVert ) ) ) / 2 );
            $( this.slider.$Elmt ).css( 'top', ( $( '.cnhk-overlay-content' ).height() - ( ssHeight * Math.min( scaleHorz, scaleVert ) ) ) / 2 );
        },
        
    };
    
    $(function(){
        cnhkTemplateHandler['image'] = new templateHandlerIMAGE();
    });
    
})( jQuery );
