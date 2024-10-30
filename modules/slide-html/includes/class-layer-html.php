<?php
class cnhk_layer_html
{
	static private $instance = null;
    
    // layer default data
    static private $default_data = array(
        'name' => '',
        'style' => '{"w":100,"h":100,"le":32,"left":100,"top":50,"padh":0,"padv":0,"font":"","fgColor":"","bgColor":"","bgOpacity":1,"bdStyle":"none","bdWidth":1,"bdColor":"","bdrTL":0,"bdrTR":0,"bdrBL":0,"bdrBR":0}',
        'html' => '',
    );
    
	protected function __construct() {
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_js' ) );
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            require_once CNHK_PATH . 'modules/slide-html/includes/ajax.php';
        }
	}
    
    // enqueue script for edit slider page
    public function postnew_js( $scripts ) {
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        
        $styling_locale = array(
            'overlayTitle' => __( 'Layer styling and positioning', 'cnhk-ss' ),
        );
        
        $scripts['html-layer-styling'] = array(
            'url' => CNHK_URL . 'modules/slide-html/js/layer-styling-controls' . $mini . '.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
            'locale' => 'layerStylingLocale',
            'translations' => $styling_locale,
        );
        $scripts['html-layer-editor'] = array(
            'url' => CNHK_URL . 'modules/slide-html/js/layer-editor.js',
            'dep' => array( 'html-layer-styling' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    /**
     *  render the layer on the front end
     *  
     *  @param [array] $layer, the layer data
     */
    public static function render_layer( $layer ) {
        if ( empty( $layer ) ) return;
        $layer = $layer + self::$default_data;
        $layer_main_style = '';
        $style = json_decode( $layer['style'], true );
        if ( $style['fgColor'] ) {
            $layer_main_style .= 'color:' . $style['fgColor'] . ';';
        }
        if ( $style['font'] ) {
            $fonts = cnhk_ss::get_instance()->get_font_stacks();
            $layer_main_style .= 'font-family:' . $fonts[$style['font']] . ';';
        }
        $le = ( $style['le'] )? $style['le'] : 32;
        $layer_main_style .= 'line-height:' . $le . 'px;';
        $bg_color = '';
        if ( $style['bgColor'] && '0' != $style['bgOpacity'] ) {
            $rgb = cnhk_hex_to_rgb( $style['bgColor'] );
            $bg_color = 'background-color:' . $style['bgColor'] . ';'; // for IE < 9
            $bg_color .= 'background-color:rgba(' . $rgb[0] . ',' . $rgb[1] . ',' . $rgb[2] . ',' . $style['bgOpacity'] . ');';
        }
        $border = 'border-top-left-radius:' . $style['bdrTL'] . 'px;';
        $border .= 'border-top-right-radius:' . $style['bdrTR'] . 'px;';
        $border .= 'border-bottom-left-radius:' . $style['bdrBL'] . 'px;';
        $border .= 'border-bottom-right-radius:' . $style['bdrBR'] . 'px;';
        
        $border .= 'width:100%;height:100%;' . $bg_color;
        if ( 'none' != $style['bdStyle'] ) {
            $border .= 'border:' . $style['bdWidth'] . 'px ' . $style['bdStyle'] . ' ' . $style['bdColor'] . ';';
        }
        $padding =  'padding-left:' . $style['padh'] . '%;' .
                    'padding-right:' . $style['padh'] . '%;' .
                    'padding-top:' . $style['padv'] . '%;' .
                    'padding-bottom:' . $style['padv'] . '%;';
        ?>
        <div class="cnhk-layer" style="position:absolute;left:<?php echo $style['left']; ?>px;top:<?php echo $style['top'];
            ?>px;width:<?php echo $style['w']; ?>px;height:<?php echo $style['h']; ?>px;<?php echo $layer_main_style; ?>">
            <div style="<?php echo $border; ?>"><div style="<?php echo $padding; ?>"><?php echo $layer['html']; ?></div></div>
        </div>
        <?php
    }
    
    // print the admin markup within an html slide admin markup
    public static function admin_params( $layers, $slide_id ) {
        if ( ! $slide_id || ! is_array( $layers ) ) return;
        require CNHK_PATH . 'modules/slide-html/views/layers-params.php';
    }
    
    // print the layer editor markup
    public static function editor_markup() {
        require CNHK_PATH . 'modules/slide-html/includes/editor-markup.php';
    }
    
    // admin fields for a single layer
    public static function single_layer_params( $layer, $slide_id ) {
        if ( ! $slide_id || ! is_array( $layer ) ) return;
        if ( ! isset( $layer['id'] ) ) $layer['id'] = wp_generate_password( 8, false );
        $layer = $layer + self::$default_data;
        require CNHK_PATH . 'modules/slide-html/views/single-layer-params.php';
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
