<?php
/**
 *  @module: slide-html
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/slide-html/includes/class-slide-html.php';
function cnhk_register_module_slide_html( $modules ) {
    $slug = 'html';
    $args = array(
        'slug' => $slug, // The same slug ( must be the same anywhere within the module's files )
        'activator' => CNHK_PATH . 'modules/slide-html/activator.php', // the file to load if the module is active
        'name' => __( 'HTML Slides', 'cnhk-ss' ), // the name displayed in settings page
        'desc' => __( 'Use custom HTML content as slide', 'cnhk-ss' ), // the description for setting page
        'is_used' => array( 'cnhk_slide_html', 'is_used' ), // callback, check if the module is use by at least one slider
    );
    $modules[ $slug ] = $args;
    return $modules;
}
add_filter( 'cnhk-module-list', 'cnhk_register_module_slide_html' );
