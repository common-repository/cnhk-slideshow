<?php
/**
 *  bullets navigator class
 */
class cnhk_nav_bullet extends cnhk_nav_abstract
{
    private static $instance = null;
    
    private function __construct() {
        $this->slug = 'bullet';
        $this->name = __( 'Bullets navigator', 'cnhk-ss' );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
        add_filter( 'cnhk-postnew-styles', array( $this, 'postnew_styles' ) );
    }
    
    // enqueue styles on post edit pages
    public function postnew_styles( $styles ) {
        $styles['cnhk-nav-bullet-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-bullet/css/post-new.css',
            'version' => CNHK_VERSION,
        );
        return $styles;
    }
    
    // enqueue script on post edit pages
    public function postnew_scripts( $scripts ) {
        $scripts['cnhk-nav-bullet-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-bullet/js/post-new.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-nav-bullet-handler'] = array(
            'url' => CNHK_URL . 'modules/nav-bullet/js/nav-handler.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print the admin form in the navigation metabox
    public function admin_params() {
        include_once CNHK_PATH . 'modules/nav-bullet/includes/admin-params.php';
    }
    
    // print the HTML in the front end
    public function render( $data, $options ) {
        
        $DP = floatval( $options['$DisplayPieces'] );
        
        if ( $DP <= 1 ) {
            $DP = 1;
        } else if ( 2 <= $DP ) {
            $DP = floor( $DP );
        } else {
            $DP = 2;
        }
        
        $size = ( isset( $data['size'] ) )? floatval( $data['size'] ) : 16;
        $size = $DP * $size;
        $m = 0.25;
        $color = ( $data['color'] )? $data['color'] : false;
        ?>
        <div data-u="navigator" class="jssor-bullet-nav-wrap" 
            style="position:absolute;bottom:<?php echo 0.75 * $size; ?>px;">
            <div data-u="prototype" class="jssor-bullet-nav"
                style="width:<?php echo $size; ?>px;height:<?php echo $size; ?>px;position:absolute;font-size:<?php echo $size; ?>px;<?php if ( $color ) echo 'color:' . $color . ';' ?>">
            </div>
        </div>
        <?php
    }
    
    // get additional height and width added to the slider container by the navigator markup
    public function get_size( $data ) {
        if ( ! isset( $data['navs']['bullet'] ) ) return array( 'width' => 0, 'height' => 0, 'left' => 0, 'top' => 0 );
        if ( 'inside' == $data['navs']['bullet']['position'] ) return array( 'width' => 0, 'height' => 0, 'left' => 0, 'top' => 0 );
        
        $DP = floatval( $data['options']['$DisplayPieces'] );
        
        if ( $DP <= 1 ) {
            $DP = 1;
        } else if ( 2 <= $DP ) {
            $DP = floor( $DP );
        } else {
            $DP = 2;
        }
        
        return array(
            'width' => 0,
            'height' => 3 * $DP * intval( $data['navs']['bullet']['size'] ),
            'left' => 0,
            'top' => 0,
        );
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
