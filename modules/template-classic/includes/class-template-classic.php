<?php
/**
 *  classic slider template
 */
class cnhk_template_classic extends cnhk_template_abstract
{
    private static $instance = null;
    
    // default slider data
    protected $default_options = array(
        'w' => 1280,
        'h' => 720,
        'loadBg' => '',
        'b' => false,
        'brw' => '',
        'align' => 'center',
        // background
        'bg' => '',
        'bgRepeat' => 'cover',
        'bgPosition' => 'center center',
        // jssor specific settings
        '$FillMode' => 2,
        '$AutoPlay' => true,
        '$AutoPlayInterval' => 6000,
        '$SlideDuration' => 1500,
        '$PauseOnHover' => 1,
        '$PlayOrientation' => 1,
        '$DragOrientation' => 1,
        '$DisplayPieces' => 1,
    );
    
    // template slug
    public $slug = 'classic';
    
    // supported slide type
    public $supported_slide_types = array( 'image', 'html', 'youtube', 'vimeo' );
    
    // supported navigators
    public $supported_nav_types = array( 'arrows', 'bullet', 'progress' );
    
    // template support for slide transition effects
    public $supports_fx = false;
    
    // template support for caption
    public $supports_caption = false;
    
	protected function __construct() {
        parent::__construct();
        $this->name = __( 'Classic slider template', 'cnhk-ss' );
        $this->desc = __( 'The classic slider. No captions nor advanced slide effects. Usable with all types of slide.', 'cnhk-ss' );
        
        $this->default_data = array(
            'template' => 'classic',
            'options' => $this->default_options,
            'slides' => array(),
            'navs' => array(),
        );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
    }
    
