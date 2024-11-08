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
    
    var cnhkFxSaver = function( el, options ) {
        this.el = el;
        this.$el = $( el ).addClass( 'fx-saver' );
        this.saveBtn;
        
        // add to current collection checkbox
        this.addToCk;
        
        // add to new collection checkbox
        this.addNewCk;
        
        this.newCollName;
        this.name;
        this.collSelect;
        this.notice;
        this.closeIcon;
        
        var defaultOptions = {
            root: 'slide', 
            codeElem: undefined,
            triggerEvent: 'click',
            autoRemove: false,
        };
        
        this.options = $.extend( {}, defaultOptions, options );
        var that = this;
        
        var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
        
        if ( undefined === data ) {
            $( document ).on( that.options.root + 'FxLoaded', function () {
                // run init() only when fx and collections data loaded (loaded by the picker script)
                that.init();
            } );
        } else {
            that.init();
        }
        
        $( document ).on( this.options.root + 'CollectionChange', function () {
            that.populate();
        } );
    };
    
    cnhkFxSaver.prototype = {
        
        constructor: cnhkFxSaver,

        // get/set option
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
            
            this.$el.on( this.options.triggerEvent, function( ev ) {
                ev.stopPropagation();
                ev.preventDefault();
                that.showSaver();
            } );
            
            this.closeIcon.on( 'click', function(){
                that.closeSaver();
            } );
            
            this.addToCk.on( 'click', function( ev ) {
                that.newCollection( ! $( this ).prop( 'checked' ) );
            } );
            
            this.addNewCk.on( 'click', function( ev ) {
                that.newCollection( $( this ).prop( 'checked' ) );
            } );
            
            this.saveBtn.on( 'click', function( ev ) {
                ev.preventDefault();
                that.prepareSave();
            } );
            
        },
        
        // update fields state depending on the user's choice to add fx to existing or new collection
        newCollection: function ( state ) {
            if ( undefined == state ) {
                return this.addNewCk.prop( 'checked' );
            } else {
                if ( true !== state ) state = false;
                this.addNewCk.prop( 'checked', state );
                this.addToCk.prop( 'checked', ! state );
                this.newCollName.prop( 'disabled', ! state );
                this.collSelect.prop( 'disabled', state );
            }
        },
        
        // create markup for the saver and set initial values
        init: function(){
            this.form = $( '#fx-saver-container' ).clone();
            this.form.removeAttr( 'id' ).addClass( 'fx-saver-container' );
            this.saveBtn = this.form.find( '.save-new-fx' );
            this.name = this.form.find( '.new-fx-name' );
            this.newCollName = this.form.find( '.new-collection-name' );
            this.addNewCk = this.form.find( '.add-new-collection' );
            this.collSelect = this.form.find( '.select-collection' );
            this.addToCk = this.form.find( '.add-to-collection' );
            this.notice = this.form.find( '.saver-notice' );
            this.closeIcon = this.form.find( '.dashicons-no' );
            this.populate();
            this.$el.after( this.form );
            this.evt();
            this.closeSaver();
            this.$el.prop( 'disabled', false );
        },
        
        // populate fields that depend on the current collection value
        populate: function(){
            var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
            this.collSelect.empty();
            for ( var i in data ) {
                this.collSelect.append( $( '<option value="' + i + '">' + i + '</option>' ) );
            }
            this.newCollName.prop( 'disabled', true );
            this.addToCk.prop( 'checked', true );
            this.addNewCk.prop( 'checked', false );
        },
        
        // show (expand) the saver
        showSaver: function(){
            this.$el.css( 'display', 'none' );
            var aw = this.form.parent().width() - 10;
            var width = Math.min( 320, aw );
            this.form.width( width );
            this.form.show( 500 );
        },
        
        // hide (contract) the saver
        closeSaver: function(){
            this.$el.css( 'display', 'inline' );
            this.form.hide( 500 );
        },
        
        // prepare to save new fx
        prepareSave: function(){
            var useNew = this.newCollection();
            var coll = ( useNew )? this.newCollName.val(): this.collSelect.val();
            var name = this.name.val();
            var data = $( '#wpwrap' ).data( this.options.root + 'Fx' );
            var proceed = true;
            if ( name ) {
                // is a valid effect name
                
                if ( coll ) {
                    // is a valid collection name
                    
                    this.notice.empty();
                    if ( undefined !== data[coll] && undefined !== data[coll][name] ) {
                        proceed = confirm( fxSaverLocale.fxExists );
                    }
                } else {
                    // invalid collection name
                    this.notice.text( fxSaverLocale.invalidCollName );
                    proceed = false;
                }
            } else {
                // invalid effect name
                this.notice.text( fxSaverLocale.invalidFxName );
                proceed = false;
            }
            if ( proceed ) {
                this.trySave( coll, name );
            }
        },
        
        // try to save ne fx (AJAX)
        trySave: function( coll, name ){
            var formData = {
                nonce : cnhkAjaxNonce,
                action : 'cnhk_fx_call',
                
                // the PHP function to call
                func: 'add_fx',
                formdata: $.param({
                    root: this.options.root,
                    collection: coll,
                    name: name,
                    code: this.options.codeElem.val(),
                }),
            };
            
            this.saveBtn.prop( 'disabled', true ).after( spinner.clone() );
            
            var that = this;
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: formData,
                success: function ( resp, textStatus, XHR ) {
                    if ( resp.status ) {
                        // all OK
                        
                        that.form.find( '.preloader' ).remove();
                        that.saveBtn.prop( 'disabled', false );
                        that.name.val( '' );
                        that.closeSaver();
                        that.collSelect.val( '' );
                        if ( ! that.addToCk.prop( 'checked' ) ) {
                            // added to new collection, then reset the saver to its original state
                            that.addToCk.trigger( 'click' );
                        }
                        var allData = $( '#wpwrap' ).data( that.options.root + 'Fx' );
                        if ( undefined === allData[coll] ) {
                            allData[coll] = {};
                        }
                        allData[coll][name] = that.options.codeElem.val();
                        $( '#wpwrap' ).data( that.options.root + 'Fx', allData );
                        $( document ).trigger( that.options.root + 'CollectionChange' );
                        if ( that.options.autoRemove ) {
                            that.$el.remove();
                        }
                    } else {
                        // tha call passed but PHP refused the job
                        
                        that.saveBtn.prop( 'disabled', false );
                        var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                        if ( undefined !== resp.msg) {
                            error = $( '<span class="cnhk-error">' + resp.msg + '</span>' );
                        }
                        that.form.find( '.preloader' ).replaceWith( error );
                        autoHide( error );
                    }
                },
                error: function ( request, textStatus, err ) {
                    // the call did not pass
                    
                    this.connecting = false;
                    var error = $( '<span class="cnhk-error">' + fxPickerLocale.actionFailed + '</span>' );
                    that.form.find( '.preloader' ).replaceWith( error );
                    that.saveBtn.prop( 'disabled', false );
                    autoHide( error );
                    if ( ! that.addToCk.prop( 'checked' ) ) {
                        // reset the saver to its original state
                        that.addToCk.trigger( 'click' );
                    }
                }
            });
            
        },
    };
    
    // extend jQuery with this saver
    $.fn.cnhkFxSaver = function( option ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        var results = [];
        this.each(function () {
            var $this = $( this );
            var data = $this.data( 'cnhkFxSaver' );
            if ( ! data ) {
                data = new cnhkFxSaver( this, option );
                $this.data( 'cnhkFxSaver', data );
            }
            if ( typeof( option )=== 'string' ) {
                if ( typeof data[ option ] !== 'function' ) {
                    throw 'jquery.cnhkFxSaver has no "' + option + '" method';
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
    
})( jQuery );
