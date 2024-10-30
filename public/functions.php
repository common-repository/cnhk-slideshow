<?php
/**
 *  shorthand (template tag) for rendering a slider
 *  @param [mixed], $which post ID or slug 
 */
function cnhk_slider( $which ) {
    cnhk_public::get_instance()->cnhk_slider( $which );
}

// the old template tag
function cnhk_slideshow( $which ) {
    cnhk_public::get_instance()->cnhk_slider( $which );
}

/**
 *  convert HEX color to rgb components
 */
function cnhk_hex_to_rgb( $hex ) {
    $hex = trim( str_replace( '#', '', $hex ) );

    if( strlen( $hex ) == 3 ) {
        $r = hexdec( substr( $hex, 0, 1 ).substr( $hex, 0, 1 ) );
        $g = hexdec( substr( $hex, 1, 1 ).substr( $hex, 1, 1 ) );
        $b = hexdec( substr( $hex, 2, 1 ).substr( $hex, 2, 1 ) );
    } else { 
        $r = hexdec( substr( $hex, 0, 2 ) );
        $g = hexdec( substr( $hex, 2, 2 ) );
        $b = hexdec( substr( $hex, 4, 2 ) );
    }
    $rgb = array( $r, $g, $b );
   
   return $rgb;
}

/**
 * convert a jssor effect into valid JSON string or directly into associative array
 *
 * @param [string] $jssor, the jssor effect code
 * @param [array] $to_array, whether to return an associative array or not
 */
function jssor_decode( $jssor, $to_array = true ) {
    $pattern = array(
        '/\s/',
        '/:(\$[^,}]+)/',
        '/([^{:,]+):/i',
    );
    $repl = array(
        '',
        ':"$1"',
        '"$1":',
    );
    $json = preg_replace( $pattern, $repl, $jssor );
    if ( ! $to_array ) {
        // do not return as an associative array, return a JSON string instead
        return $json;
    }
    $array = json_decode( $json, true );
        if ( null !== $array ) {
        return $array;
    } else {
        return false;
    }
}

/**
 *  convert effect into jssor code
 */
function jssor_encode( $fx ) {
    $json = json_encode( $fx );
    $code = str_replace( array( ' ', '"' ), array( '', '' ), $json );
    return $code;
}
