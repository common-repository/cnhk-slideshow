/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ) {
    "use strict";
    
    var cnhkNavArrows = function() {};
    
    cnhkNavArrows.prototype = {
        
        constructor: cnhkNavArrows,
        
        isUsed: function() {
            return ( $( '#use-nav-arrows' ).prop( 'checked' ) );
        },
        
        // get arrows navigators markup for slider preview
        getMarkup: function( offset ) {
            if ( undefined === offset ) {
                offset = {top: 0, left: 0};
            }
            
            var DP = parseFloat( $( '#options-_DisplayPieces' ).val() );
            var PO = parseFloat( $( '#options-_PlayOrientation' ).val() );
            
            var DPFactor = DP;
            if ( DP <= 1 ) {
                DP = 1;
                DPFactor = 1;
            } else if ( 2 <= DP ) {
                DP = Math.floor( DP );
                DPFactor = DP;
            } else {
                DP = 2;
            }
            
            var SP = 0;
            var hSP = 0;
            var vSP = 0;
            
            if ( 2 <= DP ) {
                SP = 5; // 5 pixel space between slides
                if ( 0 == ( PO % 2 ) ) {
                    // vertical spacing
                    vSP = DP * SP;
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
            
            var sw = parseFloat( $( '#options-w' ).val() );
            var sh = parseFloat( $( '#options-h' ).val() );
            
            sw = ( sw * ( 1 + ( ( PO % 2 ) * ( DPFactor - 1 ) ) ) ) + vSP;
            sh = ( sh * ( 1 + ( Math.pow( 0, PO % 2 ) ) * ( DPFactor - 1 ) ) ) + hSP;
            
            
            var pos = $( '#navs-arrows-position' ).val().split( '-' );
            var orientation = $( '#navs-arrows-orientation' ).val();
            var spacing = $( '#navs-arrows-spacing' ).val();
            var as = parseFloat( $( '#navs-arrows-size' ).val() );
            as = as * DP;
            
            var i = parseInt( pos[0] );
            var j = Math.floor( ( i - 0.1 ) / 3 );
            var m = 0.05;
            var l = ( 1 + ( 2 * m ) ) * as;
            
            // prev icon
            var pIcon = $( '<div />' ).attr({
                'data-u': 'arrowleft',
                'class': 'navarrow',
            }).append( $( '<span />' ).addClass( 'fa fa-' + $( '#navs-arrows-picon' ).val() ).css({
                    width: as,
                    height: as,
                    position: 'absolute',
                    fontSize: as,
                    left: m * as,
                    top: m * as,
                })
            );
            
            // next icon
            var nIcon = $( '<div />' ).attr({
                'data-u': 'arrowright',
                'class': 'navarrow',
            }).append( $( '<span />' ).addClass( 'fa fa-' + $( '#navs-arrows-nicon' ).val() ).css({
                    position: 'absolute',
                    width: as,
                    height: as,
                    fontSize: as,
                    left: m * as,
                    top: m * as,
                }) 
            );
            
            // rounded background
            var br = ( $( '#navs-arrows-round' ).prop( 'checked' ) )? ( 0.5 + m ) * as : 0;
            pIcon.add( nIcon ).css({
                width: l,
                height: l,
                color: $( '#navs-arrows-color' ).val(),
                borderRadius: br,
            });
            
            var bx = l + ( ( ( sw / 2 ) - l ) * ( ( i + 2 ) % 3 ) );
            var by = l + ( ( ( sh / 2 ) - l ) * j );
            var wrap = $( '<div />' );
            
            if ( 'spaced' == spacing ) {
                // spaced icons
                if ( 'horizontal' == orientation ) {
                    pIcon.css({
                        left: ( l / 4 ) + offset.left,
                        top: by - ( l / 2 ) + offset.top,
                    });
                    
                    nIcon.css({
                        left: sw - ( l * 1.25 ) + offset.left,
                        top: by - ( l / 2 ) + offset.top,
                    });
                } else {
                    pIcon.css({
                        left: bx - ( l / 2 ) + offset.left,
                        top: ( l / 4 ) + offset.top,
                    });
                    
                    nIcon.css({
                        left: bx - ( l / 2 ) + offset.left,
                        top: sh - ( l * 1.25 ) + offset.top,
                    });
                }
            } else {
                // grouped icons
                pIcon.css({
                    left: bx - l + offset.left,
                    top: by - l / 2 + offset.top,
                });
                
                nIcon.css({
                    left: bx + offset.left,
                    top: by - l / 2 + offset.top,
                });                
            }
            wrap.append( pIcon ).append( nIcon );
            return wrap.html();
        },
        
    };
    
    $(function(){
        cnhkNavHandler['arrows'] = new cnhkNavArrows();
    });
    
})( jQuery );
