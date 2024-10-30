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
    
    // color picker
    $( document ).on( 'slideAdded', '#slides-list', function ( ev, slide, index ) {
        if ( slide.find( '.vimeo-control-color' ).length ) {
            slide.find( '.vimeo-control-color' ).wpColorPicker({
                default: '#00adef',
            });
        }
    } );
    // show pastediv
    $( document ).on( 'click', '.vimeo-from-url', function ( ev ){
        ev.preventDefault();
        $( this ).siblings( '.vimeo-url-pastediv' ).find( 'textarea' ).val( '' );
        $( this ).siblings( '.vimeo-url-pastediv' ).show( 500 );
        $( this ).hide();
    } );
    
    // hide pastediv
    $( document ).on( 'click', '.close-vimeo-pastediv', function(){
        var pastediv = $( this ).parent();
        $( this ).siblings( 'textarea' ).val( '' );
        $( this ).siblings( '.pastediv-error' ).empty();
        pastediv.siblings( '.vimeo-from-url' ).show();
        pastediv.hide( 500 );
    } );
    
    // parse vimeo url
    $( document ).on( 'click', '.parse-vimeo-url', function( ev ){
        ev.preventDefault();
        var input = $( this ).siblings( 'textarea' );
        var viReg = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
        
        var parsed = viReg.exec( input.val() );
        if ( null === parsed || undefined === parsed[3] ) {
            $( this ).siblings( '.pastediv-error' ).text( cnhkYTLocale.vidNotFound );
        } else {
            $( this ).siblings( '.pastediv-error' ).empty();
            input.val( '' );
            $( this ).parents( '.param-inside' ).find( '.vimeo-from-url' ).show();
            $( this ).parents( '.param-inside' ).find( '.vimeo-vid' ).val( parsed[3] );
            $( this ).parents( '.vimeo-url-pastediv' ).hide( 500 );
        }
    } );
    
    $(function(){
        $( '.vimeo-control-color' ).wpColorPicker({
            default: '#00adef',
        });
    });
    
})( jQuery );
