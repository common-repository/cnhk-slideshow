/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    
    var preloader = $( '<p class="preloader" style="text-align:center;"><img src="/wp-admin/images/spinner.gif"/></p>' );
    
    // info on duplicated slide
    var slideCopy = null;
    
    // update template input value when choosing a template
    $( document ).on( 'click', 'input.choose-template', function () {
        $( 'input#new-template' ).val( $( this ).data( 'slug' ) );
        return true;
    } );
    
    // on post save
    $( document ).on( 'submit', 'form#post', function ( ev ) {
        if ( ! $( 'input#new-template' ).length ) {
            /**
             *  Normal post saving
             *  
             *  A custom event is triggered so modules can make additional tasks.
             *  If any module modifies the canSave data attribute of #post, no saving is performed
             */
            $( 'form#post' ).trigger( 'cnhkSavePost' );
            if ( $( this ).data( 'canSave' ) ) {
                return true;
            } else {
                ev.preventDefault();
                $( '#submitdiv .spinner' ).remove();
                $( '#submitdiv' ).find( 'button,input[type="submit"]' ).removeClass( 'disabled' );
                return false;
            }
        }
    } );
    
    // select input with tip
    $( document ).on( 'change', 'select.with-tip', function( ev ) {
        var tip = $( this ).find( 'option:selected' ).data( 'tip' );
        if ( undefined == tip) {
            tip = '';
        }
        var target = $( this ).siblings( '.desc' ).find( '.select-tip' );
        target.html( tip );
    } );
    
    // remove slide
    $( document ).on( 'click', '.remove-slide', function( ev ) {
        ev.stopPropagation();
        $( this ).parents( '.slide' ).hide( 200, function() {
            $( this ).remove();
        } )
    } );
    
    // add slide button
    $( document ).on( 'click', '#add-slide', function( ev ) {
        ev.preventDefault();
        ev.stopPropagation();
        if ( '' == $( '#new-slide-type' ).val() ) return;
        $( '#slides-list' ).append( preloader.clone() );
        
        var formData = {
            nonce: cnhkAjaxNonce,
            type: $( '#new-slide-type' ).val(),
            action: 'cnhk_add_slide',
            template: $( 'input[name="template"]' ).val(),
        };
        
        if ( slideCopy ) {
            // at this point, we're not adding a slide but pasting the copy of existing one
            
            formData['type'] = slideCopy.type;
            formData['copy-id'] = slideCopy.id;
            var slideDiv = $( '.slide-id[value="' + slideCopy.id + '"]' ).parents( '.slide' );
            slideDiv.find( 'input,select,textarea' ).each(function(){
                // fill formData with the original slide's data
                if ( $( this ).attr( 'name' ) ) {
                    if ( 'CHECKBOX$' == $( this ).prop( 'tagName' ) ) {
                        if ( ! $( this ).prop( 'checked' ) ) return;
                    }
                    formData[$( this ).attr( 'name' )] = $( this ).val();
                }
            });
            slideCopy = null;
        }
        
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: formData,
            success: function ( data, textStatus, XMLHttpRequest ) {
                $( '.preloader' ).remove();
                var slide = $( data );
                var index = ( $( '#slides-list .slide' ).length );
                $( '#slides-list' ).append( slide );
                $( '#slides-list' ).trigger( 'slideAdded', [ slide, index ] );
            },
            error: function ( MLHttpRequest, textStatus, errorThrown ) {
                $( '.preloader' ).remove();
            }
        });
    } );
    
    // duplicate slide button
    $( document ).on( 'click', '.duplicate-slide', function ( ev ) {
        ev.stopPropagation();
        ev.preventDefault();
        slideCopy = {};
        var type = $( this ).parents( '.slide' ).find( '.slide-type' ).val();
        if ( $( '#new-slide-type option[value="' + type + '"]' ).length ) {
            $( '#new-slide-type' ).val( type );
            slideCopy.id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
            slideCopy.type = type;
            $( '#add-slide' ).trigger( 'click' );
        }
    } );
    
    // preview single slide
    $( document ).on( 'click', '.preview-slide', function ( ev ) {
        var id = $( this ).parents( '.slide' ).find( '.slide-id' ).val();
        var tH = cnhkTemplateHandler[ $( 'input[name="template"]' ).val() ];
        tH.previewSingleSlide( id );
    } );
    
    // slide and slide params accordion
    $( document ).on( 'slideAdded', '#slides-list', function ( ev, slide, index ) {
        $( '#slides-list' ).accordion( 'refresh' ).accordion( 'option', 'active', index );
        slide.find( '.slide-params' ).each( function() {
            $( this ).accordion({
                header: ' .param-header',
                collapsible: false,
                heightStyle: 'content',
                active: 0,
            });
        });
        
        // build fx-picker in the newly added slide
        if ( slide.find( '.fx-autopicker' ).length ) {
            var picker = slide.find( '.fx-autopicker' );
            var pickerOptions = {
                root: picker.attr( 'data-root' ),
                code: picker.val(),
            };
            
            // if fx name not found in existing collections (PHP side), build the saver
            if ( picker.siblings( '.fx-autosaver' ).length ) {
                var autosaver = picker.siblings( '.fx-autosaver' );
                autosaver.cnhkFxSaver({
                    root: autosaver.attr( 'data-root' ),
                    codeElem: picker,
                    autoRemove: true,
                });
                pickerOptions['saverElem'] = autosaver;
            }
            
            picker.cnhkFxPicker( pickerOptions );
        }
        
    } );
    
    // window resize
    $( window ).resize( function() {
        $( 'td.slide-preview .slide-main-content' ).each( function () {
            var data = $( this ).data( 'cnhkSlideWrap' );
            if ( data && $( this ).parents( '.slide-inside' ).hasClass( 'ui-accordion-content-active' ) ) {
                // slide panel is open
                data.scale();
            }
        } );
    } );
    
    // click on the preview button
    $( document ).on( 'click', '#preview-slideshow', function ( ev ) {
        ev.preventDefault();
        if ( $( '#cnhkss-slides-param .slide' ).length ) {
            $( document ).trigger( 'beforeSliderPreview' );
            var tH = cnhkTemplateHandler[ $( 'input[name="template"]' ).val() ];
            tH.previewSlideshow();
        }
    } );
    
    // update state for boxed slider related fields
    function checkBoxingState() {
        if ( $( '#boxed-inputs-alt' ).length ) {
            if ( $( '#options-b' ).prop( 'checked' ) ) {
                $( '#boxed-inputs-alt input' ).attr( 'disabled', 'disabled' );
                $( '#boxed-inputs' ).find( 'input,select' ).removeAttr( 'disabled' );
            } else {
                $( '#boxed-inputs-alt input' ).removeAttr( 'disabled' );
                $( '#boxed-inputs' ).find( 'input,select' ).attr( 'disabled', 'disabled' );
            }
        } else {
            return false;
        }
    }
    
    // boxed slider checkbox clicked
    $( document ).on( 'click', '#options-b', function() {
        checkBoxingState();
    } );
    
    // update state for every slider background related fields
    function checkSliderBg() {
        if ( $( '#slider-bg-src' ).val() ) {
            $( '#slider-bg-inputs-alt input' ).attr( 'disabled', 'disabled' );
            $( '#slider-bg-inputs' ).find( 'input,select' ).removeAttr( 'disabled' );
            $( '#clear-slider-bg' ).removeAttr( 'disabled' );
        } else {
            $( '#slider-bg-inputs-alt input' ).removeAttr( 'disabled' );
            $( '#slider-bg-inputs' ).find( 'input,select' ).attr( 'disabled', 'disabled' );
            $( '#clear-slider-bg' ).attr( 'disabled', 'disabled' );
        }
    }
    
    // on slider background url changed
    $( document ).on( 'change', '#slider-bg-src', function(){checkSliderBg()} );
    
    // on click onto the select background button
    $( document ).on( 'click', '#select-slider-bg', function( ev ) {
        ev.preventDefault();
        $.cnhkImageFrame({
            url: $( '#slider-bg-src' ),
            mime: ['image/jpeg', 'image/png'],
            notice: $( '#slider-bg-notice' ),
        });
    } );
    
    // click on the clear background (slider background)
    $( document ).on( 'click', '#clear-slider-bg', function( ev ) {
        ev.preventDefault();
        $( '#slider-bg-src' ).val( '' );
        $( this ).prop( 'disabled', true );
    } );
    
    // slide name edited
    $( document ).on( 'change', '.slide-name', function() {
        if ( ( $( this ).val() ) ) {
            $( this ).parents( '.slide' ).find( '.slide-name-head' ).text( $( this ).val() );
        } else {
            $( this ).parents( '.slide' ).find( '.slide-name-head' ).html( '&nbsp;' );
        }
    } );
    
    // caption name edited
    $( document ).on( 'change', '.caption-name', function() {
        if ( ( $( this ).val() ) ) {
            $( this ).parents( '.caption' ).find( '.caption-name-head' ).text( $( this ).val() );
        } else {
            $( this ).parents( '.caption' ).find( '.caption-name-head' ).html( '&nbsp;' );
        }
    } );
    
    // layer name edited
    $( document ).on( 'change', '.layer-name', function() {
        if ( ( $( this ).val() ) ) {
            $( this ).parents( '.layer' ).find( '.layer-name-head' ).text( $( this ).val() );
        } else {
            $( this ).parents( '.layer' ).find( '.layer-name-head' ).html( '&nbsp;' );
        }
    } );
    
	// On DOM ready
	$(function () {
		// hide the visibility field ("public|private|password protected"). not yet supported
        $( '#visibility' ).hide();
        
        $( '.color-picker' ).wpColorPicker();
        
        checkBoxingState();
        checkSliderBg();
        
        // If a template has been chosen, add the preview button
        if ( $( 'input[name="template"]' ).length ) {
            $( '#save-action' ).prepend( '<button class="button-secondary" id="preview-slideshow">' + mainScriptLocale.preview + '</button>' );
        } else {
            // else force the user to choose template
            $( '#save-post,#publish' ).attr( 'disabled', 'disabled' );
        }
        
		// slides list sortable
        $( '#slides-list' ).sortable({
            items: ' .slide',
            handle: ' .dashicons-sort',
            stop: function( ev, ui ) {
                $( '#slides-list' ).trigger( 'stopSorting', ui );
            },
        });
        
        // slides list accordion
        $( '#slides-list' ).accordion({
            header: ' .slide-header',
            collapsible: true,
            heightStyle: 'content',
            active: false,
            activate: function ( ev, ui ) {
                $( '#slides-list' ).trigger( 'activate', ui );
            },
            beforeActivate: function ( ev, ui ) {
                $( '#slides-list' ).trigger( 'beforeActivate', ui );
            }
        });
        
        // slide inner parameters accordion
        $( '.slide-params' ).accordion({
            header: ' .param-header',
            collapsible: false,
            heightStyle: 'content',
            active: 0,
            activate: function ( ev, ui ) {
                if ( ui.oldPanel.length ) {
                    var slideId = ui.oldPanel.parents( '.slide' ).find( '.slide-id' ).val();
                    $( '.slide' ).has( '.slide-id[value="' + slideId + '"]' ).trigger( 'paramDeactivate', ui );
                }
            },
        });
        
        // initialize every fx-picker on DOM loaded
        $( '.fx-autopicker' ).each(function(){
            var pickerOptions = {
                root: $( this ).attr( 'data-root' ),
                code: $( this ).val(),
            };
            
            if ( $( this ).siblings( '.fx-autosaver' ).length ) {
                var autosaver = $( this ).siblings( '.fx-autosaver' );
                autosaver.cnhkFxSaver({
                    root: autosaver.attr( 'data-root' ),
                    codeElem: $( this ),
                    autoRemove: true,
                });
                pickerOptions['saverElem'] = autosaver;
            }
            
            $( this ).cnhkFxPicker( pickerOptions );
        });
        
        // Set up default canSave data of #post (saving allowed by default)
        $( 'form#post' ).data( 'canSave', true );
        
    });
    
})( jQuery );
