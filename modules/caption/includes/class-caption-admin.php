<?php
/**
 *  admin class for caption
 */
class cnhk_caption_admin
{
    private static $instance = null;
    
	protected function __construct() {
        // Enqueue style and script
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
        add_filter( 'cnhk-postnew-styles', array( $this, 'postnew_styles' ) );
        
        // init
        add_action( 'wp_loaded', array( $this, 'wp_loaded' ) );
    }
    
    public function wp_loaded() {
        $this->set_default_data();
    }
    
    // set default data on init
    public function set_default_data(){
        $default_styling = array(
            'w' => 100,
            'h' => 100,
            'left' => 50,
            'top' => 20,
            'le' => 32,
            'font' => '',
            'pad' => '0_0',
            'fgColor' => '',
            'bgColor' => '',
            'bgOpacity' => 1,
            'bdColor' => '',
            'bdWidth' => 0,
            'bdStyle' => 'none',
            'bdRadius' => '0_0_0_0',
        );
        $default_timing = array(
            'cafx' => '',
            'cafx2' => '',
            'cafx3' => '',
            'cadu' => 0,
            'cadu2' => 0,
            'cadu3' => 0,
            'cas' => 0,
            'cas2' => 0,
            'cas3' => 0,
        );
        $this->data = array(
            'id' => wp_generate_password( 8, false ),
            'name' => '',
            'slide' => wp_generate_password( 8, false ),
            'html' => '',
            'styling' => json_encode( $default_styling ),
            'timing' => json_encode( $default_timing ),
        );
    }
    
    // enqueue styles on edit/new slider page
    public function postnew_styles( $styles ) {
        $styles['wp-color-picker'] = array();
        
        $styles['caption-styling'] = array(
            'url' => CNHK_URL . 'modules/caption/css/caption-styling-box.css',
            'version' => CNHK_VERSION,
        );
        
        $styles['caption-timing'] = array(
            'url' => CNHK_URL . 'modules/caption/css/caption-timing-box.css',
            'version' => CNHK_VERSION,
        );
        return $styles;
    }
    
    // enqueue scripts on edit/new slider page
    public function postnew_scripts( $scripts ) {
        
        // use minified scripts
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        
        $styling_locale = array(
            'overlayTitle' => __( 'Caption styling and positioning', 'cnhk-ss' ),
        );
        
        $scripts['cnhk-caption-styling-controls'] = array(
            'url' => CNHK_URL . 'modules/caption/js/caption-styling-controls' . $mini . '.js',
            'dep' => array( 'jquery', 'cnhk-slide-wrap' ),
            'version' => CNHK_VERSION,
            'locale' => 'captionStylingLocale',
            'translations' => $styling_locale,
        );
        
        $timing_translations = array(
            'overlayTitle' => __( 'Caption transitions and timing', 'cnhk-ss' ),
        );
        
        $scripts['cnhk-caption-timing-controls'] = array(
            'url' => CNHK_URL . 'modules/caption/js/caption-timing-controls' . $mini . '.js',
            'dep' => array( 'jquery' ),
            'locale' => 'captionTimingLocale',
            'translations' => $timing_translations,
            'version' => CNHK_VERSION,
        );
        
        $scripts['cnhk-caption-editor'] = array(
            'url' => CNHK_URL . 'modules/caption/js/caption-editor' . $mini . '.js',
            'dep' => array( 
                'jquery',
                'wp-color-picker',
                'jquery-ui-tabs',
                'jquery-ui-slider',
                'jquery-ui-draggable',
                'jquery-ui-resizable',
                'cnhk-caption-styling-controls',
                'cnhk-caption-timing-controls',
            ),
            'version' => CNHK_VERSION,
        );
        
        $scripts['cnhk-caption-handler'] = array(
            'url' => CNHK_URL . 'modules/caption/js/caption-handler' . $mini . '.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        
        $scripts['cnhk-caption-admin-js'] = array(
            'url' => CNHK_URL . 'modules/caption/js/admin' . $mini . '.js',
            'dep' => array(
                'cnhk-caption-editor',
            ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print the caption related field
    public function admin_params() {
        include CNHK_PATH . 'modules/caption/includes/admin-params.php';
    }
    
    /**
     *  print the accordion ( jquery-ui-accodrion )
     *  
     *  @param [array] $slide_id, parent slide id
     *  @param [array] $slide, parent slide data
     */
    public function accordion( $slide_id, $slide ) {
        ?>
        <div class="param-header"><?php _e( 'Captions', 'cnhk-ss' ); ?></div>
        <div class="param-inside">
            <input type="hidden" class="slide-du" name="slides[<?php echo $slide_id; ?>][du]" value="<?php echo $slide['du']; ?>" />
            <input type="hidden" class="slide-du2" name="slides[<?php echo $slide_id; ?>][du2]" value="<?php echo $slide['du2']; ?>" />
            <input type="hidden" class="slide-du3" name="slides[<?php echo $slide_id; ?>][du3]" value="<?php echo $slide['du3']; ?>" />
            <div class="captions-list">
            <?php
            if ( isset( $slide['captions'] ) && ! empty( $slide['captions'] ) ) {
                foreach ( $slide['captions'] as $id => $caption ) {
                    $caption['slide'] = $slide_id;
                    $caption['id'] = $id;
                    $this->data = $caption;
                    $this->admin_params();
                }
            }
            ?>
            </div>
            <hr />
            <button class="button button-primary add-caption"><?php _e( 'add caption', 'cnhk-ss' ); ?></button>
            <span class="add-caption-ph"></span>
            <button class="button button-secondary paste-caption-copy alignright" disabled="disabled"><?php _e( 'paste the copied caption', 'cnhk-ss' ); ?></button>
        </div>
        <?php
    }
    
    // print the editor markup
    public static function editor_markup() {
        require_once CNHK_PATH . 'modules/caption/includes/caption-editor-markup.php';
    }
    
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
