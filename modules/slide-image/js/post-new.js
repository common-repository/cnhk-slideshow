/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    
    var preloader = $( '<p class="preloader" style="text-align:center;"><img src="/wp-admin/images/loading.gif"/></p>' );
    
    function updatePreview( id ) {
        var preview = $( '.slide-id[value="' + id + '"]' ).parents( '.slide' ).find( '.slide-main-content' );
        preview.html( cnhkSlideHandler['image'].getSlideContent( id ) );
        
        preview.cnhkSlideWrap({
            fillMode: $( '#options-_FillMode' ).val(),
            boxWidth: $( '#options-w' ).val(),
            boxHeight: $( '#options-h' ).val(),
        });
        preview.cnhkSlideWrap( 'init' );
        
    }
    
    // image selection from library
    $( document ).on( 'click', '.slide-params .slide-image-btn', function( ev ) {
        ev.preventDefault();
        var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        $.cnhkImageFrame({
            url: $( 'input[name="slides[' + id + '][src]"]' ),
            alt: $( 'input[name="slides[' + id + '][alt]"]' ),
            mime: ['image/jpeg', 'image/png'],
            notice: $( this ).siblings( '.slide-image-notice' ),
        });
    } );
    
    // update preview on slide param accordion closed
    $( document ).on( 'paramDeactivate', '.slide', function ( ev, ui ) {
        if ( ui.oldPanel.length && ui.oldPanel.parents( '.slide' ).find( '.slide-type[value="image"]' ).length ) {
            var id = ui.oldPanel.parents( '.slide' ).find( '.slide-id' ).val();
            updatePreview( id );
        }
    } );
    
    // update preview on slide accordion activation
    $( document ).on( 'activate', '#slides-list', function( ev, ui ) {
        if ( ui.newPanel.length && ui.newPanel.parents( '.slide' ).find( '.slide-type[value="image"]' ).length ) {
            var id = ui.newPanel.parents( '.slide' ).find( '.slide-id' ).val();
            updatePreview( id );
        }
    } );
    
    // update preview before slide accordion activated
    $( document ).on( 'beforeActivate', '#slides-list', function( ev, ui ) {
        if ( ui.oldPanel.length && ui.oldPanel.parents( '.slide' ).find( '.slide-type[value="image"]' ).length ) {
            var preview = ui.oldPanel.find( '.slide-main-content' );
            preview.empty().data( 'cnhkSlideWrap', undefined );
        }
    } );
    
    // update preview on image change
    $( document ).on( 'change', '.slide-image-src', function ( ev ) {
        if ( $( this ).val() ) {
            var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
            updatePreview( id );
        } else {
            $( this ).parents( '.slide-inside' ).find( '.slide-main-content' ).empty().data( 'cnhkSlideWrap', null );
        }
    } );
    
})( jQuery );
