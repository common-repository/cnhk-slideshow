/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ) {
    "use strict";
    
    var slideHandlerHTML = function() {
        
        this.getSlideContent = function( id ) {
            var that = this;
            var layers = '';
            $( '.slide-id[value="' + id + '"]' ).parents( '.slide' ).find( '.layer' ).each(function (){
                var layerId = $( this ).find( '.layer-id' ).val();
                var layerContent = that.getLayerMarkup( id, layerId );
                if ( layerContent ) {
                    layers += layerContent;
                }
            });
            var container = $( '<div />' );
            
            if ( layers ) {
                container.append( $( layers ) );
            }
            
            var wrap = $( '<div />' );
            
            var isStatic = $( 'input[name="slides[' + id + '][isStatic]"' ).prop( 'checked' );
            
            if ( $( 'input[name="slides[' + id + '][bgImage]"]' ).val() && ! isStatic ) {
                wrap.append( $( '<img />' ).attr({
                    src: $( 'input[name="slides[' + id + '][bgImage]"]' ).val(),
                    alt: '',
                    'data-u': 'image',
                }) );
            }
            wrap.append( container );
            
            var bgColor = $( 'input[name="slides[' + id + '][bgColor]"]' ).val();
            var bgOpacity = parseFloat( $( 'input[name="slides[' + id + '][bgOpacity]"]' ).val() );

            if ( bgColor && 0 != bgOpacity ) {
                var rgb = jssorFunc.hexToRgb( bgColor );
                container.css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + bgOpacity + ')' );
            }
            container.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: $( '#options-w' ).val(),
                height: $( '#options-h' ).val(),
            });
            return wrap[0].innerHTML;
        };
        
        this.getLayerMarkup = function( slideId, id ) {
            var layer = $( '.layer-id[value="' + id + '"]+.parent-slide-id[value="' + slideId + '"]' ).parents( '.layer' );
            if ( ! layer.length ) return;
            
            var stObj = JSON.parse( layer.find( '.layer-style' ).val() );
            
            var layerDiv = $( '<div />' ).css({
                position: 'absolute',
                left: stObj.left,
                top: stObj.top,
                width: stObj.w,
                height: stObj.h,
                lineHeight: stObj.le + 'px',
            }).addClass( 'layer-wrap' );
            if ( stObj.fgColor ) {
                layerDiv.css( 'color', stObj.fgColor );
            }
            if ( stObj.font ) {
                layerDiv.css( 'font-family', cnhkFonts[ stObj.font ] );
            }
            var bdDiv = $( '<div />' ).addClass( 'layer-border' ).css({
                width: '100%',
                height: '100%',
            });
            var A = ( stObj.bgColor && 0 != stObj.bgOpacity )? true : false;
            var C = ( 'none' != stObj.bdStyle )? true : false;
            if ( A ) {
                var rgb = jssorFunc.hexToRgb( stObj.bgColor );
                bdDiv.css( 'background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + stObj.bgOpacity + ')' );
            }
            if ( C ) {
                bdDiv.css( 'border', stObj.bdWidth + 'px ' + stObj.bdStyle + ' ' + stObj.bdColor );
            }
            
            bdDiv.css({
                borderTopLeftRadius: stObj.bdrTL,
                borderTopRightRadius: stObj.bdrTR,
                borderBottomLeftRadius: stObj.bdrBL,
                borderBottomRightRadius: stObj.bdrBR,
            });
            
            var padDiv = $( '<div />' ).addClass( 'layer-padding' );
            padDiv.css( 'padding', stObj.padv + '% ' + stObj.padh + '%' );
            
            layerDiv.append( bdDiv.append( padDiv.html( layer.find( '.layer-html' ).val() ) ) );
            return layerDiv[0].outerHTML;
        };
        
    }
    
    $(function(){
        cnhkSlideHandler['html'] = new slideHandlerHTML();
    });
    
})( jQuery );
