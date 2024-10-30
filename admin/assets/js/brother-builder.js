/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    /**
     *  brother effect builder object
     */
    var brotherBuilder = function( options ) {
        this.$el = $( '#brother-builder' );
        var defaultOptions = {
            codeInputSel: '',
            codeDisplaySel: '',
            twinBuilder: undefined,
        };
        this.content;
        this.builder;
        
        this.options = $.extend( {}, defaultOptions, options );
        
        this.init();
        
        this.evt();
        
        return this;
    };
    
    brotherBuilder.prototype = {
        
        constuctor: brotherBuilder,
        
        /**
         *  set/get options
         */
        option: function() {
            var name;
            if ( arguments.length === 0 ) {
                return this.options;
            }
            if ( arguments.length === 2 ) {
                this.options[ arguments[0] ] = arguments[1];
                return this;
            }
            if ( arguments.length === 1 ) {
                if ( typeof arguments[0] === 'string' ) {
                    return this.options[ arguments[0] ];
                }
                if ( typeof arguments[0] === 'object' ) {
                    for( name in arguments[0] ) {
                        if ( arguments[0].hasOwnProperty( name ) ) {
                            this.options[ name ] = arguments[0][ name ];
                        }
                    }
                }
            }
            return this;
        },
        
        /**
         *  init all fields ( use diffeent ID attributes )
         */
        init: function(){
            var fields = {
                ssFormation: 'ssFormation-bro',
                ssAssembly: 'ssAssembly-bro',
                ssDuration: 'ssDuration-bro',
                ssCols: 'ssCols-bro',
                ssRows: 'ssRows-bro',
                ssDelay: 'ssDelay-bro',
                scReverse: 'scReverse-bro',
                scSlideOut: 'scSlideOut-bro',
                scOutside: 'scOutside-bro',
                scMove: 'scMove-bro',
                
                // Fly effect (horizontal)
                ssFlyHorizontal: 'ssFlyHorizontal-bro',
                stDuringBeginHor: 'stDuringBeginHor-bro',
                stDuringLengthHor: 'stDuringLengthHor-bro',
                ssEasingHorizontal: 'ssEasingHorizontal-bro',
                stScaleHorizontal: 'stScaleHorizontal-bro',
                ssRoundHorizontal: 'ssRoundHorizontal-bro',
                
                // Fly effect (vertical)
                ssFlyVertical: 'ssFlyVertical-bro',
                stDuringBeginVer: 'stDuringBeginVer-bro',
                stDuringLengthVer: 'stDuringLengthVer-bro',
                ssEasingVertical: 'ssEasingVertical-bro',
                stScaleVertical: 'stScaleVertical-bro',
                ssRoundVertical: 'ssRoundVertical-bro',
                
                // Clip effect
                ssClip: 'ssClip-bro',
                stDuringBeginClip: 'stDuringBeginClip-bro',
                stDuringLengthClip: 'stDuringLengthClip-bro',
                ssEasingClip: 'ssEasingClip-bro',
                stScaleClip: 'stScaleClip-bro',
                ssRoundClip: 'ssRoundClip-bro',
                
                // Zoom effect
                scZoom: 'scZoom-bro',
                stDuringBeginZoom: 'stDuringBeginZoom-bro',
                stDuringLengthZoom: 'stDuringLengthZoom-bro',
                ssEasingZoom: 'ssEasingZoom-bro',
                stScaleZoom: 'stScaleZoom-bro',
                ssRoundZoom: 'ssRoundZoom-bro',
                
                // Rotate effect
                scRotate: 'scRotate-bro',
                stDuringBeginRotate: 'stDuringBeginRotate-bro',
                stDuringLengthRotate: 'stDuringLengthRotate-bro',
                ssEasingRotate: 'ssEasingRotate-bro',
                stScaleRotate: 'stScaleRotate-bro',
                ssRoundRotate: 'ssRoundRotate-bro',
                
                // Fade effect
                scFade: 'scFade-bro',
                stDuringBeginFade: 'stDuringBeginFade-bro',
                stDuringLengthFade: 'stDuringLengthFade-bro',
                ssEasingFade: 'ssEasingFade-bro',
                stScaleFade: 'stScaleFade-bro',
                
                // Z-index
                scZIndex: 'scZIndex-bro',
                stDuringBeginZIndex: 'stDuringBeginZIndex-bro',
                stDuringLengthZIndex: 'stDuringLengthZIndex-bro',
                ssEasingZIndex: 'ssEasingZIndex-bro',
                stScaleZIndex: 'stScaleZIndex-bro',
                ssRoundZIndex: 'ssRoundZIndex-bro',
                
                // Chess Mode
                scChessColHorizontal: 'scChessColHorizontal-bro',
                scChessColVertical: 'scChessColVertical-bro',
                scChessRowHorizontal: 'scChessRowHorizontal-bro',
                scChessRowVertical: 'scChessRowVertical-bro',
            };
            this.builder = new jssorFxBuilder( 'bro', fields, this.$el.attr( 'id' ) , this.options.codeDisplaySel );
            // $( '#wpwrap' ).data( 'broBuilderMarkup', this.$el );
            this.$el.show().remove();
            this.content = $( '<div "#brother-container"></div>' ).css({
                position: 'absolute',
            }).append( this.$el );
        },
        
        /**
         *  event handler
         */
        evt: function(){
            var that = this;
            
            // open the twin effect editor
            $( document ).on( 'click', '#open-brother', function( ev ){
                ev.stopPropagation();
                ev.preventDefault();
                that.show();
            } );
            
            // remove existing twin effect
            $( document ).on( 'click', '#clear-brother', function( ev ) {
                ev.stopPropagation();
                ev.preventDefault();
                $( '#shBrother' ).val( '' );
                that.options.twinBuilder.inputChangedTasks();
            } );
            
            // apply changes
            $( document ).on( 'click', '#apply-brother', function( ev ) {
                ev.stopPropagation();
                ev.preventDefault();
                that.apply();
            } );
            
            // overlay resized (window resized)
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
            } );
        },
        
        /**
         *  resize overlay content
         */
        resize: function() {
            var aw = $( '.cnhk-overlay-content' ).width();
            var ah = $( '.cnhk-overlay-content' ).height();
            this.content.find( '#brother-builder-wrap' ).css({
                width: aw - 20,
                height: ah - 50 - 20,
                padding: 10,
            });
        },
        
        /**
         *  show overlay
         */
        show: function(){
            var options = {
                width: 94,
                height: 85,
                title: brotherLocale.overlayTitle,
                content: this.content,
            };
            $.cnhkOverlay( options );
            $.cnhkOverlay( 'show' );
            this.setupCode();
        },
        
        /**
         *  set up brother effect code value
         */
        setupCode: function() {
            var jCode = $( this.options.codeInputSel ).val();
            var code = JSON.parse( ( jCode )? jCode : '{}' );
            var jssorCode = ( code )? jssorFunc.convert( code, 'jssor' ) : '{}';
            this.builder.loadCode( jssorCode );
        },
        
        /**
         *  convert jssor code into json and inject it in the main effect's code
         */
        apply: function(){
            var rawCode = $( this.options.codeDisplaySel ).val();
            var jCode = jssorFunc.convert( rawCode, 'json' );
            $( this.options.codeInputSel ).val( ( jCode )? JSON.stringify( jCode, false ) : '' );
            this.options.twinBuilder.inputChangedTasks();
            $.cnhkOverlay( 'hide' );
        },
        
    };
    
    /**
     *  extend jQuery
     */
    $.brotherBuilder = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'brotherBuilder' );
        if ( ! data ) {
            data = new brotherBuilder( option );
            $( '#wpwrap' ).data( 'brotherBuilder', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.brotherBuilder has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})( jQuery );
