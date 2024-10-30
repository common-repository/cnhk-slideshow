<?php
/**
 *  @module: nav-bullet
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/nav-bullet/includes/class-nav-bullet.php';
function cnhk_register_nav_bullet( $navs ) {
    $navs['bullet'] = cnhk_nav_bullet::get_instance();
    return $navs;
}
add_filter( 'cnhk-nav-list', 'cnhk_register_nav_bullet' );
