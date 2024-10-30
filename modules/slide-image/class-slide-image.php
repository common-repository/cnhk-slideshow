<?php
class cnhk_slide_image extends cnhk_slide_abstract
{
    private static $instance = null;
    
    // slide type slug
	public $slug = 'image';
	
	protected function __construct() {
		$this->name = __( 'Image', 'cnhk-ss' );
        $this->desc = __( 'Use image as slide', 'cnhk-ss' );
	}
	
    /**
	 *  display slide param in metabox
	 *  
	 *  @param [array] $context, contains context variable in which the method is called (such as plugin's settings or template's data )
	 */
	public function admin_params( $context ) {
        $default_context['slide'] = array(
            'type' => 'image',
            'name' => '',
            'src' => '',
            'link' => '',
            'alt' => '',
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
        include CNHK_PATH . 'modules/slide-image/admin-params.php';
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
        ?>
        <div>
        <?php if ( $data['link'] ) : ?>
        <a data-u="image" href="<?php echo esc_url( $data['link'] ); ?>">
            <img data-src2="<?php echo esc_url( $data['src'] ); ?>" alt="<?php echo esc_url( $data['alt'] ); ?>" />
        </a>
        <?php else : ?>
            <img data-u="image" data-src2="<?php echo esc_url( $data['src'] ); ?>" alt="<?php echo esc_attr( $data['alt'] ); ?>" />
        <?php endif; ?>
        <?php if ( isset( $data['captions'] ) && ! empty( $data['captions'] ) ) {
            foreach ( $data['captions'] as $ca_id => $caption ) {
                cnhk_caption_render( $caption, $slide_id, $ca_id, array( $data['du'], $data['du2'], $data['du3'] ) );
            }
        } ?>
        <?php if ( isset( $options['thumb'] ) ) : ?>
            <img data-u="thumb" alt="" src="<?php echo esc_url( $options['thumb'] ); ?>" />
        <?php endif;?>
        </div>
        <?php
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
