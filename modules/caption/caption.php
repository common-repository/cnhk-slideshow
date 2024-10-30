<?php
/**
 *  @module: caption
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
if ( is_admin() ) {
    
    require_once CNHK_PATH . 'modules/caption/includes/class-caption-admin.php';
    cnhk_caption_admin::get_instance();
    
    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
        require_once CNHK_PATH . 'modules/caption/includes/ajax.php';
        cnhk_caption_ajax::get_instance();
    }
    
} else {
    require_once CNHK_PATH . 'modules/caption/includes/functions.php';
}
