/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
    "use strict";
    
    var cnhkLayerEditor = function( options ) {
        this.externalWrap = $( '#layer-editor-wrap' );
        this.editor;
        var defaultOptions = {
            slideId: null,
            layerId: null,
        };
        this.options = $.extend( {}, defaultOptions, options );
        this.evt();
        return this;
        
    };
    
    cnhkLayerEditor.prototype = {
        
        constructor: cnhkLayerEditor,
        
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
            return this;
        },
        
        show: function(){
            this.externalWrap.css({
                display: 'block',
            });
            if ( undefined === this.editor ) {
                this.externalWrap.find( '.tabs' ).tabs({
                    active: 0,
                });
                this.editor = this.externalWrap.find( '.cnhk-editor-wrap' ).cnhkEditor( 'option', 'fullScreen', true );
                this.editor.resize();
            }
            
            var content = $( 'input[name="slides[' + this.options.slideId + '][layers][' + this.options.layerId + '][html]"]' ).val();
            var reg = /(<[^>]+>)(\s)|(&nbsp;)/g;
            var c = 0;
            var alt = 'odd'; 
            while ( null !== content.match( reg ) ) {
                c++;
                content = content.replace( reg, "$1<span class=\"nbsp " + alt + " ins" + c + "\"></span>" );
                if ( 'odd' == alt ) {
                    alt = 'even';
                } else {
                    alt = 'odd';
                }
            }
            
            this.editor.squireInstance.setHTML( content );
            
            $( this.editor.iframe ).contents().find( 'span.nbsp' ).each(function(){
                if ( $( this ).hasClass( 'even' ) ) {
                    $( this ).replaceWith( ' ' );
                } else {
                    $( this ).replaceWith( '&nbsp;' );
                }
            });
            
            this.editor.rawEditor.val( this.editor.squireInstance.getHTML() );
        },
        
        hide: function(){
            this.editor.squireInstance.setHTML( '' );
            this.editor.rawEditor.val( '' );
            this.externalWrap.css({
                display: 'none',
            });
        },
        
        evt: function(){
            var that = this;
            
            // cancel
            this.externalWrap.find( '#close-layer-editor' ).on( 'click', function ( ev ) {
                ev.preventDefault();
                that.hide();
            } );
            
            // apply changes
            this.externalWrap.find( '#apply-layer-editor' ).on( 'click', function ( ev ) {
                ev.preventDefault();
                $( 'input[name="slides[' + that.options.slideId + '][layers][' + that.options.layerId + '][html]"]' ).val(
                    that.externalWrap.find( '.cnhk-editor-html' ).val()
                );
                var bgColor = that.externalWrap.find( '.colorpicker.background-color' );
                
                if ( bgColor.length ) {
                    $( 'input[name="slides[' + that.options.slideId + '][layers][' + that.options.layerId + '][editorbg]"]' ).val( bgColor.wpColorPicker( 'color' ) );
                }
                that.hide();
            } );
        },
        
    };
    
    $.cnhkLayerEditor = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'cnhkLayerEditor' );
        if ( ! data ) {
            data = new cnhkLayerEditor( option );
            $( '#wpwrap' ).data( 'cnhkLayerEditor', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.cnhkLayerEditor has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})(jQuery);
