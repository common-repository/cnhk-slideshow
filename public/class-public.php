<?php
/**
 *  front end helper class
 */
class cnhk_public
{
    // instance of the class
    private static $instance = null;
    
    // result of current_user_can( 'manage_options' )
    private $can_manage_options;
    
    private function __construct() {
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_script' ) );
        add_action( 'init', array( $this, 'init' ) );
        add_shortcode( 'cnhk_slideshow', array( $this, 'slider_shortcode' ) );
    }
    
    /**
     *  actually render slider
     *  
     *  @param [object] $post, a post object
     */
    protected function display_slideshow( $post ) {
        if ( ! $post ) return;
        if ( 'publish' != $post->post_status && ! $this->can_manage_options ) return;
        $th = cnhk_ss::get_instance()->get_template_handler_by( 'ID', $post->ID );
        if ( ! $th ) return;
        $th->load_data( $post->post_content );
        $data = $th->data;
        if ( empty( $data['slides'] ) ) return;
        $th->render( $post );
    }
    
    // init actions
    public function init() {
        $this->can_manage_options =  current_user_can( 'manage_options' );
    }
    
    // enqueue script for front end
    public function enqueue_script() {
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        wp_enqueue_script( 'cnhk-jssor', CNHK_URL . 'lib/jssor/jssor.slider.mini.js', array(), CNHK_VERSION );
        // debug
        wp_enqueue_script( 'cnhk-slider-public', CNHK_URL . 'public/assets/js/cnhk-slider.js', array( 'jquery', 'cnhk-jssor' ), CNHK_VERSION );
        wp_enqueue_style( 'cnhk-awesome', CNHK_URL . 'lib/font-awesome/css/font-awesome.min.css', array(), '4.4' );
        wp_enqueue_style( 'cnhk-css', CNHK_URL . 'public/assets/css/cnhk-slider.css', array(), CNHK_VERSION );
    }
    
    /**
     *  slider shortcode function
     *  
     *  @param [array] $atts, shortcode attribute
     */
    public function slider_shortcode( $atts ) {
        $atts = shortcode_atts(
            array(
                'id' => 0,
                'slug' => '',
            ),
            $atts,
            'cnhk_slideshow'
        );
        ob_start();
        if ( 0 != intval( $atts['id'] ) ) {
            $this->cnhk_slideshow( intval( $atts['id'] ) );
        } else {
            $this->cnhk_slideshow( $atts['slug'] );
        }
        return ob_get_clean();
    }
    
    /**
     *  find and render the slider on the front end
     *  
     *  @param [mixed] $which, post ID or slug
     */
    public function cnhk_slideshow( $which ) {
        $post = false;
        if ( is_string( $which ) ) {
            // $which should be post->post_name ( the slug )
            
            $args = array(
                'posts_per_page' => -1,
                'post_type' => CNHK_CPT,
                'name' => $which,
                'post_status' => 'any',
            );
            $posts = get_posts( $args );
            if ( 1 == count( $posts ) && isset( $posts[0]->post_status ) ) {
                $post = $posts[0];
            }            
        } elseif ( is_int( $which ) ) {
            // $which is the post ID
            
            $_post = get_post( $which );
            if ( $_post ) {
                if ( CNHK_CPT == $_post->post_type ) {
                    $post = $_post;
                }
            }
        }
        if ( $post ) {
            $this->display_slideshow( $post );
        }
    }
    
    /**
     *  return the unique instance of the class
     */
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
