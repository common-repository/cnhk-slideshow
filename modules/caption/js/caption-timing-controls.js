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
    
    var captionTimingControl = function( options ) {
        
        this.options = {};
        
        var defaultOptions = {
            slide: null,
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        this.content;
        this.form;
        this.controlMarkup; // for .du
        this.controlMarkup2; // for .du2
        this.controlMarkup3; // for .du3
        this.slide;
        this.slideId;
        
        // play in duration
        this.du;
        
        // play out
        this.du2;
        
        // immediate play out
        this.du3;
        
        this.captions = {};
        this.captionCount = 0;
        this.slider;
        
        // the current horizontal position of screen
        this.scrollHorz = 'left';
        
        // the current vertical position of screen
        this.scrollVert = 'top';
        
    };
    
    captionTimingControl.prototype = {
        
        constructor: captionTimingControl,
        
        option: function() {
            var name;
            if ( arguments.length === 0 ) {
                return this.options;
            }
            if ( arguments.length === 2 ) {
                this.options[ arguments[0] ] = arguments[1];
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
                    this.open();
                }
            }
            return this;
        },
        
        // load form from server (AJAX) or from #wpwrap
        loadForm: function() {
            
            var form = $( '#wpwrap' ).data( 'captionTimingForm' );
            if ( form ) {
                // already loaded
                this.form = form;
                this.controlMarkup = $( '#wpwrap' ).data( 'captionTimingControlMarkup' );
                this.controlMarkup2 = $( '#wpwrap' ).data( 'captionTimingControlMarkup2' );
                this.controlMarkup3 = $( '#wpwrap' ).data( 'captionTimingControlMarkup3' );
            } else {
                // first time using this form, get it from server with a POST request
                
                var that = this;
                
                var formData = {
                    nonce : cnhkAjaxNonce,
                    action : 'cnhk_caption_timing_form',
                };
                
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: formData,
                    success: function ( resp, textStatus, XHR ) {
                        // form loaded, pick all sub-form and store everything into #wpwrap
                        
                        var $resp = $( resp );
                        var controlMarkup = $resp.find( '#du-list .du' ).remove();
                        var controlMarkup2 = $resp.find( '#du-list .du2' ).remove();
                        var controlMarkup3 = $resp.find( '#du-list .du3' ).remove();
                        that.form = $( '<div />' ).attr( 'id', 'timing-container' ).append( $resp );
                        that.controlMarkup = controlMarkup;
                        that.controlMarkup2 = controlMarkup2;
                        that.controlMarkup3 = controlMarkup3;
                        $( '#wpwrap' ).data( 'captionTimingForm', that.form );
                        $( '#wpwrap' ).data( 'captionTimingControlMarkup', controlMarkup );
                        $( '#wpwrap' ).data( 'captionTimingControlMarkup2', controlMarkup2 );
                        $( '#wpwrap' ).data( 'captionTimingControlMarkup3', controlMarkup3 );
                        
                        // first time use, bind event handlers
                        that.evt();
                        
                        // event handlers ready, notify that the form is loaded
                        $( document ).trigger( 'captionTimingFormLoaded' );
                    },
                    error: function ( request, textStatus, err ) {
                        console.error( 'ajax request failed - markup loading in timing controls' );
                        $.cnhkOverlay( 'hide', true );
                    }
                });
            }
            
        },
        
        // show form in overlay
        open: function() {
            this.resetPosition();
            var options = {
                width: 94,
                height: 85,
                title: captionTimingLocale.overlayTitle,
                content: spinner,
            };
            $.cnhkOverlay( options );
            $.cnhkOverlay( 'show' );
            this.loadForm();
            if ( undefined !== this.form ) {
                this.populate();
            }
        },
        
        // after resizing the preview (ui-resizable), update the caption object
        afterResize: function ( ev, ui ) {
            var barWidth = ui.element.parent().width();
            var relWidth = this.limit_cas( ui.size.width / barWidth );
            var relPos = this.limit_cas( ui.position.left / barWidth );
            var du = ui.element.parents( '.du,.du2' );
            var index = '';
            if ( du.hasClass( 'du2' ) ) {
                index = '2';
            } else {
                if ( ui.element.parents( '.du3' ).length ) {
                    index = '3';
                }
            }
            var id = du.attr( 'data-id' );
            this.captions[id]['cadu' + index] = relWidth;
            this.captions[id]['cas' + index] = relPos;
        },
        
        // after dragging the preview (ui-draggable), update the caption object
        afterDrag: function ( ev, ui ) {
            var barWidth = ui.helper.parent().width();
            var relPos = this.limit_cas( ui.position.left / barWidth );
            var du = ui.helper.parents( '.du,.du2' );
            var index = '';
            if ( du.hasClass( 'du2' ) ) {
                index = '2';
            } else {
                if ( ui.helper.parents( '.du3' ).length ) {
                    index = '3';
                }
            }
            var id = du.attr( 'data-id' );
            this.captions[id]['cas' + index] = relPos;
        },
        
        // change fx code in caption object
        setCode: function( id, fx, value ) {
            this.captions[id]['code' + fx] = value;
        },
        
        // set content of overlay
        populate: function() {
            this.setup();
            $.cnhkOverlay( { content: this.content } );
            this.resize();
        },
        
        // setup the form with caption data from the edit post page
        setup: function() {
            this.content = this.form.clone();
            
            this.slide = this.options.slide;
            this.slideId = this.slide.find( '.slide-id' ).val();
            
            this.du = parseFloat( this.slide.find( '.slide-du' ).val() );
            this.du2 = parseFloat( this.slide.find( '.slide-du2' ).val() );
            this.du3 = parseFloat( this.slide.find( '.slide-du3' ).val() );
            
            this.content.find( '#cadu' ).val( this.du );
            this.content.find( '#cadu2' ).val( this.du2 );
            
            this.captions = {};
            var captions = this.slide.find( '.captions-list .caption' );
            
            var count = 0;
            
            var that = this;
            
            $.each( captions, function( index ){
                var caItem = {};
                var tO = JSON.parse( $( this ).find( '.ca-timing' ).val() );
                var code = tO.cafx;
                var code2 = tO.cafx2;
                var code3 = tO.cafx3;
                var caId = $( this ).find( '.caption-id' ).val();
                if ( code || code2 || code3 ) {
                    caItem = {
                        code: code,
                        cadu: tO.cadu,
                        cas: tO.cas,
                        code2: code2,
                        cadu2: tO.cadu2,
                        cas2: tO.cas2,
                        code3: code3,
                        cadu3: tO.cadu3,
                        cas3: tO.cas3,
                        index: index,
                    };
                } else {
                    caItem = {
                        code: '',
                        cadu: 0,
                        cas: 0,
                        code2: '',
                        cadu2: 0,
                        cas2: 0,
                        code3: '',
                        cadu3: 0,
                        cas3: 0,
                        index: index,
                    };
                }
                that.captions[ caId ] = caItem;
                count++;
            } );
            
            this.captionCount = count;
            this.content.find( '#du-list,#du2-list' ).empty();
            
            for ( var id in this.captions ) {
                if ( 0 == this.captions[ id ]['cadu'] ) {
                    // no t1
                    this.captions[ id ]['cadu'] = 1 / this.captionCount;
                    this.captions[ id ]['cas'] = this.captions[ id ]['index'] * ( 1 / this.captionCount );
                }
                if ( 0 == this.captions[ id ]['cadu2']) {
                    // no t2
                    this.captions[ id ]['cadu2'] = 1 / this.captionCount;
                    this.captions[ id ]['cas2'] = ( this.captionCount - this.captions[ id ]['index'] - 1 ) * ( 1 / this.captionCount );
                }
                if ( 0 == this.captions[ id ]['cadu3']) {
                    // no t3
                    this.captions[ id ]['cadu3'] = 1 / this.captionCount;
                }
                
                var markup = this.controlMarkup.clone();
                var captionName =  this.slide.find( '.slide-id[value="' + this.slideId + '"]' ).parent().find( '.caption-id[value="' + id + '"]' ).parent().find( '.caption-name' ).val();
                markup.find( '.caption-name-head' ).text( '"' + captionName + '"' );
                markup.find( '.cafx' ).val( this.captions[ id ]['code'] );
                markup.attr( 'data-id', id );
                this.content.find( '#du-list' ).append( markup );
                this.loadCaFx( id, this.captions[ id ]['code'], false );
                
                var markup2 = this.controlMarkup2.clone();
                
                markup2.find( '.caption-name-head' ).text( '"' + captionName + '"' );
                markup2.find( '.cafx2' ).val( this.captions[ id ]['code2'] );
                markup2.attr( 'data-id', id );
                this.content.find( '#du2-list' ).append( markup2 );
                this.loadCaFx( id, this.captions[ id ]['code2'], false, true, false );
                
                if ( this.captions[ id ]['code3'] ) {
                    this.loadCaFx( id, this.captions[ id ]['code3'], false, false, true );
                }
                
                this.content.find( '.du[data-id="' + id + '"] > .duration .duration-hndle' ).resizable({
                    handles: 'e,w',
                    minWidth: 20,
                    containment: 'parent',
                    stop: function ( ev, ui ) {
                        that.afterResize.apply( that, [ev, ui] );
                    },
                }).on( 'resize', function( ev ) {
                    ev.stopPropagation();
                } ).draggable({
                    containment: 'parent',
                    stop: function( ev, ui ) {
                        that.afterDrag.apply( that, [ev, ui] );
                    },
                });
                
                this.content.find( '.du2[data-id="' + id + '"] > .duration .duration-hndle' ).resizable({
                    handles: 'e,w',
                    minWidth: 20,
                    containment: 'parent',
                    stop: function ( ev, ui ) {
                        that.afterResize.apply( that, [ev, ui] );
                    },
                }).on( 'resize', function( ev ) {
                    ev.stopPropagation();
                } ).draggable({
                    containment: 'parent',
                    stop: function( ev, ui ) {
                        that.afterDrag.apply( that, [ev, ui] );
                    },
                });
                
            }
            
        },
        
        /**
         *  load a caption fx (load from fx-picker into the overlay form)
         *  
         *  @param [int] id, the caption ID
         *  @param [string] code, the fx code (the jssor format)
         *  @param [bool] isNew, whether is newly added effect
         *  @param [bool] out, whether is effect for play out
         *  @param [bool] fx3, whether is effect for immediate play out
         */
        loadCaFx: function ( id, code, isNew, out, fx3 ) {
            var that = this;
            if ( 'false' == code ) {
                code = '';
            }
            if ( undefined === isNew ) {
                isNew = true;
            }
            if ( undefined === out ) {
                isNew = false;
            }
            if ( undefined === fx3 ) {
                fx3 = false;
            }
            var _fx3 = ( fx3 )? '3' : '';
            var du = ( out )? this.content.find( '#du2-list .du2[data-id="' + id + '"]' ) : this.content.find( '#du-list .du' + _fx3 + '[data-id="' + id + '"]' );
            
            if ( fx3 && ! du.length ) {
                // current caption has no t3
                var parentDu = this.content.find( '#du-list .du[data-id="' + id + '"]' );
                du = this.controlMarkup3.clone();
                du.attr( 'data-id', id ).find( '.du-btn' );
                parentDu.append( du ).find( '.t3-btn' ).addClass( 'pressed' );
                
                du.find( '> .duration .duration-hndle' ).resizable({
                    handles: 'e,w',
                    minWidth: 20,
                    containment: 'parent',
                    stop: function ( ev, ui ) {
                        that.afterResize.apply( that, [ev, ui] );
                    },
                }).on( 'resize', function( ev ) {
                    ev.stopPropagation();
                } ).draggable({
                    containment: 'parent',
                    stop: function( ev, ui ) {
                        that.afterDrag.apply( that, [ev, ui] );
                    },
                });
                
            }
            
            var jCode = jssorFunc.convert( code, 'json' );
            
            if ( jCode ) {
                // for later use
                $( document ).trigger( 'cnhkLoadCafx', [id, jCode, isNew, out, fx3] );
            }
            
            var newCode = jssorFunc.convert( jCode, 'jssor' );
            
            var picker = du.find( '> .du-com .fx-select' );
            
            if ( ! picker.hasClass( 'fx-picker' ) ) {
                var pickerOptions = {
                    root: picker.attr( 'data-root' ),
                    code: code,
                };
                
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
            } else {
                picker.cnhkFxPicker( 'option', 'code', code );
                picker.cnhkFxPicker( 'codeChanged' );
            }
            
            if ( newCode ) {
                du.find( '> .cafx' ).val( newCode );
            } else {
                du.find( '> .cafx' ).val( '' );
            }
            if ( ! newCode ) {
                newCode = '';
            }
            if ( out ) {
                this.setCode( id, '2', newCode );
            } else {
                this.setCode( id, _fx3, newCode );
            }
            
            if ( ! newCode ) {
                du.addClass( 'empty' );
            } else {
                du.removeClass( 'empty' );
            }
            
        },
        
        // event handlers
        evt: function() {
            
            var that = this;
            
            // markup loaded via ajax
            $( document ).on( 'captionTimingFormLoaded', function(){
                that.populate();
            } );
            
            // resize
            $( document ).on( 'cnhkOverlayResized', function(){
                that.resize();
                if ( $( '#slide-preview-wrap' ).length ) {
                    that.scaleSlider();
                }
            } );
            
            // frame switch: out effect
            $( document ).on( 'click', '#goto-du2', function ( ev ) {
                that._scrollHorz( false );
            } );
            
            // frame switch: in effect
            $( document ).on( 'click', '#goto-du1', function ( ev ) {
                that._scrollHorz( true );
            } );
            
            // frame switch: preview
            $( document ).on( 'click', '#goto-preview,#goto-preview2', function ( ev ) {
                ev.stopPropagation();
                that._scrollVert( false );
                that.preview();
            } );
            
            // frame switch: in effect (from preview)
            $( document ).on( 'click', '#goto-du', function ( ev ) {
                that._scrollVert( true );
            } );
            
            // load effect menu button
            $( document ).on( 'click', '.fx-list-btn', function ( ev ){
                ev.stopPropagation();
                $( this ).toggleClass( 'pressed' );
                $( '.fx-list-btn' ).not( this ).removeClass( 'pressed' );
            } );
            
            // stop click event bubbling from effect list
            $( document ).on( 'click', '.fx-list', function( ev ) {
                ev.stopPropagation();
            } );
            
            // load selected effect
            $( document ).on( 'click', '.fx-list-btn .load-cafx', function ( ev ) {
                ev.preventDefault();
                var value = $( this ).parents( '.du,.du2' ).find( '.fx-select' ).val();
                if ( ! out && $( this ).parents( '.du3' ).length ) {
                    value = $( this ).parents( '.du3' ).find( '.fx-select' ).val();
                }
                var duList = $( this ).parents( '.du,.du2' ).parent().attr( 'id' );
                var out = ( 'du2-list' == duList )? true : false;
                // if ( value ) {
                    var fx3 = false;
                    if ( ! out && $( this ).parents( '.du3' ).length ) {
                        fx3 = true;
                    }
                    var id = $( this ).parents( '.du,.du2' ).attr( 'data-id' );
                    that.loadCaFx( id, value, true, out, fx3 );
                    that.resize();
                    $( this ).parents( '.fx-list-btn' ).removeClass( 'pressed' );
                // }
            } );
            
            // add t3
            $( document ).on( 'click', '.t3-btn', function ( ev ) {
                if ( $( this ).hasClass( 'pressed' ) ) return;
                var id = $( this ).parents( '.du' ).attr( 'data-id' );
                that.loadCaFx( id, '', true, false, true );
                $( this ).addClass( 'pressed' );
            } );
            
            // remove button
            $( document ).on( 'click', '.du-btn.remove-btn', function () {
                var id = $( this ).parents( '.du,.du2' ).attr( 'data-id' );
                var out = true;
                if ( 'du-list' == $( this ).parents( '.du' ).parent().attr( 'id' ) ) {
                    out = false;
                }
                var fx3 = ( $( this ).parents( '.du3' ).length )? true : false;
                that.loadCaFx( id, '', true, out, fx3 );
                if ( fx3 ) {
                    $( this ).parents( '.du' ).find( '.t3-btn' ).removeClass( 'pressed' );
                    $( this ).parents( '.du3' ).remove();
                }
            } );
            
            // apply changes
            $( document ).on( 'click', '#apply-timing', function ( ev ) {
                ev.preventDefault();
                for ( var id in that.captions ) {
                    var tO = {
                        cafx: that.captions[ id ]['code'],
                        cafx2: that.captions[ id ]['code2'],
                        cafx3: that.captions[ id ]['code3'],
                        cadu: that.captions[ id ]['cadu'],
                        cadu2: that.captions[ id ]['cadu2'],
                        cadu3: that.captions[ id ]['cadu3'],
                        cas: that.limit_cas( that.captions[ id ]['cas'] ),
                        cas2: that.limit_cas( that.captions[ id ]['cas2'] ),
                        cas3: that.limit_cas( that.captions[ id ]['cas3'] ),
                    };
                    that.options.slide.find( '.caption-id[value="' + id + '"]' ).parents( '.caption' ).find( '.ca-timing' ).val( JSON.stringify( tO ) );
                }
                
                that.options.slide.find( '.slide-du' ).val( that.du );
                that.options.slide.find( '.slide-du2' ).val( that.du2 );
                that.options.slide.find( '.slide-du3' ).val( that.du3 );
                
                $.cnhkOverlay( 'hide', true );
            } );
            
            // cancel button
            $( document ).on( 'click', '#cancel-timing', function ( ev ) {
                $.cnhkOverlay( 'hide', true );
            } );
            
            // play in duration change
            $( document ).on( 'change', '#cadu', function ( ev ) {
                var val = parseFloat( $( this ).val() );
                if ( NaN === val ) {
                    val = 500;
                }
                that.du = val;
                that.du3 = val;
            } );
            
            // play out duration change
            $( document ).on( 'change', '#cadu2', function ( ev ) {
                var val = parseFloat( $( this ).val() );
                if ( NaN === val ) {
                    val = 500;
                }
                that.du2 = val;
            } );
            
            // preview replay button
            $( document ).on( 'click', '#slide-preview-com #replay', function ( ev ) {
                if ( that.slider ) {
                    that.slider.$Next();
                }
            } );
            
            // destroy slider on overlay closed
            $( document ).on( 'beforeHideOverlay', function( ev ){
                if ( that.slider ) {
                    $( '#slide-preview-wrap #ss' ).remove();
                }
            } );
            
            // Tab key
            $( document ).keyup( function( ev ) {
                if (
                    'none' != $( '#cnhk-overlay' ).css( 'display' ) &&
                    $( '#timing-container' ).length &&
                    'top' == that.scrollVert
                ) {
                    var code = ev.which || ev.keyCode;
                    if ( 9 == code ) {
                        var scrollTo = true;
                        if ( 'left' == that.scrollHorz ) scrollTo = false;
                        that._scrollHorz( scrollTo );
                    }
                }
            } );
        },
        
        // horizontally scroll the overlay content
        _scrollHorz: function( left ){
            var aw = this.content.parent().width();
            if ( left ) {
                $( '#caption-timing-wrap' ).animate(
                    {'margin-left': 0},
                    350
                );
                this.scrollHorz = 'left';
            } else {
                $( '#caption-timing-wrap' ).animate(
                    {'margin-left': - aw},
                    350
                );
                this.scrollHorz = 'right';
            }
        },
        
        // vertically scroll the overlay content
        _scrollVert: function( top ){
            var ah = this.content.parent().height();
            var that = this;
            if ( top ) {
                if ( that.slider ) {
                    $( '#slide-preview-wrap #ss' ).remove();
                }
                $( '#caption-timing-wrap' ).animate(
                    {'margin-top': 0 },
                    350
                );
                this.scrollVert = 'top';
            } else {
                $( '#caption-timing-wrap' ).animate(
                    {'margin-top': - $( '#caption-timing-wrap' ).innerHeight() },
                    350,
                    'swing',
                    function(){
                        if ( 'right' == that.scrollHorz ) {
                            that._scrollHorz( true );
                        }
                    }
                );
                this.scrollVert = 'bottom';
            }
        },
        
        // reset scrolling position
        resetPosition: function() {
            this.scrollHorz = 'left';
            this.scrollVert = 'top';
            return this;
        },
        
        limit_cas: function( val ){
            if ( 0 > val ) {
                return 0;
            }
            if ( 1 < val ) {
                return 1;
            }
            return val;
        },
        
        // resize function
        resize: function() {
            if ( undefined === this.content ) return;
            var applyWrap = $( '#apply-timing-wrap' );
            var scrollWrap = $( '#scroll-wrap' );
            var captionArea = this.content.find( '#caption-timing-wrap' );
            var previewArea = this.content.find( '#slide-preview-wrap' );
            var du = captionArea.find( '#timing-du-wrap' );
            var du2 = captionArea.find( '#timing-du2-wrap' );
            var aw = this.content.parent().width();
            var ah = this.content.parent().height();
            
            scrollWrap.add( captionArea ).width( aw ).height( ah - 50 );
            previewArea.add( du ).add( du2 ).width( aw - 20 ).height( ah - 20 - 50 );
            applyWrap.css( 'margin-top', ah - 50 );
            du2.css( 'margin-left', aw );
            
            $( '#du-list,#du2-list' ).css( 'min-height', ah - 20 - 120 );
            
            if ( 'left' == this.scrollHorz ) {
                captionArea.css( 'margin-left', 0 );
            } else {
                captionArea.css( 'margin-left', - aw );
            }
            if ( 'top' == this.scrollVert ) {
                captionArea.css( 'margin-top', 0 );
            } else {
                captionArea.css( 'margin-top',  - captionArea.innerHeight() );
            }
            
            var barWidth = $( '#du-list .duration' ).width();
            
            for ( var id in this.captions ) {
                var hndle = this.content.find( '#du-list .du[data-id="' + id + '"] > .duration .duration-hndle' );
                var hndle2 = this.content.find( '#du2-list .du2[data-id="' + id + '"] .duration-hndle' );
                var hndle3 = this.content.find( '#du-list .du3[data-id="' + id + '"] .duration-hndle' );
                this.content.find( '#du-list .du[data-id="' + id + '"] > .duration .duration-hndle' ).css( 'left', ( this.limit_cas( this.captions[ id ]['cas'] ) * barWidth ) );
                this.content.find( '#du2-list .du2[data-id="' + id + '"] .duration-hndle' ).css( 'left', ( this.limit_cas( this.captions[ id ]['cas2'] ) * barWidth ) );
                if ( hndle3.length && '' != this.captions[ id ]['code3'] ) {
                    this.content.find( '#du-list .du3[data-id="' + id + '"] .duration-hndle' ).css( 'left', ( this.limit_cas( this.captions[ id ]['cas3'] ) * barWidth ) );
                }
                
                var hndleWidth = this.captions[ id ]['cadu'] * barWidth;
                var hndleWidth2 = this.captions[ id ]['cadu2'] * barWidth;
                var hndleWidth3 = this.captions[ id ]['cadu3'] * barWidth;
                
                if ( 0 == hndleWidth ) hndleWidth = 1;
                if ( 0 == hndleWidth2 ) hndleWidth2 = 1;
                if ( 0 == hndleWidth3 ) hndleWidth3 = 1;
                
                this.content.find( '#du-list .du[data-id="' + id + '"] > .duration .duration-hndle' ).width( hndleWidth );
                this.content.find( '#du2-list .du2[data-id="' + id + '"] .duration-hndle' ).width( hndleWidth2 );
                
                if ( hndle3.length && '' != this.captions[ id ]['code3'] ) {
                    this.content.find( '#du-list .du3[data-id="' + id + '"] .duration-hndle' ).width( hndleWidth3 );
                }
            }
            
        },
        
        // lauch the preview (in the bottom screen of the overlay)
        preview: function() {
            var previewSelector = '#slide-preview-wrap #slide-preview';
            
            var slideType = $( '#cnhkss-slides-param .slide-id[value="' + this.slideId + '"]' ).siblings( '.slide-type' ).val();
            var captionHandler = $( '#cnhkss-slides-param .slide-id[value="' + this.slideId + '"]' ).siblings( '.caption-handler' ).val();
            var cH = cnhkCaptionHandler[ captionHandler ];
            
            var theSlide = $( '<div />' ).html( cnhkSlideHandler[ slideType ].getSlideContent( this.slideId ) );
            
            if ( theSlide.find( '> img' ).length ) {
                theSlide.find( '> img' ).attr({
                    alt: '',
                    'data-u': 'image',
                });
            }
            var captionFxs = {};
            var codes = {};
            for ( var id in this.captions ) {
                codes[ this.slideId + '|' + id + '|code'] = this.captions[id].code;
                codes[ this.slideId + '|' + id + '|cadu'] = this.captions[id].cadu;
                codes[ this.slideId + '|' + id + '|cas'] = this.captions[id].cas;
                if ( this.captions[id].code ) {
                    codes[ this.slideId + '|' + id + '|1' ] = jssorFunc.convert( this.captions[id].code, 'fx' );
                    captionFxs[ this.slideId + '|' + id + '|1' ] = jssorFunc.convert( this.captions[id].code, 'fx' );
                }
                
                codes[ this.slideId + '|' + id + '|code2'] = this.captions[id].code2;
                codes[ this.slideId + '|' + id + '|cadu2'] = this.captions[id].cadu2;
                codes[ this.slideId + '|' + id + '|cas2'] = this.captions[id].cas2;
                if ( this.captions[id].code2 ) {
                    codes[ this.slideId + '|' + id + '|2' ] = jssorFunc.convert( this.captions[id].code2, 'fx' );
                    captionFxs[ this.slideId + '|' + id + '|2' ] = jssorFunc.convert( this.captions[id].code2, 'fx' );
                }
                
                codes[ this.slideId + '|' + id + '|code3'] = this.captions[id].code3;
                codes[ this.slideId + '|' + id + '|cadu3'] = this.captions[id].cadu3;
                codes[ this.slideId + '|' + id + '|cas3'] = this.captions[id].cas3;
                if ( this.captions[id].code3 ) {
                    codes[ this.slideId + '|' + id + '|3' ] = jssorFunc.convert( this.captions[id].code3, 'fx' );
                    captionFxs[ this.slideId + '|' + id + '|3' ] = jssorFunc.convert( this.captions[id].code3, 'fx' );
                }
                
            }
            
            var ca = cH.getCaObject( this.slideId );
            
            var allMarkup = cH.getMarkup( this.slideId, ca, codes, this.du, this.du2, this.du3 );
            
            theSlide.append( $( allMarkup ) ).append( $( allMarkup ) );
            
            var tH = cnhkTemplateHandler[ $( 'input[name="template"]' ).val() ];
            
            this.slider = tH.timingPreview( previewSelector, captionFxs, theSlide, this.du );
            this.scaleSlider();
        },
        
        // scale the timing preview slider
        scaleSlider: function() {
            if ( ! this.slider ) return;
            var aw = $( '#slide-preview-wrap' ).width() * 0.90;
            var ah = ( ( $( '#slide-preview-wrap' ).height() - $( '#slide-preview-com' ).outerHeight( true ) ) * 0.90 );
            var ssWidth = $( '#options-w' ).val();
            var ssHeight = $( '#options-h' ).val();
            var scaleHorz = ( aw / ssWidth );
            var scaleVert = ( ah / ssHeight );
            this.slider.$ScaleWidth( ssWidth * Math.min( scaleHorz, scaleVert ) );
            
            $( this.slider.$Elmt ).css( 'left', ( $( '#slide-preview-wrap' ).width() - ( ssWidth * Math.min( scaleHorz, scaleVert ) ) ) / 2 );
            $( this.slider.$Elmt ).css( 'top', ( ( $( '#slide-preview-wrap' ).height() - ( ssHeight * Math.min( scaleHorz, scaleVert ) ) ) / 2 ) + $( '#slide-preview-com' ).outerHeight( true ) );
        },
        
    };
    
    // extend jQuery
    $.captionTimingControl = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var data = $( '#wpwrap' ).data( 'captionTimingControl' );
        if ( ! data ) {
            data = new captionTimingControl( option );
            $( '#wpwrap' ).data( 'captionTimingControl', data );
        }
        if ( typeof( option ) === 'string' ) {
            if ( typeof data[ option ] !== 'function' ) {
                throw 'jquery.captionTimingControl has no "' + option + '" method';
            }
            data[ option ].apply( data, args );
        }
        if ( typeof( option ) == 'object' ) {
            data.option( option );
        }
        return data;
    };
    
})( jQuery );
