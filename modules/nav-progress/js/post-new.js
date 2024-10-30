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
        var ckb = $( '#use-nav-progress' );
        if ( ckb.prop( 'checked' ) ) {
            $( '#nav-progress-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', false );
            $( '#nav-progress-params' ).find( '.wp-picker-container' ).show();
            $( '#nav-progress-params' ).find( '#select-progress-color' ).hide();
            $( '#navs-progress-opacity' ).slider( 'enable' );
            return true;
        } else {
            $( '#nav-progress-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', true );
            $( '#nav-progress-params' ).find( '.wp-picker-container' ).hide();
            $( '#nav-progress-params' ).find( '#select-progress-color' ).show();
            $( '#navs-progress-opacity' ).slider( 'disable' );
            return false;
        }
    }
    
    $( document ).on( 'click', '#use-nav-progress', function( ev ) {
        checkMainState();
    } );
    
    $(function(){
        
        $( '#navs-progress-color' ).wpColorPicker({
            defaultColor: '#ffffff',
            color: $( '#navs-progress-color' ).val(),
        });
        
        $( '#navs-progress-opacity' ).slider({
            min: 0.025,
            max: 1,
            step: 0.025,
            value: parseFloat( $( 'input[name="navs[progress][opacity]"]' ).val() ),
            change: function( ev, ui ) {
                $( 'input[name="navs[progress][opacity]"]' ).val( ui.value );
            },
        });
        
        checkMainState();
        
    });
    
})( jQuery );
