<?php
class cnhk_layer_ajax
{
    
    public function __construct() {
        add_action( 'wp_ajax_cnhk_add_layer', array( $this, 'add_layer' ) );
        add_action( 'wp_ajax_cnhk_layer_styling_form', array( $this, 'styling_form' ) );
    }
    
    // send the layer styling form
    public function styling_form() {
        $this->check_nonce( $_POST['nonce'] );
        require CNHK_PATH . 'modules/slide-html/views/layer-styling-view.php';
        die;
    }
    
    // send the markup of new layer (or the copy)
    public function add_layer() {
        $this->check_nonce( $_POST['nonce'] );
        if ( ! $_POST['slideId'] ) die;
        $layer = array( 'id' => wp_generate_password( 8, false ) );
        if ( isset( $_POST['slides'] ) ) {
            $org_slide = $_POST['original-slide-id'];
            $org_layer = $_POST['original-layer-id'];
            if ( isset( $_POST['slides'][$org_slide]['layers'][$org_layer] ) ) {
                $layer += wp_unslash( $_POST['slides'][$org_slide]['layers'][$org_layer] );
                $layer['name'] .= __( ' - copy', 'cnhk-ss' );
            }
        }
        cnhk_layer_html::single_layer_params( $layer, $_POST['slideId'] );
        die;
    }
    
    // check nonce validity
	private function check_nonce( $nonce, $name = 'cnhk_ajax_nonce' ) {
		if ( false === wp_verify_nonce( $nonce, $name ) ) {
			die;
		}
	}
}
new cnhk_layer_ajax();
