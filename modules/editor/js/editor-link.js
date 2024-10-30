/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
    "use strict";
    var spinner = $( '<p class="preloader" style="text-align:center;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></p>' );

    var cnhkEditorLink = function ( el, options ) {
        
        this.el = el;
        this.$el = $( el );
        this.form;
        this.content;
        
		this.options = {};
        var defaultOptions = {
            // the squire editor instance in which the link is located
            editor: null,
        };
        this.options = $.extend( {}, defaultOptions, options );
        
        return this;
    };
    
    cnhkEditorLink.prototype = {
        
        constructor: cnhkEditorLink,
        
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
        
        open: function(){
            var options = {
                width: 72,
                height: 86,
                content: spinner,
                title: cnhkEditorLinkLocale.overlayTitle,
            };
            $.cnhkOverlay( 'option', options );
            $.cnhkOverlay( 'show' );
            this.getForm();
        },
        
        hide: function() {
            $.cnhkOverlay( 'hide', true );
        },
        
        // get the form markup from the server (always from the server)
        getForm: function(){
            var that = this;
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_editor_link_form',
            };
            
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    that.content = $( '<div />' ).attr( 'id', 'link-wrap' ).html( resp );
                    $.cnhkOverlay( 'option', 'content', that.content );
                    that.evt();
                    that.setup();
                    that.resize();
                },
                error: function ( request, textStatus, err ) {
                    console.error( 'ajax request failed - markup loading in link form' );
                    $.cnhkOverlay( 'hide', true );
                }
            });
        },
        
        // fill form's field if called from an existing link
        setup: function(){
            if ( this.$el.hasClass( 'squire-link' ) ) {
                var id = this.$el.attr( 'id' );
                var css = this.$el.attr( 'class' ).split( ' ' );
                var target = this.$el.attr( 'target' );
                if ( id ) {
                    $( '#link-id' ).val( id );
                }
                if ( 1 < css.length ) {
                    css.shift();
                    $( '#link-class' ).val( css.join( ' ' ) );
                }
                if ( '_blank' == target ) {
                    $( '#link-target' ).prop( 'checked', true );
                }
                $( '#link-url' ).val( this.$el.attr( 'href' ) );
            }
        },
        
        // event handlers
        evt: function(){
            var that = this;
            
            // resize
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
            } );
            
            // click on existing content
            $( document ).on( 'click', '#links-abswrap tbody tr', function ( ev ){
                if ( $( this ).attr( 'data-permalink' ) ) {
                    $( '#link-url' ).val( $( this ).attr( 'data-permalink' ) );
                }
            } );
            
            // close
            $( document ).on( 'click', '#cancel-link', function ( ev ){
                that.hide();
            } );
            
            // apply
            this.content.find( '#insert-link' ).on( 'click', function ( ev ){
                that.applyChanges();
            } );
            
        },
        
        // apply changes to the existing link or insert a link in the editor given in option
        applyChanges: function() {
            var url = $( '#link-url' ).val();
            if ( url ) {
                var id = $( '#link-id' ).val();
                var css = $( '#link-class' ).val();
                var newTab = $( '#link-target' ).prop( 'checked' );
                if ( this.$el.hasClass( 'squire-link' ) ) {
                    // link
                    if ( id ) {
                        this.$el.attr( 'id', id );
                    } else {
                        this.$el.removeAttr( 'id' );
                    }
                    
                    if ( newTab ) {
                        this.$el.attr( 'target', '_blank' );
                    } else {
                        this.$el.removeAttr( 'target' );
                    }
                    
                    this.$el.attr({
                        'class': 'squire-link ' + css,
                        'href' : url,
                    });
                    
                } else {
                    // toolbar button                    
                    var linkAttributes = {
                        'class' : 'squire-link ' + css,
                    };
                    if ( id ) linkAttributes.id = id;
                    if ( newTab ) linkAttributes.target = '_blank';
                    this.options.editor.makeLink( url, linkAttributes );
                }
                
            }
            this.hide();
        },
        
        resize: function(){
            var aw = $( '#link-wrap' ).width() - 40 - 1;
            var ah = $( '#link-wrap' ).height() - 50 - 20 - 1;
            $( '#link-settings,#existing-posts' ).width( aw / 2 );
            $( '#link-settings,#existing-posts' ).height( ah );
            $( '#links-abswrap' ).height( ah - $( '#exist-heading' ).outerHeight( true ) );
            $( '#links-abswrap' ).width( '100%' );
        },
        
    };
    
    // extend jQuery
    $.fn.cnhkEditorLink = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkEditorLink' );
            if ( ! data ) {
                data = new cnhkEditorLink( this );
                $this.data( 'cnhkEditorLink', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkEditorLink has no "' + option + '" method';
                }
                var result = data[ option ].apply( data, args );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
        });
        return ( results.length > 0 )? results[0] : this;
    };
    
})( jQuery );
