<?php
/**
 *  pattern for slider templates
 */
abstract class cnhk_template_abstract
{
    /**
     *  template slug
     *  @var [string] $slug
     */
    public $slug = 'slug';
    
    /**
     *  displayable name
     *  initialized in the constructor in order to be localized
     */
    public $name = 'name';
    
    /**
     *  template literal description
     */
    public $desc = 'desc';
    
    /**
     *  supported slide type
     */
    public $supported_slide_types = array();
    
    /**
     *  supported navigator type
     */
    public $supported_nav_types = array();
    
    /**
     *  template support for slide transition effects
     */
    public $supports_fx = false;
    
    /**
     *  Template support for captions
     */
    public $supports_caption = false;
    
    /**
     *  slider data
     *  
     *  @var [array] $data, associative array
     */
    public $data;
    
    /**
     *  slider default data
     *  
     *  @var array $data, associative array
     */
    protected $default_data;
    
    /**
     *  helper array (assoc) for jssor's $FillMode parameter
     */
    public $FillMode;
    
    /**
     *  helper array (assoc) for jssor's $PauseOnHover parameter
     */
    public $PauseOnHover;
    
    /**
     *  helper array (assoc) for jssor's $PlayOrientation parameter
     */
    public $PlayOrientation;
    
    /**
     *  helper array (assoc) for jssor's $DragOrientation
     */
    public $DragOrientation;
    
    /**
     *  helper array (assoc) for slider box
     */
    public $box_align;
    
