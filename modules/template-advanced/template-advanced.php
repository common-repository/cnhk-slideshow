<?php
/**
 *  @module: template-advanced
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/template-advanced/includes/class-template-advanced.php';
function cnhk_register_module_template_advanced( $modules ) {
    $slug = 'advanced';
    $args = array(
        'slug' => $slug,
        'activator' => CNHK_PATH . 'modules/template-advanced/activator.php',
        'name' => __( 'Advanced slider template', 'cnhk-ss' ),
        'desc' => __( 'Use advanced slide transitions and animated captions on HTML and image slide', 'cnhk-ss' ),
        'is_used' => array( 'cnhk_template_advanced', 'is_used' ),
    );
    $modules[ $slug ] = $args;
    return $modules;
}
add_filter( 'cnhk-module-list', 'cnhk_register_module_template_advanced' );
