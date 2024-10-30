/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";

    var preloader = $( '<span class="preloader" style="width: 20px;height:20px;display:inline-block;vertical-align: middle;margin-left:10px;"><img alt="loading" src="/wp-admin/images/spinner.gif"/></span>' );
    
    // on DOM ready
    $(function(){
        
        // set up, initialize and start slider preview
        
        var _fx = '{$Duration:900,x:0.6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine},$Opacity:2}';
        var fx = jssorFunc.convert( _fx, 'fx' );
        var _cafx = [];
        _cafx['i'] = fx;
        _cafx['o'] = fx;
        
        var options = {
            $FillMode: 0,
            $DragOrientation: 1,
            $AutoPlay: true,
            $AutoPlayInterval: 1500,
            $PauseOnHover: 0,
            $CaptionSliderOptions: {
                $Class: $JssorCaptionSlider$,
                $CaptionTransitions: _cafx,
                $PlayInMode: 1,
                $PlayOutMode: 1,
            },
        }
        
        // launch the slider preview
        var slider = new $JssorSlider$( 'ss', options );
        
        // create an instance of effect builder
        var builder = new jssorFxBuilder( 'ca', {}, 'fx-builder' , '#the-code' );
        
        // resize function
        function resize() {
            slider.$ScaleWidth( Math.round( $( '#wrap-ca' ).width() * 0.5 ) );
        }
        
        $( window ).resize( function() {
            resize();
        } );
        
        resize();
        
        // fx picker
        $( '#cafx-selection' ).cnhkFxPicker({
            root: $( '#cafx-selection' ).attr( 'data-root' ),
            code: $( '#cafx-selection' ).val(),
        });
        
        // fx saver
        $( '#save-to-selection' ).cnhkFxSaver({
            root: $( '#save-to-selection' ).attr( 'data-root' ),
            codeElem: $( '#the-code' ),
        });
        
        // click on the play button
        $( document ).on( 'click', '#play', function( ev ) {
            ev.stopPropagation();
            ev.preventDefault();
            var rawFx = $( '#the-code' ).val();
            var fx = jssorFunc.convert( rawFx, 'fx' );
            if ( fx ) {
                $( '#the-code' ).css( 'background-color', '#fff' );
                _cafx['i'] = fx;
                _cafx['o'] = fx;
                slider.$SetCaptionTransitions( _cafx );
                slider.$Next();
                $( 'html body' ).animate({
                    scrollTop: $( slider.$Elmt ).offset().top - 50,
                }, 800);
                builder.resetOrv();
            } else {
                $( '#the-code' ).css( 'background-color', '#fcc' );
            }
        } );
        
        // load predefined effect
        $( document ).on( 'click', '#load-predefined', function( ev ) {
            ev.stopPropagation();
            ev.preventDefault();
            builder.loadCode( $( '#cafx-predefined' ).val() );
            window.jssorFunc.blink( '#fx-builder', '#cdf' );
            $( '#play' ).trigger( 'click' );
        } );
        
        // load user effect
        $( document ).on( 'click', '#load-collection', function( ev ) {
            ev.stopPropagation();
            ev.preventDefault();
            builder.loadCode( $( '#cafx-selection' ).val() );
            window.jssorFunc.blink( '#fx-builder', '#cdf' );
            $( '#play' ).trigger( 'click' );
        } );
        
        // run fields states verification when the builder has been changed
        $( document ).on( 'jssorFxChanged', '#fx-builder', function(){
            builder.inputChangedTasks();
        } );
        
        
    });// End on DOM ready
        
})( jQuery );
