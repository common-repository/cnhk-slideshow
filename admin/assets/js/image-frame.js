/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function($){
    "use strict";
    var cnhkImageFrame = function( options ) {
        
        this.defaultOptions = {
            url: null,
            alt: null,
            mime: ['image/jpeg', 'image/png', 'image/gif'],
            notice: null,
        };
        this.options = $.extend( {}, this.defaultOptions, options );
        
        // create an instance of wp.media for our usage
        this.wpMediaFrame = wp.media.frames.frame = wp.media( {
            title: cnhkImageFrameLocale.selectImage,
            button: {
                text: cnhkImageFrameLocale.button,
            },
            multiple: false
        } );
        
        var that = this;
        
        // on media selected (actually when the bottom right button is pressed)
        this.wpMediaFrame.on( 'select' , function(){
            var attachment = that.wpMediaFrame.state().get( 'selection' ).first().toJSON();
            var isValidImage = ( -1 != that.options.mime.indexOf( attachment.mime ) );
            if ( isValidImage ) {
                that.options.url.val( attachment.url );
                that.options.url.trigger( 'change' );
                if ( that.options.alt ) {
                    that.options.alt.val( attachment.alt );
                    that.options.alt.trigger( 'change' );
                }
                if ( that.options.notice ) {
                    that.options.notice.empty();
                }
            } else {
                // mime type not allowed
                
                if ( that.options.notice ) {
                    that.options.notice.text( cnhkImageFrameLocale.invalidFileType );
                }
            }
        });
        
        this.wpMediaFrame.open();
        
        return this;
    };
    
    // extend jQury with this object
    $.cnhkImageFrame = function( options ){
        var data = $( '#wpwrap' ).data( 'cnhkImageFrame' );
        if ( undefined === data ) {
            $( '#wpwrap' ).data( 'cnhkImageFrame', new cnhkImageFrame( options ) );
        } else {
            data.options = $.extend( {}, data.defaultOptions, options );
            data.wpMediaFrame.open();
        }
    };
    
})(jQuery);
