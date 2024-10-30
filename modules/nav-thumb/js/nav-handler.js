/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var cnhkNavThumb = function() {};
    
    cnhkNavThumb.prototype = {
        
        constructor: cnhkNavThumb,
        
        isUsed: function() {
            return ( $( '#use-nav-thumb' ).prop( 'checked' ) );
        },
        
        getMarkup: function( settings, ssw, ssh ) {
            var size = this.getSize( settings );
            
            // bottom
            var mkTop = ssh;
            var mkLeft = ( ssw - Math.min( ssw, size.width ) ) / 2;
            
            switch ( settings.position ) {
                case 'top':
                    // mkLeft = ( ssw - Math.min( ssw, size.width ) ) / 2;
                    mkTop = 0;
                    break;
                case 'left':
                    mkLeft = 0;
                    mkTop = ( ssh - Math.min( ssh, size.height ) ) / 2;
                    break;
                case 'right':
                    mkLeft = ssw;
                    mkTop = ( ssh - Math.min( ssh, size.height ) ) / 2;
                    break;
                default:
            }
            
            var markup = $( '<div />' ).attr({
                'data-u': 'thumbnavigator',
                'class': 'jssor-thumb-nav-wrap',
            }).css({
                left: mkLeft,
                top: mkTop,
                width: size.width,
                height: size.height,
                position: 'absolute',
            });
            var slides = $( '<div />' ).attr( 'data-u', 'slides' );
            var proto = $( '<div />' ).attr( 'data-u', 'prototype' ).addClass( 'thumb-nav' ).css({
                position: 'absolute',
                width: settings.width,
                height: settings.height,
            });
            var template = $( '<div data-u="thumbnailtemplate"></div><div class="thov"></div>' );
            markup.append( slides.append( proto.append( template ) ) );
            return markup[0].outerHTML;
        },
        
        getSize: function( settings ) {
            var width =  1.025 * settings.width * Math.ceil( settings.pieces / settings.lane );
            var height = 1.1 * ( 1.025 * settings.height * settings.lane );
            if ( 'left' == settings.position || 'right' == settings.position ) {
                width = 1.1 * ( 1.025 * settings.width * settings.lane );
                height = 1.025 * settings.height * Math.ceil( settings.pieces / settings.lane );
            }
            return {
                width: width,
                height: height,
                position: settings.position,
            }
        },
        
        getThumbImage: function ( src, w, h ) {
            return ajaxurl + '?action=cnhk_thumb&url=' + src + '&w=' + w + '&h=' + h;
        },
        
    };
    
    $(function(){
        cnhkNavHandler['thumb'] = new cnhkNavThumb();
    });
    
})( jQuery );
