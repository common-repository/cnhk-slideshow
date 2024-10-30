<?php
class cnhk_slide_html extends cnhk_slide_abstract
{
	static private $instance = null;
    
    // slide type slug
    public $slug = 'html';
    
	protected function __construct() {
        // Name and description use for post edit page as any other slide type
		$this->name = __( 'HTML', 'cnhk-ss' );
        $this->desc = __( 'Use custom HTML content as slide', 'cnhk-ss' );
        
        // enqueue scripts on slider edit page
        add_action( 'cnhk-postnew-scripts', array( $this, 'postnew_js' ) );
	}
	
    // enqueue script for edit slider page
    public function postnew_js( $scripts ) {
        
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        $locale = array(
            'staticContent' => __( 'static content', 'cnhk-ss' )
        );
        $scripts['cnhk-postnew-slide-html'] = array(
            'url' => CNHK_URL . 'modules/slide-html/js/post-new' . $mini . '.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
            'locale' => 'slideHTMLPostNewLocale',
            'translations' => $locale,
        );
        $scripts['cnhk-slide-html-handler'] = array(
            'url' => CNHK_URL . 'modules/slide-html/js/slide-handler.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    /**
	 *  display slide param in metabox
	 *  
	 *  @param [array] $context, contains context variable in which the method is called (such as plugin's settings or template's data )
	 */
	public function admin_params( $context ) {
        $default_context['slide'] = array(
            'type' => 'html',
            'name' => '',
            'layers' => array(),
            'bgColor' => '',
            'bgOpacity' => 1,
            'bgImage' => '',
            'slfx' => '',
            'sldu' => '1500',
            // slide type supports captions
            'du' => 2000,
            'du2' => 2000,
            'du3' => 2000,
        );
        if ( is_array( $context ) ) {
            $context = $context + $default_context;
        } else {
            $context = $default_context;
        }
        $slide_id = wp_generate_password( 8, false );
        if ( isset( $context['slide_id'] ) ) {
            $slide_id = $context['slide_id'];
        }
        include CNHK_PATH . 'modules/slide-html/views/admin-params.php';
    }
    
	/**
	 *  render slide on the front end
	 *  
	 *  @param [array] $data, slide's data
	 *  @param [string] $slide_id
	 *  @param [array] $options, "options" fields of slider's data (in which the slide is used)
	 *  @param [int] $sli, slide index in the slider
	 */
	public function render( $data, $slide_id, $options, $sli ) {
        $slide_style = 'width:' . $options['w'] . 'px;height:' . $options['h'] . 'px;';
        if ( !empty( $data['bgColor'] ) ) {
            $rgb = cnhk_hex_to_rgb( $data['bgColor'] );
            $slide_style .= 'background-color:' . $data['bgColor'] . ';'; // IE < 9
            $slide_style .= 'background-color:rgba(' . $rgb[0] . ',' . $rgb[1] . ',' . $rgb[2] . ',' . $data['bgOpacity'] . ');';
        }
        $is_static = ( isset( $data['isStatic'] ) );
        ?>
        <div <?php if ( $is_static ) echo ' data-u="any" style="z-index:20;"'?>>
        <?php if ( $data['bgImage'] && ! $is_static ) : ?>
            <img data-src2="<?php echo esc_url( $data['bgImage'] ); ?>" alt="" data-u="image" />
        <?php endif; ?>
        <div style="<?php echo $slide_style; ?>">
        <?php 
        if ( isset( $data['layers'] ) && is_array( $data['layers'] ) ) {
            foreach ( $data['layers'] as $layer ) {
                cnhk_layer_html::render_layer( $layer );
            }
        }
        ?>
        </div>
        <?php
        if ( isset( $data['captions'] ) && ! empty( $data['captions'] ) && ! $is_static ) {
            foreach ( $data['captions'] as $ca_id => $caption ) {
                cnhk_caption_render( $caption, $slide_id, $ca_id, array( $data['du'], $data['du2'], $data['du3'] ) );
            }
        } ?>
        </div>
        <?php
    }
    
    /**
	 *  check if the slide type is used
	 *  
	 *  @param [array] $posts an array of posts
	 *  @return [bool], TRUE if used within one of the given posts, FALSE otherwise
	 */
	public static function is_used( $posts ) {
        foreach ( $posts as $post ) {
            $slider = unserialize( $post->post_content );
            if ( ! is_array( $slider ) || ! is_array( $slider['slides'] ) ) continue;
            foreach ( $slider['slides'] as $slide ) {
                if ( 'html' == $slide['type'] ) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
