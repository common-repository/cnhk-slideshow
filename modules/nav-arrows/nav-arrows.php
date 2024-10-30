<?php
/**
 *  @module: nav-arrow
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/nav-arrows/includes/class-nav-arrows.php';
function cnhk_register_nav_arrows( $navs ) {
    $navs['arrows'] = cnhk_nav_arrows::get_instance();
    return $navs;
}
add_filter( 'cnhk-nav-list', 'cnhk_register_nav_arrows' );
