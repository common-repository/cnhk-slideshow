/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    var spinner = $( '<span class="preloader" style="width:20px;height:20px;display:inline-block;margin-top:4px;"><img src="/wp-admin/images/spinner.gif"/></span>' );
    
    // update slide preview
    function updatePreview( id ) {
        
    }
    
    // show pastediv
    $( document ).on( 'click', '.youtube-from-url', function ( ev ){
        ev.preventDefault();
        $( this ).siblings( '.youtube-url-pastediv' ).find( 'textarea' ).val( '' );
        $( this ).siblings( '.youtube-url-pastediv' ).show( 500 );
        $( this ).hide();
    } );
    
    // hide pastediv
    $( document ).on( 'click', '.close-youtube-pastediv', function(){
        var pastediv = $( this ).parent();
        $( this ).siblings( 'textarea' ).val( '' );
        $( this ).siblings( '.pastediv-error' ).empty();
        pastediv.siblings( '.youtube-from-url' ).show();
        pastediv.hide( 500 );
    } );
    
    // parse youtube url
    $( document ).on( 'click', '.parse-youtube-url', function( ev ){
        ev.preventDefault();
        var input = $( this ).siblings( 'textarea' );
        var ytReg = /(?:youtube.com\/(?:embed\/|watch\?v=)|youtu.be\/)([^&#?]+)/;
        var parsed = ytReg.exec( input.val() );
        if ( null === parsed || undefined === parsed[1] ) {
            $( this ).siblings( '.pastediv-error' ).text( cnhkYTLocale.vidNotFound );
        } else {
            $( this ).siblings( '.pastediv-error' ).empty();
            input.val( '' );
            $( this ).parents( '.param-inside' ).find( '.youtube-from-url' ).show();
            $( this ).parents( '.param-inside' ).find( '.youtube-vid' ).val( parsed[1] );
            $( this ).parents( '.youtube-url-pastediv' ).hide( 500 );
        }
    } );
    
})( jQuery );
