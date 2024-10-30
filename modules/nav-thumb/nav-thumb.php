<?php
/**
 *  @module: nav-thumb
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
if ( ! function_exists( 'imagecreatefromjpeg' ) || ! function_exists( 'imagecreatefrompng' ) ) {
    // no GD functions, abort
    return;
}

require_once CNHK_PATH . 'modules/nav-thumb/includes/class-nav-thumb.php';
function cnhk_register_nav_thumb( $navs ) {
    $navs['thumb'] = cnhk_nav_thumb::get_instance();
    return $navs;
}
add_filter( 'cnhk-nav-list', 'cnhk_register_nav_thumb' );