    // enqueue scripts on post edit page
    public function postnew_scripts( $scripts ) {
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        $template_locale = array(
            'singlePreview' => __( 'Single slide preview', 'cnhk-ss' ),
            'ssPreview' => __( 'Slider preview', 'cnhk-ss' ),
        );
        $scripts['cnhk-template-handler-classic'] = array(
            'url' => CNHK_URL . 'modules/template-classic/js/template-handler' . $mini . '.js',
            'dep' => array( 'jquery', 'jssor-js' ),
            'locale' => 'cnhkTemplateHandlerClassicLocale',
            'translations' => $template_locale,
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    /**
     *  render the slider
     *  
     *  @param [WP_Post] $post, post object
     */
    public function render( $post ) {
        $data = $this->data;
        global $cnhkss_index;
        if ( ! isset( $cnhkss_index ) ) {
            $cnhkss_index = 0;
        }
        $ss_id = 'cnhkss-' . $post->ID . '-' . $cnhkss_index;
        $cnhkss_index++;
        $ssw = $data['options']['w'];
        $ssh = $data['options']['h'];
        
        $DP = floatval( $data['options']['$DisplayPieces'] );
        $PO = floatval( $data['options']['$PlayOrientation'] );
        
        $SP = 0;
        $hSP = 0;
        $vSP = 0;
        $PP = 0;
        
        $DPFactor = $DP;
        if ( $DP <= 1 ) {
            $DP = 1;
            $DPFactor = 1;
        } elseif ( 2 <= $DP ) {
            $DP = floor( $DP );
            $DPFactor = $DP;
        } else {
            $DP = 2;
            $PP = ( 0 == ( $PO % 2 ) )? ( $ssh * ( 1 - $DP + $DPFactor ) ) / 2 : ( $ssw * ( 1 - $DP + $DPFactor ) ) / 2;
        }
        
        $SP = 5;
        
        if ( 2 <= $DP ) {
            if ( 0 == ( $PO % 2 ) ) {
                // vertical
                $vSP = $DP * $SP; // 5 pixel space between slides
                if ( 2 > $DPFactor ) {
                    $vSP += $SP;
                }
            } else {
                $hSP = $DP * $SP;
                if ( 2 > $DPFactor ) {
                    $hSP += $SP;
                }
            }
        }
        if ( 1 == $DP ) {
            $SP = 0;
        }
        $slider_width = ( $ssw * ( 1 + ( ( $PO % 2 ) * ( $DPFactor - 1 ) ) ) );
        $slider_height = ( $ssh * ( 1 + ( pow( 0, $PO % 2 ) ) * ( $DPFactor - 1 ) ) );
        
        if ( 1 != $DP ) {
            if ( 0 == $PO % 2 ) {
                $slider_height += $vSP;
            } else {
                $slider_width += $hSP;
            }
        }
        if ( isset( $data['navs'] ) ) {
            $nav_handlers = cnhk_ss::get_instance()->get_nav_list();
            foreach ( $data['navs'] as $key => $value ) {
                if ( ! isset( $nav_handlers[ $key ] ) ) continue;
                $_size = $nav_handlers[ $key ]->get_size( $data );
                $slider_width += $_size['width'];
                $slider_height += $_size['height'];
            }
        }
        
        $box_style = ' style="visibility:hidden;';
        $box_class = '';
        if ( $data['options']['b'] && $data['options']['brw'] ) {
            $box_style .= 'width:' . $data['options']['brw'] . '%;"';
            $box_class = ' boxed';
            switch ( $data['options']['align'] ) {
                case 'left' :
                    $box_class .= ' boxleft';
                    break;
                case 'center' :
                    $box_class .= ' boxcenter';
                    break;
                case 'right' :
                    $box_class .= ' boxright';
                    break;
                default:
            }
        } else {
            $box_style .= '"';
        }
        if ( isset( $data['navs'] ) && isset( $data['navs']['progress'] ) ) {
            $progress_prop = 'width';
            $progress_thick = 'height';
            $progress_pos_vert = 'top';
            $progress_pos_horz =  'left';
            switch ( $data['navs']['progress']['position'] ) {
                case 'left' :
                    $progress_prop = 'height';
                    $progress_thick = 'width';
                    $progress_pos_vert = 'bottom';
                    $progress_pos_horz =  'left';
                    break;
                case 'right' :
                    $progress_prop = 'height';
                    $progress_thick = 'width';
                    $progress_pos_vert = 'bottom';
                    $progress_pos_horz =  'right';
                    break;
                case 'bottom' :
                    $progress_prop = 'width';
                    $progress_thick = 'height';
                    $progress_pos_vert = 'bottom';
                    $progress_pos_horz =  'left';
                    break;
                default:
            }
        }
        ?>
        <div id="<?php echo $ss_id; ?>-box" class="cnhkss-wrap<?php echo $box_class; ?>"<?php echo $box_style; ?>>
            <script type="text/javascript">
            /* <![CDATA[ */
            (function($){
                var sliderOptions = {
                    $FillMode: <?php echo $data['options']['$FillMode'] ?>,
                    $AutoPlay: <?php echo ( $data['options']['$AutoPlay'] )? 'true' : 'false'; ?>,
                    $AutoPlayInterval: <?php echo $data['options']['$AutoPlayInterval'] ?>,
                    $MinDragOffsetToSlide: 110,
                    $SlideWidth: <?php echo $data['options']['w']; ?>,
                    $SlideHeight: <?php echo $data['options']['h']; ?>,
                    $SlideSpacing: <?php echo $SP; ?>,
                    $PlayOrientation: <?php echo $data['options']['$PlayOrientation'] ?>,
                    $DragOrientation: <?php echo ( 0 == floatval( $data['options']['$PlayOrientation'] ) % 2 )? 2 : 1; ?>,
                    $SlideDuration: <?php echo ( floatval( $data['options']['$SlideDuration'] ) )? floatval( $data['options']['$SlideDuration'] ) : 1500; ?>,
                    $PauseOnHover: <?php echo $data['options']['$PauseOnHover'] ?>,
                    $DisplayPieces: <?php echo $DP; ?>,
                    $ParkingPosition: <?php echo $PP; ?>,
                    <?php if ( isset( $data['navs']['arrows'] ) ) : ?>
                    $ArrowNavigatorOptions: {
                        $Class: $JssorArrowNavigator$,
                        $ChanceToShow: <?php echo $data['navs']['arrows']['$ChanceToShow'] ?>,
                        $AutoCenter: 0,
                        $Steps: 1,
                    },
                    <?php endif; ?>
                    <?php if ( isset( $data['navs']['bullet'] ) ) : ?>
                    $BulletNavigatorOptions: {
                        $Class: $JssorBulletNavigator$,
                        $ChanceToShow: 2,
                        $AutoCenter: 1,
                        $Orientation: 1,
                        $SpacingX: <?php echo floatval( $data['navs']['bullet']['size'] ) / 2; ?>,
                        $SpacingY: <?php echo floatval( $data['navs']['bullet']['size']) / 2 ; ?>,
                    }
                    <?php endif; ?>
                };
                $(function(){
                    if ( undefined === $.cnhkSlider ) {
                        $.cnhkSlider = {};
                    }
                    <?php if ( $DP != $DPFactor ) : 
                    /**
                     *  Nearby image visible, so load directly the last image
                     */
                    ?>
                    var lastImage = $( '#<?php echo $ss_id ?> [data-u="slides"] > div' ).last().find( 'img[data-u="image"]' )
                    lastImage.attr( 'src', lastImage.attr( 'data-src2' ) ).removeAttr( 'data-src2' );
                    <?php endif; ?>
                    $( '#<?php echo $ss_id ?>' ).parent().css( 'visibility', 'visible' );
                    $.cnhkSlider['<?php echo $ss_id; ?>'] = {
                        slider: new $JssorSlider$( '<?php echo $ss_id; ?>' , sliderOptions ),
                    };
                    <?php if ( isset( $data['navs'] ) && isset( $data['navs']['progress'] ) ) : ?>
                    $.cnhkSlider['<?php echo $ss_id; ?>'].slider.$On($JssorSlider$.$EVT_PROGRESS_CHANGE, function( slideIndex, progress, progressBegin, idleBegin, idleEnd, progressEnd ) {
                        $( '#<?php echo $ss_id; ?> .slider-progress-bar' ).css( '<?php echo $progress_prop; ?>', ( progress * 100 / progressEnd ) + '%' );
                    });
                    <?php endif; ?>
                    $( document ).trigger( 'cnhkSliderStarted', ['<?php echo $ss_id; ?>'] );
                });
            })(jQuery);
            /* ]]> */
            </script>
            <?php 
                $loading_left = ( floatval( $slider_width ) / 2 ) - 16;
                $loading_top = ( floatval( $slider_height ) / 2 ) - 16;
                $loading_bg = ( isset( $data['options']['loadBg'] ) && ! empty( $data['options']['loadBg'] ) )?  $data['options']['loadBg'] : false;
                $loading_style = 'position:absolute;left:0px;top:0px;width:' . $data['options']['w'] . 'px;height:' . $data['options']['h'] . 'px;';
                if ( $loading_bg ) {
                    $loading_style .= 'background-color:' . $loading_bg .';';
                }
            ?>
            <div id="<?php echo $ss_id; ?>" style="position:absolute;overflow:hidden;width:<?php echo $slider_width; ?>px;height:<?php echo $slider_height; ?>px;">
                <div data-u="loading" style="<?php echo $loading_style; ?>">
                    <img alt="loading" src="<?php echo esc_url( CNHK_URL . 'public/assets/img/loader.gif' ); ?>"  style="position:absolute;left:<?php echo $loading_left; ?>px;top:<?php echo $loading_top; ?>px;width:32px;height:32px;" />
                </div>
                <div data-u="slides" style="position:absolute;overflow:hidden;width:<?php echo $slider_width; ?>px;height:<?php echo $slider_height; ?>px;">
                <?php 
                $sli = 0;
                foreach ( $data['slides'] as $slide_id => $slide ) {
                    $sh = cnhk_ss::get_instance()->get_slide_type_handler( $slide['type'] );
                    if ( ! $sh ) continue;
                    $sh->render( $slide, $slide_id, $data['options'], $sli );
                    $sli++;
                }
                if ( isset( $data['navs'] ) && isset( $data['navs']['progress'] ) ) {
                    $progress_style = 'position:absolute;background-color:' . $data['navs']['progress']['color'] . ';' .
                            'opacity:' . $data['navs']['progress']['opacity'] . ';' .
                            $progress_pos_horz . ':0;' .
                            $progress_pos_vert . ':0;' .
                            $progress_prop . ':0;' .
                            $progress_thick . ':' . $data['navs']['progress']['size'] . 'px;';
                    ?>
                    <div data-u="any" class="slider-progress-bar" style="<?php echo $progress_style; ?>"></div>
                    <?php
                }
                ?>
                </div>
                <?php if ( isset( $data['navs'] ) ) {
                    foreach ( $nav_handlers as $key => $handler ) {
                        if ( ! isset( $data['navs'][ $key ] ) ) continue;
                        $handler->render( $data['navs'][ $key ], $data['options'] );
                    }
                }
                ?>
            </div>
        </div>
        <?php
    }
    
    // content of slides post box
    public function slide_params() {
        global $post;
        $this->load_data( $post->post_content );
        require_once CNHK_PATH . 'modules/template-classic/views/slide-params.php';
    }
    
    // content of basic parameters post box
    public function basic_params() {
        global $post;
        $this->load_data( $post->post_content );
        require_once CNHK_PATH . 'modules/template-classic/views/basic-params.php';
    }
    
    // content of advanced parameters post box
    public function advanced_params() {
        global $post;
        $this->load_data( $post->post_content );
        require_once CNHK_PATH . 'modules/template-classic/views/advanced-params.php';
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    
}
