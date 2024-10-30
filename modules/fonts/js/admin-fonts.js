/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var cnhkAdminFonts = function(){
        
        this.evt();
        
    }
    
    cnhkAdminFonts.prototype = {
        constructor: cnhkAdminFonts,
        
        evt: function(){
            /**
             *  Parse new font code
             */
            $( document ).on( 'click', '#parse-new-font', function ( ev ) {
                ev.preventDefault();
                var code = $( '#new-font-pastecode' ).val();
                var reg = /(\/\/fonts\.googleapis\.com\/css\?family=(([^:]+)[^)'"]+))|(google:[^'"]+['"](([^:]+)[^'"]+))/i
                var result = reg.exec( code );
                
                if ( null === result ) {
                    $( '#parse-result' ).html( '<strong style="color:red;background-color:#fff5f3;">' + cnhkFontsLocale.noFont + '</strong>' );
                    $( '#new-font-url' ).val( '' );
                    $( '#new-font-family' ).val( '' );
                } else {
                    var fName = '';
                    var fUrl = '';
                    
                    if ( undefined === result[1] ) {
                        fUrl = result[5];
                        fName = result[6].replace( '+', ' ' );
                    } else {
                        fUrl = result[2];
                        fName = result[3].replace( '+', ' ' );
                    }
                    $( '#parse-result' ).html( '<strong style="color:#08c308;background-color:#f3fff5;">' + cnhkFontsLocale.fontFamily + ': ' + fName + '</strong>' );
                    
                    if ( 2 < fUrl.split( ':' ).length ) {
                        var subset = fUrl.split( ':' )[2];
                        var newUrl = fUrl.replace( ':' + subset, '&subset=' + subset );
                        fUrl = newUrl;
                    }
                    $( '#new-font-url' ).val( fUrl );
                    $( '#new-font-family' ).val( fName );
                }
                
            } );
            
            // save new font
            $( document ).on( 'click', '#save-new-font', function(){
                if ( ! $( '#new-font-name' ).val() || ! $( '#new-font-url' ).val() ) {
                    return false;
                }
            } );
            
            $( document ).on( 'click', '.row-actions .delete>a', function ( ev ) {
                ev.preventDefault();
                var $tr = $( this ).parents( 'tr' );
                if ( 1 == $tr.parent().find( 'tr' ).length ) {
                    var emptyRow = $( '<tr class="alternate"><td colspan="4" style="text-align:center;"><em>' + cnhkFontsLocale.noMoreFont + '</em></td></tr>' );
                    $tr.hide( 500, function(){ $tr.replaceWith( emptyRow ); } );
                } else {
                    $tr.hide( 500, function(){ $tr.remove(); } );
                }
            } );
            
        },
        
    }
    
    $(function(){
        $.cnhkAdminFonts = new cnhkAdminFonts();
    });
    
})( jQuery );
