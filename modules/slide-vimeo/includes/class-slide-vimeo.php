<?php
class cnhk_slide_vimeo extends cnhk_slide_abstract
{
	static private $instance = null;
    
    // slide type slug
    public $slug = 'vimeo';
    
	protected function __construct() {
        // Name and description use for post edit page as any other slide type
		$this->name = __( 'Vimeo', 'cnhk-ss' );
        $this->desc = __( 'Use Vimeo video as slide', 'cnhk-ss' );
        
        // enqueue scripts on slider edit page
        add_action( 'cnhk-postnew-scripts', array( $this, 'postnew_js' ) );
        
        // script for front end
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}
    
    // scripts for the front end
    public function enqueue_scripts() {
        wp_enqueue_script( 'cnhk-froogaloop', CNHK_URL . 'lib/froogaloop/froogaloop.min.js', array(), CNHK_VERSION );
        wp_enqueue_script( 'cnhk-viplayer', CNHK_URL . 'modules/slide-vimeo/js/vimeo-player.js', array( 'cnhk-froogaloop' ), CNHK_VERSION );
    }
    
    // enqueue script for new/edit slider page
    public function postnew_js( $scripts ) {
        $postnew_translations = array(
            'vidNotFound' => __( 'video ID not found', 'cnhk-ss' ),
        );
        $scripts['cnhk-postnew-slide-vimeo'] = array(
            'url' => CNHK_URL . 'modules/slide-vimeo/js/post-new.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
            'locale' => 'cnhkViLocale',
            'translations' => $postnew_translations,
        );
        $scripts['cnhk-slide-vimeo-handler'] = array(
            'url' => CNHK_URL . 'modules/slide-vimeo/js/slide-handler.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-admin-froogaloop'] = array(
            'url' => CNHK_URL . 'lib/froogaloop/froogaloop.min.js',
            'dep' => array(),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-admin-vimeo-player'] = array(
            'url' => CNHK_URL . 'modules/slide-vimeo/js/admin-vimeo-player.js',
            'dep' => array( 'jquery', 'cnhk-admin-froogaloop' ),
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
            'type' => 'vimeo',
            'name' => '',
            'videoid' => '',
            'params' => array(
                'byline' => '1',
                'portrait' => '1',
                'title' => '1',
                'color' => '#00adef',
            ),
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
        include CNHK_PATH . 'modules/slide-vimeo/views/admin-params.php';
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
        $site_url = get_site_url();
        $parsed = parse_url( $site_url );
        $player_id = wp_generate_password( 8, false );
        $color = ( $data['params']['color'] )? '&color=' . substr( $data['params']['color'], 1 ) : '';
        $src =  '//player.vimeo.com/video/' . $data['videoid'] .
                '?autoplay=0&byline=' . $data['params']['byline'] . '&portrait=' . $data['params']['portrait'] . '&title=' . $data['params']['title'] .
                '&api=1&player_id=viSlide-' . $player_id . $color;
        ?>
        <div>
            <iframe frameborder="0" width="<?php echo $options['w']; ?>"
                height="<?php echo $options['h']; ?>" class="cnhk-vi-player"
                id="viSlide-<?php echo $player_id; ?>" src="<?php echo $src?>" data-sli="<?php echo $sli; ?>"
                webkitallowfullscreen mozallowfullscreen allowfullscreen >
            </iframe>
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
                if ( 'vimeo' == $slide['type'] ) {
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
