<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

// The module is active, add the slide type
function cnhk_slide_youtube( $slides ) {
    $slides['youtube'] = cnhk_slide_youtube::get_instance();
    return $slides;
}
add_filter( 'cnhk-slide-list', 'cnhk_slide_youtube' );
