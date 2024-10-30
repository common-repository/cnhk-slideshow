/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    
    "use strict";
    
    var cnhkOverlay = function( options ) {
        this.options = {};
        
        /**
         *  Default options
         */
        var defaultOptions = {
            width: 90,
            height: 80,
            minWidth: 480,
            title: $( '<p />' ),
            content: $( '<p />' ),
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        
        // lowest layer
        this.overlay = $( '<div />' ).css({
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.66)',
            zIndex: '10050',
            display: 'none',
        }).attr( 'id', 'cnhk-overlay' );
        
        // wrapper
        this.wrapper = $( '<div />' ).css({
            position: 'absolute',
            backgroundColor: '#f0f0f0',
            width: '100%',
        }).attr( 'id', 'cnhk-overlay-wrapper' );
        
        // Heading bar with title
        this.head = $( '<div class="overlay-header">' +
            '<span class="alignright cnhk-overlay-close" style="-webkit-transition: color 0.25s;-moz-transition: color 0.25s;' +
            '-ms-transition: color 0.25s;-o-transition: color 0.25s;transition: color 0.25s;">' + 
            '<i class="dashicons dashicons-no" style="font-size: 20px; width: 20px; height: 20px"></i></span>' +
            '<span style="font-size: 1.2em; font-weight: bold;" id="cnhk-overlay-title">' + this.options['title'] + '</span>' +
        '</div>' ).css({
            padding: '8px',
            borderBottom : '1px solid #d6d6d6',
            minHeight: 17,
        });
        
        this.init();
        this.populate();
        this.overlay.append( this.wrapper.append( this.head ).append( this.content.append( this.options['content'] ) ) );
        $( '#wpwrap' ).prepend( this.overlay );
        return this;
    };
    
    cnhkOverlay.prototype = {
        
        constructor: cnhkOverlay,
        
        instance: function() {
            return this;
        },
        
        // initialize overlay and add event handlers
        init: function() {
            var that = this;
            
            this.head.find( '.cnhk-overlay-close' ).css({
                color: '#aaa',
                cursor: 'pointer',
            }).hover(function( ev ){
                ev.stopPropagation();
                $( this ).css( 'color', '#555' );
            }).on( 'click', function( ev ) {
                that.hide( true );
            } ).on( 'mouseout', function( ev ){
                ev.stopPropagation();
                $( this ).css( 'color', '#aaa' );
            });
            
            this.content = $( '<div />' ).css({
                maxWidth: '100%',
                backgroundColor: '#fff',
                overflow: 'hidden',
                position: 'relative',
            }).addClass( 'cnhk-overlay-content' );
            
            // Escape key
            $( document ).keydown( function( ev ) {
                if ( 'none' != that.overlay.css( 'display' ) ) {
                    var code = ev.which || ev.keyCode;
                    if ( 27 == code ) {
                        $( '.cnhk-overlay-close' ).trigger( 'click' );
                    }
                }
            } );
            
            $( window ).resize( function() {
                that.resize();
            } );
            
        },
        
        option: function() {
            var name;
            if ( arguments.length === 0 ) {
                return this.options;
            }
            if ( arguments.length === 2 ) {
                this.options[ arguments[0] ] = arguments[1];
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
            // on option change, re-populate and resize
            this.populate();
            this.resize();
            return this;
        },
        
        // set title and content
        populate : function() {
            var that = this;
            this.head.find( '#cnhk-overlay-title' ).text( this.options.title );
            this.content.empty().append( this.options.content );
            return this;
        },
        
        // resize the wrapper
        resize: function() {
            var w = this.overlay.width();
            var h = this.overlay.height();
            var headH = this.head.outerHeight();
            this.wrapper.css({
                width: Math.max( this.options.minWidth, w * ( this.options['width'] / 100 ) ),
                height: h * ( this.options['height'] / 100 ),
                marginLeft: ( ( ( 100 - this.options['width'] ) / 100 ) * w / 2 ),
                marginTop: ( ( ( 100 - this.options['height'] ) / 100 ) * h / 2 ),
            });
            this.content.css( 'height', ( this.wrapper.height() - headH ) );
            $( document ).trigger( 'cnhkOverlayResized' );
        },
        
        // show overlay
        show: function() {
            this.overlay.css( 'opacity', 0 ).show();
            this.resize();
            this.overlay.animate( {opacity : 1}, 200 );
            return this;
        },
        
        // clear content and title
        clear: function() {
            this.head.find( '#cnhk-overlay-title' ).empty();
            this.content.empty();
            return this;
        },
        
        // hide overlay
        hide: function( clear ) {
            var that = this;
            if ( undefined === clear ) {
                clear = true;
            }
            $( document ).trigger( 'beforeHideKaiOverlay' );
            this.overlay.css( 'opacity', 1 ).animate(
                {opacity : 0},
                200,
                function(){
                    $( this ).hide();
                    if ( true === clear ) {
                        that.clear();
                    }
                    $( document ).trigger( 'cnhkOverlayClosed' );
                }
            );
            return this;
        },
        
    };
    
    // extend jQuery
    $.cnhkOverlay = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'cnhkOverlay' );
        if ( ! data ) {
            data = new cnhkOverlay( option );
            $( '#wpwrap' ).data( 'cnhkOverlay', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.cnhkOverlay has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})( jQuery );
