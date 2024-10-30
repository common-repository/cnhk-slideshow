/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    
    window.jssorFunc = {
        /**
         *  reverse HEX color
         *  
         *  @param [string] color, original HEX color
         *  
         *  @return [string], the reversed HEX color
         */
        reverseHexColor: function ( color ) {
            color = window.jssorFunc.hexToRgb( color ); 
            var rev = {
                r: 255 - color.r,
                g: 255 - color.g,
                b: 255 - color.b,
                a: 0.5,
            };
            var hexRev = window.jssorFunc.rgbaToHexAlpha( rev );
            return hexRev.hex;
        },
        
        /**
         *  parse rgba color string
         *  
         *  @param [string] rgba, the rgba color - rgba(r,g,b,a)
         *  
         *  @return [object] result, object with r, g, b and alpha component of the input color
         */
        parseRgba: function ( rgba ) {
            var result = /^rgba\(([^,]+),([^,]+),([^,]+),([01]?\.\d*)\)$/i.exec( rgba.replace( / /g, '' ) );
            if ( result ) {
                result = {
                    r: parseInt( result[1] ),
                    g: parseInt( result[2] ),
                    b: parseInt( result[3] ),
                    a: parseFloat( result[4] ),
                };
            }
            return result;
        },
        
        /**
         *  parse rgba color string then find the HEX color and alpha channel
         *  
         *  @param [string] rgba, the rgba color
         *  
         *  @return [object], with HEX color string in the first field, and alpha (opacity) in the second
         */
        rgbaToHexAlpha: function ( rgba ) {
            var result = rgba;
            if ( result ) {
                var hexR = parseInt( result.r ).toString( 16 );
                var hexG = parseInt( result.g ).toString( 16 );
                var hexB = parseInt( result.b ).toString( 16 );
                
                if ( undefined === hexR[1] ) hexR = '0' + hexR;
                if ( undefined === hexG[1] ) hexG = '0' + hexG;
                if ( undefined === hexB[1] ) hexB = '0' + hexB;
                
                result = {
                    hex: '#' + hexR + hexG + hexB,
                    a: parseFloat( result.a ),
                };
            }
            return result;
        },
        
        /**
         *  convert hex color to rgb
         *  
         *  @param [string] hex, HEX color
         *  @retunr [object], with r, g, and b component of the input color
         */
        hexToRgb : function ( hex ) {
            var shortHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace( shortHex, function( m, r, g, b ) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
            
            if ( result ) {
                result = {
                    r: parseInt( result[1], 16 ),
                    g: parseInt( result[2], 16 ),
                    b: parseInt( result[3], 16 )
                };
            }
            return result;
        },
        
        /**
         *  create random id
         *  
         *  @param [int] len, the lenght of the ranom ID
         */
        makeId: function( len ) {
            var id = '';
            var pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for( var i = 0; i < len; i++ ) {
                id += pool.charAt( Math.floor( Math.random() * pool.length ) );
            }
            return id;
        },
        
        /**
         *  convert effect code
         *  
         *  @param [string] str, the code to convert
         *  @param [string] to, the targeted format. 'json', 'jssor' or 'fx' (working effect object) 
         */
        convert : function ( str, to ) {
            if ( 'undefined' == typeof( to ) ) {
                to = 'json';
            }
            switch ( to ) {
                case 'jssor' :
                    // json to jssor
                    if ( 'object' != typeof( str ) ) {
                        return false;
                    }
                    return JSON.stringify( str ).replace( /"/g, '' );
                    
                    break;
                case 'json' :
                    // jssor to json
                    try {
                        var validStr = str.replace( / /g, '' ).replace( /:(\$[^,}]+)/g, ':"$1"' ).replace( /([^{:,]+):/ig, '"$1":' );
                        var result = JSON.parse( validStr );
                        return result;
                    } catch( e ) {
                        return false;
                    }
                    
                    break;
                case 'fx' :
                    /**
                     * Convert jssor code into working effect object
                     */                    
                    // Strip blank spaces
                    str = str.replace( / /g, '' );
                    
                    var fx;
                    try {
                        fx = eval( '(' + str + ')' );
                    } catch ( e ) {
                        return false;
                    }
                    if ( 'object' == typeof( fx ) || 'undefined' != typeof( fx.$Duration ) ) {
                        // a "normal" jssor effect object should always have a "$Duration" property
                        return fx;
                    }
                    
                    // return false if not an object (or doesn't have a $Duration property)
                    return false;
                    
                    break;
            }
        },
        
        /**
         * check if an effect code string is correctly formatted in order to be converted into a JSON object
         *
         * @param [string] str, the string that need to be checked
         * @return [bool] result, TRUE is the str is correctly formate. FALSE if not
         */
        isValidFx : function ( str ) {
            var testing = window.jssorFunc.convert( str );
            if ( false === testing ) {
                return false;
            } else {
                return true;
            }
        },
        
        /**
         *  display briefly an overlay on top of an element and then remove it quickly
         *  
         *  @param [string] selector, the targeted element
         *  @param [string] color, color of the overlay div
         */
        blink : function( selector, color ) {
            if ( 'undefined' == typeof( color ) ) {
                color = '#fff';
            }
            var overlay = $( '<div />' ).addClass( 'blink-overlay' ).css({
                position : 'absolute',
                width: $( selector ).outerWidth() + 'px',
                height: $( selector ).outerHeight() + 'px',
                zIndex: 10005,
                opacity: 1,
                backgroundColor: color,
            });
            $( selector ).prepend( overlay );
            overlay.animate(
                {
                    opacity: 0,
                },
                400,
                function(){
                    overlay.remove();
                }
            );
        },
        
    }// end window.jssorFunc {}
    
    // dismiss admin-notice
    $( document ).on( 'click', '.cnhk-notice-dismiss', function( ev ) {
        var notice = $( this ).parent( 'div' );
        notice.hide( 100, function(){
            notice.remove();
        } );
    } );
    
    // on DOM ready
    $(function(){
        
        // move notice printed on the fly (by modules or whatever) below <h1 />
        $( '.notice-on-the-fly' ).each(function(){
            if ( $( 'h1' ).lenght ) {
                $( 'h1' ).after( $( this ) );
            } else {
                $( '#post' ).before( $( this ) );
            }
        });
        
    });
    
})( jQuery );
