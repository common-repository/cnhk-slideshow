/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    function sanitizeNumbers( $el ) {
        if ( $el.prop( 'disabled' ) ) return;
        if ( $el.hasClass( 'cnhk-int' ) ) {
            var val = parseInt( $el.val() );
            if ( isNaN( val ) ) {
                $el.val( $el.attr( 'data-default' ) );
            } else {
                $el.val( Math.abs( val ) );
            }
        }  else if ( $el.hasClass( 'cnhk-float' ) ) {
            var val = parseFloat( $el.val() );
            if ( isNaN( val ) ) {
                $el.val( $el.attr( 'data-default' ) );
            } else {
                $el.val( Math.abs( val ) );
            }
        } else if ( $el.attr( 'data-pat' ) ) {
            var rg = new RegExp( $el.attr( 'data-pat' ) );
            if ( null === rg.exec( $el.val() ) ) {
                $el.val( $el.attr( 'data-default' ) );
            }
        }
    }
    
    $( document ).on( 'cnhkSavePost', 'form#post', function(){
        
        var serialized = $( this ).serialize();
        var count = serialized.match( /=/g ).length;
        if ( cnhkServerConfig.maxInputVars < count ) {
            $( this ).data( 'canSave', false );
            $( '.input-vars-overflow' ).remove();
            var notice = $( '<div />' ).addClass( 'error below-h2 input-vars-overflow'
                ).append( $( '<p />' ).html( '<p>' +cnhkInternalLocale.maxInputVarsExcess + '</p>' ) );
            notice.find( '.var-elements-count' ).text( count );
            $( 'h1,h2' ).first().after( notice );
        } else {
            $( this ).data( 'canSave', true );
            $( '.input-vars-overflow' ).remove();
            $( '#post input.cnhk-number' ).each(function(){
                sanitizeNumbers( $( this ) );
            });
        }
        
    } );
    
    $( document ).on( 'beforeSliderPreview', function() {
        $( '#post input.cnhk-number' ).each(function(){
            sanitizeNumbers( $( this ) );
        });
    } );
    
})( jQuery );
