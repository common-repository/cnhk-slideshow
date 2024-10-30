<?php
/**
 *  @module: nav-progress
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/nav-progress/includes/class-nav-progress.php';
function cnhk_register_nav_progress( $navs ) {
    $navs['progress'] = cnhk_nav_progress::get_instance();
    return $navs;
}
add_filter( 'cnhk-nav-list', 'cnhk_register_nav_progress' );
