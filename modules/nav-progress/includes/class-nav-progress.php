<?php
/**
 *  progress bar class
 */
class cnhk_nav_progress extends cnhk_nav_abstract
{
    private static $instance = null;
    
    private function __construct() {
        $this->slug = 'progress';
        $this->name = __( 'Progress bar', 'cnhk-ss' );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
    }
    
    // enqueue script on post edit pages
    public function postnew_scripts( $scripts ) {
        $scripts['cnhk-nav-progress-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-progress/js/post-new.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print the admin form in the navigation metabox
    public function admin_params() {
        include_once CNHK_PATH . 'modules/nav-progress/includes/admin-params.php';
    }
        
    // print the HTML in the front end
    public function render( $data, $options ) {
        // markup is created, inserted and updated with javascript
        return;
    }
    
    // return the unique instance of this class.
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
