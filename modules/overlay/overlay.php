<?php
/**
 *  @module: overlay
 */
function cnhk_overlay_enqueue_scripts() {
    $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
    wp_enqueue_script( 'cnhk-overlay', CNHK_URL . 'modules/overlay/overlay' . $mini . '.js', array( 'jquery' ), CNHK_VERSION );
}
add_action( 'admin_enqueue_scripts', 'cnhk_overlay_enqueue_scripts' );
