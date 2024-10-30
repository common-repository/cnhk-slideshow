/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    // $FillMode
    var FM = {
        '0' : 'stretch',
        '1' : 'contain',
        '2' : 'cover',
        '4' : 'asis',
        '5' : 'mix',
    };
    
    var cnhkSlideWrap = function( el, options ) {
        this.el = el;
        this.$el = $( el );
        
        // scale factor
        this.SF;
        this.box;
        this.image;
        this.originalImageSize;
        
        var defaultOptions = {
            slideID: undefined,
            boxWidth: 1300,
            boxHeight: 500,
            fillMode: '2',
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        
        var that = this;
        $( document ).on( 'cnhkOverlayResized', function(){
            that.scale();
        });
        return this;
    };
    
    cnhkSlideWrap.prototype = {
        
        constuctor: cnhkSlideWrap,
        
        // get scale factor
        getScale: function(){
            return this.SF;
        },
        
        // get/set option
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
        
        // fill the slide wrap with all content
        init: function(){
            var that = this;
            
            this.box = $( '<div />' ).attr({
                'class': 'slidewrap-abs-container',
                'style': 'position:absolute;overflow:hidden;',
            });
            
            var content = $( this.el ).html();
            
            this.$el.empty().append( this.box.html( content ) );
            
            this.image = this.box.find( '> img' );
            
            if ( this.image.length ) {
                
                this.image.on( 'load', function (){
                    that.originalImageSize = {
                        width: this.naturalWidth,
                        height: this.naturalHeight,
                    }; 
                    that.scale();
                } );
                
                this.image.removeAttr( 'style' ).css( 'position', 'absolute' );
                this.box.prepend( this.image );
            }
            this.SF = 1;
            this.scale();
            return this;
        },
        
        // (re-)scale the slide wrapper
        scale: function() {
            var that = this;
            var aw = this.$el.parent().width() * 0.92;
            var ah = Math.min( this.$el.parent().height() * 0.80 );
            
            this.SF = Math.min( aw / this.options.boxWidth, ah / this.options.boxHeight );
            
            this.box.css({
                '-moz-transform' : 'scale(' + this.SF + ',' + this.SF + ')',
                '-moz-transform-origin' : 'left top',
                '-ms-transform' : 'scale(' + this.SF + ',' + this.SF + ')',
                '-ms-transform-origin' : 'left top',
                '-o-transform' : 'scale(' + this.SF + ',' + this.SF + ')',
                '-o-transform-origin' : 'left top',
                '-webkit-transform' : 'scale(' + this.SF + ',' + this.SF + ')',
                '-webkit-transform-origin' : 'left top',
                'transform' : 'scale(' + this.SF + ',' + this.SF + ')',
                'transform-origin' : 'left top',
                'margin-left' : ( ( aw / 0.92 ) -  ( this.SF * this.options.boxWidth ) ) / 2,
                'margin-top' : ( ( ah / 0.80 ) - ( this.SF * this.options.boxHeight ) ) / 2,
                'width' : this.options.boxWidth,
                'height' : this.options.boxHeight,
            });
            
            if ( this.image.length && undefined != this.originalImageSize ) {
                
                var OW = this.originalImageSize.width;
                var OH = this.originalImageSize.height;
                var isBigImage = ( ( that.options.boxWidth < OW ) || ( that.options.boxHeight < OH ) )? true : false;
                
                var imageCss = {
                    width: OW,
                    height: OH,
                    left: 0,
                    top: 0,
                    scale: 1,
                };
                
                switch ( FM[that.options.fillMode] ) {
                    case 'cover' :
                        imageCss.scale = Math.max( that.options.boxWidth / OW, that.options.boxHeight / OH );
                        imageCss.width = Math.floor( imageCss.scale * OW );
                        imageCss.height = Math.floor( imageCss.scale * OH );
                        imageCss.left = Math.floor( ( that.options.boxWidth - imageCss.width ) / 2 );
                        imageCss.top = Math.floor( ( that.options.boxHeight - imageCss.height ) / 2 );
                        break;
                    case 'contain' :
                        imageCss.scale = Math.min( that.options.boxWidth / OW, that.options.boxHeight / OH );
                        imageCss.width = Math.floor( imageCss.scale * OW );
                        imageCss.height = Math.floor( imageCss.scale * OH );
                        imageCss.left = Math.floor( ( that.options.boxWidth - imageCss.width ) / 2 );
                        imageCss.top = Math.floor( ( that.options.boxHeight - imageCss.height ) / 2 );
                        break;
                    case 'stretch' :
                        imageCss.scale = false;
                        imageCss.width = OW;
                        imageCss.height = OH;
                        break;
                    case 'asis' :
                        imageCss.left = Math.floor( ( that.options.boxWidth - imageCss.width ) / 2 );
                        imageCss.top = Math.floor( ( that.options.boxHeight - imageCss.height ) / 2 );
                        break;
                    case 'mix' :
                        if ( isBigImage ) {
                            imageCss.scale = Math.min( that.options.boxWidth / slideWidth, that.options.boxHeight / OH );
                            imageCss.width = Math.floor( imageCss.scale * OW );
                            imageCss.height = Math.floor( imageCss.scale * OH );
                            imageCss.left = Math.floor( ( that.options.boxWidth - imageCss.width ) / 2 );
                            imageCss.top = Math.floor( ( that.options.boxHeight - imageCss.height ) / 2 );
                        } else {
                            imageCss.left = Math.floor( ( that.options.boxWidth - imageCss.width ) / 2 );
                            imageCss.top = Math.floor( ( that.options.boxHeight - imageCss.height ) / 2 );
                        }
                        break;
                    default:
                };
                
                this.image.css({
                    width: imageCss.width,
                    height: imageCss.height,
                    left: imageCss.left,
                    top: imageCss.top,
                });
            }
        },
        
    };
    
    // extend jQuery
    $.fn.cnhkSlideWrap = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkSlideWrap' );
            if ( ! data ) {
                data = new cnhkSlideWrap( this, option );
                $this.data( 'cnhkSlideWrap', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkSlideWrap has no "' + option + '" method';
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
