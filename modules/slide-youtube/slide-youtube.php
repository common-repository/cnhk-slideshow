<?php
/**
 *  @module: slide-youtube
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/slide-youtube/includes/class-slide-youtube.php';
function cnhk_register_module_slide_youtube( $modules ) {
    $slug = 'youtube';
    $args = array(
        'slug' => $slug, // The same slug ( must be the same anywhere within the module's files )
        'activator' => CNHK_PATH . 'modules/slide-youtube/activator.php', // the file to load if the module is active
        'name' => __( 'YouTube slides', 'cnhk-ss' ), // the name displayed in settings page
        'desc' => __( 'Use YouTube video as slide', 'cnhk-ss' ), // the description for setting page
        'is_used' => array( 'cnhk_slide_youtube', 'is_used' ), // callback, check if the module is use by at least one slider
    );
    $modules[ $slug ] = $args;
    return $modules;
}
add_filter( 'cnhk-module-list', 'cnhk_register_module_slide_youtube' );
