<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Register template
function cnhk_register_template_advanced( $templates ) {
    $templates['advanced'] = cnhk_template_advanced::get_instance();
    return $templates;
}
add_filter( 'cnhk-template-list', 'cnhk_register_template_advanced' );
