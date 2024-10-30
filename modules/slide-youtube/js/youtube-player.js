/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    window.cnhkYTAPIReady = false;
    var cnhkYTPlayers = function(){
        this.players = {};
        this.playersQueue = {};
        this.delay = undefined;
        this.k = 5;
        var that = this;
        
        $( document ).on( 'cnhkSliderStarted', function( ev, id ){
            that.onSliderStarted( ev, id );
        } );
        
        this.onYouTubeIframeAPIReady = function(){
            cnhkYTAPIReady = true;
            that.onAPIReady();
        }
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
        
    }
    
    cnhkYTPlayers.prototype = {
        
        constructor: cnhkYTPlayers,
        
        onSliderStarted: function( ev, sliderId ){
            var that = this;
            var players = {};
            
            $( $.cnhkSlider[sliderId]['slider'].$Elmt ).find( '.cnhk-yt-player' ).each(function(){
                players[$( this ).attr( 'id' )] = sliderId;
            });
            $.extend( this.playersQueue, players );
            
            if ( cnhkYTAPIReady || undefined !== window.YT ) {
                this.onAPIReady();
            }
            
        },
        
        stopAll: function(){
            if ( ! cnhkYTAPIReady ) return;
            for ( var pid in this.players ) {
                if ( 'function' === typeof( this.players[pid]['player'].stopVideo ) ) {
                    this.players[pid]['player'].stopVideo();
                }
            }
        },
        
        onAPIReady: function(){
            var that = this;
            for ( var pid in this.playersQueue ) {
                var _p = {
                    player: new YT.Player( pid, {
                        events: {
                            onStateChange: function( ev ){
                                that.onStateChange( ev, pid );
                            }
                        }
                    } ),
                    sliderId: this.playersQueue[pid],
                };
                if ( $( '#' + _p.sliderId ).find( '.navarrow,.jssor-bullet-nav' ).length ) {
                    $( '#' + _p.sliderId ).find( '.navarrow,.jssor-bullet-nav' ).click(function(){
                        if ( $( this ).hasClass( 'jssor-bullet-navav' ) ) return;
                        that.stopAll();
                    });
                }
                this.players[pid] = _p;
            }
            this.playersQueue = {};
        },
        
        onStateChange: function ( ev, pid ) {
            if ( 1 == ev.data || 3 == ev.data ) {
                var slider = $.cnhkSlider[this.players[pid]['sliderId']]['slider'];
                slider.$Pause();
            }
        },
    }
    
    $(function(){
        $.cnhkYTPlayers = new cnhkYTPlayers();
        $.getScript( '//www.youtube.com/iframe_api' );
    });
    
})( jQuery );
