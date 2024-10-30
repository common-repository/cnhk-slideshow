/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    window.cnhkYTAPIReady = false;
    var ytPlayersControls = function() {
        this.players = {};
        this.playersQueue = {};
        var that = this;
        $( document ).on( 'cnhkOverlayClosed', function(){
            that.clearAll();
        } );
        
        $( document ).on( 'click', '.jssor-bullet-nav,.navarrow', function ( ev ) {
            if ( ! cnhkYTAPIReady ) return;
            that.stopAll();
        } );
    
        this.onYouTubeIframeAPIReady = function(){
            cnhkYTAPIReady = true;
            that.buildPlayer();
        }
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
    }

    ytPlayersControls.prototype = {
        
        constructor: ytPlayersControls,
        
        addPlayer: function( iframeId, slider ) {
            this.playersQueue[iframeId] = slider;
            if ( cnhkYTAPIReady ) {
                this.buildPlayer();
            }
        },
        
        buildPlayer: function() {
            var that = this;
            for ( var iframeId in this.playersQueue ) {
                var slider = this.playersQueue[iframeId];
                var player = new YT.Player( iframeId, {
                    events: {
                        onStateChange: function( ev ){
                            that.onStateChange( ev, iframeId );
                        },
                    }
                } );
                this.players[iframeId] = {
                    player: player,
                    slider: slider,
                };
            }
            this.playersQueue = {};
        },
        
        clearAll: function () {
            this.players = {};
        },
        
        onStateChange: function ( ev, id ) {
            if ( 1 == ev.data || 3 == ev.data ) {
                this.players[id]['slider'].$Pause();
            }
        },
        
        stopAll: function () {
            for ( var id in this.players ) {
                if( 'function' === typeof( this.players[id]['player'].stopVideo ) ) {
                    this.players[id]['player'].stopVideo();
                }
            }
        },
        
    }
    $.ytPlayers = new ytPlayersControls();
    $.getScript( '//www.youtube.com/iframe_api' );
    
})( jQuery );
