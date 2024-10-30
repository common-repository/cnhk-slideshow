<?php
/**
 *  effects options handling class
 */
class cnhk_fx
{
	const OPT_PREFIX = 'cnhkfx-';
    
    static private $instance = null;
    
    /**
     *  the two main types of effect code
     *  
     *  @var [array] $roots
     */
    private $roots = array( 'slide', 'caption' );
    
    private $data;
    
    /**
     *  default effect code collection for both roots
     *  
     *  @var [array]
     */
    private $default_collection = array(
        'slide' => array(
            'default' => array(
                'Zoom Fade' => '{$Duration:2000,$Cols:1,$Rows:1,$Zoom:2.25,$Opacity:2,$During:{$Zoom:[0,1.0000],$Opacity:[0.2,0.6000]},$Easing:{$Zoom:$JssorEasing$.$EaseInSine,$Opacity:$JssorEasing$.$EaseOutSine},$Brother:{$Duration:1000,$Opacity:2}}',
                'Fly Stripes Vertical' => '{$Duration:800,$Formation:$JssorSlideshowFormations$.$FormationStraight,$Assembly:513,$Cols:12,$Rows:1,$Delay:80,y:1,$Opacity:2,$During:{$Top:[0,1.0000],$Opacity:[0,1.0000]},$Easing:{$Top:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseOutQuad},$Brother:{$Duration:1000,$Opacity:2}}',
                'Twin Slide Down' => '{$Duration:1500,$Cols:1,$Rows:1,y:-1,$During:{$Top:[0,1.0000]},$Easing:{$Top:$JssorEasing$.$EaseInSine},$Brother:{$Duration:1500,$Cols:1,$Rows:1,y:1,$During:{$Top:[0,1]},$Easing:{$Top:$JssorEasing$.$EaseOutSine}}}',
                'Collapse 5x3' => '{$Duration:1000,$Cols:5,$Rows:3,$Delay:80,$SlideOut:true,$Clip:15,$ScaleClip:1,$During:{$Clip:[0,1.0000]},$Easing:{$Clip:$JssorEasing$.$EaseOutQuad},$Brother:{$Duration:1000,$Opacity:2}}',
            ),
        ),
        'caption' => array(
            'default' => array(
                'Bottom Left' => '{$Duration:900,x:0.6,y:-0.6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine,$Top:$JssorEasing$.$EaseInOutSine},$Opacity:2}',
                'Clip Right' => '{$Duration:900,$Clip:2,$Easing:{$Clip:$JssorEasing$.$EaseInOutCubic},$Opacity:2}',
                'Zoom Fly Fade' => '{$Duration:900,x:0.1,$Zoom:11,$Rotate:-0.2,$Opacity:2,$During:{$Left:[0,1.0000],$Zoom:[0,1.0000],$Rotate:[0,1.0000],$Opacity:[0,1.0000]},$Easing:{$Left:$JssorEasing$.$EaseInSine,$Zoom:$JssorEasing$.$EaseInExpo,$Rotate:$JssorEasing$.$EaseInSine,$Opacity:$JssorEasing$.$EaseLinear}}',
                'Zoom' => '{$Duration:900,$Zoom:1.6,$Opacity:2,$During:{$Zoom:[0,1.0000],$Opacity:[0.6,0.4000]},$Easing:{$Zoom:$JssorEasing$.$EaseInQuad}}',
            ),
        ),
    );
    
