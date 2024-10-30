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
        var ckb = $( '#use-nav-bullet' );
        if ( ckb.prop( 'checked' ) ) {
            $( '#nav-bullet-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', false );
            $( '#nav-bullet-params' ).find( '.wp-picker-container' ).show();
            $( '#nav-bullet-params' ).find( '#select-bullet-color' ).hide();
            return true;
        } else {
            $( '#nav-bullet-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', true );
            $( '#nav-bullet-params' ).find( '.wp-picker-container' ).hide();
            $( '#nav-bullet-params' ).find( '#select-bullet-color' ).show();
            return false;
        }
    }
    
    $( document ).on( 'click', '#use-nav-bullet', function( ev ) {
        checkMainState();
    } );
    
    $(function(){
        
        $( '#navs-bullet-color' ).wpColorPicker({
            defaultColor: '',
            color: $( '#navs-bullet-color' ).val(),
        });
        
        checkMainState();
        
    });
    
})( jQuery );
