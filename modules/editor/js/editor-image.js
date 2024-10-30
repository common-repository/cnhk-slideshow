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
    
    var cnhkEditorImage = function ( el ) {
        
        this.el = el;
        this.$el = $( el );
        
        this.naturalWidth;
        this.naturalHeight;
        this.alignment;
        
        this.form;
        this.content;
        
        return this;
    };
    
    cnhkEditorImage.prototype = {
        
        constructor : cnhkEditorImage,
        
        // get form from server or from #wpwrap
        getForm: function(){
            var that = this;
            var form = $( '#wpwrap' ).data( 'cnhkEditorImageForm' );
            
            if ( form ) {
                // the markup already stored in #wpwrap
                
                this.form = form.clone();
                this.content = this.form.clone();
                this.evt();
            } else {
                // get the markup from server via AJAX and store it in #wpwrap
                
                var formData = {
                    nonce : cnhkAjaxNonce,
                    action : 'cnhk_editor_image_form',
                };
                
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: formData,
                    success: function ( resp, textStatus, XHR ) {
                        var $resp = $( '<div id="editor-image-wrap"></div>' ).html( resp );
                        that.form = $resp.clone();
                        $( '#wpwrap' ).data( 'cnhkEditorImageForm', $resp );
                        that.content = that.form.clone();
                        that.evt();
                        $( that.$el ).trigger( 'editorImageFormLoaded' );
                    },
                    error: function ( request, textStatus, err ) {
                        console.error( 'ajax request failed - markup loading in image edit' );
                        $.cnhkOverlay( 'hide', true );
                    }
                });
            }
        },
        
        // show the form in overlay frame
        show: function() {
            var options = {
                width: 85,
                height: 80,
                content: spinner,
                title: cnhkEditorImageLocale.overlayTitle,
            };
            $.cnhkOverlay( 'option', options );
            $.cnhkOverlay( 'show' );
            this.getForm();
            if ( this.form ) {
                this.init();
            }
        },
        
        // hide and empty the overlay
        hide: function() {
            $.cnhkOverlay( 'hide', true );
        },
        
        // resize function
        resize: function() {
            if ( undefined === this.content ) return; 
            var ah = $( '.cnhk-overlay-content' ).height() - $( '#image-edit-toolbar' ).outerHeight() - 51;
            var aw = $( '.cnhk-overlay-content' ).width();
            var preview = this.content.find( '#image-edit-preview > img' );
            
            if ( this.naturalWidth > aw || this.naturalHeight > ah ) {
                // need scaling
                var scale = Math.min( aw / this.naturalWidth, ah / this.naturalHeight ) * 0.9;
                
                preview.css({
                    width: scale * this.naturalWidth,
                    height: scale * this.naturalHeight,
                    marginLeft: ( aw - ( scale * this.naturalWidth ) ) / 2,
                    marginTop: ( ah - ( scale * this.naturalHeight ) ) / 2,
                } );
                
            } else {
                preview.css({
                    marginLeft: ( aw - this.naturalWidth ) / 2,
                    marginTop: ( ah - this.naturalHeight ) / 2,
                });
            }
            
        },
        
        // initialize the instance of the current object with the current image's info
        init: function() {
            
            if ( ! this.naturalWidth ) {
                var image = new Image();
                image.src = this.$el.attr( 'src' );
                this.naturalWidth = image.naturalWidth;
                this.naturalHeight = image.naturalHeight;
            }
            
            // alignment
            var align = 'none';
            if ( 'block' == this.$el.css( 'display' ) ) {
                // there is an alignment set
                if ( undefined !== this.$el.css( 'float' ) && 'none' != this.$el.css( 'float' ) ) {
                    // left or right
                    if ( 'left' == this.$el.css( 'float' ) ) {
                        align = 'left';
                    } else {
                        align = 'right';
                    }
                } else {
                    // no float but display block
                    align = 'center';
                }
            }
            this.alignment = align;
            this.populate();
            
        },
        
        // fill the form with image's info
        populate: function(){
            
            var preview = this.$el.clone().removeAttr( 'width' ).removeAttr( 'height' ).addClass( 'img-edit-preview' );
            this.content.find( '#image-edit-preview' ).append( preview );
            this.content.find( '#nat-size-width' ).text( this.naturalWidth );
            this.content.find( '#nat-size-height' ).text( this.naturalHeight );
            
            var widthAttr = ( this.$el.attr( 'width' ) )? this.$el.attr( 'width' ) : '';
            var heightAttr = ( this.$el.attr( 'height' ) )? this.$el.attr( 'height' ) : '';
            
            this.content.find( '#image-edit-toolbar #image-width' ).val( widthAttr );
            this.content.find( '#image-edit-toolbar #image-height' ).val( heightAttr );
            this.content.find( '#image-edit-toolbar #image-edit-alignment' ).val( this.alignment );
            
            $.cnhkOverlay( 'option', 'content', this.content );
            this.resize();
            
        },
        
        // apply the form info on the current image
        applyChanges: function(){
            var that = this;
            var width = this.content.find( '#image-width' ).val();
            var height = this.content.find( '#image-height' ).val();
            
            if ( width ) {
                this.$el.attr( 'width', width );
            } else {
                this.$el.removeAttr( 'width' );
            }
            
            if ( height ) {
                this.$el.attr( 'height', height );
            } else {
                this.$el.removeAttr( 'height' );
            }
            
            var alignment = this.content.find( '#image-edit-alignment' ).val();
            
            switch ( alignment ) {
                case 'none':
                    that.$el.css({
                        display: 'inline',
                        float: 'none',
                        clear: 'none',
                        marginTop: 2,
                        marginRight: 2,
                        marginBottom: 3,
                        marginLeft: 2,
                    });
                    
                    break;
                case 'left':
                    that.$el.css({
                        display: 'block',
                        float: 'left',
                        clear: 'both',
                        marginTop: 2,
                        marginRight: 5,
                        marginBottom: 5,
                        marginLeft: 2,
                    });
                    break;
                case 'center':
                    that.$el.css({
                        display: 'block',
                        float: 'none',
                        clear: 'both',
                        marginTop: 2,
                        marginRight: 'auto',
                        marginBottom: 3,
                        marginLeft: 'auto',
                    });
                    break;
                case 'right':
                    that.$el.css({
                        display: 'block',
                        float: 'right',
                        clear: 'both',
                        marginTop: 2,
                        marginRight: 2,
                        marginBottom: 5,
                        marginLeft: 5,
                    });
                    break;
                default:
            }
            return;
        },
        
        // event handlers
        evt: function() {
            var that = this;
            
            this.$el.on( 'editorImageFormLoaded', function(){
                that.init();
            } );
            
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
            } );
            
            $( document ).on( 'click', '#cancel-edit-image', function( ev ) {
                $.cnhkOverlay( 'hide', true );
            } );
            
            this.content.find( '#apply-edit-image' ).on( 'click', function( ev ) {
                ev.stopPropagation();
                ev.preventDefault();
                that.applyChanges();
                $.cnhkOverlay( 'hide', true );
            } );
            
        },
        
    };
    
    // extend jQuery
    $.fn.cnhkEditorImage = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkEditorImage' );
            if ( ! data ) {
                data = new cnhkEditorImage( this );
                $this.data( 'cnhkEditorImage', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkEditorImage has no "' + option + '" method';
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
