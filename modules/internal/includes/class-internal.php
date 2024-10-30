<?php
/**
 *  module class for internal (critical) tasks
 */
class cnhk_internal
{   
    private static $instance = null;
    
    private function __construct() {
        add_action( 'cnhk-postnew-print-scripts', array( $this, 'postnew_print_script' ) );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_js' ) );
    }
    
    // enqueue script for new/edit slider page
    public function postnew_js( $scripts ) {
        $overflow_notice = __( 'Your server configuration does not allow the saving of this slider. There is too much variables. ', 'cnhk-ss' );
        $overflow_notice .= __( 'You will need to increase the value of the <code>max_input_vars</code> directive in your <code>php.ini</code> file ', 'cnhk-ss' );
        $overflow_notice .= __( '(current value: ', 'cnhk-ss' );
        $overflow_notice .= '<code>' . ini_get( 'max_input_vars' ) . '</code>, variables to save <code class="var-elements-count"></code>). ';
        $overflow_notice .= __( 'Please ask your web hosting provider on how to proceed. ', 'cnhk-ss' );
        $overflow_notice .= __( 'Alternatively you can reduce the amount of elements (layers, captions or slides) before saving. ', 'cnhk-ss' );
        
        $locale = array(
            'maxInputVarsExcess' => $overflow_notice,
        );
        
        $scripts['cnhk-internal'] = array(
            'url' => CNHK_URL . 'modules/internal/js/post-new.js',
            'dep' => array( 'jquery' ),
            'locale' => 'cnhkInternalLocale',
            'translations' => $locale,
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print script for new/edit slider page
    public function postnew_print_script() {
        ?>
        <script type="text/javascript">
        /* <![CDATA[ */
        var cnhkServerConfig = {
            maxInputVars: <?php echo ini_get( 'max_input_vars' ); ?>,
        };
        /* ]]> */
        </script>
        <?php
    }
    
    // return the unique instance
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    
}
