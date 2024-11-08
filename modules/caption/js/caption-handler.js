/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var captionHandlerSTD = function(){
        
        /**
         *  get captions styling data object within one slide in the format it is used in admin preview, timing etc
         *  
         *  @param [int] id, the slide ID
         */
        this.getCaObject = function ( id ) {
            var captionsList = $( '#cnhkss-slides-param .slide'  ).has( '.slide-id[value="' + id + '"]' ).find( '.captions-list' );
            if ( ! captionsList.length ) return false;            
            var captions = {};
            captionsList.find( '.caption' ).each(function(){
                var ca = {};
                var $this = $( this );
                var stylingObj = JSON.parse( $this.find( '.ca-styling' ).val() );
                
                ca['left'] = stylingObj.left;
                ca['top'] = stylingObj.top;
                ca['width'] = stylingObj.w;
                ca['height'] = stylingObj.h;
                ca['le'] = stylingObj.le;
                ca['padHorz'] = parseInt( stylingObj.pad.split( '_' )[0] );
                ca['padVert'] = parseInt( stylingObj.pad.split( '_' )[1] );
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
                
                ca['html'] = $this.find( '.caption-html' ).val();
                ca['ID'] = $this.find( '.caption-id' ).val();

                captions[ ca.ID ] = ca;
                
            });
            
            return captions;
        };
        
        /**
         *  get captions effects object for one slide in the format used by timing functions and different admin previews
         *  
         *  @param [int] id, the slide ID
         */
        this.getFxCodes = function( id ) {
            var captionsList = $( '#cnhkss-slides-param .slide'  ).has( '.slide-id[value="' + id + '"]' ).find( '.captions-list' );
            if ( ! captionsList.length ) return false;
            
            var fx = {};
            captionsList.find( '.caption' ).each(function(){
                var $this = $( this );
                var tO = JSON.parse( $this.find( '.ca-timing' ).val() );
                
                var ID = $this.find( '.caption-id' ).val();
                fx[ id + '|' + ID + '|code' ] = tO.cafx;
                fx[ id + '|' + ID + '|cadu' ] = tO.cadu;
                fx[ id + '|' + ID + '|cas' ] = tO.cas;
                if ( fx[ id + '|' + ID + '|code' ] ) {
                    fx[ id + '|' + ID + '|1' ] = jssorFunc.convert( fx[ id + '|' + ID + '|code' ], 'fx' );
                }
                
                fx[ id + '|' + ID + '|code2' ] = tO.cafx2;
                fx[ id + '|' + ID + '|cadu2' ] = tO.cadu2;
                fx[ id + '|' + ID + '|cas2' ] = tO.cas2;
                if ( fx[ id + '|' + ID + '|code2' ] ) {
                    fx[ id + '|' + ID + '|2' ] = jssorFunc.convert( fx[ id + '|' + ID + '|code2' ], 'fx' );
                }
                
                fx[ id + '|' + ID + '|code3' ] = tO.cafx3;
                fx[ id + '|' + ID + '|cadu3' ] = tO.cadu3;
                fx[ id + '|' + ID + '|cas3' ] = tO.cas3;
                if ( fx[ id + '|' + ID + '|code3' ] ) {
                    fx[ id + '|' + ID + '|3' ] = jssorFunc.convert( fx[ id + '|' + ID + '|code3' ], 'fx' );
                }
                fx[ id + '|' + ID + '|html' ] = $this.find( '.caption-html' ).val();
            });
            
            return fx;
        };
        
        /**
         *  get effect object for one slide in the format use by a jssor slider
         *  
         *  @param [int] id, the slide ID
         */
        this.getFxArray = function( id ) {
            var captionsList = $( '#cnhkss-slides-param .slide'  ).has( '.slide-id[value="' + id + '"]' ).find( '.captions-list' );
            if ( ! captionsList.length ) return false;            
            var fxs = {};
            
            captionsList.find( '.caption' ).each(function(){
                var $this = $( this );
                var tO = JSON.parse( $this.find( '.ca-timing' ).val() );
                var ID = $this.find( '.caption-id' ).val();
                if ( tO.cafx ) {
                    fxs[ id + '|' + ID + '|1' ] = jssorFunc.convert( tO.cafx , 'fx' );
                }
                
                if ( tO.cafx2 ) {
                    fxs[ id + '|' + ID + '|2' ] = jssorFunc.convert( tO.cafx2, 'fx' );
                }
                
                if ( tO.cafx3 ) {
                    fxs[ id + '|' + ID + '|3' ] = jssorFunc.convert( tO.cafx3, 'fx' );
                }
            });
            
            return fxs;
        };
        
        /**
         *  get the markup (HTML) for captions in one given slide
         *  
         *  @param [string] slideId, the slide ID
         *  @param [object] ca, the captions styling object for the slide obtained from the getCaObject(id) function above
         *  @param [object] fx, the effect object for the slide obtained by the getFxArray(id) function above
         *  @param [int] du, caption play in duration for this slide (in ms)
         *  @param [int] du2, caption play out duration for this slide (in ms)
         *  @param [int] du3, caption immediate play out duration for this slide (in ms)
         */
        this.getMarkup = function ( slideId, ca, fx, du, du2, du3 ) {
            var wrap = $( '<div />' );
            for ( var id in ca ) {
                var captionDiv = $( '<div />' ).attr( 'data-u', 'caption' ).css({
                    position: 'absolute',
                    whiteSpace: 'no-wrap',
                });
                
                // in/out/out3 effects
                if ( undefined !== fx ) {
                    if ( fx[ slideId + '|' + id + '|1' ] ) {
                        captionDiv.attr( 'data-t', slideId + '|' + id + '|1' );
                        captionDiv.attr( 'data-b', du * fx[slideId + '|' + id + '|cas'] );
                        captionDiv.attr( 'data-du', du * fx[slideId + '|' + id + '|cadu'] );
                    } else {
                        captionDiv.attr( 'data-t', 'NO' );
                    }
                    if ( fx[ slideId + '|' + id + '|2' ] ) {
                        captionDiv.attr( 'data-t2', slideId + '|' + id + '|2' );
                        captionDiv.attr( 'data-b2', du2 * fx[slideId + '|' + id + '|cas2'] );
                        captionDiv.attr( 'data-du2', du2 * fx[slideId + '|' + id + '|cadu2'] );
                    } else {
                        captionDiv.attr( 'data-t2', 'NO' );
                    }
                    if ( fx[ slideId + '|' + id + '|3' ] ) {
                        captionDiv.attr( 'data-t3', slideId + '|' + id + '|3' );
                        captionDiv.removeAttr( 'data-t2' );
                        captionDiv.attr( 'data-d3', du3 * fx[slideId + '|' + id + '|cas3'] );
                        captionDiv.attr( 'data-du3', du3 * fx[slideId + '|' + id + '|cadu3'] );
                    }
                }
                
                // CSS
                if ( '' != ca[id]['left'] ) {
                    captionDiv.css( 'left', ca[id]['left'] + 'px' );
                }
                if ( '' != ca[id]['top'] ) {
                    captionDiv.css( 'top', ca[id]['top'] + 'px' );
                }
                if ( ca[id]['width'] ) {
                    if ( 'none' != ca[id]['borderStyle'] ) {
                        captionDiv.width( ca[id]['width'] + ( 2 * ca[id]['borderWidth'] ) );
                    } else {
                        captionDiv.width( ca[id]['width'] );
                    }
                }
                if ( ca[id]['height'] ) {
                    if ( 'none' != ca[id]['borderStyle'] ) {
                        captionDiv.height( ca[id]['height'] + ( 2 * ca[id]['borderWidth'] ) );
                    } else {
                        captionDiv.height( ca[id]['height'] );
                    }
                }
                if ( ca[id]['fgColor'] ) {
                    captionDiv.css( 'color', ca[id]['fgColor'] );
                }
                if ( ca[id]['font'] ) {
                    captionDiv.css( 'font-family', cnhkFonts[ca[id]['font']] );
                }
                var le = ( ca[id]['le'] )? parseFloat( ca[id]['le'] ) : 32;
                captionDiv.css( 'line-height', le + 'px' );
                
                var paddingDiv = $( '<div />' );
                
                if ( ca[id]['padHorz'] ) {
                    paddingDiv.css({
                        'padding-left': ca[id]['padHorz'] + '%',
                        'padding-right': ca[id]['padHorz'] + '%',
                    });
                }
                if ( ca[id]['padVert'] ) {
                    paddingDiv.css({
                        'padding-top': ca[id]['padVert'] + '%',
                        'padding-bottom': ca[id]['padVert'] + '%',
                    });
                }
                
                var borderDiv = $( '<div />' ).css({
                    width: ca[id]['width'],
                    height: ca[id]['height'],
                });
                
                if ( 'none' != ca[id]['borderStyle'] && ca[id]['borderWidth'] ) {
                    borderDiv.css( 'border', ca[id]['borderWidth'] + 'px ' + ca[id]['borderStyle'] + ' ' + ca[id]['borderColor'] );
                }
                
                borderDiv.css( 'border-top-left-radius', ca[id]['bdrTL'] + 'px' );
                borderDiv.css( 'border-top-right-radius', ca[id]['bdrTR'] + 'px' );
                borderDiv.css( 'border-bottom-left-radius', ca[id]['bdrBL'] + 'px' );
                borderDiv.css( 'border-bottom-right-radius', ca[id]['bdrBR'] + 'px' );
                
                if ( ca[id]['bgColor'] && ca[id]['bgOpacity'] ) {
                    var rgb = jssorFunc.hexToRgb( ca[id]['bgColor'] );
                    if ( rgb ) {
                        borderDiv.css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g +',' + rgb.b + ',' + ca[id]['bgOpacity'] + ')' );
                    }
                }
                captionDiv.append( borderDiv );
                if ( ca[id]['padHorz'] || ca[id]['padVert'] ) {
                    borderDiv.append( paddingDiv.html( ca[id]['html'] ) );
                } else {
                    borderDiv.html( ca[id]['html'] );
                }
                if ( 'none' != ca[id]['bdStyle'] ) {
                    captionDiv.css({
                        width: ca[id]['width'] + ( 2 * ca[id]['borderWidth'] ),
                        height: ca[id]['height'] + ( 2 * ca[id]['borderWidth'] ),
                    });
                }
                wrap.append( captionDiv );
                
            }
            return wrap.html();
        };
        
        /**
         *  get the style attribute of the most outer DIV for one caption (contains position, size, font family and foreground color)
         *  
         *  @param [object] ca, one item of the caption styling object obtained with getCaObject(id)
         */
        this.boxToString = function( ca ) {
            var str =  'left:' + ca.left + 'px;top:' + ca.top + 'px;';
            if ( 'auto' == ca.width || '' == ca.width ) {
                str += 'width:auto;';
            } else {
                str += 'width:' + ca.width + 'px;';
            }
            if ( 'auto' == ca.height || '' == ca.height ) {
                str += 'height:auto;';
            } else {
                str += 'height:' + ca.height + 'px;';
            }
            if ( ca.fgColor ) {
                str += 'color:' + ca.fgColor + ';';
            }
            if ( ca.font ) {
                str += 'font-family:' + cnhkFonts[ca.font] + ';';
            }
            var le = ( parseFloat( ca.le ) )?  parseFloat( ca.le ) : 32;
            str += 'line-height:' + le + 'px;';
            return str;
        };
        
        /**
         *  get the style attribute second DIV from outside for one caption (dedicated to padding)
         *  
         *  @param [object] ca, one item of the caption styling object obtained with getCaObject(id)
         */
        this.paddingToString = function( ca ) {
            var str = '';
            if ( ca.padHorz ) {
                str += 'padding-left:' + ca.padHorz + '%;padding-right:' + ca.padHorz + '%;';
            }
            if ( ca.padVert ) {
                str += 'padding-top:' + ca.padVert + '%;padding-bottom:' + ca.padVert + '%;';
            }
            return str;
        };
        
        /**
         *  get the style attribute of the most inner DIV for one caption (contains background color and border)
         *  
         *  @param [object] ca, one item of the caption styling object obtained with getCaObject(id)
         */
        this.styleToString = function( ca ) {
            var str = 'width:100%;height:100%;';
            if ( 0 != parseFloat( ca.bgOpacity ) ) {
                var rgb = jssorFunc.hexToRgb( ca.bgColor );
                if ( rgb ) {
                    str += 'background-color:rgba(' + rgb.r +',' + rgb.g + ',' + rgb.b + ',' + ca.bgOpacity + ');';
                }
            }
            if ( 'none' != ca.borderStyle ) {
                str += 'border:' + ca.borderWidth + 'px ' + ca.borderStyle + ' ' + ca.borderColor + ';';
            }
            str += 'border-top-left-radius:' + ca.bdrTL + 'px;';
            str += 'border-top-right-radius:' + ca.bdrTR + 'px;';
            str += 'border-bottom-left-radius:' + ca.bdrBL + 'px;';
            str += 'border-bottom-right-radius:' + ca.bdrBR + 'px;';
            return str;
        };
        
    };
    
    $(function(){
        // on DOM ready, build the handler
        cnhkCaptionHandler['std'] = new captionHandlerSTD();
    });
    
})( jQuery );
