<?php
/**
 *  @module: template-classic
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once CNHK_PATH . 'modules/template-classic/includes/class-template-classic.php';
function cnhk_template_classic( $templates ) {
    $templates['classic'] = cnhk_template_classic::get_instance();
    return $templates;
}
add_filter( 'cnhk-template-list', 'cnhk_template_classic' );
