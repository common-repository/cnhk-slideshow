/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var viPlayers = function(){
        this.players = {};
        this.slider;
        
        var that = this;
        $( document ).on( 'click', '.jssor-bullet-nav,.navarrow', function ( ev ) {
            if ( $( this ).hasClass( '.jssor-bullet-navav' ) ) return;
            that.stopAll();
        } );
        
    }
    
    viPlayers.prototype = {
        
        constructor: viPlayers,
        
        addPlayer: function( pid ){
            var that = this;
            var player = $f( $( '#' + pid )[0] );
            player.addEvent( 'ready', function() {
                player.addEvent( 'play', function(){that.stopSlider( pid )} );
            } );
            this.players[pid] = player;
        },
        
        stopSlider: function( pid ) {
            this.slider.$PlayTo( parseFloat( $( '#' + pid ).attr( 'data-sli' ) ) );
            this.slider.$Pause();
        },
        
        stopAll: function(){
            for ( var id in this.players ) {
                this.players[id].api( 'pause' );
            }
        },
        
        setSlider: function( slider ) {
            this.slider = slider;
        },
    }
    
    $.viPlayers = new viPlayers();
    
})( jQuery );
