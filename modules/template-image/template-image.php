<?php
/**
 *  @module: template-image
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Register template
require_once CNHK_PATH . 'modules/template-image/includes/class-template-image.php';
function cnhk_template_image( $templates ) {
    $templates['image'] = cnhk_template_image::get_instance();
    return $templates;
}
add_filter( 'cnhk-template-list', 'cnhk_template_image' );
