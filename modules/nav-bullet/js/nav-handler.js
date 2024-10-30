/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var cnhkNavBullet = function() {};
    
    cnhkNavBullet.prototype = {
        
        constructor: cnhkNavBullet,
        
        isUsed: function() {
            return ( $( '#use-nav-bullet' ).prop( 'checked' ) );
        },
        
        getMarkup: function() {
            var bs = parseFloat( $( '#navs-bullet-size' ).val() );
            
            var ssw = parseFloat( $( '#options-w' ).val() );
            var ssh = parseFloat( $( '#options-h' ).val() );
            
            var DP = parseFloat( $( '#options-_DisplayPieces' ).val() );
            
            if ( DP <= 1 ) {
                DP = 1;
            } else if ( 2 <= DP ) {
                DP = Math.floor( DP );
            } else {
                DP = 2;
            }
            
            var scale = DP;
            
            if ( ! bs ) bs = 16;
            bs = bs * scale;
            var bc = $( '#navs-bullet-color' ).val();
            var m = 0.25;
            var proto = $( '<div class="jssor-bullet-nav" data-u="prototype"></div>' ).css({
                fontSize: bs,
                padding: m * bs,
            });
            if ( bc ) {
                proto.css( 'color', bc );
            }
            var markup = $( '<div data-u="navigator" class="jssor-bullet-nav-wrap"></div>' ).append( proto ).css({
                position: 'absolute',
                bottom: 0.75 * bs,
            });
            return markup[0].outerHTML;
        },
        
        getSize: function() {
            if ( ! this.isUsed() ) return 0;
            if ( 'inside' == $( '#navs-bullet-position' ).val() ) return 0;
            var bs = parseFloat( $( '#navs-bullet-size' ).val() );
            return 3 * bs;
        },
        
        getSpacing: function() {
            if ( ! this.isUsed() ) return 0;
            var bs = parseFloat( $( '#navs-bullet-size' ).val() );
            return 0.5 * bs;
        },
    };
    
    $(function(){
        cnhkNavHandler['bullet'] = new cnhkNavBullet();
    });
    
})( jQuery );
