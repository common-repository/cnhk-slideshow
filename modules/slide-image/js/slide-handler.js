/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var slideHandlerIMAGE = function() {
        
        this.getSlideContent = function( id ) {
            if ( ! $( 'input[name="slides[' + id + '][src]"]' ).length ) return false;
            return '<img src="' + $( 'input[name="slides[' + id + '][src]"]' ).val() + '" alt="' + $( 'input[name="slides[' + id + '][alt]"]' ).val() + '" />';
            
        };
        
    }
    
    $(function(){
        cnhkSlideHandler['image'] = new slideHandlerIMAGE();
    });
    
})( jQuery );
