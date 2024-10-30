/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    /**
     *  Effect buimder. create it in window scope
     */
    window.jssorFxBuilder = function( fxType, fields, wrapperID, codeFieldSelector ) {
        
        // selector for code text input (input is "readonly")
        this.codeFieldSelector = codeFieldSelector;
        
        // fx type (ss|ca|bro)
        this.fxType = fxType;
        
        // wrapper DIV
        this.wrapperID = wrapperID;
        
        if ( 'ss' != fxType && 'ca' != fxType && 'bro' != fxType ) {
            throw 'Need a correct effect type';
        }
        
        if ( 'object' != typeof( fields ) ) {
            fields = {};
        }
        
        // input fields selector ( actually ID attributes )
        this.fieldsSel = {};
        
        var defaultFields = {
            // Block settings
            ssFormation: 'ssFormation',
            ssAssembly: 'ssAssembly',
            ssDuration: 'ssDuration',
            ssCols: 'ssCols',
            ssRows: 'ssRows',
            ssDelay: 'ssDelay',
            scReverse: 'scReverse',
            scSlideOut: 'scSlideOut',
            scOutside: 'scOutside',
            scMove: 'scMove',
            
            // Fly effect (horizontal)
            ssFlyHorizontal: 'ssFlyHorizontal',
            stDuringBeginHor: 'stDuringBeginHor',
            stDuringLengthHor: 'stDuringLengthHor',
            ssEasingHorizontal: 'ssEasingHorizontal',
            stScaleHorizontal: 'stScaleHorizontal',
            ssRoundHorizontal: 'ssRoundHorizontal',
            
            // Fly effect (vertical)
            ssFlyVertical: 'ssFlyVertical',
            stDuringBeginVer: 'stDuringBeginVer',
            stDuringLengthVer: 'stDuringLengthVer',
            ssEasingVertical: 'ssEasingVertical',
            stScaleVertical: 'stScaleVertical',
            ssRoundVertical: 'ssRoundVertical',
            
            // Clip effect
            ssClip: 'ssClip',
            stDuringBeginClip: 'stDuringBeginClip',
            stDuringLengthClip: 'stDuringLengthClip',
            ssEasingClip: 'ssEasingClip',
            stScaleClip: 'stScaleClip',
            ssRoundClip: 'ssRoundClip',
            
            // Zoom effect
            scZoom: 'scZoom',
            stDuringBeginZoom: 'stDuringBeginZoom',
            stDuringLengthZoom: 'stDuringLengthZoom',
            ssEasingZoom: 'ssEasingZoom',
            stScaleZoom: 'stScaleZoom',
            ssRoundZoom: 'ssRoundZoom',
            
            // Rotate effect
            scRotate: 'scRotate',
            stDuringBeginRotate: 'stDuringBeginRotate',
            stDuringLengthRotate: 'stDuringLengthRotate',
            ssEasingRotate: 'ssEasingRotate',
            stScaleRotate: 'stScaleRotate',
            ssRoundRotate: 'ssRoundRotate',
            
            // Fade effect
            scFade: 'scFade',
            stDuringBeginFade: 'stDuringBeginFade',
            stDuringLengthFade: 'stDuringLengthFade',
            ssEasingFade: 'ssEasingFade',
            stScaleFade: 'stScaleFade',
            
            // Z-index
            scZIndex: 'scZIndex',
            stDuringBeginZIndex: 'stDuringBeginZIndex',
            stDuringLengthZIndex: 'stDuringLengthZIndex',
            ssEasingZIndex: 'ssEasingZIndex',
            stScaleZIndex: 'stScaleZIndex',
            ssRoundZIndex: 'ssRoundZIndex',
            
            // Chess Mode
            scChessColHorizontal: 'scChessColHorizontal',
            scChessColVertical: 'scChessColVertical',
            scChessRowHorizontal: 'scChessRowHorizontal',
            scChessRowVertical: 'scChessRowVertical',
        };
        
        this.fieldsSel = $.extend( {}, defaultFields, fields );
        
        this.flyHorzGroup = '#' + this.fieldsSel.stDuringBeginHor + ',' +
        '#' + this.fieldsSel.stDuringLengthHor + ',' +
        '#' + this.fieldsSel.ssEasingHorizontal + ',' +
        '#' + this.fieldsSel.stScaleHorizontal + ',' +
        '#' + this.fieldsSel.ssRoundHorizontal;

        this.flyVertGroup =    '#' + this.fieldsSel.stDuringBeginVer + ',' +
        '#' + this.fieldsSel.stDuringLengthVer + ',' +
        '#' + this.fieldsSel.ssEasingVertical + ',' +
        '#' + this.fieldsSel.stScaleVertical + ',' +
        '#' + this.fieldsSel.ssRoundVertical;

        this.clipGroup = '#' + this.fieldsSel.stDuringBeginClip + ',' +
        '#' + this.fieldsSel.stDuringLengthClip + ',' +
        '#' + this.fieldsSel.ssEasingClip + ',' +
        '#' + this.fieldsSel.stScaleClip + ',' +
        '#' + this.fieldsSel.ssRoundClip;

        this.zoomGroup = '#' + this.fieldsSel.stDuringBeginZoom + ',' +
        '#' + this.fieldsSel.stDuringLengthZoom + ',' +
        '#' + this.fieldsSel.ssEasingZoom + ',' +
        '#' + this.fieldsSel.stScaleZoom + ',' +
        '#' + this.fieldsSel.ssRoundZoom;

        this.rotateGroup = '#' + this.fieldsSel.stDuringBeginRotate + ',' +
        '#' + this.fieldsSel.stDuringLengthRotate + ',' +
        '#' + this.fieldsSel.ssEasingRotate + ',' +
        '#' + this.fieldsSel.stScaleRotate + ',' +
        '#' + this.fieldsSel.ssRoundRotate;

        this.fadeGroup = '#' + this.fieldsSel.stDuringBeginFade + ',' +
        '#' + this.fieldsSel.stDuringLengthFade + ',' +
        '#' + this.fieldsSel.ssEasingFade + ',' +
        '#' + this.fieldsSel.stScaleFade;

        this.zIndexGroup = '#' + this.fieldsSel.stDuringBeginZIndex + ',' +
        '#' + this.fieldsSel.stDuringLengthZIndex + ',' +
        '#' + this.fieldsSel.ssEasingZIndex + ',' +
        '#' + this.fieldsSel.stScaleZIndex + ',' +
        '#' + this.fieldsSel.ssRoundZIndex;
        
        // the effect object
        this.fxObj = {};
        
        // used for determination of class attributes of inputs
        this.invalidFields = [];
        this.nouseFields = [];
        
        this.init();
        this.evt();
    };
    
    window.jssorFxBuilder.prototype = {
        
        constructor: window.jssorFxBuilder,
        
        init: function() {
            this.setStates();
            this.buildFxObj();
            this.updateCode();
        },
        
        /**
         *  event handler
         */
        evt: function(){
            var that = this;
            
            // on input/select value changed
            $( document ).on( 'change', '#' + that.wrapperID + ' select,#' + that.wrapperID + ' input[type="text"]', function( ev ) {
                that.inputChangedTasks();
            } );
            
            // on checkbox clicked
            $( document ).on( 'click', '#' + that.wrapperID + ' input[type="checkbox"]', function( ev ) {
                that.inputChangedTasks();
            } );
            
            // select code input text on click
            $( document ).on( 'click', this.codeFieldSelector, function( ev ) {
                $( this ).select();
            } );
        },
        
        /**
         *  reset each original field values
         */
        resetOrv: function() {
            $( '#' + this.wrapperID ).find( 'select,input' ).each( function () {
                if ( false == $( this ).prop( 'disabled' ) ) {
                    var tagName = $( this ).prop( 'tagName' );
                    var id = $( this ).attr( 'id' );
                    var type = 'generic';
                    if ( 'SELECT' == tagName ) {
                        type = 'select';
                    } else if ( 'INPUT' == tagName && 'checkbox' == $( this ).attr( 'type' ) ) {
                        type = 'checkbox';
                    }
                    switch ( type ) {
                        case 'checkbox' :
                            $( this ).data( 'orv', $( this ).prop( 'checked' ) );
                            break;
                        default :
                            $( this ).data( 'orv', $( this ).val() );
                    }
                }
                $( this ).removeClass( 'modified-field' );
            } );
        },
        
        /**
         *  return the jssor's during parameters with start and length
         *  
         *  @param [int] s, start time
         *  @param [int] e, end time
         *  
         *  @return [mixed] array if s and e are consistent, FALSE if not.
         */
        duringArray: function( s, e ) {
            var start = $( '#' + s ).val().replace( / /g, '' ).replace( /,/g, '.' );
            var end = $( '#' + e ).val().replace( / /g, '' ).replace( /,/g, '.' );
            var result = false;
            if ( ( '' == start && '' != end ) || ( '' != start && '' == end ) ) {
                // one and only one is empty
                this.invalidFields.push( '#' + s );
                this.invalidFields.push( '#' + e );
                return false;
            }
            if ( '' == start && '' == end ) {
                return null;
            }
            var invalidField = false;
            if ( null === start.match( /^(0(\.\d+)?|1)$/ ) ) {
                // start time has an invalid format
                this.invalidFields.push( '#' + s );
                invalidField = true;
            }
            
            if ( null == end.match( /^(0(\.\d+)?|1)$/ ) ) {
                // start time has an invalid format
                this.invalidFields.push( '#' + e );
                invalidField = true;
            }
            if ( invalidField ) {
                return false;
            }
            var _s = parseFloat( parseFloat( start ).toFixed( 4 ) );
            var _e = parseFloat( parseFloat( end ).toFixed( 4 ) );
            if ( isNaN( _s ) || isNaN( _e ) ) {
                return false;
                // fields are already invalidated at this point
            }
            
            if ( 0 <= _e - _s ) {
                if ( 0 != _e - _s ) {
                    result = [_s, ( _e - _s ).toFixed( 4 )];
                } else {
                    // start = end, nothing to do, just return false
                    this.nouseFields.push( '#' + s );
                    this.nouseFields.push( '#' + e );
                }
            } else {
                this.invalidFields.push( '#' + s );
                this.invalidFields.push( '#' + e );
                return false;
            }
            return result;
        },
        
        // build the effect object (json, not valid jssor effect object)
        buildFxObj: function() {
            
            var duringObj = {};
            var easingObj = {};
            var roundObj = {};
            this.nouseFields = [];
            this.invalidFields = [];
            this.fxObj = {};
            // Duration
            this.fxObj.$Duration = parseInt( $( '#' + this.fieldsSel.ssDuration ).val() );
            
            // slide transition specific properties
            if ( 'ca' != this.fxType ) {
                
                // Formation
                var _formation = $( '#' + this.fieldsSel.ssFormation ).val();
                if (
                    '$JssorSlideshowFormations$.$FormationRandom' != _formation &&
                    '' != _formation
                ) {
                    // when not the default formation
                    this.fxObj.$Formation = _formation;
                }
                
                // Assembly
                var _assembly = $ ( '#' + this.fieldsSel.ssAssembly ).val();
                if ( '' != _assembly ) {
                    this.fxObj.$Assembly = parseInt( _assembly );
                }
                
                // Cols and Rows and Delay
                this.fxObj.$Cols = parseInt( $( '#' + this.fieldsSel.ssCols ).val() );
                this.fxObj.$Rows = parseInt( $( '#' + this.fieldsSel.ssRows ).val() );
                if ( 0 != parseInt( $( '#' + this.fieldsSel.ssDelay ).val() ) ) {
                    this.fxObj.$Delay = parseInt( $( '#' + this.fieldsSel.ssDelay ).val() );
                }
                
                // Play outside
                if ( false == $( '#' + this.fieldsSel.scOutside ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scOutside ).prop( 'checked' ) ) {
                    this.fxObj.$Outside = true;
                } else {
                    delete( this.fxObj.$Outside );
                }
                
                // Slide Out
                if ( false == $( '#' + this.fieldsSel.scSlideOut ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scSlideOut ).prop( 'checked' ) ) {
                    this.fxObj.$SlideOut = true;
                } else {
                    delete( this.fxObj.$SlideOut );
                }
                
                // Reverse
                if ( false == $( '#' + this.fieldsSel.scReverse ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scReverse ).prop( 'checked' ) ) {
                    this.fxObj.$Reverse = true;
                } else {
                    delete( this.fxObj.$Reverse );
                }
            
            }
            
            // Move
            if ( false == $( '#' + this.fieldsSel.scMove ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scMove ).prop( 'checked' ) ) {
                this.fxObj.$Move = true;
            } else {
                delete( this.fxObj.$Move );
            }
            
            
            // Fly horz
            var x = parseInt( $( '#' + this.fieldsSel.ssFlyHorizontal ).val() );
            if ( 0 != x ) {
                var _xScale = $( '#' + this.fieldsSel.stScaleHorizontal ).val().replace( / /g,'' ).replace( /,/g, '.' );
                if ( '' == _xScale ) {
                    _xScale = '1';
                }
                
                if ( null !== _xScale.match( /^\d+(:?\.\d+)?$/ ) ) {
                    var xScale = parseFloat( _xScale );
                
                    if ( 0 != xScale ) {
                        this.fxObj.x = x * xScale;
                    } else {
                        // Fly horz effect is used (x != 0) but there is no impact (xScale = 0)
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleHorizontal );
                        // use 1 as scale
                        this.fxObj.x = x * 1;
                    }
                    
                } else {
                    // not a valid scale
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleHorizontal );
                }
                
                
                // during
                var _flyHorzDuring = this.duringArray( this.fieldsSel.stDuringBeginHor, this.fieldsSel.stDuringLengthHor );
                
                if ( false !== _flyHorzDuring && null !== _flyHorzDuring ) {
                    duringObj.$Left = _flyHorzDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingHorizontal ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingHorizontal ).val()
                ) {
                    easingObj.$Left = $( '#' + this.fieldsSel.ssEasingHorizontal ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundHorizontal ).val() ) {
                    roundObj.$Left = parseFloat( $( '#' + this.fieldsSel.ssRoundHorizontal ).val() );
                }
                
            }
            
            // Fly vert
            var y = parseInt( $( '#' + this.fieldsSel.ssFlyVertical ).val() );
            if ( 0 != y ) {
                // fly vert effect is used
                var _yScale = $( '#' + this.fieldsSel.stScaleVertical ).val().replace( / /g,'' ).replace( /,/g, '.' );
                if ( '' == _yScale ) {
                    _yScale = '1';
                }
                
                if ( null !== _yScale.match( /^\d+(:?\.\d+)?$/ ) ) {
                    var yScale = parseFloat( _yScale );
                    
                    if ( 0 != yScale ) {
                        this.fxObj.y = y * yScale;
                    } else {
                        // Fly vert is used (y != 0) but there is no impact (yScale = 0)
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleVertical );
                        // use 1 as scale
                        this.fxObj.y = y * 1;
                    }
                } else {
                    // not a valid scale
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleVertical );
                }
                
                // during
                var _flyVertDuring = this.duringArray( this.fieldsSel.stDuringBeginVer, this.fieldsSel.stDuringLengthVer );
                
                if ( false !== _flyVertDuring && null !== _flyVertDuring ) {
                    duringObj.$Top = _flyVertDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingVertical ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingVertical ).val()
                ) {
                    easingObj.$Top = $( '#' + this.fieldsSel.ssEasingVertical ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundVertical ).val() ) {
                    roundObj.$Top = parseFloat( $( '#' + this.fieldsSel.ssRoundVertical ).val() );
                }
            }
            
            // Clip
            if ( '' != $( '#' + this.fieldsSel.ssClip ).val() ) {
                this.fxObj.$Clip = parseInt( $( '#' + this.fieldsSel.ssClip ).val() );
                var _clipScale = $( '#' + this.fieldsSel.stScaleClip ).val();
                if ( '' == _clipScale ) {
                    _clipScale = '1';
                }
                if ( null !== _clipScale.match( /^\d+(:?\.\d+)?$/ ) ) {
                    var clipScale = parseFloat( _clipScale );
                    if ( 0 == clipScale ) {
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleClip );
                    } else {
                        this.fxObj.$ScaleClip = clipScale;
                    }
                } else {
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleClip );
                }
                
                // during
                var _clipDuring = this.duringArray( this.fieldsSel.stDuringBeginClip, this.fieldsSel.stDuringLengthClip );
                if ( false !== _clipDuring && null !== _clipDuring ) {
                    duringObj.$Clip = _clipDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingClip ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingClip ).val()
                ) {
                    easingObj.$Clip = $( '#' + this.fieldsSel.ssEasingClip ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundClip ).val() ) {
                    roundObj.$Clip = parseFloat( $( '#' + this.fieldsSel.ssRoundClip ).val() );
                }
            }
            
            // Zoom
            if ( false == $( '#' + this.fieldsSel.scZoom ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scZoom ).prop( 'checked' ) ) {
                // zoom effect is active
                var _zoom = $( '#' + this.fieldsSel.stScaleZoom ).val().replace( / /g, '' ).replace( /,/g, '.' );
                if ( '' == _zoom ) {
                    // Default zoom 1 ( 0 + 1 )
                    _zoom = '1';
                }
                if ( null !== _zoom.match( /^-?\d+(:?\.\d+)?$/ ) ) {
                    if ( '1' != _zoom && '-1' != _zoom ) {
                        this.fxObj.$Zoom = parseFloat( _zoom ) + 1;
                    } else {
                        // 1 and -1 have no effect
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleZoom );
                    }
                } else {
                    // not a valid scale
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleZoom );
                }
                
                // during
                var _zoomDuring = this.duringArray( this.fieldsSel.stDuringBeginZoom, this.fieldsSel.stDuringLengthZoom );
                if ( false !== _zoomDuring && null !== _zoomDuring ) {
                    duringObj.$Zoom = _zoomDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingZoom ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingZoom ).val()
                ) {
                    easingObj.$Zoom = $( '#' + this.fieldsSel.ssEasingZoom ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundZoom ).val() ) {
                    roundObj.$Zoom = parseFloat( $( '#' + this.fieldsSel.ssRoundZoom ).val() );
                }
            }
            
            // Rotate
            if (  false == $( '#' + this.fieldsSel.scRotate ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scRotate ).prop( 'checked' ) ) {
                var _rotate = $( '#' + this.fieldsSel.stScaleRotate ).val().replace( / /g, '' ).replace( /,/g, '.' );
                if ( '' == _rotate ) {
                    _rotate = '0';
                }
                if ( null !== _rotate.match( /^-?\d+(:?\.\d+)?$/ ) ) {
                    if ( '0' != _rotate ) {
                        this.fxObj.$Rotate = parseFloat( _rotate );
                    } else {
                        // scale with no impact ('0' or '')
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleRotate );
                    }
                } else {
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleRotate );
                }
                
                // during
                var _rotateDuring = this.duringArray( this.fieldsSel.stDuringBeginRotate, this.fieldsSel.stDuringLengthRotate );
                
                if ( false !== _rotateDuring && null !== _rotateDuring ) {
                    duringObj.$Rotate = _rotateDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingRotate ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingRotate ).val()
                ) {
                    easingObj.$Rotate = $( '#' + this.fieldsSel.ssEasingRotate ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundRotate ).val() ) {
                    roundObj.$Rotate = parseFloat( $( '#' + this.fieldsSel.ssRoundRotate ).val() );
                }
            }
            
            // Fade
            if (  false == $( '#' + this.fieldsSel.scFade ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scFade ).prop( 'checked' ) ) {
                var _fade = $( '#' + this.fieldsSel.stScaleFade ).val().replace( / /g, '' ).replace( /,/g, '.' );
                if ( '' == _fade ) {
                    _fade = '0';
                }
                
                if ( null !== _fade.match( /^(?:(?:0(?:\.\d+)?)|(?:1)){1}$/ ) ) {
                    if ( '0' == _fade ) {
                        // no impact
                        this.nouseFields.push( '#' + this.fieldsSel.stScaleFade );
                    } else {
                        this.fxObj.$Opacity = 1 + parseFloat( _fade );
                    }
                } else {
                    // invalid scale
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleFade );
                }
                
                // during
                var _fadeDuring = this.duringArray( this.fieldsSel.stDuringBeginFade, this.fieldsSel.stDuringLengthFade );
                if ( false !== _fadeDuring && null!== _fadeDuring ) {
                    duringObj.$Opacity = _fadeDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingFade ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingFade ).val()
                ) {
                    easingObj.$Opacity = $( '#' + this.fieldsSel.ssEasingFade ).val();
                }
                // no round
            }
            
            // Zindex
            if (  false == $( '#' + this.fieldsSel.scZIndex ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scZIndex ).prop( 'checked' ) ) {
                var _zindex = $( '#' + this.fieldsSel.stScaleZIndex ).val();
                if ( '' == _zindex ) {
                    _zindex = '1';
                }
                if ( null !== _zindex.match( /^-?\d+(:?\.\d+)?$/ ) ) {
                    var zindex = parseFloat( _zindex );
                    this.fxObj.$ZIndex = zindex;
                } else {
                    // invalid scale
                    this.invalidFields.push( '#' + this.fieldsSel.stScaleZIndex );
                }
                
                
                // during
                var _zindexDuring = this.duringArray( this.fieldsSel.stDuringBeginZIndex, this.fieldsSel.stDuringLengthZIndex );
                if ( false !== _zindexDuring && null !== _zindexDuring ) {
                    duringObj.$ZIndex = _zindexDuring;
                }
                
                // easing
                if ( 
                    '$JssorEasing$.$EaseSwing' != $( '#' + this.fieldsSel.ssEasingZIndex ).val() &&
                    '' != $( '#' + this.fieldsSel.ssEasingZIndex ).val()
                ) {
                    easingObj.$ZIndex = $( '#' + this.fieldsSel.ssEasingZIndex ).val();
                }
                
                // round
                if ( '' != $( '#' + this.fieldsSel.ssRoundZIndex ).val() ) {
                    roundObj.$ZIndex = parseFloat( $( '#' + this.fieldsSel.ssRoundZIndex ).val() );
                }                
            }
            
            // during object
            if ( ! $.isEmptyObject( duringObj ) ) {
                this.fxObj.$During = duringObj;
            }
            
            // easing object
            if ( ! $.isEmptyObject( easingObj ) ) {
                this.fxObj.$Easing = easingObj;
            }
            
            // round object
            if ( ! $.isEmptyObject( roundObj ) ) {
                this.fxObj.$Round = roundObj;
            }
            
            if ( 'ca' != this.fxType ) {
                
                /**
                 * Chess Mode
                 */
                var chessObj = {}
                var chessCol = 0;
                var chessRow = 0;
                
                // chess column horizontal
                if ( 
                    false == $( '#' + this.fieldsSel.scChessColHorizontal ).prop( 'disabled' ) &&
                    true == $( '#' + this.fieldsSel.scChessColHorizontal ).prop( 'checked' ) 
                ) {
                    chessCol += 3;
                }
                
                // chess column vertical
                if ( 
                    false == $( '#' + this.fieldsSel.scChessColVertical ).prop( 'disabled' ) &&
                    true == $( '#' + this.fieldsSel.scChessColVertical ).prop( 'checked' ) 
                ) {
                    chessCol += 12;
                }
                
                if ( 0 != chessCol ) {
                    chessObj.$Column = chessCol;
                }
                
                // chess row horizontal
                if ( 
                    false == $( '#' + this.fieldsSel.scChessRowHorizontal ).prop( 'disabled' ) &&
                    true == $( '#' + this.fieldsSel.scChessRowHorizontal ).prop( 'checked' ) 
                ) {
                    chessRow += 3;
                }
                
                // chess row vertical
                if ( 
                    false == $( '#' + this.fieldsSel.scChessRowVertical ).prop( 'disabled' ) &&
                    true == $( '#' + this.fieldsSel.scChessRowVertical ).prop( 'checked' ) 
                ) {
                    chessRow += 12;
                }
                
                if ( 0 != chessRow ) {
                    chessObj.$Row = chessRow;
                }
                if ( ! $.isEmptyObject( chessObj ) ) {
                    this.fxObj.$ChessMode = chessObj;
                }
            }
            // set class attributes for inputs
            $( '#' + this.wrapperID ).find( 'input,select,textarea' ).removeAttr( 'class' );
            var nouse = this.nouseFields.join( ',' );
            var invalid = this.invalidFields.join( ',' );
            
            $( nouse ).addClass( 'nouse-field' );
            $( invalid ).addClass( 'invalid-field' );
            if ( $( '#' + this.wrapperID ).find( '#shBrother' ).val() ) {
                var bro = JSON.parse( $( '#' + this.wrapperID ).find( '#shBrother' ).val() );
                this.fxObj.$Brother = bro;
                $( '#clear-brother' ).text( BuilderLocale.clear ).prop( 'disabled', false );
                $( '#open-brother' ).text( BuilderLocale.editTwin );
            } else {
                if ( undefined !== this.fxObj.$Brother ) {
                    delete( this.fxObj.$Brother );
                }
                $( '#clear-brother' ).text( BuilderLocale.empty ).prop( 'disabled', true );
                $( '#open-brother' ).text( BuilderLocale.addTwin );
            }
            
        },
        
        /**
         *  set fields state (disabled, CSS classes) after something changed 
         */
        setStates: function() {
            
            /**
             * if no fly horizontal effect, then disable all related fields
             */
            if ( '0' == $( '#' + this.fieldsSel.ssFlyHorizontal ).val() ) {
                $( this.flyHorzGroup ).attr( 'disabled', 'disabled' );
            } else {
                $( this.flyHorzGroup ).removeAttr( 'disabled' );
            }
            
            /**
             * idem for fly vertical effect
             */
            if ( '0' == $( '#' + this.fieldsSel.ssFlyVertical ).val() ) {
                $( this.flyVertGroup ).attr( 'disabled', 'disabled' );
            } else {
                $( this.flyVertGroup ).removeAttr( 'disabled' );
            }
            
            /**
             * then for Clip
             */
            if ( '' == $( '#' + this.fieldsSel.ssClip ).val() ) {
                $( this.clipGroup ).attr( 'disabled', 'disabled' );
            } else {
                $( this.clipGroup ).removeAttr( 'disabled' );
            }
            
            /**
             * disable Zoom and Rotate when there are more than 2 blocks
             */
            if ( 'ca' != this.fxType ) {
                /**
                 * Rows and column
                 */
                var _c = parseInt( $( '#' + this.fieldsSel.ssCols ).val() );
                var _r = parseInt( $( '#' + this.fieldsSel.ssRows ).val() );
                if ( 2 < ( _c * _r ) ) {
                    $( '#' + this.fieldsSel.scZoom ).prop( 'disabled', true );
                    $( '#' + this.fieldsSel.scRotate ).prop( 'disabled', true );
                } else {
                    $( '#' + this.fieldsSel.scZoom ).prop( 'disabled', false );
                    $( '#' + this.fieldsSel.scRotate ).prop( 'disabled', false );
                }
            }
            
            /**
             * Zoom
             */
            if ( false == $( '#' + this.fieldsSel.scZoom ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scZoom ).prop( 'checked' ) ) {
                $( this.zoomGroup ).removeAttr( 'disabled' );
            } else {
                $( this.zoomGroup ).attr( 'disabled', 'disabled' );
            }
            
            /**
             * Rotate
             */
            if ( false == $( '#' + this.fieldsSel.scRotate ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scRotate ).prop( 'checked' ) ) {
                $( this.rotateGroup ).removeAttr( 'disabled' );
            } else {
                $( this.rotateGroup ).attr( 'disabled', 'disabled' );
            }
            
            /**
             * Fade
             */
            if ( false == $( '#' + this.fieldsSel.scFade ).prop( 'checked' ) ) {
                $( this.fadeGroup ).attr( 'disabled', 'disabled' );
            } else {
                $( this.fadeGroup ).removeAttr( 'disabled' );
            }
            
            /**
             * Z-index
             */
            if ( false == $( '#' + this.fieldsSel.scZIndex ).prop( 'checked' ) ) {
                $( this.zIndexGroup ).attr( 'disabled', 'disabled' );
            } else {
                $( this.zIndexGroup ).removeAttr( 'disabled' );
            }
            if ( 'ca' != this.fxType ) {
                
                /**
                 * Chess Mode
                 */
                var _CH = ['5', '6', '9', '10', '1', '2', '14', '13'];
                var _RH = ['5', '6', '9', '10', '1', '2', '14', '13'];
                var _CV = ['5', '6', '9', '10', '4', '8', '11', '7'];
                var _RV = ['5', '6', '9', '10', '4', '8', '11', '7'];
                
                var needle = $( '#' + this.fieldsSel.ssClip ).val();
                $( 
                    '#' + this.fieldsSel.scChessColHorizontal + ',' +
                    '#' + this.fieldsSel.scChessColVertical + ',' +
                    '#' + this.fieldsSel.scChessRowHorizontal + ',' +
                    '#' + this.fieldsSel.scChessRowVertical
                ).attr( 'disabled', 'disabled' );
                
                // chess column horizontal
                if ( -1 != _CH.indexOf( needle ) || '0' != $( '#' + this.fieldsSel.ssFlyHorizontal ).val() ) {
                    $( '#' + this.fieldsSel.scChessColHorizontal ).removeAttr( 'disabled' );
                }
                
                // chess row horizental
                if ( -1 != _RH.indexOf( needle ) || '0' != $( '#' + this.fieldsSel.ssFlyHorizontal ).val() ) {
                    $( '#' + this.fieldsSel.scChessRowHorizontal ).removeAttr( 'disabled' );
                }
                
                // chess column vertical
                if ( -1 != _CV.indexOf( needle ) || '0' != $( '#' + this.fieldsSel.ssFlyVertical ).val() ) {
                    $( '#' + this.fieldsSel.scChessColVertical ).removeAttr( 'disabled' );
                }
                
                // chess column vertical
                if ( -1 != _CV.indexOf( needle ) || '0' != $( '#' + this.fieldsSel.ssFlyVertical ).val() ) {
                    $( '#' + this.fieldsSel.scChessRowVertical ).removeAttr( 'disabled' );
                }
                
                // Play Outside
                $( '#' + this.fieldsSel.scOutside ).attr( 'disabled', 'disabled');
                if (
                    '0' != $( '#' + this.fieldsSel.ssFlyHorizontal ).val() ||
                    '0' != $( '#' + this.fieldsSel.ssFlyVertical ).val() ||
                    ( false == $( '#' + this.fieldsSel.scZoom ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scZoom ).prop( 'checked' ) ) ||
                    ( false == $( '#' + this.fieldsSel.scRotate ).prop( 'disabled' ) && true == $( '#' + this.fieldsSel.scRotate ).prop( 'checked' ) )
                ) {
                    $( '#' + this.fieldsSel.scOutside ).removeAttr( 'disabled' );
                }
                
            }
            
            /**
             * Move
             */
            $( '#' + this.fieldsSel.scMove ).attr( 'disabled', 'disabled' );
            if ( -1 == ['', '15', '3', '12'].indexOf( $( '#' + this.fieldsSel.ssClip ).val() ) ) {
                $( '#' + this.fieldsSel.scMove ).removeAttr( 'disabled' );
            }
            
        },
        
        // add CSS class on each input if current value is different from the original one
        originalValues: function() {
            $( '#' + this.wrapperID ).find( 'select,input' ).each( function () {
                if ( false == $( this ).prop( 'disabled' ) ) {
                    var tagName = $( this ).prop( 'tagName' );
                    var id = $( this ).attr( 'id' );
                    var type = 'generic';
                    if ( 'SELECT' == tagName ) {
                        type = 'select';
                    } else if ( 'INPUT' == tagName && 'checkbox' == $( this ).attr( 'type' ) ) {
                        type = 'checkbox';
                    }
                    switch ( type ) {
                        case 'checkbox' :
                            if ( $( this ).data( 'orv' ) != $( this ).prop( 'checked' ) ) {
                                $( this ).addClass( 'modified-field' );
                            }
                            break;
                        default :
                            if ( $( this ).val() != $( this ).data( 'orv' ) ) {
                                // in case of unmodified value, nothing to do, css class already deleted by call to buildFxObj().
                                $( this ).addClass( 'modified-field' );
                            }
                    }
                }
            });
        },
        
        // update code field according to current value of fxObj
        updateCode: function() {
            $( this.codeFieldSelector ).val( jssorFunc.convert( this.fxObj, 'jssor' ) );
        },
        
        // tasks to be performed on builder input changed
        inputChangedTasks: function() {
            this.setStates();
            this.buildFxObj();
            this.originalValues();
            this.updateCode();
        },
        
        // load a code (jssor code). set all builder inputs value and orv attribute
        loadCode: function ( code ) {
            var jCode = jssorFunc.convert( code, 'json' );
            // formation
            if ( $( '#' + this.fieldsSel.ssFormation ).find( 'option[value="' + jCode.$Formation + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssFormation ).val( jCode.$Formation ).attr( 'data-orv', jCode.$Formation );
            } else {
                $( '#' + this.fieldsSel.ssFormation ).val( '' ).attr( 'data-orv', '' );
            }
            
            // assembly
            if ( $( '#' + this.fieldsSel.ssAssembly ).find( 'option[value="' + jCode.$Assembly + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssAssembly ).val( jCode.$Assembly ).attr( 'data-orv', jCode.$Assembly );
            } else {
                $( '#' + this.fieldsSel.ssAssembly ).val( '' ).attr( 'data-orv', '' );
            }
            
            // duration
            if ( $( '#' + this.fieldsSel.ssDuration ).find( 'option[value="' + jCode.$Duration + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssDuration ).val( jCode.$Duration ).attr( 'data-orv', jCode.$Duration );
            } else {
                $( '#' + this.fieldsSel.ssDuration ).val( '800' ).attr( 'data-orv', '800' );
            }
            
            // cols
            if ( $( '#' + this.fieldsSel.ssCols ).find( 'option[value="' + jCode.$Cols + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssCols ).val( jCode.$Cols ).attr( 'data-orv', jCode.$Cols );
            } else {
                $( '#' + this.fieldsSel.ssCols ).val( '1' ).attr( 'data-orv', '1' );
            }
            
            // rows
            if ( $( '#' + this.fieldsSel.ssRows ).find( 'option[value="' + jCode.$Rows + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssRows ).val( jCode.$Rows ).attr( 'data-orv', jCode.$Rows );
            } else {
                $( '#' + this.fieldsSel.ssRows ).val( '1' ).attr( 'data-orv', '1' );
            }
            
            // delay
            if ( $( '#' + this.fieldsSel.ssDelay ).find( 'option[value="' + jCode.$Delay + '"]' ).length ) {
                $( '#' + this.fieldsSel.ssDelay ).val( jCode.$Delay ).attr( 'data-orv', jCode.$Delay );
            } else {
                $( '#' + this.fieldsSel.ssDelay ).val( '0' ).attr( 'data-orv', '0' );
            }
            
            // reverse
            if ( jCode.$Reverse ) {
                $( '#' + this.fieldsSel.scReverse ).prop( 'checked', true ).attr( 'data-orv', 'true' );
            } else {
                $( '#' + this.fieldsSel.scReverse ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            }
            
            // slide out
            if ( jCode.$SlideOut ) {
                $( '#' + this.fieldsSel.scSlideOut ).prop( 'checked', true ).attr( 'data-orv', 'true' );
            } else {
                $( '#' + this.fieldsSel.scSlideOut ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            }
            
            // play outside
            if ( jCode.$Outside ) {
                $( '#' + this.fieldsSel.scOutside ).prop( 'checked', true ).attr( 'data-orv', 'true' );
            } else {
                $( '#' + this.fieldsSel.scOutside ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            }
            
            // move
            if ( jCode.$Move ) {
                $( '#' + this.fieldsSel.scMove ).prop( 'checked', true ).attr( 'data-orv', 'true' );
            } else {
                $( '#' + this.fieldsSel.scMove ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            }
            
            // fly horz
            if ( undefined === jCode.x ) {
                $( '#' + this.fieldsSel.ssFlyHorizontal ).val( '0' ).attr( 'data-orv', '0' );
                $( '#' + this.fieldsSel.stScaleHorizontal ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringBeginHor ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringLengthHor ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssEasingHorizontal ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssRoundHorizontal ).val( '' ).attr( 'data-orv', '' );
            } else {
                var xVal = parseFloat( jCode.x );
                var absX = Math.abs( xVal );
                if ( 0 > xVal ) {
                    $( '#' + this.fieldsSel.ssFlyHorizontal ).val( '-1' ).attr( 'data-orv', '-1' );
                } else {
                    $( '#' + this.fieldsSel.ssFlyHorizontal ).val( '1' ).attr( 'data-orv', '1' );
                }
                $( '#' + this.fieldsSel.stScaleHorizontal ).val( absX ).attr( 'data-orv', absX );
                
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Left ) {
                    $( '#' + this.fieldsSel.stDuringBeginHor ).val( jCode.$During.$Left[0] ).attr( 'data-orv', jCode.$During.$Left[0] );
                    $( '#' + this.fieldsSel.stDuringLengthHor ).val( jCode.$During.$Left[0] + jCode.$During.$Left[1] ).attr( 'data-orv', jCode.$During.$Left[0] + jCode.$During.$Left[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginHor ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthHor ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginHor ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthHor ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Left ) {
                    $( '#' + this.fieldsSel.ssEasingHorizontal ).val( jCode.$Easing.$Left ).attr( 'data-orv', jCode.$Easing.$Left );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingHorizontal ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingHorizontal ).val( '' ).attr( 'data-orv', '' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$Left ) {
                    $( '#' + this.fieldsSel.ssRoundHorizontal ).val( jCode.$Round.$Left ).attr( 'data-orv', jCode.$Round.$Left );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundHorizontal ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundHorizontal ).val( '' ).attr( 'data-orv', '' );
                }
                
            }
            
            // fly vert
            if ( undefined === jCode.y ) {
                $( '#' + this.fieldsSel.ssFlyVertical ).val( '0' ).attr( 'data-orv', '0' );
                $( '#' + this.fieldsSel.stScaleVertical ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringBeginVer ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringLengthVer ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssEasingVertical ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssRoundVertical ).val( '' ).attr( 'data-orv', '' );
            } else {
                var yVal = parseFloat( jCode.y );
                var absY = Math.abs( yVal );
                if ( 0 > yVal ) {
                    $( '#' + this.fieldsSel.ssFlyVertical ).val( '-1' ).attr( 'data-orv', '-1' );
                } else {
                    $( '#' + this.fieldsSel.ssFlyVertical ).val( '1' ).attr( 'data-orv', '1' );
                }
                $( '#' + this.fieldsSel.stScaleVertical ).val( absY ).attr( 'data-orv', absY );
                
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Top ) {
                    $( '#' + this.fieldsSel.stDuringBeginVer ).val( jCode.$During.$Top[0] ).attr( 'data-orv', jCode.$During.$Top[0] );
                    $( '#' + this.fieldsSel.stDuringLengthVer ).val( jCode.$During.$Top[0] + jCode.$During.$Top[1] ).attr( 'data-orv', jCode.$During.$Top[0] + jCode.$During.$Top[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginVer ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthVer ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginVer ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthVer ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Top ) {
                    $( '#' + this.fieldsSel.ssEasingVertical ).val( jCode.$Easing.$Top ).attr( 'data-orv', jCode.$Easing.$Top );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingVertical ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingVertical ).val( '' ).attr( 'data-orv', '' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$Top ) {
                    $( '#' + this.fieldsSel.ssRoundVertical ).val( jCode.$Round.$Top ).attr( 'data-orv', jCode.$Round.$Top );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundVertical ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundVertical ).val( '' ).attr( 'data-orv', '' );
                }
                
            }
            
            // clip
            if ( undefined === jCode.$Clip ) {
                $( '#' + this.fieldsSel.ssClip ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stScaleClip ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringBeginClip ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.stDuringLengthClip ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssEasingClip ).val( '' ).attr( 'data-orv', '' );
                $( '#' + this.fieldsSel.ssRoundClip ).val( '' ).attr( 'data-orv', '' );
            } else {
                $( '#' + this.fieldsSel.ssClip ).val( jCode.$Clip ).attr( 'data-orv', jCode.$Clip );
                
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Clip ) {
                    $( '#' + this.fieldsSel.stDuringBeginClip ).val( jCode.$During.$Clip[0] ).attr( 'data-orv', jCode.$During.$Clip[0] );
                    $( '#' + this.fieldsSel.stDuringLengthClip ).val( jCode.$During.$Clip[0] + jCode.$During.$Clip[1] ).attr( 'data-orv', jCode.$During.$Clip[0] + jCode.$During.$Clip[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginClip ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthClip ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginClip ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthClip ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Clip ) {
                    $( '#' + this.fieldsSel.ssEasingClip ).val( jCode.$Easing.$Clip ).attr( 'data-orv', jCode.$Easing.$Clip );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingClip ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingClip ).val( '' ).attr( 'data-orv', '' );
                }
                
                // scale
                if ( undefined == jCode.$ScaleClip ) {
                    $( '#' + this.fieldsSel.stScaleClip ).val( jCode.$ScaleClip ).attr( 'data-orv', jCode.$ScaleClip );
                } else {
                    $( '#' + this.fieldsSel.stScaleClip ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$Clip ) {
                    $( '#' + this.fieldsSel.ssRoundClip ).val( jCode.$Round.$Clip ).attr( 'data-orv', jCode.$Round.$Clip );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundClip ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundClip ).val( '' ).attr( 'data-orv', '' );
                }
                
            }
            
            // zoom
            if ( undefined === jCode.$Zoom ) {
                $( '#' + this.fieldsSel.scZoom ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            } else {
                $( '#' + this.fieldsSel.scZoom ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                var zoomVal = parseFloat( jCode.$Zoom ) - 1;
                $( '#' + this.fieldsSel.stScaleZoom ).val( zoomVal ).attr( 'data-orv', zoomVal );
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Zoom ) {
                    $( '#' + this.fieldsSel.stDuringBeginZoom ).val( jCode.$During.$Zoom[0] ).attr( 'data-orv', jCode.$During.$Zoom[0] );
                    $( '#' + this.fieldsSel.stDuringLengthZoom ).val( jCode.$During.$Zoom[0] + jCode.$During.$Zoom[1] ).attr( 'data-orv', jCode.$During.$Zoom[0] + jCode.$During.$Zoom[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginZoom ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthZoom ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginZoom ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthZoom ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Zoom ) {
                    $( '#' + this.fieldsSel.ssEasingZoom ).val( jCode.$Easing.$Zoom ).attr( 'data-orv', jCode.$Easing.$Zoom );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingZoom ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingZoom ).val( '' ).attr( 'data-orv', '' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$Zoom ) {
                    $( '#' + this.fieldsSel.ssRoundZoom ).val( jCode.$Round.$Zoom ).attr( 'data-orv', jCode.$Round.$Zoom );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundZoom ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundZoom ).val( '' ).attr( 'data-orv', '' );
                }
            }
            
            // rotate
            if ( undefined === jCode.$Rotate ) {
                $( '#' + this.fieldsSel.scRotate ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            } else {
                $( '#' + this.fieldsSel.scRotate ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                var rotateVal = parseFloat( jCode.$Rotate );
                $( '#' + this.fieldsSel.stScaleRotate ).val( rotateVal ).attr( 'data-orv', rotateVal );
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Rotate ) {
                    $( '#' + this.fieldsSel.stDuringBeginRotate ).val( jCode.$During.$Rotate[0] ).attr( 'data-orv', jCode.$During.$Rotate[0] );
                    $( '#' + this.fieldsSel.stDuringLengthRotate ).val( jCode.$During.$Rotate[0] + jCode.$During.$Rotate[1] ).attr( 'data-orv', jCode.$During.$Rotate[0] + jCode.$During.$Rotate[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginRotate ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthRotate ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginRotate ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthRotate ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Rotate ) {
                    $( '#' + this.fieldsSel.ssEasingRotate ).val( jCode.$Easing.$Rotate ).attr( 'data-orv', jCode.$Easing.$Rotate );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingRotate ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingRotate ).val( '' ).attr( 'data-orv', '' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$Rotate ) {
                    $( '#' + this.fieldsSel.ssRoundRotate ).val( jCode.$Round.$Rotate ).attr( 'data-orv', jCode.$Round.$Rotate );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundRotate ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundRotate ).val( '' ).attr( 'data-orv', '' );
                }
            }
            
            // fade
            if ( undefined === jCode.$Opacity ) {
                $( '#' + this.fieldsSel.scFade ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            } else {
                $( '#' + this.fieldsSel.scFade ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                var zoomVal = parseFloat( jCode.$Opacity ) - 1;
                $( '#' + this.fieldsSel.stScaleFade ).val( zoomVal ).attr( 'data-orv', zoomVal );
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$Opacity ) {
                    $( '#' + this.fieldsSel.stDuringBeginFade ).val( jCode.$During.$Opacity[0] ).attr( 'data-orv', jCode.$During.$Opacity[0] );
                    $( '#' + this.fieldsSel.stDuringLengthFade ).val( jCode.$During.$Opacity[0] + jCode.$During.$Opacity[1] ).attr( 'data-orv', jCode.$During.$Opacity[0] + jCode.$During.$Opacity[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginFade ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthFade ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginFade ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthFade ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$Opacity ) {
                    $( '#' + this.fieldsSel.ssEasingFade ).val( jCode.$Easing.$Opacity ).attr( 'data-orv', jCode.$Easing.$Opacity );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingFade ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingFade ).val( '' ).attr( 'data-orv', '' );
                }
            }
            
            // z-index
            if ( undefined === jCode.$ZIndex ) {
                $( '#' + this.fieldsSel.scZIndex ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            } else {
                $( '#' + this.fieldsSel.scZIndex ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                var rotateVal = parseFloat( jCode.$ZIndex );
                $( '#' + this.fieldsSel.stScaleZIndex ).val( rotateVal ).attr( 'data-orv', rotateVal );
                // during
                if ( undefined !== jCode.$During && undefined !== jCode.$During.$ZIndex ) {
                    $( '#' + this.fieldsSel.stDuringBeginZIndex ).val( jCode.$During.$ZIndex[0] ).attr( 'data-orv', jCode.$During.$ZIndex[0] );
                    $( '#' + this.fieldsSel.stDuringLengthZIndex ).val( jCode.$During.$ZIndex[0] + jCode.$During.$ZIndex[1] ).attr( 'data-orv', jCode.$During.$ZIndex[0] + jCode.$During.$ZIndex[1] );
                } else if ( undefined !== jCode.$During && Array.isArray( jCode.$During ) ) {
                    $( '#' + this.fieldsSel.stDuringBeginZIndex ).val( jCode.$During[0] ).attr( 'data-orv', jCode.$During[0] );
                    $( '#' + this.fieldsSel.stDuringLengthZIndex ).val( jCode.$During[0] + jCode.$During[1] ).attr( 'data-orv', jCode.$During[0] + jCode.$During[1] );
                } else {
                    $( '#' + this.fieldsSel.stDuringBeginZIndex ).val( '0' ).attr( 'data-orv', '0' );
                    $( '#' + this.fieldsSel.stDuringLengthZIndex ).val( '1' ).attr( 'data-orv', '1' );
                }
                
                // easing
                if ( undefined !== jCode.$Easing && undefined !== jCode.$Easing.$ZIndex ) {
                    $( '#' + this.fieldsSel.ssEasingZIndex ).val( jCode.$Easing.$ZIndex ).attr( 'data-orv', jCode.$Easing.$ZIndex );
                } else if ( undefined !== jCode.$Easing && 'string' === typeof( jCode.$Easing ) ) {
                    $( '#' + this.fieldsSel.ssEasingZIndex ).val( jCode.$Easing ).attr( 'data-orv', jCode.$Easing );
                } else {
                    $( '#' + this.fieldsSel.ssEasingZIndex ).val( '' ).attr( 'data-orv', '' );
                }
                
                // round
                if ( undefined !== jCode.$Round && undefined !== jCode.$Round.$ZIndex ) {
                    $( '#' + this.fieldsSel.ssRoundZIndex ).val( jCode.$Round.$ZIndex ).attr( 'data-orv', jCode.$Round.$ZIndex );
                } else if ( undefined !== jCode.$Round ) {
                    $( '#' + this.fieldsSel.ssRoundZIndex ).val( jCode.$Round ).attr( 'data-orv', jCode.$Round );
                } else {
                    $( '#' + this.fieldsSel.ssRoundZIndex ).val( '' ).attr( 'data-orv', '' );
                }
            }
            
            // chess mode
            $(
                '#' + this.fieldsSel.scChessColHorizontal + ',' +
                '#' + this.fieldsSel.scChessColVertical + ',' +
                '#' + this.fieldsSel.scChessRowHorizontal + ',' +
                '#' + this.fieldsSel.scChessRowVertical
            ).prop( 'checked', false ).attr( 'data-orv', 'false' );
            
            if ( undefined !== jCode.$ChessMode ) {
                if ( undefined !== jCode.$ChessMode.$Column ) {
                    if ( 3 == jCode.$ChessMode.$Column ) {
                        $( '#' + this.fieldsSel.scChessColHorizontal ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    } else if ( 12 == jCode.$ChessMode.$Column ) {
                        $( '#' + this.fieldsSel.scChessColVertical ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    } else {
                        $( '#' + this.fieldsSel.scChessColHorizontal + ',' + '#' + this.fieldsSel.scChessColVertical ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    }
                }
                if ( undefined !== jCode.$ChessMode.$Row ) {
                    if ( 3 == jCode.$ChessMode.$Row ) {
                        $( '#' + this.fieldsSel.scChessRowHorizontal ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    } else if ( 12 == jCode.$ChessMode.$Row ) {
                        $( '#' + this.fieldsSel.scChessRowVertical ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    } else {
                        $( '#' + this.fieldsSel.scChessRowHorizontal + ',' + '#' + this.fieldsSel.scChessRowVertical ).prop( 'checked', true ).attr( 'data-orv', 'true' );
                    }
                }
            }
            
            if ( undefined !== jCode.$Brother ) {
                $( '#' + this.wrapperID + ' #shBrother' ).val( JSON.stringify( jCode.$Brother, false, 0 ) );
            }
            
            this.inputChangedTasks();
        },
        
    };
    
})( jQuery );
