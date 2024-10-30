/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function ( $ ){
	"use strict";
    
    var cnhkEditor = function( el, options ) {
        this.el = el;
        this.$el = $( el );
        this.squireInstance;
        this.iframe;
        this.toolbar;
		this.options = {};
        var defaultOptions = {
            fullScreen: false,
        };
        this.options = $.extend( {}, defaultOptions, options );
        
        // the textarea in text tab
        this.rawEditor;
        this.build();
        return this;
    };
    
    cnhkEditor.prototype = {
        
        constructor: cnhkEditor,
        
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
                }
            }
            return this;
        },
        
        // build the visual editor and bind event handlers
        build: function(){
            var that = this;
            this.iframe = this.$el.find( 'iframe.cnhk-editor-visual' )[0];
            this.toolbar = this.$el.find( '.cnhk-editor-toolbar' );
            this.rawEditor = this.$el.find( 'textarea.cnhk-editor-html' );
            
            var doc = ( undefined === this.iframe.contentDocument )? this.iframe.contentWindow.document : this.iframe.contentDocument;
            var fontSize = this.toolbar.find( 'select.font-size' ).val();
            var config = {
                blockTag: 'DIV',
            };
            this.squireInstance = new Squire( doc, config );
            this.squireInstance.setHTML( this.rawEditor.val() );
            
            this.evt();
        },
        
        // event handlers
        evt: function(){
            
            var that = this;
            var toolbar = this.toolbar;
            var iframe = this.iframe;
            var instance = this.squireInstance;
            var textareaInput = this.rawEditor;
            
            $( window ).on( 'resize', function( ev ) {
                if ( that.options.fullScreen ) {
                    that.resize();
                }
            } );
            
            // hide color picker when iframe content clicked
            $( iframe ).contents().find( 'body' ).on( 'click', function() {
                $( '.hide-on-click' ).parents( '.pressed' ).removeClass( 'pressed' );
            } );
            
            // change html editor on visual editor changes
            instance.addEventListener( 'input', function(){
                textareaInput.val( instance.getHTML() );
            });
            
            // and vice versa
            textareaInput.on( 'change', function(){
                instance.setHTML( textareaInput.val() );
            } );
            
            // undo/redo state
            instance.addEventListener( 'undoStateChange', function( ev ){
                that._undoButtonsStates( ev );
            } );
            
            // selection changed
            instance.addEventListener( 'select', function(){
                that._buttonStatesOnSelect();
            } );
            
            // path (DOM) changed
            instance.addEventListener( 'pathChange', function( ev ) {
                that._buttonStatesOnPath( ev.path );
            } );
            
            // toolbar button click
            toolbar.find( '.editor-btn' ).on( 'click', function( ev ) {
                ev.stopPropagation();
                ev.preventDefault();
                
                var fn3 = $( this ).attr( 'data-fn3' );
                
                $( '.hide-on-click' ).each(function(){
                    var btn = $( this ).parents( '.editor-btn' );
                    if ( fn3 != btn.attr( 'data-fn3' ) ) {
                        btn.removeClass( 'pressed' );
                    }
                });
                
                if ( $( this ).hasClass( 'disabled' ) ) {
                    return;
                }
                
                if ( $( this ).attr( 'data-fn' ) ) {
                    // reversible functionality
                    if ( $( this ).hasClass( 'pressed' ) ) {
                        instance[ $( this ).attr( 'data-fn2' ) ]();
                    } else {
                        instance[ $( this ).attr( 'data-fn' ) ]();
                    }
                } else {
                    // other functions
                    if ( $( this ).attr( 'data-fn3' ) ) {
                        switch ( $( this ).attr( 'data-fn3' ) ) {
                            case 'text-align':
                                if ( $( this ).hasClass( 'pressed' ) ) {
                                    // if an alignment is set, cancel it
                                    instance.setTextAlignment( null );
                                } else {
                                    instance.setTextAlignment( $( this ).attr( 'data-param' ) );
                                }
                                break;
                            case 'expand-contract':
                                var icon = $( this ).find( '.dashicons' );
                                var tip = $( this ).find( '.btn-tip' );
                                if ( icon.hasClass( 'dashicons dashicons-editor-contract' ) ) {
                                    icon.attr( 'class', 'dashicons dashicons-editor-expand' );
                                    tip.text( cnhkEditorLocale['expand'] );
                                } else {
                                    icon.attr( 'class', 'dashicons dashicons-editor-contract' );
                                    tip.text( cnhkEditorLocale['contract'] );
                                }
                                that.switchSize();
                                break;
                            default :
                        }
                    }
                }
                
            } );
            
            // insert image
            toolbar.find( '.editor-btn[data-fn3="media-lib"]' ).on( 'click', function ( ev ) {
                ev.stopPropagation();
                $.cnhkEditorMedia( instance );
            } );
            
            // edit image
            $( instance.getDocument() ).on( 'click', 'img', function ( ev ) {            
                ev.stopPropagation();
                $( this ).cnhkEditorImage( 'show' );
            } );
            
            // edit icon
            $( instance.getDocument() ).on( 'click', '.fa', function ( ev ) {            
                ev.stopPropagation();
                var that = this;
                $( this ).cnhkEditorIconSelect({
                    applyChanges: function ( html ) {
                        if ( $( that ).hasClass( 'fa' ) ) {
                            if ( spanColor.length ) {
                                spanColor.replaceWith( $( html ) );
                            } else {
                                $( that ).replaceWith( $( html ) );
                            }
                        }
                    },
                });
            } );
            
            // font size
            toolbar.find( '.font-size' ).on( 'change', function ( ev ) {
                if ( ! instance.getSelection().collapsed ) {
                    var value = $( this ).val();
                    instance.setFontSize(  value + 'px' );
                    $( this ).find( 'option' ).removeAttr( 'selected' );
                    $( this ).find( 'option[value="' + value + '"]' ).attr( 'selected', 'selected' );
                }
            } );
            
            // insert icon
            toolbar.find( '.editor-btn[data-fn3="faw"]' ).on( 'click', function ( ev ) {
                if ( instance.getSelection().collapsed ) {
                    $( this ).cnhkEditorIconSelect({
                        insert: function( html ) {
                            if ( html ) {
                                instance.insertHTML( html );
                                var content = $( '<div />' ).html( instance.getHTML() );
                                content.find( '.fa' ).each(function(){
                                    $( this ).empty();
                                });
                                instance.setHTML( content.html() );
                                textareaInput.val( content.html() );
                            }
                        },
                        color: ( toolbar.find( '.text-color .colorpicker' ).val() )? toolbar.find( '.text-color .colorpicker' ).val() : '',
                        bg: ( toolbar.find( '.background-color .colorpicker' ).val() )? toolbar.find( '.background-color .colorpicker' ).val() : '',
                    });
                }
            } );
            
            // insert link
            toolbar.find( '.editor-btn[data-fn3="link"]' ).on( 'click', function ( ev ) {
                $( this ).cnhkEditorLink( 'option', 'editor', instance );
                $( this ).cnhkEditorLink( 'open' );
            } );
            
            // remove link
            toolbar.find( '.editor-btn[data-fn3="unlink"]' ).on( 'click', function ( ev ) {
                that.squireInstance.removeLink();
            } );
            
            // click on a link
            $( instance.getDocument() ).on( 'click', 'a.squire-link', function ( ev ) {
                ev.preventDefault();
                $( this ).cnhkEditorLink( 'option', 'editor', instance );
                $( this ).cnhkEditorLink( 'open' );
            } );
            
        },
        
        // undo/redo buttons state
        _undoButtonsStates: function( ev ) {
            if ( ev.canUndo ) {
                this.toolbar.find( '.editor-btn[data-fn="undo"]' ).removeClass( 'disabled' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="undo"]' ).addClass( 'disabled' );
            }
            if ( ev.canRedo ) {
                this.toolbar.find( '.editor-btn[data-fn="redo"]' ).removeClass( 'disabled' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="redo"]' ).addClass( 'disabled' );
            }
        },
        
        // buttons state on selection changed
        _buttonStatesOnSelect: function() {
            // bold
            if ( this.squireInstance.hasFormat( 'B' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="bold"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="bold"]' ).removeClass( 'pressed' );
            }
            
            // underline
            if ( this.squireInstance.hasFormat( 'U' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="underline"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="underline"]' ).removeClass( 'pressed' );
            }
            
            // italic
            if ( this.squireInstance.hasFormat( 'I' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="italic"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="italic"]' ).removeClass( 'pressed' );
            }
            
            // unordered list
            if ( this.squireInstance.hasFormat( 'UL' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="makeUnorderedList"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="makeUnorderedList"]' ).removeClass( 'pressed' );
            }
            
            // ordered list
            if ( this.squireInstance.hasFormat( 'OL' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="makeOrderedList"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="makeOrderedList"]' ).removeClass( 'pressed' );
            }
            
            // alignment
            this.toolbar.find( '.editor-btn[data-fn3="text-align"]' ).removeClass( 'pressed' );
            if ( this.squireInstance.hasFormat( 'DIV', {class: 'align-left'} ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="left"]' ).addClass( 'pressed' );
            }
            if ( this.squireInstance.hasFormat( 'DIV', {class: 'align-center'} ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="center"]' ).addClass( 'pressed' );
            }
            if ( this.squireInstance.hasFormat( 'DIV', {class: 'align-right'} ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="right"]' ).addClass( 'pressed' );
            }
            if ( this.squireInstance.hasFormat( 'DIV', {class: 'align-justify'} ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="justify"]' ).addClass( 'pressed' );
            }
        },
        
        // buttons state on path changed
        _buttonStatesOnPath: function( fullPath ) {
            // removes 'HTML>BODY' from the path.
            var path = fullPath.substr( 9 );
            // bold
            if ( -1 != path.indexOf( '>B' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="bold"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="bold"]' ).removeClass( 'pressed' );
            }
            
            // underline
            if ( -1 != path.indexOf( '>U' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="underline"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="underline"]' ).removeClass( 'pressed' );
            }
            
            // italic
            if ( -1 != path.indexOf( '>I' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="italic"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="italic"]' ).removeClass( 'pressed' );
            }
            
            // unordered list
            if ( -1 != path.indexOf( 'UL>' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="makeUnorderedList"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="makeUnorderedList"]' ).removeClass( 'pressed' );
            }
            
            // ordered list
            if ( -1 != path.indexOf( 'OL>' ) ) {
                this.toolbar.find( '.editor-btn[data-fn="makeOrderedList"]' ).addClass( 'pressed' );
            } else {
                this.toolbar.find( '.editor-btn[data-fn="makeOrderedList"]' ).removeClass( 'pressed' );
            }
            
            // alignment
            this.toolbar.find( '.editor-btn[data-fn3="text-align"]' ).removeClass( 'pressed' );
            if ( -1 != path.indexOf( 'DIV.align-left' ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="left"]' ).addClass( 'pressed' );
            }
            if ( -1 != path.indexOf( 'DIV.align-center' ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="center"]' ).addClass( 'pressed' );
            }
            if ( -1 != path.indexOf( 'DIV.align-right' ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="right"]' ).addClass( 'pressed' );
            }
            if ( -1 != path.indexOf( 'DIV.align-justify' ) ) {
                this.toolbar.find( '.editor-btn[data-fn3="text-align"][data-param="justify"]' ).addClass( 'pressed' );
            }
            
            // update font size input when cursor position changes
            if ( -1 != fullPath.indexOf( 'SPAN.size' ) ) {
                var sizePx = $( this.squireInstance.getSelection().commonAncestorContainer.parentElement ).css( 'font-size' );
                var size = Math.round( parseFloat( sizePx.substr( 0, sizePx.indexOf( 'px' ) ) ) );
                if ( size ) {
                    this.toolbar.find( '.font-size option' ).removeAttr( 'selected' );
                    this.toolbar.find( '.font-size option[value="' + size + '"]' ).attr( 'selected', 'selected' );
                }
            } else {
                this.toolbar.find( '.font-size option' ).removeAttr( 'selected' );
                this.toolbar.find( '.font-size option' ).first().attr( 'selected', 'selected' );
            }
            
            // update font family when cursor position changes
            if ( -1 != fullPath.indexOf( 'SPAN.font' ) && this.squireInstance.getSelection().collapsed ) {
                var fontFamily = $( this.squireInstance.getSelection().commonAncestorContainer.parentElement ).css( 'font-family' ).replace( /'|"/g, '' );
                if ( fontFamily ) {
                    this.toolbar.find( '.font-family option' ).each(function(){
                        if ( -1 != fontFamily.indexOf( $( this ).attr( 'value' ) ) ) {
                            $( this ).prop( 'selected', true );
                        }
                    });
                }
            } else {
                this.toolbar.find( '.font-family option' ).each(function(){
                    if ( 'Arial, Helvetica Neue, Helvetica, sans-serif' == $( this ).attr( 'value' ) ) {
                        $( this ).prop( 'selected', true );
                    }
                });
            }
            
        },
        
        // resize function
        resize: function() {
            if ( this.options.fullScreen ) {
                var adminBar = $( '#wpadminbar' );
                var aw = $( window ).width();
                var ah = $( window ).height() - adminBar.outerHeight();
                this.$el.css({
                    zIndex: 10010,
                    position: 'fixed',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    top: 0,
                    left: 0,
                    width: aw,
                    height: ah + adminBar.outerHeight(),
                });
                this.$el.find( '.cnhk-editor' ).css({
                    width: aw * 0.88,
                    marginLeft: aw * 0.06,
                    marginTop: 1.5 * adminBar.outerHeight(),
                });
                this.$el.find( '.cnhk-editor-visual,.cnhk-editor-html' ).height( ah * 0.66 );
            } else {
                this.$el.css({
                    zIndex: 1,
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                });
                this.$el.find( '.cnhk-editor' ).css({
                    width: '99%',
                    marginLeft: 0,
                    marginTop: 0,
                });
                this.$el.find( '.cnhk-editor-visual,.cnhk-editor-html' ).css( 'height', 300 );
            }            
        },
        
        // toggle editor size
        switchSize: function () {
            this.options.fullScreen = ! this.options.fullScreen;
            this.resize();
        },
        
    };
    
    // extend jQuery
    $.fn.cnhkEditor = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkEditor' );
            if ( ! data ) {
                data = new cnhkEditor( this );
                $this.data( 'cnhkEditor', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkEditor has no "' + option + '" method';
                }
                var result = data[ option ].apply( data, args );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
        });
        return ( results.length > 0 )? results[0] : this;
    };
    
})( jQuery );
