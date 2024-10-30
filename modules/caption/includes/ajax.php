<?php
/**
 *  AJAX class handler for caption
 */
class cnhk_caption_ajax
{
	private static $instance = null;
	
	private function __construct() {
        add_action( 'wp_ajax_cnhk_add_caption', array( $this, 'add_caption' ) );
        add_action( 'wp_ajax_cnhk_caption_styling_form', array( $this, 'caption_styling_form' ) );
        add_action( 'wp_ajax_cnhk_caption_timing_form', array( $this, 'timing_form' ) );
	}
    
    /**
     *  return the markup of the timing form
     */
    public function timing_form() {
        if ( $this->check_nonce( $_POST['nonce'] ) ) {
            require CNHK_PATH . 'modules/caption/views/caption-timing-view.php';
        }
        die();
    }
    
    /**
     *  return the markup form styling form
     */
    public function caption_styling_form() {
        if ( $this->check_nonce( $_POST['nonce'] ) ) {
            require CNHK_PATH . 'modules/caption/views/caption-styling-view.php';
        }
        die();
    }
    
    /**
     *  return the markup for a new caption (or a copy)
     */
    public function add_caption() {
        if ( $this->check_nonce( $_POST['nonce'] ) ) {
            $slide = $_POST['slide'];
            $_caption = cnhk_caption_admin::get_instance();
            $_caption->set_default_data();
            $_caption->data['slide'] = $slide;
            if ( isset( $_POST['o-slide-id'] ) ) {
                $org_slide = $_POST['o-slide-id'];
                $org_caption = $_POST['o-ca-id'];
                $_caption->data = wp_unslash( $_POST['slides'][$org_slide]['captions'][$org_caption] );
                $_caption->data['id'] = wp_generate_password( 8, false );
                $_caption->data['slide'] = $slide;
                $_caption->data['name'] .= __( ' - copy', 'cnhk-ss' );
            }
            $_caption->admin_params();
        }
        die();
    }
    
    /**
	 *  Check nonce validity
	 */
	private function check_nonce( $nonce, $name = 'cnhk_ajax_nonce' ) {
		if ( false !== wp_verify_nonce( $nonce, $name ) ) {
			return true;
		} else {
			return false;
		}
	}
	
    /**
     *  return the unique instance of the class
     */
	public static function get_instance() {
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}    
}
