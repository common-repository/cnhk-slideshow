/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
    
    "use strict";
    
    var preloader = $( '<span class="preloader" style="width:20px;height:20px;display:inline-block;vertical-align:middle;"><img src="/wp-admin/images/spinner.gif"/></span>' );
    var spinnerP = $( '<p class="preloader" style="text-align:center;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></p>' );
    
    var captionCopy = null;
    var doCopy = false;
    
    /**
     *  refresh accordion/tabs on new caption added
     *  
     *  @param [jQuery] caption, the newly added caption retrieved by ajax
     *  @return void
     *  
     */
    function refreshCaptionList( caption ) {
        // caption editor tabs
        caption.find( '.tabs' ).tabs({
            active: 0,
        });
        // caption accordion
        var index = $( '.captions-list .caption' ).length - 1;
        $( '.captions-list' ).accordion( 'refresh' ).accordion( 'option', 'active', index );
    }
    
    // create sortable and accordion on slide added (or duplicated)
    $( document ).on( 'slideAdded', '#slides-list', function ( ev, slide, index ) {
        slide.find( '.captions-list' ).accordion({ header: ' .caption-head',
            collapsible: true,
            heightStyle: 'content',
            active: false,
        }).sortable( {
            items: ' .caption',
            handle: ' .dashicons-sort',
        } );
    } );
    
    // add caption
    $( document ).on( 'click', '.slide .add-caption', function( ev ) {
        ev.preventDefault();
        ev.stopPropagation();
        var slide = $( this ).parents( '.slide' ).find( 'input.slide-id' ).val();
        var preloaderPh = $( this ).siblings( '.add-caption-ph' );
        var formData = {
            nonce: cnhkAjaxNonce,
            slide: slide,
            action: 'cnhk_add_caption', 
        };
        if ( doCopy ) {
            // pasting a copy
            
            formData['o-slide-id'] = captionCopy.oSlId;
            formData['o-ca-id'] = captionCopy.oCaId;
            var captionDataDiv = $( '.caption-id[value="' + captionCopy.oCaId + '"] ~ .parent-slide-id[value="' + captionCopy.oSlId + '"]' ).parents( '.caption' );
            var captionObj = {};
            
            // populate formData with the copy
            captionDataDiv.find( 'input,select,textarea' ).each(function(){
                if ( $( this ).attr( 'name' ) ) {
                    if ( 'CHECKBOX' == $( this ).prop( 'tagName' ) ) {
                        if ( ! $( this ).prop( 'checked' ) ) return;
                    }
                    formData[$( this ).attr( 'name' )] = $( this ).val();
                }
            });
            
            doCopy = false;
        }
        
        preloaderPh.append( preloader );
        
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: formData,
            success: function ( data, textStatus, XMLHttpRequest ) {
                $( '.preloader' ).remove();
                var newCaption = $( data );
                preloaderPh.parents( '.slide' ).find( '.captions-list' ).append( newCaption );
                if ( preloaderPh.parents( '.slide' ).find( '.captions-list' ).hasClass( 'ui-accordion' ) ) {
                    refreshCaptionList( newCaption );
                } else {
                    preloaderPh.parents( '.slide' ).find( '.captions-list' ).accordion({
                        header: ' .caption-head',
                        collapsible: true,
                        heightStyle: 'content',
                        active: false,
                    });
                }
                if ( ! newCaption.find( '.tabs' ).hasClass( 'ui-tabs' ) ) {
                    newCaption.find( '.tabs' ).tabs({
                        active: 0,
                    });
                }
            },
            error: function ( MLHttpRequest, textStatus, errorThrown ) {
                $( '.preloader' ).remove();
            }
        });
        
    } );
    
    // open caption styling form on click on the button
    $( document ).on( 'click', '.caption-styling', function( ev ) {
        ev.stopPropagation();
        var parentSlide = $( this ).parents( '.slide' );
        var index = parentSlide.find( '.caption-styling' ).index( this );
        $.captionStylingControl({
            slide: $( this ).parents( '.slide' ),
            activeCI: index,
        });
    } );
    
    // duplicate caption
    $( document ).on( 'click', '.caption-duplicate', function ( ev ) {
        ev.stopPropagation();
        captionCopy = {
            oCaId: $( this ).parents( '.caption' ).find( '.caption-id' ).val(),
            oSlId: $( this ).parents( '.slide' ).find( '.slide-id' ).val(),
        },
        $( 'button.paste-caption-copy' ).removeAttr( 'disabled' ).removeClass( 'button-secondary' ).addClass( 'button-primary' );
    } );
    
    // paste caption copy
    $( document ).on( 'click', '.paste-caption-copy', function ( ev ) {
        ev.stopPropagation();
        ev.preventDefault();
        doCopy = true;
        $( this ).siblings( '.add-caption' ).trigger( 'click' );
    } );
    
    // remove caption
    $( document ).on( 'click', '#cnhkss-slides-param .remove-caption', function ( ev ) {
        ev.stopPropagation();
        $( this ).parents( '.caption' ).hide( 500, function(){
            $( this ).remove();
        } );
    } );
    
    // open the caption timing form on click on the button
    $( document ).on( 'click', '.caption-timing', function ( ev ) {
        ev.stopPropagation();
        $.captionTimingControl( 'option', {
            slide: $( this ).parents( '.slide' ),
            activeCaptionId: $( this ).parents( '.caption' ).find( '.caption-id' ).val(),
        });
    } );
    
    // edit caption's content
    $( document ).on( 'click', '.caption-edit', function( ev ) {
        var caId = $( this ).parents( '.caption' ).find( '.caption-id' ).val();
        var slideId = $( this ).parents( '.caption' ).find( '.parent-slide-id' ).val();
        $.cnhkCaptionEditor({
            captionId: caId,
            slideId: slideId,
        });
        $.cnhkCaptionEditor( 'show' );
    } );
    
    
    // on DOM ready
    $(function(){
        $( '#wpwrap' ).prepend( $( '#caption-editor-wrap' ) );
        
		// captions list
        $( '.captions-list' ).sortable( {
            items: ' .caption',
            handle: ' .dashicons-sort',
        } );
        
        // caption params
        $( '.captions-list' ).accordion({
            header: ' .caption-head',
            collapsible: true,
            heightStyle: 'content',
            active: false,
        });
        
    });
    
})( jQuery );