    private function __construct() {
        // setup default data
        foreach ( $this->roots as $root ) {
            $collections = get_option( self::OPT_PREFIX . $root );
            if ( $collections ) {
               $this->data[ $root ] = $collections;
            } else {
                $this->data[ $root ] = $this->default_collection[ $root ];
            }
        }
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            // AJAX action
            add_action( 'wp_ajax_cnhk_fx_call', array( $this, 'ajax_call' ) );
        }
    }
    
    /**
     *  check validity of AJAX nonce
     *  
     *  @param [string] $nonce
     *  @param [string] $context the nonce context set with wp_create_nonce( $context )
     *  
     *  @return void, die if the nonce is not valid
     */
    private function check_ajax_nonce( $nonce, $context = 'cnhk_ajax_nonce' ) {
		if ( false === wp_verify_nonce( $nonce, $context ) ) die;
    }
    
    /**
     *  check consistency of parameters passed to a method
     *  
     *  @return [array|bool] TRUE if OK, an associative array if something is wrong
     */
    private function check_params( $pairs = array() ) {
        foreach ( $pairs as $key => $value ) {
            $value = trim( $value );
            switch ( $key ) {
                case 'root' :
                    if ( ! in_array( $value, $this->roots ) ) {
                        return array(
                            'status' => false,
                            'msg' => 'unknown root',
                        );
                    }
                    break;
                case 'collection' :
                    if ( empty( $value ) ) {
                        return array(
                            'status' => false,
                            'msg' => 'missing collection name',
                        );
                    }
                    break;
                case 'name' :
                    if ( empty( $value ) ) {
                        return array(
                            'status' => false,
                            'msg' => 'missing effect name',
                        );
                    }
                default :
            }
        }
        return true;
    }
    
    /**
     *  add effect to collection
     *  
     *  @param [string] $root, the effect type (slide|caption)
     *  @param [string] $collection, the collection name
     *  @param [string] $name, the name of the effect
     *  @param [string] $code, the effect code
     *  
     *  @return [array]
     */
    public function add_fx( $root, $collection, $name, $code ) {
        $check = $this->check_params(
            array(
                'root' => $root,
                'collection' => $collection,
                'name' => $name,
            )
        );
        if ( is_array( $check ) ) {
            return $check;
        }
        
        $this->data[ $root ][ $collection ][ $name ] = $code;
        update_option( self::OPT_PREFIX . $root, $this->data[ $root ] );
        $result = array(
            'status' => true,
        );
        return $result;
    }
    
    /**
     *  delete an effect from a given collection
     *  
     *  @param [string] $root, the effect type (slide|caption)
     *  @param [string] $collection, the collection name
     *  @param [string] $name, the name of the effect
     */
    public function delete_fx( $root, $collection, $name ) {
        $check = $this->check_params(
            array(
                'root' => $root,
                'collection' => $collection,
                'name' => $name,
            )
        );
        if ( is_array( $check ) ) {
            return $check;
        }
        
        if ( isset( $this->data[ $root ][ $collection ][ $name ] ) ) {
            unset( $this->data[ $root ][ $collection ][ $name ] );
            update_option( self::OPT_PREFIX . $root, $this->data[ $root ] );
        }
        $result = array(
            'status' => true,
        );
        return $result;
        
    }
    
    /**
     *  delete an entire collection
     *  
     *  @param [string] $root, the effect type (slide|caption)
     *  @param [string] $collection, the collection name
     */
    public function delete_collection( $root, $collection ) {
        $check = $this->check_params(
            array(
                'root' => $root,
                'collection' => $collection,
            )
        );
        if ( is_array( $check ) ) {
            return $check;
        }
        
        if ( isset( $this->data[ $root ][ $collection ] ) ) {
            unset( $this->data[ $root ][ $collection ] );
            update_option( self::OPT_PREFIX . $root, $this->data[ $root ] );
        }
        $result = array(
            'status' => true,
        );
        return $result;
        
    }
    
    /**
     *  retrieve the name of an effect based on its code
     *  
     *  @param [string] $root, the effect type (slide|caption)
     *  @param [string] $code, the effect code for which the name is searched
     */
    public function get_name( $root, $code ) {
        $check = $this->check_params(
            array(
                'root' => $root,
            )
        );
        if ( is_array( $check ) ) {
            return $check;
        }
        foreach ( $this->data[ $root ] as $collection => $fx_array ) {
            foreach ( $fx_array as $name => $value ) {
                if ( trim( $code ) == $value ) {
                    return array(
                        'status' => true,
                        'name' => $name,
                        'collection' => $collection,
                    );
                }
            }
        }
        return array(
            'status' => true,
            'name' => __( 'custom effect', 'cnhk-ss' ),
            'collection' => false,
        );
    }
    /**
     *  get all effect data for a given root
     *  
     *  @param [string] $root, the effect root (slide|caption)
     */
    public function get_all( $root ) {
        $check = $this->check_params(
            array(
                'root' => $root,
            )
        );
        if ( is_array( $check ) ) {
            return $check;
        }
        return array(
            'status' => true,
            'collections' => $this->data[ $root ],
        );
    }
    
    /**
     *  allows the call of one of methods of this class via AJAX
     */
    public function ajax_call() {
        $this->check_ajax_nonce( $_POST['nonce'] );
        parse_str( $_POST['formdata'], $params );
        $func = $_POST['func'];
        $response = array(
            'status' => false,
            'msg' => 'method does not exists',
        );
        if ( method_exists( $this, $func ) ) {
            $response = call_user_func_array( array( $this, $func ), $params );
        }
        header( 'Content-Type: application/json' );
        echo json_encode( $response );
        die;
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
