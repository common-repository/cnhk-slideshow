/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var templateHandlerCLASSIC = function() {
        this.slider = null;
        this.ytPlayers = [];
        this.viPlayers = [];
        
        var that = this;
        // scale slider on overlay resized
        $( document ).on( 'cnhkOverlayResized', function() {
            that.scaleSlider();
        } );
        
        // delete sliders on overlay closed
        $( document ).on( 'beforeHideKaiOverlay', function() {
            that.slider = null;
        } );
    };
    
    templateHandlerCLASSIC.prototype = {
        
        constructor: templateHandlerCLASSIC,
        
        /**
         *  make a slider with single slide and display it in the overlay
         *  
         *  @param [string] id, the ID of the slide to display
         *  @param [bool] display, if FALSE return the slide in its jQuery form
         */
        previewSingleSlide: function( id, display ) {
            if ( undefined === display ) {
                display = true;
            }
            var form = $( '.slide' ).has( '.slide-id[value="' + id + '"]' );
            var sH = cnhkSlideHandler[ form.find( '.slide-type' ).val() ];
            
            var slideContent = sH.getSlideContent( id );
            
            var slide = $( '<div />' ).html( slideContent );
            if ( slide.find( '>img' ).length ) {
                slide.find( '>img' ).attr( 'data-u', 'image' );
            }
            
            // avoid error from froogaloop
            if ( slide.find( '.cnhk-vi-player' ) && true == display && 'undefined' !== typeof( $f ) ) {
                var player = $f( slide.find( '#' + slide.find( '.cnhk-vi-player' ).attr( 'id' ) )[0] );
                player.addEvent( 'ready', function(){} );
            }
            
            var autoPlayDelay = parseFloat( $( '#options-_AutoPlayInterval' ).val() );
            var $SlideDuration = parseFloat( $( '#options-_SlideDuration' ).val() );
            if ( NaN == $SlideDuration ) {
                $SlideDuration = 1500;
            }
            
            var sliderOptions = {
                $FillMode: parseFloat( $( '#options-_FillMode' ).val() ),
                $AutoPlay: true,
                $AutoPlayInterval: autoPlayDelay,
                $SlideDuration: $SlideDuration,
                $MinDragOffsetToSlide: 20,
                $PlayOrientation: parseFloat( $( '#options-_PlayOrientation' ).val() ),
                $DragOrientation: parseFloat( $( '#options-_DragOrientation' ).val() ),
                $PauseOnHover: parseFloat( $( '#options-_PauseOnHover' ).val() ),
            };
            
            var slidesContainer = $( '<div />' ).attr( 'data-u', 'slides' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
            });
            
            slidesContainer.append( slide );
            
            var ss = $( '<div />' ).attr( 'id', 'ss' ).css({
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
                position: 'absolute',
                overflow: 'hidden',
                margin: 0,
                border: '1px dashed #222',
                lineHeight: '1em',
            }).append( slidesContainer );
            
            if ( display ) {
                $.cnhkOverlay({
                    width: 94,
                    height: 85,
                    title: cnhkTemplateHandlerClassicLocale.singlePreview,
                    content: ss,
                });
                $.cnhkOverlay( 'show' );
                this.slider = new $JssorSlider$( 'ss' , sliderOptions );
                this.scaleSlider();
            } else {
                return {
                    slide: slide,
                };
            }
        },
        
        previewSlideshow: function () {
            
            var ssw = parseFloat( $( '#options-w' ).val() );
            var ssh = parseFloat( $( '#options-h' ).val() );
            
            var DP = parseFloat( $( '#options-_DisplayPieces' ).val() );
            var PO = parseFloat( $( '#options-_PlayOrientation' ).val() );
            
            var SP = 0;
            var hSP = 0;
            var vSP = 0;
            var PP = 0;
            
            var DPFactor = DP;
            if ( DP <= 1 ) {
                DP = 1;
                DPFactor = 1;
            } else if ( 2 <= DP ) {
                DP = Math.floor( DP );
                DPFactor = DP;
            } else {
                DP = 2;
                PP = ( 0 == ( PO % 2 ) )? ( ssh * ( 1 - DP + DPFactor ) ) / 2 : ( ssw * ( 1 - DP + DPFactor ) ) / 2;
            }
            
            if ( 2 <= DP ) {
                SP = 5;
                if ( 0 == ( PO % 2 ) ) {
                    // vertical
                    vSP = DP * SP; // 5 pixel space between slides
                    if ( 2 > DPFactor ) {
                        vSP += SP;
                    }
                } else {
                    hSP = DP * SP;
                    if ( 2 > DPFactor ) {
                        hSP += SP;
                    }
                }
            }
            var sliderWidth = ssw * ( 1 + ( ( PO % 2 ) * ( DPFactor - 1 ) ) );
            var sliderHeight = ssh * ( 1 + ( Math.pow( 0, PO % 2 ) ) * ( DPFactor - 1 ) );
            if ( 1 != DP ) {
                if ( 0 == PO % 2 ) {
                    sliderHeight += vSP;
                } else {
                    sliderWidth += hSP;
                }
            }
            
            var slidesContainer = $( '<div />' ).attr( 'data-u', 'slides' ).css({
                width: sliderWidth,
                height: sliderHeight,
                position: 'absolute',
                overflow: 'hidden',
            });
            
            var ss = $( '<div />' ).attr( 'id', 'ss' ).css({
                width: sliderWidth,
                height: sliderHeight,
                position: 'absolute',
                overflow: 'hidden',
            }).append( slidesContainer );
            
            if ( $( '#slider-bg-src' ).val() ) {
                slidesContainer.css({
                    backgroundImage: 'url(' + $( '#slider-bg-src' ).val() + ')',
                    backgroundPosition: $( '#options-bgPosition' ).val(),
                });
                var bgRepeat = $( '#options-bgRepeat' ).val();
                if ( 'cover' == bgRepeat ) {
                    slidesContainer.css({
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    });
                } else {
                    slidesContainer.css( 'background-repeat', bgRepeat );
                }
            }
            
            
            var that = this;
            var sli = 0;
            $( '.slide-id' ).each(function(){
                var result = that.previewSingleSlide( $( this ).val(), false );
                if ( undefined !== $.ytPlayers && result.slide.find( '.cnhk-yt-player' ).length ) {
                    that.ytPlayers.push( result.slide.find( '.cnhk-yt-player' ).attr( 'id' ) );
                }
                if ( undefined !== $.viPlayers && result.slide.find( '.cnhk-vi-player' ).length ) {
                    result.slide.find( '.cnhk-vi-player' ).attr( 'data-sli', sli );
                    that.viPlayers.push( result.slide.find( '.cnhk-vi-player' ).attr( 'id' ) );
                }
                slidesContainer.append( result.slide );
                sli++;
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
            
            var $SlideDuration = parseFloat( $( '#options-_SlideDuration' ).val() );
            if ( NaN == $SlideDuration ) {
                $SlideDuration = 1500;
            }
            var sliderOptions = {
                $FillMode: parseFloat( $( '#options-_FillMode' ).val() ),
                $AutoPlay: $( '#options-_AutoPlay' ).prop( 'checked' ),
                $SlideWidth: ssw,
                $SlideHeight: ssh,
                $SlideSpacing: SP,
                $SlideDuration: $SlideDuration,
                $ParkingPosition: PP,
                $AutoPlayInterval: parseFloat( $( '#options-_AutoPlayInterval' ).val() ),
                $MinDragOffsetToSlide: 20,
                $PlayOrientation: PO,
                $DragOrientation: ( 0 == PO % 2 )? 2 : 1,
                $PauseOnHover: parseFloat( $( '#options-_PauseOnHover' ).val() ),
                $DisplayPieces: DP,
                $Loop: 1,
            };
            
            var useArrows = cnhkNavHandler['arrows'].isUsed();
            var useBullet = cnhkNavHandler['bullet'].isUsed();
            
            if ( useArrows ) {
                var arrowMarkup = cnhkNavHandler['arrows'].getMarkup();
                sliderOptions['$ArrowNavigatorOptions'] = {
                    $Class: $JssorArrowNavigator$,
                    $ChanceToShow: parseFloat( $( '#navs-arrows-_ChanceToShow').val() ),
                    $AutoCenter: 0,
                    $Steps: 1,
                };
                ss.append( $( arrowMarkup ) );
            }
            
            if ( useBullet ) {
                var bulletMarkup = cnhkNavHandler['bullet'].getMarkup();
                var bulletWrapSize = cnhkNavHandler['bullet'].getSize();
                var bulletSpacing = cnhkNavHandler['bullet'].getSpacing();
                sliderOptions['$BulletNavigatorOptions'] = {
                    $Class: $JssorBulletNavigator$,
                    $ChanceToShow: 2,
                    $AutoCenter: 1,
                    $Orientation: 1,
                    $SpacingX: bulletSpacing,
                    $SpacingY: bulletSpacing,
                };
                var currentSsh = ss.height();
                ss.css({
                    height: currentSsh + bulletWrapSize,
                });
                
                ss.append( $( bulletMarkup ) );
            }
            $.cnhkOverlay({
                width: 94,
                height: 85,
                title: cnhkTemplateHandlerClassicLocale.ssPreview,
                content: ss,
            });
            
            $.cnhkOverlay( 'show' );
            this.slider = new $JssorSlider$( 'ss' , sliderOptions );
            
            if ( $( '#use-nav-progress' ).prop( 'checked' ) ) {
                this.slider.$On($JssorSlider$.$EVT_PROGRESS_CHANGE, function( slideIndex, progress, progressBegin, idleBegin, idleEnd, progressEnd ) {
                    $( '.slider-progress-bar' ).css( progressProp, ( progress * 100 / progressEnd ) + '%' );
                });
            }
            
            if ( undefined !== $.ytPlayers ) {
                for ( var i in this.ytPlayers ) {
                    $.ytPlayers.addPlayer( this.ytPlayers[i], this.slider );
                }
            }
            if ( undefined !== $.viPlayers ) {
                $.viPlayers.setSlider( this.slider );
                for ( var i in this.viPlayers ) {
                    $.viPlayers.addPlayer( this.viPlayers[i] );
                }
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
        
        scaleSlider: function() {
            if ( null === this.slider ) return; 
            var aw = $( '.cnhk-overlay-content' ).width() * 0.90;
            var ah = $( '.cnhk-overlay-content' ).height() * 0.90;
            
            var ssWidth = $( this.slider.$Elmt ).width();
            var ssHeight = $( this.slider.$Elmt ).height();
            
            var scaleHorz = ( aw / ssWidth );
            var scaleVert = ( ah / ssHeight );
            this.slider.$ScaleWidth( ssWidth * Math.min( scaleHorz, scaleVert ) );
            
            $( this.slider.$Elmt ).css( 'left', ( $( '.cnhk-overlay-content' ).width() - ( ssWidth * Math.min( scaleHorz, scaleVert ) ) ) / 2 );
            $( this.slider.$Elmt ).css( 'top', ( $( '.cnhk-overlay-content' ).height() - ( ssHeight * Math.min( scaleHorz, scaleVert ) ) ) / 2 );
        },
        
    };
    
    $(function(){
        cnhkTemplateHandler['classic'] = new templateHandlerCLASSIC();
    });
    
})( jQuery );