	/**
	 * Constructor
	 */
	protected function __construct() {
        /**
         *  set the different helper array
         */
        
        // FillMode
        $this->FillMode = array(
            0 => array(
                'value' => 0,
                'readable' => __( 'Stretch', 'cnhk-ss' ),
                'desc' => __( 'Stretch images to fit slider dimensions', 'cnhk-ss' ),
            ),
            1 => array(
                'value' => 1,
                'readable' => __( 'Contain', 'cnhk-ss' ),
                'desc' => __( 'keep aspect ratio and put all inside slide', 'cnhk-ss' ),
            ),
            2 => array(
                'value' => 2,
                'readable' => __( 'Cover', 'cnhk-ss' ),
                'desc' => __( 'keep aspect ratio and cover whole slide', 'cnhk-ss' ),
            ),
            4 => array(
                'value' => 4,
                'readable' => __( 'As is', 'cnhk-ss' ),
                'desc' => __( 'keep image size as is no matter the slider size', 'cnhk-ss' ),
            ),
            5 => array(
                'value' => 5,
                'readable' => __( 'Mixed', 'cnhk-ss' ),
                'desc' => __( 'contain for large image, as is for the small ones', 'cnhk-ss' ),
            ),
        );
        
        // PauseOnHover
        $this->PauseOnHover = array(
            0 => array(
                'value' => 0,
                'readable' => __( 'None', 'cnhk-ss' ),
                'desc' => __( 'no pause', 'cnhk-ss' ),
            ),
            1 => array(
                'value' => 1,
                'readable' => __( 'Pause desktop', 'cnhk-ss' ),
                'desc' => __( 'pause for desktop, slide progression continues but the next transition is blocked', 'cnhk-ss' ),
            ),
            2 => array(
                'value' => 2,
                'readable' => __( 'Pause touch device', 'cnhk-ss' ),
                'desc' => __( 'pause for touch device, slide progression continues but the next transition is blocked', 'cnhk-ss' ),
            ),
            3 => array(
                'value' => 3,
                'readable' => __( 'Pause both', 'cnhk-ss' ),
                'desc' => __( 'pause for both desktop and touch device', 'cnhk-ss' ),
            ),
            4 => array(
                'value' => 4,
                'readable' => __( 'Freeze desktop', 'cnhk-ss' ),
                'desc' => __( 'freeze for desktop, slide progression is stopped immediately', 'cnhk-ss' ),
            ),
            8 => array(
                'value' => 8,
                'readable' => __( 'Freeze touch device', 'cnhk-ss' ),
                'desc' => __( 'freeze for touch device, slide progression is stopped immediately', 'cnhk-ss' ),
            ),
            12 => array(
                'value' => 12,
                'readable' => __( 'Freeze both', 'cnhk-ss' ),
                'desc' => __( 'freeze for both desktop and touch device', 'cnhk-ss' ),
            ),
        );
        
        // PlayOrientation
        $this->PlayOrientation = array(
            1 => array(
                'value' => 1,
                'readable' => __( 'Horizontal', 'cnhk-ss' ),
                'desc' => '',
            ),
            2 => array(
                'value' => 2,
                'readable' => __( 'Vertical', 'cnhk-ss' ),
                'desc' => '',
            ),
            5 => array(
                'value' => 5,
                'readable' => __( 'Reverse Horizontal', 'cnhk-ss' ),
                'desc' => '',
            ),
            6 => array(
                'value' => 6,
                'readable' => __( 'Reverse Vertical', 'cnhk-ss' ),
                'desc' => '',
            ),
        );
        
        // DragOrientation
        $this->DragOrientation = array(
            1 => array(
                'value' => 1,
                'readable' => __( 'Horizontal', 'cnhk-ss' ),
                'desc' => '',
            ),
            2 => array(
                'value' => 2,
                'readable' => __( 'Vertical', 'cnhk-ss' ),
                'desc' => '',
            ),
            3 => array(
                'value' => 3,
                'readable' => __( 'Both', 'cnhk-ss' ),
                'desc' => '',
            ),
        );
        
        // wrap box alignment
        $this->box_align = array(
            'none' => array(
                'value' => 'none',
                'readable' => __( 'no alignment', 'cnhk-ss' ),
                'tip' => __( 'no alignment', 'cnhk-ss' ),
            ),
            'left' => array(
                'value' => 'left',
                'readable' => __( 'left', 'cnhk-ss' ),
                'tip' => __( 'left floating box', 'cnhk-ss' ),
            ),
            'right' => array(
                'value' => 'right',
                'readable' => __( 'right', 'cnhk-ss' ),
                'tip' => __( 'right floating box', 'cnhk-ss' ),
            ),
            'center' => array(
                'value' => 'center',
                'readable' => __( 'centered', 'cnhk-ss' ),
                'tip' => __( 'centered box', 'cnhk-ss' ),
            ),
        );
        
        // slider background repeat
        $this->bg_repeat = array(
            'cover' => array(
                'value' => 'cover',
                'readable' => __( 'cover', 'cnhk-ss' ),
                'tip' => __( 'cover the entire area (some part might be hidden)', 'cnhk-ss' ),
            ),
            'repeat-x' => array(
                'value' => 'repeat-x',
                'readable' => __( 'repeat horizontally', 'cnhk-ss' ),
                'tip' => __( 'repeated horizontally, no scaling', 'cnhk-ss' ),
            ),
            'repeat-y' => array(
                'value' => 'repeat-y',
                'readable' => __( 'repeat vertically', 'cnhk-ss' ),
                'tip' => __( 'repeated vertically, no scaling', 'cnhk-ss' ),
            ),
            'repeat' => array(
                'value' => 'repeat',
                'readable' => __( 'repeat', 'cnhk-ss' ),
                'tip' => __( 'repeated both horizontally and vertically', 'cnhk-ss' ),
            ),
        );
        
    }
    
    /**
     *  load slider data
     *  
     *  @param [string] $data, serialized slider data stored in post content
     */
    public function load_data( $data ) {
        $_data = unserialize( $data );
        if ( isset( $_data['slides'] ) && is_array( $_data['slides'] ) ) {
            $slides = $_data['slides'];
            $_data['slides'] = cnhk_ss::get_instance()->recover_html( $slides );
        }
        $this->data = ( false != $_data )? $_data : $this->default_data;
    }
    
    /**
     *  get the default data for new slider
     *  
     *  @param [bool] $ser, whether to return the data in serialized format or as an array
     */
    public function get_default_data( $ser = false ) {
        if ( $ser ) {
            return serialize( $this->default_data );
        } else {
            return $this->default_data;
        }
    }
    
    /**
     *  render the slider
     */
    abstract public function render( $post);
    
    /**
     *  render the content of the basic parameter metabox
     */
    abstract public function basic_params();
    
    /**
     *  render the content of the slide metabox
     */
    abstract public function slide_params();
}
