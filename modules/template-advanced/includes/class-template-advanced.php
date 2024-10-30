<?php
/**
 *  Advanced slider template
 */
class cnhk_template_advanced extends cnhk_template_abstract
{
    private static $instance = null;
    
    // default slider data
    protected $default_options = array(
        // size
        'w' => 1300,
        'h' => 500,
        'loadBg' => '',
        // box
        'b' => false,
        'brw' => '',
        'align' => 'center',
        // slide transition
        'ssfx' => '',
        'ssdu' => 1500,
        // jssor specific settings
        '$FillMode' => 2,
        '$AutoPlay' => true,
        '$AutoPlayInterval' => 8000,
        '$PauseOnHover' => 1,
        '$PlayOrientation' => 1,
        '$DisplayPieces' => 1,
    );
    
    // template slug
    public $slug = 'advanced';
    
    // supported slide type
    public $supported_slide_types = array( 'image', 'html' );
    
    // supported navigators
    public $supported_nav_types = array( 'arrows', 'bullet', 'progress' );
    
    // template support for slide transition effects
    public $supports_fx = true;
    
    // template support for caption
    public $supports_caption = true;
    
    // template supports for static content
    public $supports_static = true;
    
	protected function __construct() {
        parent::__construct();
        $this->name = __( 'Advanced template', 'cnhk-ss' );
        $this->desc = __( 'Template with advanced slide effects and captions. Usable with HTML and image slides', 'cnhk-ss' );
        
        $this->default_data = array(
            'template' => 'advanced',
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
        $scripts['cnhk-template-handler-advanced'] = array(
            'url' => CNHK_URL . 'modules/template-advanced/js/template-handler' . $mini . '.js',
            'dep' => array( 'jquery', 'jssor-js' ),
            'locale' => 'cnhkTemplateHandlerAdvancedLocale',
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
        
        if ( isset( $data['navs'] ) ) {
            $nav_handlers = cnhk_ss::get_instance()->get_nav_list();
            foreach ( $data['navs'] as $key => $value ) {
                if ( ! isset( $nav_handlers[ $key ] ) ) continue;
                $_size = $nav_handlers[ $key ]->get_size( $data );
                $ssw += $_size['width'];
                $ssh += $_size['height'];
            }
        }
        
        $ssfx = array();
        $cafx = array();
        foreach ( $data['slides'] as $slide_id => $slide ) {
            if ( isset( $slide['isStatic'] ) ) continue;
            $slfx = 'null';
            if ( $slide['slfx'] ) {
                $slfx = $slide['slfx'];
            } elseif ( $data['options']['ssfx'] ) {
                $slfx = $data['options']['ssfx'];
            }
            $sldu = 1500;
            if ( $slide['sldu'] ) {
                $sldu = floatval( $slide['sldu'] );
            } elseif ( $data['options']['ssdu'] ) {
                $sldu = floatval( $data['options']['ssdu'] );
            }
            if ( 'null' != $slfx ) {
                $fx = jssor_decode( $slfx );
                if ( isset( $fx['$Brother'] ) ) {
                    $d1 = $fx['$Duration'];
                    $ratio = floatval( $d1 ) / $sldu;
                    $fx['$Duration'] = $sldu;
                    $fx['$Brother']['$Duration'] = floatval( $fx['$Brother']['$Duration'] ) / $ratio;
                } else {
                    $fx['$Duration'] = $sldu;
                }
                $slfx = jssor_encode( $fx );
            }
            $ssfx[] = $slfx;
            
            if ( isset( $slide['captions'] ) ) {
                foreach ( $slide['captions'] as $caid => $caption ) {
                    $fxs = json_decode( $caption['timing'], true );
                    if ( $fxs['cafx'] ) {
                        $cafx[$slide_id . '|' . $caid . '|1'] = $fxs['cafx'];
                    }
                    if ( $fxs['cafx2'] ) {
                        $cafx[$slide_id . '|' . $caid . '|2'] = $fxs['cafx2'];
                    }
                    if ( $fxs['cafx3'] ) {
                        $cafx[$slide_id . '|' . $caid . '|3'] = $fxs['cafx3'];
                    }
                }
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
                var ssFx = [<?php echo implode( ",", $ssfx ); ?>];
                var caFx = {
                    <?php 
                    foreach ( $cafx as $key => $value ){
                        echo "'" . $key . "': " . $value . ",";
                    }
                    ?>
                };
                var sliderOptions = {
                    $FillMode: <?php echo $data['options']['$FillMode'] ?>,
                    $AutoPlay: <?php echo ( $data['options']['$AutoPlay'] )? 'true' : 'false'; ?>,
                    $AutoPlayInterval: <?php echo $data['options']['$AutoPlayInterval'] ?>,
                    $SlideDuration: <?php echo ( floatval( $data['options']['ssdu'] ) )?  floatval( $data['options']['ssdu'] ) : 1500; ?>,
                    $MinDragOffsetToSlide: 110,
                    $PlayOrientation: <?php echo $data['options']['$PlayOrientation'] ?>,
                    $DragOrientation: <?php echo ( 0 == floatval( $data['options']['$PlayOrientation'] ) % 2 )? 2 : 1; ?>,
                    $PauseOnHover: <?php echo $data['options']['$PauseOnHover'] ?>,
                    $DisplayPieces: <?php echo $data['options']['$DisplayPieces'] ?>,
                    $SlideshowOptions: {
                        $Class: $JssorSlideshowRunner$,
                        $Transitions: ssFx,
                        $TransitionsOrder: 1,
                    },
                    <?php if ( ! empty( $cafx ) ) : ?>
                    $CaptionSliderOptions: {
                        $Class: $JssorCaptionSlider$,
                        $CaptionTransitions: caFx,
                        $PlayInMode: 1,
                        $PlayOutMode: 1,
                    },
                    <?php endif; ?>
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
                        $SpacingX: <?php echo floatval( $data['navs']['bullet']['size'] / 2 ); ?>,
                        $SpacingY: <?php echo floatval( $data['navs']['bullet']['size'] / 2 ); ?>,
                    }
                    <?php endif; ?>
                };
                $(function(){
                    if ( undefined === $.cnhkSlider ) {
                        $.cnhkSlider = {};
                    }
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
                $loading_left = ( floatval( $data['options']['w'] ) / 2 ) - 16;
                $loading_top = ( floatval( $data['options']['h'] ) / 2 ) - 16;
                $loading_bg = ( isset( $data['options']['loadBg'] ) && ! empty( $data['options']['loadBg'] ) )?  $data['options']['loadBg'] : false;
                $loading_style = 'position:absolute;left:0px;top:0px;width:' . $data['options']['w'] . 'px;height:' . $data['options']['h'] . 'px;';
                if ( $loading_bg ) {
                    $loading_style .= 'background-color:' . $loading_bg .';';
                }
            ?>
            <div id="<?php echo $ss_id; ?>" style="position:absolute;overflow:hidden;width:<?php echo $ssw; ?>px;height:<?php echo $ssh; ?>px;">
                <div data-u="loading" style="<?php echo $loading_style; ?>">
                    <img alt="loading" src="<?php echo esc_url( CNHK_URL . 'public/assets/img/loader.gif' ); ?>"  style="position:absolute;left:<?php echo $loading_left; ?>px;top:<?php echo $loading_top; ?>px;width:32px;height:32px;" />
                </div>
                <div data-u="slides" style="position:absolute;overflow:hidden;width:<?php echo $data['options']['w']; ?>px;height:<?php echo $data['options']['h']; ?>px;">
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
        require_once CNHK_PATH . 'modules/template-advanced/views/slide-params.php';
    }
    
    // content of basic parameters post box
    public function basic_params() {
        global $post;
        $this->load_data( $post->post_content );
        require_once CNHK_PATH . 'modules/template-advanced/views/basic-params.php';
    }
    
    // content of advanced parameters post box
    public function advanced_params() {
        global $post;
        $this->load_data( $post->post_content );
        require_once CNHK_PATH . 'modules/template-advanced/views/advanced-params.php';
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
            if ( ! is_array( $slider ) ) continue;
            if ( 'advanced' == $slider['template'] ) {
                return true;
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
