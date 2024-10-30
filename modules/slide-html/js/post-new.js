/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    var spinner = $( '<span class="preloader" style="width:20px;height:20px;display:inline-block;margin-top:4px;"><img src="/wp-admin/images/spinner.gif"/></span>' );
    
    var layerCopy = null;
    var isCopy = false;
    
    // update slide preview
    function updatePreview( id ) {
        var slide = $( '.slide' ).has( '.slide-id[value="' + id + '"]' );
        slide.find( '.slide-preview' ).empty();
        var preview = $( '<div class="slide-main-content"></div>' );
        slide.find( '.slide-preview' ).append( preview );
        var content = cnhkSlideHandler['html'].getSlideContent( id );
        preview.empty().append( content );
        
        preview.cnhkSlideWrap({
            fillMode: $( '#options-_FillMode' ).val(),
            boxWidth: $( '#options-w' ).val(),
            boxHeight: $( '#options-h' ).val(),
        });
        preview.cnhkSlideWrap( 'init' );
    }
    
    // update the preview after layer edited
    $( document ).on( 'htmlSlideUpdated', function( ev, id ){
        updatePreview( id );
    } );
    
    // update preview on slide accordion activated
    $( document ).on( 'activate', '#slides-list', function( ev, ui ) {
        if ( ui.newPanel.length && ui.newPanel.parents( '.slide' ).find( '.slide-type[value="html"]' ).length ) {
            var id = ui.newPanel.parents( '.slide' ).find( '.slide-id' ).val();
            updatePreview( id );
        }
    } );
    
    // update preview before slide accordion activated
    $( document ).on( 'beforeActivate', '#slides-list', function( ev, ui ) {
        if ( ui.oldPanel.length && ui.oldPanel.parents( '.slide' ).find( '.slide-type[value="html"]' ).length ) {
            var preview = ui.oldPanel.find( '.slide-main-content' );
            preview.empty().data( 'cnhkSlideWrap', undefined );
        }
        if ( ui.newPanel.length && ui.newPanel.parents( '.slide' ).find( '.slide-type[value="html"]' ).length ) {
            var id = ui.newPanel.parents( '.slide' ).find( '.slide-id' ).val();
            updatePreview( id );
        }
    } );
    
    // update preview on slide param accordion closed
    $( document ).on( 'paramDeactivate', '.slide', function ( ev, ui ) {
        if ( ui.oldPanel.length ) {
            if ( ui.oldPanel.parents( '.slide' ).find( '.slide-type[value="html"]' ).length ) {
                var id = ui.oldPanel.parents( '.slide' ).find( '.slide-id' ).val();
                updatePreview( id );
            }
        }
    } );
    
    // selecting a background image
    $( document ).on( 'click', '.slide-bg-image', function( ev ){
        ev.preventDefault();
        $.cnhkImageFrame({
            url: $( this ).siblings( 'input[type="hidden"]' ),
            mime: ['image/jpeg', 'image/png'],
            notice: $( this ).siblings( '.slide-bg-notice' ),
        });
    } );
    
    // background image selected ( valid image );
    $( document ).on( 'change', '.slide-bg-image-url', function ( ev ) {
        var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        if ( $( this ).val() ) {
            $( this ).siblings( '.slide-bg-image-pos,.slide-bg-remove-image' ).removeAttr( 'disabled' );
        } else {
            $( this ).siblings( '.slide-bg-image-pos' ).attr( 'disabled', 'disabled' );
        }
        updatePreview( id );
    } );
    
    // remove background image
    $( document ).on( 'click', '.slide-bg-remove-image', function ( ev ) {
        ev.preventDefault();
        var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        $( this ).siblings( '.slide-bg-image-url' ).val( '' );
        $( this ).attr( 'disabled', 'disabled' );
        updatePreview( id );
    } );
    
    // background opacity slider moved
    $( document ).on( 'slBgOpacityChange', function( ev, id, value ) {
        $( 'input[name="slides[' + id + '][bgOpacity]"]' ).val( value );
        updatePreview( id );
    } );
    
    // add new layer
    $( document ).on( 'click', '.add-layer', function( ev ) {
        ev.preventDefault();
        var slideId = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        var ph = $( this ).siblings( '.add-layer-ph' );
        ph.append( spinner );
        
        var formData = {
            nonce: cnhkAjaxNonce,
            slideId: slideId,
            action: 'cnhk_add_layer',
        };
        
        // if it's a copy
        if ( isCopy ) {
            formData['original-slide-id'] = layerCopy.slideid;
            formData['original-layer-id'] = layerCopy.layerid;
            var layerDiv = $( '.layer-id[value="' + layerCopy.layerid + '"] ~ .parent-slide-id[value="' + layerCopy.slideid + '"]' ).parents( '.layer' );
            
            layerDiv.find( 'input,select,textarea' ).each(function(){
                if ( $( this ).attr( 'name' ) ) {
                    if ( 'CHECKBOX' == $( this ).prop( 'tagName' ) ) {
                        if ( ! $( this ).prop( 'checked' ) ) return;
                    }
                    formData[$( this ).attr( 'name' )] = $( this ).val();
                }
            });
        }
        
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: formData,
            success: function ( data, textStatus, XMLHttpRequest ) {
                ph.empty();
                var newLayer = $( data );
                var layerList = ph.parents( '.slide-params' ).find( '.layers' );
                layerList.append( newLayer );
                if ( layerList.hasClass( 'ui-accordion' ) ) {
                    var index = layerList.find( '.layer' ).length - 1;
                    layerList.accordion( 'refresh' ).accordion( 'option', 'active', index );
                } else {
                    layerList.accordion({
                        header: ' .layer-head',
                        collapsible: true,
                        heightStyle: 'content',
                        active: false,
                    });
                }
            },
            error: function ( MLHttpRequest, textStatus, errorThrown ) {
                ph.empty();
            }
        });
        
    } );
    
    // remove layer
    $( document ).on( 'click', '.remove-layer', function (){
        $( this ).parents( '.layer' ).remove();
    } );
    
    // edit layer content
    $( document ).on( 'click', '.layer-edit', function (){
        var layerId = $( this ).parents( '.layer' ).find( '.layer-id' ).val();
        var slideId = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        $.cnhkLayerEditor({
            layerId: layerId,
            slideId: slideId,
        });
        $.cnhkLayerEditor( 'show' );
    } );
    
    // layer styling
    $( document ).on( 'click', '.layer-styling', function( ev ) {
        ev.stopPropagation();
        var parentSlide = $( this ).parents( '.slide' );
        var index = parentSlide.find( '.layer-styling' ).index( this );
        $.layerStylingControl({
            slide: $( this ).parents( '.slide' ),
            slideId: $( this ).parents( '.slide' ).find( '.slide-id' ).val(),
            activeLI: index,
        });
    } );
    
    // init layer on slide duplication (accordion and sortable)
    $( document ).on( 'slideAdded', '#slides-list', function ( ev, slide, index ) {
        if ( slide.find( '.layers' ).length ) {
                slide.find( '.layers' ).sortable({
                items: '>.layer',
                handle: ' .dashicons-sort',
            }).accordion({
                header: '.layer-head',
                collapsible: true,
                heightStyle: 'content',
                active: false,
            });
        }
        if ( slide.find( '.slide-type[value="html"]' ).length ) {
            var id = slide.find( '.slide-id' ).val();
            slide.find( '.slide-bg-color' ).wpColorPicker({
                defaultColor: '',
                change: function( ev, ui ) {
                    $( document ).trigger( 'slBgColorChange', [id, ui.color.toString] );
                    updatePreview( id );
                },
                clear: function( ev, ui ) {
                    $( document ).trigger( 'slBgColorClear', [id] );
                    updatePreview( id );
                },
            });
            var bgOpacity = slide.find( '.slide-bg-opacity' );
            bgOpacity.css({
                width: '85%',
                marginLeft: '5%',
            }).slider({
                value: ( ( bgOpacity.prev().val() )? parseFloat( bgOpacity.prev().val() ) : parseFloat( bgOpacity.attr( 'data-max' ) ) ),
                min: parseFloat( bgOpacity.attr( 'data-min' ) ),
                max: parseFloat( bgOpacity.attr( 'data-max' ) ),
                step: parseFloat( bgOpacity.attr( 'data-step' ) ),
                change: function( ev, ui ) {
                    $( document ).trigger( 'slBgOpacityChange', [id, ui.value] );
                    updatePreview( id );
                },
            });
        }
    } );
    
    // copy layer
    $( document ).on( 'click', '.layer-duplicate', function() {
        var slideId = $( this ).parents( '.layer' ).find( '.parent-slide-id' ).val();
        var layerId = $( this ).parents( '.layer' ).find( '.layer-id' ).val();
        layerCopy = {
            slideid: slideId,
            layerid: layerId,
        };
        $( '.paste-layer-copy' ).removeAttr( 'disabled' ).removeClass( 'button-secondary' ).addClass( 'button-primary' );
        isCopy = true;
    } );
    
    // paste layer
    $( document ).on( 'click', '.paste-layer-copy', function ( ev ) {
        ev.preventDefault();
        $( this ).siblings( '.add-layer' ).trigger( 'click' );
    } );
    
    // allow layer pasting on slide added ( if any copy exists )
    $( document ).on( 'slideAdded', '#slides-list', function( ev, slide, index ){
        if ( isCopy ) {
            slide.find( '.paste-layer-copy' ).removeAttr( 'disabled' ).removeClass( 'button-secondary' ).addClass( 'button-primary' );
        }
    } );
    
    // static content
    $( document ).on( 'click', '.setStatic', function() {
        if ( $( this ).prop( 'checked' ) ) {
            $( this ).parents( '.slide' ).find( '.static-content-head' ).text( slideHTMLPostNewLocale.staticContent );
        } else {
            $( this ).parents( '.slide' ).find( '.static-content-head' ).empty();
        }
    } );
    
    $(function(){
        
        // move layer editor markup next to caption editor
        $( '#wpwrap' ).prepend( $( '#layer-editor-wrap' ) );
        
        // init layer list
        $( '#slides-list .layers' ).sortable({
            items: '>.layer',
            handle: ' .dashicons-sort',
        }).accordion({
            header: '.layer-head',
            collapsible: true,
            heightStyle: 'content',
            active: false,
        });
        
        // init background-color picker
        $( '.slhtml-bg-color-field .slide-bg-color' ).each(function(){
            var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
            $( this ).wpColorPicker({
                defaultColor: $( this ).val(),
                change: function( ev, ui ) {
                    $( document ).trigger( 'slBgColorChange', [id, ui.color.toString] );
                    updatePreview( id );
                },
                clear: function( ev, ui ) {
                    $( document ).trigger( 'slBgColorClear', [id] );
                    updatePreview( id );
                },
            });
        });
        
        // init background-opacity slider
        $( '.slhtml-bg-color-field .slide-bg-opacity' ).each(function(){
            var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
            $( this ).css({
                width: '85%',
                marginLeft: '5%',
            });
            $( this ).slider({
                value: ( ( $( this ).prev().val() )? parseFloat( $( this ).prev().val() ) : parseFloat( $( this ).attr( 'data-max' ) ) ),
                min: parseFloat( $( this ).attr( 'data-min' ) ),
                max: parseFloat( $( this ).attr( 'data-max' ) ),
                step: parseFloat( $( this ).attr( 'data-step' ) ),
                change: function( ev, ui ) {
                    $( document ).trigger( 'slBgOpacityChange', [id, ui.value] );
                    updatePreview( id );
                },
            });
        });
    
    });
    
})( jQuery );
