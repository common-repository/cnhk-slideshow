<?php
class cnhk_slide_youtube extends cnhk_slide_abstract
{
	static private $instance = null;
    
    // slide type slug
    public $slug = 'youtube';
    
	protected function __construct() {
        // Name and description use for post edit page as any other slide type
		$this->name = __( 'YouTube', 'cnhk-ss' );
        $this->desc = __( 'Use YouTube video as slide', 'cnhk-ss' );
        
        // enqueue scripts on slider edit page
        add_action( 'cnhk-postnew-scripts', array( $this, 'postnew_js' ) );
        
        // script for front end
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}
	
    // scripts for the front end
    public function enqueue_scripts() {
        wp_enqueue_script( 'cnhk-ytplayer', CNHK_URL . 'modules/slide-youtube/js/youtube-player.js', array(), CNHK_VERSION );
    }
    
    // enqueue script for edit slider page
    public function postnew_js( $scripts ) {
        $postnew_translations = array(
            'vidNotFound' => __( 'video ID not found', 'cnhk-ss' ),
        );
        $scripts['cnhk-postnew-slide-youtube'] = array(
            'url' => CNHK_URL . 'modules/slide-youtube/js/post-new.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
            'locale' => 'cnhkYTLocale',
            'translations' => $postnew_translations,
        );
        $scripts['cnhk-slide-youtube-handler'] = array(
            'url' => CNHK_URL . 'modules/slide-youtube/js/slide-handler.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-admin-youtube-player'] = array(
            'url' => CNHK_URL . 'modules/slide-youtube/js/admin-youtube-player.js',
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
            'type' => 'youtube',
            'name' => '',
            'videoid' => '',
            'params' => array(
                'rel' => '0',
                'fs' => '1',
                'info' => '1',
                'logo' => '1',
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
        include CNHK_PATH . 'modules/slide-youtube/views/admin-params.php';
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
        $src = $parsed['scheme'] . '://www.youtube.com/embed/' . $data['videoid'] .
                    '?autoplay=0&rel=' . $data['params']['rel'] . '&fs=' . $data['params']['fs'] . 
                    '&enablejsapi=1&origin=' . $parsed['scheme'] . '://' . $parsed['host'] .
                    '&showinfo=' . $data['params']['info'] . '&modestbranding=' . $data['params']['logo'] ;
        ?>
        <div>
            <iframe frameborder="0" width="<?php echo $options['w']; ?>"
                height="<?php echo $options['h']; ?>" class="cnhk-yt-player"
                id="ytSlide-<?php echo $player_id; ?>" <?php if ( '1' == $data['params']['fs'] ) echo ' webkitallowfullscreen mozallowfullscreen allowfullscreen '?>
                src="<?php echo $src; ?>">
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
                if ( 'youtube' == $slide['type'] ) {
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
