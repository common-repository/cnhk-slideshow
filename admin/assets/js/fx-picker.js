/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    var spinner = $( '<span class="preloader" style="width: 20px;height:20px;display:inline-block;vertical-align: middle;margin-left:10px;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></span>' );
    
    function autoHide( jQ, t, a ) {
        if ( undefined === t ) {
            t = 4000;
        }
        if ( undefined === a ) {
            a = 500;
        }
        if ( undefined === jQ ) return;
        
        setTimeout(function(){
            jQ.hide( a, function(){
                jQ.remove();
            } );
        }, t);
    }
    
    var cnhkFxPicker = function( el, options ) {
        this.el = el;
        this.$el = $( el ).addClass( 'fx-picker' );
        
        // the effect's code
        this.code;
        
        // its name
        this.name;
        
        // the current collection
        this.collection;
        
        // the markup
        this.form;
        this.clearBtn;
        this.selectBtn;
        this.nameSpan;
        
        // form wrapper
        this.pickerWrap;
        this.connecting = false;
        this.deleteCollectionIcon;
        
        var defaultOptions = {
            root: 'slide', 
            code: '',
            saverElem: undefined,
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        var that = this;
        
        var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
        
        if ( undefined === data ) {
            // data (fx-s and collections) are not yet loaded. fire init() only after they are.
            $( document ).on( that.options.root + 'FxLoaded', function () {
                that.init();
            } );
        } else {
            that.init();
        }
        
        // on current collection changed (by action on the select field but also after deleting or adding something)
        $( document ).on( that.options.root + 'CollectionChange' , function () {
            that.populate();
        } );
        return this;
    };
    
    cnhkFxPicker.prototype = {
        
        constructor: cnhkFxPicker,
        
        // set/get option
        option: function() {
            var name;
            if ( arguments.length === 0 ) {
                return this.options;
            }
            if ( arguments.length === 2 ) {
                this.options[ arguments[0] ] = arguments[1];
                return this;
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
        
        // event handler
        evt: function() {
            var that = this;
            
            // pick an effect
            this.selectBtn.on( 'click', function( ev ){
                ev.preventDefault();
                that.showPicker();
            } );
            
            // clear current effect
            this.clearBtn.on( 'click', function( ev ){
                ev.preventDefault();
                that.options.code = '';
                that.codeChanged();
                that.removeSaver();
            } );
            
            // collection select field changed
            this.collSelect.on( 'change', function(){
                that.collectionChanged();
            } );
            
            // delete entire collection
            this.deleteCollectionIcon.on( 'click', function(){
                that.deleteCollection();
            } );
            
        },
        
        // place markup and initialize values
        init: function(){
            this.form = $( '#fx-picker-container' ).clone();
            this.nameSpan = this.form.find( '.current-name' );
            this.form.removeAttr( 'id' ).addClass( 'fx-picker-container' ).css( 'display', 'inline-block' );
            this.selectBtn = this.form.find( '.select-fx' );
            this.clearBtn = this.form.find( '.clear-fx' );
            this.pickerWrap = this.form.find( '.fx-picker-wrap' );
            this.$el.after( this.selectBtn ).after( this.clearBtn ).after( this.form );
            this.collSelect = this.form.find( '.select-collection' );
            this.deleteCollectionIcon = this.form.find( '.delete-collection' );
            
            this.populate();
            this.closePicker();
            this.evt();
        },
        
        // populate fields that depend on what is in the current collection
        populate: function(){
            var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
            this.collSelect.empty();
            this.codeChanged();
            for ( var i in data ) {
                this.collSelect.append( $( '<option value="' + i + '">' + i + '</option>' ) );
            }
            this.collection = this.collSelect.val();
            this.collectionChanged();
        },
        
        // expand the picker
        showPicker: function(){
            var aw = this.form.parent().width() - 10;
            var width = Math.min( 320, aw );
            this.pickerWrap.width( width );
            this.collSelect.css({
                width: width - 30 - this.collSelect.prev().width(),
            });
            this.pickerWrap.show( 500 );
            this.selectBtn.add( this.clearBtn ).add( this.nameSpan ).css( 'display', 'none' );
        },
        
        // contract the picker
        closePicker: function() {
            this.pickerWrap.hide( 500 );
            this.selectBtn.add( this.clearBtn ).add( this.nameSpan ).css( 'display', 'inline' );
        },
        
        // change display of everything that depends on current code value
        codeChanged: function() {
            var name = this.getName( this.options.code );
            this.nameSpan.text( name );
            if ( '' == this.options.code.trim() ) {
                this.clearBtn.prop( 'disabled', true );
            } else {
                this.clearBtn.prop( 'disabled', false );
            }
            this.$el.val( this.options.code );
        },
        
        // get the name of a given code (if any name exists)
        getName: function( code ) {
            if ( '' == code.trim() ) {
                return fxPickerLocale.empty;
            }
            var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
            for ( var i in data ) {
                for ( var j in data[i] ) {
                    var _code = jssorFunc.convert( code, 'json' );
                    var _data = jssorFunc.convert( data[i][j], 'json' );
                    var compCode = JSON.stringify( _code, false );
                    var compData = JSON.stringify( _data, false );
                    if ( compCode == compData ) {
                        return j;
                    }
                }
            }
            return fxPickerLocale.customCode;
        },
        
        // change all values that depend on collection's content (called internally by the above "populate" function)
        collectionChanged: function() {
            var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
            var coll = data[this.collSelect.val()];
            this.collection = this.collSelect.val();
            if ( 'default' == this.collSelect.val() ) {
                this.form.find( '.delete-collection' ).hide();
            } else {
                this.form.find( '.delete-collection' ).show();
            }
            var body = this.form.find( '.picker-body' ).empty();
            for ( var name in coll ) {
                body.append( $( '<div class="fx-elem" data-code="' + coll[name] + '"><span class="fx-name">' + name + '</span><div class="action-row"><span class="delete-fx">' + fxPickerLocale['deleteFx'] + '</sapn></div></div>' ) );
            }
        },
        
        // try to delete an effect frm a collection (AJAX)
        tryDelete: function( name ) {
            if ( this.connecting ) return;
            this.connecting = true;
            var row = '';
            this.form.find( '.picker-body .fx-name' ).each(function(){
                if ( name == $( this ).text() ) {
                    row = $( this ).parent( '.fx-elem' );
                }
            });
            if ( ! row.length ) return;
            row.find( '.fx-name' ).append( spinner.clone() );
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_fx_call',
                
                // the PHP function to call
                func: 'delete_fx',
                formdata: $.param({
                    root: this.options.root,
                    collection: this.collection,
                    name: name,
                }),
            };
            var that = this;
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    that.connecting = false;
                    if ( resp.status ) {
                        // all OK - job done
                        
                        that.form.find( '.preloader' ).remove();
                        row.remove();
                        that.closePicker();
                        var allData = $( '#wpwrap' ).data( that.options.root + 'Fx' );
                        delete( allData[that.collection][name] );
                        $( '#wpwrap' ).data( that.options.root + 'Fx', allData );
                        $( document ).trigger( that.options.root + 'CollectionChange' );
                        
                    } else {
                        
                        // the call passed but PHP (the module's PHP file) refused the job. So print the what "PHP" said (if he said anything)
                        var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                        if ( undefined !== resp.msg) {
                            error = $( '<span class="cnhk-error">' + resp.msg + '</span>' );
                        }
                        that.form.find( '.preloader' ).replaceWith( error );
                        autoHide( error );
                        
                    }
                },
                error: function ( request, textStatus, err ) {
                    // the call did not pass at all.
                    this.connecting = false;
                    var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                    that.form.find( '.preloader' ).replaceWith( error );
                    autoHide( error );
                }
            });
        },
        
        // delete an entire collection
        deleteCollection: function(){
            var coll = this.collSelect.val();
            if ( 'default' == coll ) return;
            this.deleteCollectionIcon.before( spinner.clone() );
            this.connecting = true;
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_fx_call',
                
                // the PHP function to call
                func: 'delete_collection',
                formdata: $.param({
                    root: this.options.root,
                    collection: coll,
                }),
            };
            var that = this;
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    this.connecting = false;
                    if ( resp.status ) {
                        // all OK - the call passed, and the job is done
                        
                        that.form.find( '.preloader' ).remove();
                        that.closePicker();
                        var allData = $( '#wpwrap' ).data( that.options.root + 'Fx' );
                        delete( allData[coll] );
                        $( '#wpwrap' ).data( that.options.root + 'Fx', allData );
                        $( document ).trigger( that.options.root + 'CollectionChange' );
                        
                    } else {
                        // the call passed but PHP did not perform the job
                        
                        var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                        if ( undefined !== resp.msg) {
                            error = $( '<span class="cnhk-error">' + resp.msg + '</span>' );
                        }
                        that.form.find( '.preloader' ).replaceWith( error );
                        autoHide( error );
                        
                    }
                },
                error: function ( request, textStatus, err ) {
                    // the call was lost somewhere in the maze of internet
                    
                    this.connecting = false;
                    var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                    that.form.find( '.preloader' ).replaceWith( error );
                    autoHide( error );
                }
            });
        },
        
        // remove the associated effect saver
        removeSaver: function() {
            if ( undefined !== this.options.saverElem ) {
                this.options.saverElem.remove();
            }
        },
        
    };
    
    // extend jQuery with this fx picker
    $.fn.cnhkFxPicker = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkFxPicker' );
            if ( ! data ) {
                data = new cnhkFxPicker( this, option );
                $this.data( 'cnhkFxPicker', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkFxPicker has no "' + option + '" method';
                }
                var result = data[ option ].apply( data, args );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
            if ( typeof( option ) == 'object' ) {
                var result = data.option( option );
                if ( result !== undefined ) {
                    results.push( result );
                }
            }
        });
        return ( results.length > 0 )? results[0] : this;
    };
    
    // on DOM ready
    $(function (){
        // load slide effects collections
        if ( undefined === $( '#wpwrap' ).data( 'slideFx' ) ) {
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_fx_call',
                func: 'get_all',
                formdata: $.param({
                    root: 'slide',
                }),
            };
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    if ( undefined === resp.status || true !== resp.status ) {
                        $( '#wpwrap' ).data( 'slideFx', undefined );
                    }
                    $( '#wpwrap' ).data( 'slideFx', resp.collections );
                    
                    // tell every already existing pickers (and savers) that data for slide are ready
                    $( document ).trigger( 'slideFxLoaded' );
                },
                error: function ( request, textStatus, err ) {
                    $( '#wpwrap' ).data( 'slideFx', undefined );
                    console.log( textStatus );
                }
            });
        }
        
        // load caption effects collections
        if ( undefined === $( '#wpwrap' ).data( 'captionFx' ) ) {
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_fx_call',
                func: 'get_all',
                formdata: $.param({
                    root: 'caption',
                }),
            };
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    if ( undefined === resp.status || true !== resp.status ) {
                        $( '#wpwrap' ).data( 'captionFx', undefined );
                    }
                    $( '#wpwrap' ).data( 'captionFx', resp.collections );
                    
                    // tell every already existing pickers (and savers) that data for caption are ready
                    $( document ).trigger( 'captionFxLoaded' );
                },
                error: function ( request, textStatus, err ) {
                    $( '#wpwrap' ).data( 'captionFx', undefined );
                    console.log( textStatus );
                }
            });
        }
        
        // close picker when the close icon is clicked
        $( document ).on( 'click', '.fx-picker-wrap .dashicons-no', function () {
            var elt = $( this ).parents( '.fx-picker-container' ).prev( '.fx-picker' );
            elt.cnhkFxPicker( 'closePicker' );
        } );
        
        // change current code of picker when a code name is clicked
        $( document ).on( 'click', '.fx-picker-wrap .fx-elem .fx-name', function () {
            var elt = $( this ).parents( '.fx-picker-container' ).prev( '.fx-picker' );
            elt.cnhkFxPicker( 'option', 'code', $( this ).parents( '.fx-elem' ).attr( 'data-code' ) );
            elt.cnhkFxPicker( 'codeChanged' );
            elt.cnhkFxPicker( 'closePicker' );
            elt.cnhkFxPicker( 'removeSaver' );
        } );
        
        // delete an effect
        $( document ).on( 'click', '.fx-picker-wrap .fx-elem .delete-fx', function ( ev ) {
            var elt = $( this ).parents( '.fx-picker-container' ).prev( '.fx-picker' );
            var name = $( this ).parents( '.fx-elem' ).find( '>.fx-name' ).text();
            elt.cnhkFxPicker( 'tryDelete', name );
        } );
        
    });
    
})( jQuery );
