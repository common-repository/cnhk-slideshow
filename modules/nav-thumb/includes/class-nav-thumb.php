<?php
/**
 *  thumbnail navigator handler class
 */
class cnhk_nav_thumb extends cnhk_nav_abstract
{
    private static $instance = null;
    
    private function __construct() {
        $this->slug = 'thumb';
        $this->name = __( 'Thumbnail navigator', 'cnhk-ss' );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
        add_filter( 'cnhk-postnew-styles', array( $this, 'postnew_styles' ) );
        add_action( 'wp_ajax_cnhk_thumb', array( $this, 'thumbnail' ) );
        add_action( 'wp_ajax_nopriv_cnhk_thumb', array( $this, 'thumbnail' ) );
    }
    
    // output thumbnails via AJAX
    public function thumbnail() {
        $url = ( isset( $_GET['url'] ) )? $_GET['url'] : false;
        $w = ( isset( $_GET['w'] ) )? floatval( $_GET['w'] ) : false;
        $h = ( isset( $_GET['h'] ) )? floatval( $_GET['h'] ) : false;
        if ( !$url || !$w || !$h ) die( 'missing parameter' );
        
        $dir = wp_upload_dir();
        if ( false === stripos( $url, $dir['baseurl'] ) ) die( 'not same origin' );
        
        $file = substr( $url, strlen( $dir['baseurl'] ) );
        $file = $dir['basedir'] . $file;
        $info = @getimagesize( $file );
        if ( ! $info ) die( 'no image found' );
        
        $orig_img = false;
        if ( 'image/jpeg' == $info['mime'] ) {
            $orig_img = imagecreatefromjpeg( $file );
        }
        if ( 'image/png' == $info['mime'] ) {
            $orig_img = imagecreatefrompng( $file );
        }
        if ( ! $orig_img ) die( 'image loading error' );
        
        $new_img = imagecreatetruecolor( $w, $h );
        
        $scale = max( $w / $info[0], $h / $info[1] );
        
        $bx = $info[0] / 2;
        $by = $info[1] / 2;
        $ox = $bx - ( $w / ( $scale * 2 ) );
        $oy = $by - ( $h / ( $scale * 2 ) );
        $ow = $w / $scale;
        $oh = $h / $scale;
        
        imagecopyresampled( $new_img, $orig_img, 0, 0, $ox, $oy, $w, $h, $ow, $oh );
        
        if ( 'image/jpeg' == $info['mime'] ) {
            header( 'Content-Type: image/jpeg' );
            imagejpeg( $new_img, null, 92 );
            die;
        }
        if ( 'image/png' == $info['mime'] ) {
            header( 'Content-Type: image/png' );
            imagepng( $new_img, null, 4 );
            die;
        }
        die;
    }
    
    // enqueue styles on post edit page
    public function postnew_styles( $styles ) {
        $styles['cnhk-nav-thumb-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-thumb/css/post-new.css',
            'version' => CNHK_VERSION,
        );
        return $styles;
    }
    
    // enqueue script on post edit page
    public function postnew_scripts( $scripts ) {
        $scripts['cnhk-nav-thumb-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-thumb/js/post-new.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-nav-thumb-handler'] = array(
            'url' => CNHK_URL . 'modules/nav-thumb/js/nav-handler.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print the admin form in the navigation metabox
    public function admin_params() {
        include_once CNHK_PATH . 'modules/nav-thumb/includes/admin-params.php';
    }
    
    // print the HTML in the front end
    public function render( $data, $options ) {
        $settings = array(
            'width' => floatval( $data['width'] ),
            'height' => floatval( $data['height'] ),
            'pieces' => floatval( $data['pieces'] ),
            'lane' => floatval( $data['lane'] ),
            'position' => $data['position'],
        );
        $_data['navs']['thumb'] = $data;
        $size = $this->get_size( $_data );
        
        // bottom
        $mkleft = ( $options['w'] - min( $options['w'], $size['width'] ) ) / 2;
        $mktop = $options['h'];
        
        switch ( $settings['position'] ) {
            case 'top':
                $mktop = 0;
                break;
            case 'left':
                $mkleft = 0;
                $mktop = ( $options['h'] - min( $options['h'], $size['height'] ) ) / 2;
                break;
            case 'right':
                $mkleft = $options['w'];
                $mktop = ( $options['h'] - min( $options['h'], $size['height'] ) ) / 2;
                break;
            default:
        }
        ?>
        <div data-u="thumbnavigator" 
            class="jssor-thumb-nav-wrap"
            style="left:<?php echo $mkleft; ?>px;top:<?php echo $mktop; ?>px;width:<?php echo $size['width']; ?>px; height:<?php echo $size['height']; ?>px;position:absolute;">
            <div data-u="slides">
                <div data-u="prototype" 
                class="cnhk-thumb-nav" 
                style="position:absolute;width:<?php echo $settings['width']; ?>px;height:<?php echo $settings['height']; ?>px;">
                    <div data-u="thumbnailtemplate"></div><div class="thov"></div>
                </div>
            </div>
        </div>
        <?php
    }
    
    // get additional height and width added to the slider container by the navigator markup
    public function get_size( $data ) {
        $settings = array(
            'width' => floatval( $data['navs']['thumb']['width'] ),
            'height' => floatval( $data['navs']['thumb']['height'] ),
            'pieces' => floatval( $data['navs']['thumb']['pieces'] ),
            'lane' => floatval( $data['navs']['thumb']['lane'] ),
            'position' => $data['navs']['thumb']['position'],
        );
        
        $width =  1.025 * $settings['width'] * ceil( $settings['pieces'] / $settings['lane'] );
        $height = 1.1 * ( 1.025 * $settings['height'] * $settings['lane'] );
        if ( 'left' == $settings['position'] || 'right' == $settings['position'] ) {
            $width = 1.1 * ( 1.025 * $settings['width'] * $settings['lane'] );
            $height = 1.025 * $settings['height'] * ceil( $settings['pieces'] / $settings['lane'] );
        }
        $left = 0;
        $top = 0;
        switch ( $data['navs']['thumb']['position'] ) {
            case 'left' :
                $left = $width;
                break;
            case 'top' :
                $top = $height;
        }
        return array(
            'width' => $width,
            'height' => $height,
            'left' => $left,
            'top' => $top,
            'position' => $settings['position'],
        );
    }
    
    // get thumbnail url
    public static function get_thumb_url( $src, $w, $h ) {
        return site_url( '/wp-admin/admin-ajax.php' . '?action=cnhk_thumb&url=' . $src . '&w=' . $w . '&h=' . $h );
    }
    
    // return the unique instance if the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
