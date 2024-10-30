<?php
/**
 *  @module: internal
 */
if ( is_admin() ) {
    require_once CNHK_PATH . 'modules/internal/includes/class-internal.php';
    cnhk_internal::get_instance();
}
