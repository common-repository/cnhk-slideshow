/**
*   Plugin Name: Cnhk Slideshow
*
*   Cnhk Slideshow plugin for WordPress, Copyright (C) 2015 Rija Rajaonah
*   Cnhk Slideshow plugin for WordPress is licensed under the GPL License version 3.
*   [http://www.gnu.org/licenses/gpl-3.0.html]
*/
;(function( $ ){
    "use strict";
    
    // update field state depending on the usage or not of arrows navigator
    function checkMainState() {
        var ckb = $( '#use-nav-arrows' );
        if ( ckb.prop( 'checked' ) ) {
            $( '#nav-arrows-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', false );
            $( '#nav-arrows-params' ).find( '.wp-picker-container,#navs-arrows-bgOpacity' ).show();
            $( '#nav-arrows-params' ).find( '#select-arrows-color,#select-arrows-bgColor' ).hide();
            return true;
        } else {
            $( '#nav-arrows-params' ).find( 'input,select' ).not( ckb ).prop( 'disabled', true );
            $( '#nav-arrows-params' ).find( '.wp-picker-container,#navs-arrows-bgOpacity' ).hide();
            $( '#nav-arrows-params' ).find( '#select-arrows-color,#select-arrows-bgColor' ).show();
            return false;
        }
    }
    
    // update prev icon
    function updatePIcon() {
        $( '#picon-preview' ).html( '<span class="fa fa-' + $( '#navs-arrows-picon' ).val() + '"></span>' );
    }
    
    // update next icon
    function updateNIcon() {
        $( '#nicon-preview' ).html( '<span class="fa fa-' + $( '#navs-arrows-nicon' ).val() + '"></span>' );
    }
    
    // update arrow position
    function updatePosition() {
        if ( true === $( '#use-nav-arrows' ).prop( 'checked' ) ) {
            $( '.arrow-grid' ).not( '.arrow-grid.neutral' ).attr( 'class', 'arrow-grid' );
            var val = $( '#navs-arrows-position' ).val().split( '-' );
            var orientation = $( '#navs-arrows-orientation' ).val();
            var spacing = $( '#navs-arrows-spacing' ).val();
            if ( 'spaced' == spacing ) {
                if ( 'horizontal' == orientation ) {
                    // horizontal
                    $( '.arrow-grid[data-index="2"],.arrow-grid[data-index="8"]' ).addClass( 'disabled' );
                } else {
                    // vertical
                    $( '.arrow-grid[data-index="4"],.arrow-grid[data-index="6"]' ).addClass( 'disabled' );
                }
            }
            for ( var i in val ) {
                $( '.arrow-grid[data-index="' + val[i] + '"]' ).addClass( 'active' );
            }
        } else if ( false === $( '#use-nav-arrows' ).prop( 'checked' ) ) {
            $( '.arrow-grid' ).not( '.arrow-grid.neutral' ).attr( 'class', 'arrow-grid disabled' );
        }
    }
    
    $( document ).on( 'click', '#use-nav-arrows', function() {
        checkMainState();
        updatePosition();
    } );
    
    $( document ).on( 'change', '#navs-arrows-nicon', function(){
        updateNIcon();
    } );
    
    $( document ).on( 'change', '#navs-arrows-picon', function(){
        updatePIcon();
    } );
    
    $( document ).on( 'click', '#select-arrows-color', function ( ev ) {
        ev.preventDefault();
    } );
    
    // arrows orientation or spacing changed
    $( document ).on( 'change', '#navs-arrows-orientation,#navs-arrows-spacing', function ( ev ) {
        var orientation = $( '#navs-arrows-orientation' ).val();
        var spacing = $( '#navs-arrows-spacing' ).val();
        var newValue = '';
        if ( 'spaced' == spacing ) {
            // spaced
            if ( 'horizontal' == orientation ) {
                // horizontal
                newValue = '4-6';
            } else {
                // vertical
                newValue = '2-8';
            }
        } else {
            // grouped
            newValue = '9';
        }
        $( '#navs-arrows-position' ).val( newValue );
        updatePosition();
    } );
    
    // click on arrows positioning grid
    $( document ).on( 'click', '.arrow-grid', function ( ev ) {
        if ( $( this ).hasClass( 'neutral' ) || $( this ).hasClass( 'disabled' ) || $( this ).hasClass( 'active' ) ) return;
        if ( ! cnhkNavHandler['arrows'].isUsed() ) return;
        var orientation = $( '#navs-arrows-orientation' ).val();
        var spacing = $( '#navs-arrows-spacing' ).val();
        var i = $( this ).attr( 'data-index' );
        
        var newValue = '';
        if ( 'spaced' == spacing ) {
            // spaced
            if ( 'horizontal' == orientation ) {
                // horizontal
                switch ( i ) {
                    case '1' :
                    case '3' :
                    newValue = '1-3';
                        break;
                    case '4' :
                    case '6' :
                    newValue = '4-6';
                        break;
                    case '7' :
                    case '9' :
                    newValue = '7-9';
                        break;
                    default:
                }
            } else {
                // vertical
                switch ( i ) {
                    case '1' :
                    case '7' :
                    newValue = '1-7';
                        break;
                    case '2' :
                    case '8' :
                    newValue = '2-8';
                        break;
                    case '3' :
                    case '9' :
                    newValue = '3-9';
                        break;
                    default:
                }
            }
        } else {
            // grouped
            newValue = i;
        }
        $( '#navs-arrows-position' ).val( newValue );
        updatePosition();
    } );
    
    $( document ).on( 'click', '#navs-arrows-bg', function ( ev ) {
        if ( $( this ).prop( 'checked' ) ) {
            $( 'input[name="navs[arrows][bg]"]' ).val( 'use' );
        } else {
            $( 'input[name="navs[arrows][bg]"]' ).val( '' );
        }
    } );
    
    $( document ).on( 'click', '#navs-arrows-round', function ( ev ) {
        if ( $( this ).prop( 'checked' ) ) {
            $( 'input[name="navs[arrows][round]"]' ).val( 'round' );
        } else {
            $( 'input[name="navs[arrows][round]"]' ).val( '' );
        }
    } );
    
    $(function(){
        // update next and prev icons
        updateNIcon();
        updatePIcon();
        
        // init background opacity slider
        $( '#navs-arrows-bgOpacity' ).slider({
            step: 0.025,
            min: 0,
            max: 1,
            value: $( 'input[name="navs[arrows][bgOpacity]"]' ).val(),
            change: function ( ev, ui ) {
                $( 'input[name="navs[arrows][bgOpacity]"]' ).val( ui.value );
            },
        });
        
        // init color pickers
        
        $( '#navs-arrows-color' ).wpColorPicker({
            color: $( '#navs-arrows-color' ).val(),
        });
        
        $( '#navs-arrows-bgColor' ).wpColorPicker({
            color: $( '#navs-arrows-bgColor' ).val(),
        });
        
        checkMainState();
        
        if ( $( '#use-nav-arrows' ).length ) {
            updatePosition();
        }
        
    });
    
})( jQuery );
