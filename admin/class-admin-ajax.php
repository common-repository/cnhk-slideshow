<?php
/**
 *  main AJAX actions for admin panel
 */
class cnhk_admin_ajax
{
	private static $instance = null;
	
	private function __construct() {
        add_action( 'wp_ajax_cnhk_add_slide', array( $this, 'add_slide' ) );
	}
    
    /**
	 *  check nonce validity
	 *  
	 *  @param [string] $nonce, the nonce to check
	 *  @param [string] $name, the context created with wp_create_nonce()
	 *  @return [bool], TRUE if valid nonce
	 */
	private function check_nonce( $nonce, $name = 'cnhk_ajax_nonce' ) {
		if ( false !== wp_verify_nonce( $nonce, $name ) ) {
			return true;
		} else {
			return false;
		}
	}
	
    /**
     *  add new slide on edit slideshow page (or paste a copy)
     */
    public function add_slide() {
        if ( $this->check_nonce( $_POST['nonce'] ) ) {
            $type = stripslashes( $_POST['type'] );
            $hndle = cnhk_ss::get_instance()->get_slide_type_handler( $type );
            
            if ( $hndle ) {
                if ( isset( $_POST['slides'] ) ) {
                    $context = array(
                        'slide_id' => wp_generate_password( 8, false ),
                        'slide' => wp_unslash( $_POST['slides'][$_POST['copy-id']] ),
                        'template' => $_POST['template'],
                    );
                    $context['slide']['name'] .= __( ' - copy', 'cnhk-ss' );
                    $hndle->admin_params( $context );
                } else {
                    $hndle->admin_params( array( 'template' => $_POST['template'] ) );
                }
            }
        }
        die();
    }
    
    /**
	 *  Returns the unique instance of the class
	 *  
	 *  @return cnhk_admin_ajax
	 *  
	 *  @since 1.0
	 */
	public static function get_instance() {
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}
}
cnhk_admin_ajax::get_instance();
