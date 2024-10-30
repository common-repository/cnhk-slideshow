/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    function checkMainState() {
        var ckb = $( '#use-nav-thumb' );
        if ( ckb.prop( 'checked' ) ) {
            $( '#nav-thumb-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', false );
            return true;
        } else {
            $( '#nav-thumb-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', true );
            return false;
        }
    }
    
    $( document ).on( 'click', '#use-nav-thumb', function( ev ) {
        checkMainState();
    } );
    
    $(function(){
        checkMainState();
    });
    
})( jQuery );
