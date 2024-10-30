/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var cnhkViPlayers = function(){
        this.players = {};
        var that = this;
        $( document ).on( 'cnhkSliderStarted', function( ev, id ){
            that.onSliderStarted( ev, id );
        } );
        
    }
    
    cnhkViPlayers.prototype = {
        
        constructor: cnhkViPlayers,
        
        onSliderStarted: function( ev, sliderId ){
            var that = this;
            $( $.cnhkSlider[sliderId]['slider'].$Elmt ).find( '.cnhk-vi-player' ).each(function(){
                var pid = $( this ).attr( 'id' );
                var sli = $( this ).attr( 'data-sli' );
                
                var player = $f( $( '#' + pid )[0] );
                player.addEvent( 'ready', function() {
                    
                    player.addEvent( 'play', function(){that.stopSlider( sliderId, sli )} );
                    
                    if ( $( '#' + sliderId ).find( '.jssor-bullet-nav,.navarrow' ).length ) {
                        $( '#' + sliderId ).find( '.jssor-bullet-nav,.navarrow' ).click( function(){
                            that.stopAll( sliderId );
                        } );
                    }
                    
                } );
                
                that.players[pid] = {
                    sliderId: sliderId,
                    player: player,
                }
            });
            
        },
        
        stopAll: function( sliderId ){
            for ( var pid in this.players ) {
                if ( sliderId == this.players[pid].sliderId ) {
                    this.players[pid].player.api( 'pause' );
                }
            }
        },
        
        stopSlider: function( sliderId, sli ) {
            $.cnhkSlider[sliderId]['slider'].$PlayTo( parseFloat( sli ) );
            $.cnhkSlider[sliderId]['slider'].$Pause();
        },
        
    }
    
    $.cnhkViPlayers = new cnhkViPlayers();
    
    
})( jQuery );
