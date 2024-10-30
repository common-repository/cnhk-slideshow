<?php
/**
 *  @module: slide-image
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/slide-vimeo/includes/class-slide-vimeo.php';
function cnhk_register_module_slide_vimeo( $modules ) {
    $slug = 'vimeo';
    $args = array(
        'slug' => $slug, // The same slug ( must be the same anywhere within the module's files )
        'activator' => CNHK_PATH . 'modules/slide-vimeo/activator.php', // the file to load if the module is active
        'name' => __( 'Vimeo slides', 'cnhk-ss' ), // the name displayed in settings page
        'desc' => __( 'Use Vimeo video as slide', 'cnhk-ss' ), // the description for setting page
        'is_used' => array( 'cnhk_slide_vimeo', 'is_used' ), // callback, check if the module is use by at least one slider
    );
    $modules[ $slug ] = $args;
    return $modules;
}
add_filter( 'cnhk-module-list', 'cnhk_register_module_slide_vimeo' );
