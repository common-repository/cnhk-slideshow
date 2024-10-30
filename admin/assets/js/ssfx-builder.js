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
    
    // On DOM ready
    $(function(){
        var fx = null;
        var _ssfx = [ fx, fx ];
        
        var options = {
            $FillMode: 0,
            $DragOrientation: 1,
            $AutoPlay: true,
            $AutoPlayInterval: 1500,
            $SlideshowOptions: {
                $Class: $JssorSlideshowRunner$,
                $Transitions: _ssfx,
                $TransitionsOrder: 1,
            },
            $PauseOnHover: 0,
        }
        
        // launch the slider preview
        var slider = new $JssorSlider$( 'ss', options );
        
        // Create an instance of effect builder
        var builder = new jssorFxBuilder( 'ss', {}, 'fx-builder' , '#the-code' );
        
        $.brotherBuilder({
            codeInputSel: '#shBrother',
            codeDisplaySel: '#brother-code',
            twinBuilder: builder,
        });
        
        function resize() {
            slider.$ScaleWidth( Math.round( $( '#wrap-ss' ).width() * 0.50 ) );
        }
        
        $( window ).resize( function() {
            resize();
        } );
        
        resize();
        
        // fx picker
        $( '.fx-picker' ).each(function(){
            $( this ).cnhkFxPicker({
                root: $( this ).attr( 'data-root' ),
                code: $( this ).val(),
            });
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
           
            var newFx = jssorFunc.convert( $( '#the-code' ).val(), 'fx' );
            
            if ( false != newFx ) {
                $( '#the-code' ).css( 'background-color', '#fff' );
                slider.$SetSlideshowTransitions( [newFx, newFx, newFx] );
                slider.$Next();
                $( 'html body' ).animate({
                    scrollTop: $( slider.$Elmt ).offset().top - 50,
                }, 800);
                builder.resetOrv();
            } else {
                $( '#the-code' ).css( 'background-color', '#fcc' );
            }
            
        } );
        
        // Run fields states verification when the builder has been changed
        $( document ).on( 'jssorFxChanged', '#fx-builder', function(){
            builder.inputChangedTasks();
        } );
        
        // load predefined effect
        $( document).on( 'click', '#load-slidefx', function ( ev ) {
            ev.stopPropagation();
            ev.preventDefault();
            builder.loadCode( $( '#ssfx-predefined' ).val() );
            window.jssorFunc.blink( '#fx-builder', '#cdf' );
            $( '#play' ).trigger( 'click' );
        } );
        
        // load selection effect
        $( document ).on( 'click', '#load-selection', function ( ev ) {
            ev.stopPropagation();
            ev.preventDefault();
            builder.loadCode( $( '#ssfx-selection' ).val() );
            window.jssorFunc.blink( '#fx-builder', '#cdf' );
            $( '#play' ).trigger( 'click' );
        } );
        
    });
    
})( jQuery );
