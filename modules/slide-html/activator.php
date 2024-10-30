<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

// The module is active, add the slide type
function cnhk_slide_html( $slides ) {
    $slides['html'] = cnhk_slide_html::get_instance();
    return $slides;
}
add_filter( 'cnhk-slide-list', 'cnhk_slide_html' );
require_once CNHK_PATH . 'modules/slide-html/includes/class-layer-html.php';
cnhk_layer_html::get_instance();
