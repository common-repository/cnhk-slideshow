/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function($){
    
    var cnhkEditorMedia = function( editor ) {
        
        this.editor = editor;
        
        this.wpMediaFrame = wp.media.frames.frame = wp.media( {
            title: cnhkEditorMediaLocale.selectImage,
            button: {
                text: cnhkEditorMediaLocale.insert,
            },
            multiple: false
        } );
        
        var that = this;
        
        this.wpMediaFrame.on( 'select' , function(){
            var attachment = that.wpMediaFrame.state().get( 'selection' ).first().toJSON();
            var isValidImage = attachment.url.match( /\.(jpg)|(jpeg)|(png)|(gif)$/i );
            if ( isValidImage ) {
                that.editor.insertImage( attachment.url );
            }
        });
        
        this.wpMediaFrame.open();
        
        return this;
    };
    
    $.cnhkEditorMedia = function( editor ){
        var data = $( '#wpwrap' ).data( 'cnhkEditorMedia' );
        if ( undefined === data ) {
            $( '#wpwrap' ).data( 'cnhkEditorMedia', new cnhkEditorMedia( editor ) );
        } else {
            data.editor = editor;
            data.wpMediaFrame.open();
        }
    };
    
})(jQuery);
