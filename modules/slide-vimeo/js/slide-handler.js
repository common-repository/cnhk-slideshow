/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var slideHandlerVIMEO = function() {
        
        this.getSlideContent = function( id ) {
            var slide = $( '.slide-id[value="' + id + '"]' ).parents( '.slide' );
            if ( ! slide.find( '.vimeo-vid' ).val() ) return;
            var vid = slide.find( '.vimeo-vid' ).val();
            var byline = $( 'input[name="slides[' + id + '][params][byline]"]:checked' ).val();
            var portrait = $( 'input[name="slides[' + id + '][params][portrait]"]:checked' ).val();
            var title = $( 'input[name="slides[' + id + '][params][title]"]:checked' ).val();
            var color = $( 'input[name="slides[' + id + '][params][color]"]' ).val();
            if ( color ) {
                color = '&color=' + color.substring( 1 );
            }
            var w = $( '#options-w' ).val();
            var h = $( '#options-h' ).val();
            var url = window.location.href.split( '/' );
            return  '<iframe id="viSlide-' + id + '" class="cnhk-vi-player" frameborder="0" width="' + w + '" height="' + h + '"' + 
                    ' src="//player.vimeo.com/video/' + vid +
                    '?autoplay=0&byline=' + byline + '&portrait=' + portrait + '&title=' + title +
                    '&api=1&player_id=viSlide-' + id + color + '" webkitallowfullscreen mozallowfullscreen allowfullscreen >' +
                    '</iframe>';
        };
        
    }
    
    $(function(){
        cnhkSlideHandler['vimeo'] = new slideHandlerVIMEO();
    });
    
})( jQuery );
