<?php
/**
 *  AJAX actions for the editor
 */
class cnhk_editor_ajax
{
    // check nonce validity
	private function check_nonce( $nonce, $name = 'cnhk_ajax_nonce' ) {
		if ( false === wp_verify_nonce( $nonce, $name ) ) {
			die( 'security stop!' );
		}
	}
    
    public function __construct() {
        add_action( 'wp_ajax_cnhk_editor_link_form', array( $this, 'link_form' ) );
        add_action( 'wp_ajax_cnhk_editor_icon_form', array( $this, 'icon_form' ) );
        add_action( 'wp_ajax_cnhk_editor_image_form', array( $this, 'image_form' ) );
    }
    
    // send the markup for link form
    public function link_form() {
        $this->check_nonce( $_POST['nonce'] );
        require CNHK_PATH . 'modules/editor/views/editor-link.php';
        die();
    }
    
    // send the markup for image form
    public function image_form() {
        $this->check_nonce( $_POST['nonce'] );
        require CNHK_PATH . 'modules/editor/views/editor-image.php';
        die();
    }
    
    // send the markup for icon form
    public function icon_form() {
        $this->check_nonce( $_POST['nonce'] );
        require CNHK_PATH . 'modules/editor/views/editor-icon.php';
        die();
    }
    
}
new cnhk_editor_ajax;
