/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    
    "use strict";
    
    var cnhkEditorIconSelect = function( el, options ) {
        
        this.el = el;
        this.$el = $( el );
        this.options = {};
        
        var defaultOptions = {
            color: '#2b2b2b',
            bg: '#ffffff',
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        this.markup;
        this.evt();
        return this;
        
    };
    
    cnhkEditorIconSelect.prototype = {
        
        constructor: cnhkEditorIconSelect,
        
        // event handler
        evt: function(){
            var that = this;
            
            // value of search filter changed
            $( document ).on( 'change, keyup', '#icon-filter-input', function( ev ) {
                if ( $( this ).val() ) {
                    if ( 'undefined' != typeof( delay ) ) clearTimeout( delay );
                    var D = 300;
                    var delay = setTimeout(function(){
                        var nothingFound = true;
                        $( '#icons-all #icons-list .icon-block' ).each( function(){
                            var str = $( '#icon-filter-input' ).val();
                            if ( str && -1 != $( this ).attr( 'data-val' ).indexOf( str.toLowerCase() ) ) {
                                nothingFound = false;
                                $( this ).css( 'display', 'block' );
                            } else {
                                $( this ).css( 'display', 'none' );
                            }
                        });
                        if ( nothingFound ) {
                            $( '#no-icon-found' ).css( 'display', 'block' );
                        } else {
                            $( '#no-icon-found' ).css( 'display', 'none' );
                        }
                    }, D );
                } else {
                    if ( 'undefined' != typeof( delay ) ) clearTimeout( delay );
                    $( '#icons-all #icons-list .icon-block' ).css( 'display', 'block' );
                }
            } );
            
            // icon chosen
            $( document ).on( 'click', '.icon-block', function( ev ) {
                var key = $( this ).attr( 'data-key' );
                if ( $( '#icon-zone .fa' ).length ) {
                    $( '#icon-zone .fa' ).removeClass( $( '#icon-zone' ).attr( 'data-key' ) ).addClass( key );
                    $( '#icon-zone' ).attr( 'data-key', key );
                } else {
                    var icon = $( '<span />' ).addClass( $( this ).find( 'i' ).attr( 'class' ) );
                    $( '#icon-zone' ).attr( 'data-key', key ).append( icon );
                    $( '#no-icon-selected' ).remove();
                    $( '#insert-icon' ).removeAttr( 'disabled' );
                }
            } );
            
            // insert icon
            $( document ).on( 'click', '#insert-icon', function( ev ) {
                ev.preventDefault();
                ev.stopPropagation();
                var size = $( '#icon-size' ).val();
                if ( ! size ) {
                    size = 50;
                }
                var icon = $( '#icon-zone .fa' ).remove();
                $( '#icon-zone' ).append( $( '<span class="size" style="font-size:' + size + 'px"></span>' ).append( icon.text( 'FA;' ) ) );
                that.insert( $( '#icon-zone' ).html() );
                $.cnhkOverlay( 'hide', true );
            } );
            
            // apply changes (on existing icon)
            $( document ).on( 'click', '#apply-icon', function( ev ) {
                ev.preventDefault();
                ev.stopPropagation();
                if ( ! that.$el.hasClass( 'fa' ) ) return;
                var size = $( '#icon-size' ).val();
                if ( ! size ) {
                    size = 50;
                }
                var icon = $( '#icon-zone .fa' );
                that.$el.parent( '.size' ).css( 'font-size', size + 'px' );
                that.$el.attr( 'class', icon.attr( 'class' ) );
                $.cnhkOverlay( 'hide', true );
            } );
            
            // delete icon
            $( document ).on( 'click', '#remove-icon', function( ev ) {
                ev.preventDefault();
                ev.stopPropagation();
                
                // if called from the toolbar button, abort
                if ( ! that.$el.hasClass( 'fa' ) ) return;
                that.$el.parent( '.size' ).remove();
                $.cnhkOverlay( 'hide', true );
            } );
            
            // on window resized
            $( document ).on( 'cnhkOverlayResized', function( ev ) {
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
                return;
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
                    this.open();
                }
            }
            return this;
        },
        
        open: function() {
            var that = this;
            var content = $( '<p class="preloader" style="text-align:center;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></p>' );
            this.markup = $( '#wpwrap' ).data( 'cnhkEditorIconSelectMarkup' );
            var title = cnhkEditorIconLocale.overlayTitle;
            $.cnhkOverlay( 'option', {
                width: 94,
                height: 85,
                title: title,
                content: content,
            });
            
            $.cnhkOverlay( 'show' );
            
            if ( ! this.markup ) {
                
                var formData = {
                    nonce : cnhkAjaxNonce,
                    action : 'cnhk_editor_icon_form',
                };
                
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: formData,
                    success: function ( data, textStatus, XHR ) {
                        that.markup = $( data );
                        $( '#wpwrap' ).data( 'cnhkEditorIconSelectMarkup', that.markup );
                        $.cnhkOverlay( 'option', { content: that.markup.clone() } );
                        $.cnhkOverlay( 'resize' );
                        that.setup();
                        that.resize();
                    },
                    error: function ( request, textStatus, err ) {
                        console.error( 'ajax request failed' );
                    }
                });
                
            } else {
                content = this.markup.clone();
                $.cnhkOverlay( 'option', { content: content });
                this.setup();
                this.resize();
            }
        },
        
        resize: function() {
            var main = $( '#icons-all' );
            var submitDiv = $( '#insert-icon-div' );
            var form = $( '#icon-preview' );
            var aw = main.parent().innerWidth();
            var ah = main.parent().innerHeight();
            main.outerWidth( aw - form.outerWidth() );
            main.outerHeight( ah - submitDiv.outerHeight() );
            $( '#icons-list' ).outerHeight( main.height() - $( '#icon-filter' ).outerHeight( true ) );
            form.css( 'margin-left', main.outerWidth() );
            $( '#icon-com' ).innerHeight( ah - submitDiv.outerHeight() - 180 );
            submitDiv.css( 'margin-top', main.innerHeight() );
            form.outerHeight( ah - submitDiv.outerHeight() );
        },
        
        // setup icon preview if called from an icon in the editor
        setup: function() {
            
            var that = this;
            
            if ( this.$el.hasClass( 'fa' ) ) {
                // if the plugin is called on a font awesome icon, pre-set all fields
                $( '#no-icon-selected' ).remove();
                var classAttr = this.$el.attr( 'class' );
                
                var sizeArr = this.$el.parent( '.size' ).css( 'font-size' ).split( 'px' );
                var size = ( sizeArr[0] )? sizeArr[0] : 50;
                $( '#icon-zone' ).append( this.$el.clone() );
                
                $( '#icon-size' ).val( size );
                
                var name = classAttr.replace( 'fa', '' ).replace( / /g, '' );
                $( '#icon-zone' ).attr( 'data-key', name );
                
                $( '#insert-icon' ).remove();
                $( '#apply-icon,#remove-icon' ).css( 'display', 'inline-block' );
            }
            
        },
        
        // insert icon
        insert: function( html ) {
            if ( 'function' == typeof( this.options.insert ) ) {
                this.options.insert.call( this.el, html );
            }
        },
        
    };
    
    // extend jQuery
    $.fn.cnhkEditorIconSelect = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkEditorIconSelect' );
            if ( ! data ) {
                data = new cnhkEditorIconSelect( this, option );
                $this.data( 'cnhkEditorIconSelect', data );
            }
            if ( typeof( option ) === 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkEditorIconSelect has no "' + option + '" method';
                }
                var result = data[ option ].apply( data, args );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
            if ( typeof( option ) == 'object' ) {
                var result = data.option( option );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
        });
        return ( results.length > 0 )? results[0] : this;
    };
    
})( jQuery );
