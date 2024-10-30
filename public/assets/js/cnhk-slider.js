/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var cnhkSliderControl = function() {
        this.evt();
    };
    
    cnhkSliderControl.prototype = {
        
        constructor: cnhkSliderControl,
        
        evt: function() {
            var that = this;
            
            $( document ).on( 'cnhkSliderStarted', function( ev, id ) {
                
                $( '#' + id ).find( '.fa' ).each( function(){
                    if ( ! $( this ).parent().hasClass( 'size' ) ) return;
                    var size = parseFloat( $( this ).parent().css( 'font-size' ).replace( 'px', '' ) );
                    $( this ).css( 'font-size', size );
                });
                
                if ( $( '#' + id ).find( '.navarrow' ).length ) {
                    var hbgColor = $( '#' + id ).find( '.navarrow' ).attr( 'data-hbg' );
                    $( '#' + id ).on( 'mouseenter', function() {
                        $( this ).find( '.navarrow' ).css({
                            backgroundColor: hbgColor,
                        });
                    } ).on( 'mouseleave', function() {
                        $( this ).find( '.navarrow' ).css({
                            backgroundColor: 'transparent',
                        });
                    } );
                }
                that.scaleSlider( id );
            } );
            
            $( window ).on( 'load', function(){
                for ( var id in $.cnhkSlider ) {
                    that.scaleSlider( id );
                }
            } );
            
            $( window ).resize(function() {
                for ( var id in $.cnhkSlider ) {
                    that.scaleSlider( id );
                }
            });
            
        },
        
        scaleSlider: function( id ) {
            var slider = $.cnhkSlider[ id ]['slider'];
            var $el = $( slider.$Elmt );
            var wrap = $el.parent();
            var aw = wrap.width();
            slider.$ScaleWidth( aw );
            wrap.height( $el.height() * aw / $el.width() );
        },
        
    };
    
    $.cnhkSliderControl = cnhkSliderControl;
    
    $(function(){
        new cnhkSliderControl();
    });
    
})( jQuery );
