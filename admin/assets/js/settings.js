/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    
    $( document ).on( 'click', '.plugged-module', function ( ev ) {
        if ( $( this ).prop( 'checked' ) ) {
            $( this ).after( $( '<input type="hidden" name="modules[]" value="' + $( this ).val() + '" />' ) );
        } else {
            $( this ).next( 'input[type="hidden"]' ).remove();
        }
    } );
    
})( jQuery );
