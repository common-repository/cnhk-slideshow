/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var slideHandlerYOUTUBE = function() {
        
        this.getSlideContent = function( id ) {
            var slide = $( '.slide-id[value="' + id + '"]' ).parents( '.slide' );
            if ( ! slide.find( '.youtube-vid' ).val() ) return;
            var vid = slide.find( '.youtube-vid' ).val();
            var rel = $( 'input[name="slides[' + id + '][params][rel]"]:checked' ).val();
            var fs = $( 'input[name="slides[' + id + '][params][fs]"]:checked' ).val();
            var info = $( 'input[name="slides[' + id + '][params][info]"]:checked' ).val();
            var logo = $( 'input[name="slides[' + id + '][params][logo]"]:checked' ).val();
            var w = $( '#options-w' ).val();
            var h = $( '#options-h' ).val();
            var url = window.location.href.split( '/' );
            var origin = url[0] + '//' + url[2];
            return  '<iframe id="ytSlide-' + id + '" class="cnhk-yt-player" frameborder="0" width="' + w + '" height="' + h + '"' + 
                    ' src="http://www.youtube.com/embed/' + vid +
                    '?autoplay=0&rel=' + rel + '&fs=' + fs + '&modestbranding=' + logo + '&showinfo=' + info +
                    '&enablejsapi=1&origin=' + origin + '" ' + ( ( '1' == fs )? 'allowfullscreen' : '' ) + '></iframe>';
        };
        
    }
    
    $(function(){
        cnhkSlideHandler['youtube'] = new slideHandlerYOUTUBE();
    });
    
})( jQuery );
