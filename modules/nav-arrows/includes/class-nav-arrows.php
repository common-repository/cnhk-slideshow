<?php
/**
 *  arrows navigator class
 */
class cnhk_nav_arrows extends cnhk_nav_abstract
{
    private static $instance = null;
    
    // list of font awesome arrows icons
    private $icons;
    
    // jssor's $ChanceToShow parameters helper array
    private $_ChanceToShow;
    
    private function __construct() {
        $this->slug = 'arrows';
        $this->name = __( 'Navigation arrows', 'cnhk-ss' );
        add_filter( 'cnhk-postnew-scripts', array( $this, 'postnew_scripts' ) );
        add_filter( 'cnhk-postnew-styles', array( $this, 'postnew_styles' ) );
        $this->init();
    }
    
    // setup properties on init
    private function init() {
        
        $this->icons = array(
            'step-backward',
            'backward',
            'step-forward',
            'forward',
            'chevron-left',
            'chevron-right',
            'chevron-up',
            'chevron-down',
            'arrow-left',
            'arrow-right',
            'arrow-up',
            'arrow-down',
            'arrow-circle-left',
            'arrow-circle-right',
            'arrow-circle-up',
            'arrow-circle-down',
            'caret-left',
            'caret-right',
            'caret-up',
            'caret-down',
            'angle-left',
            'angle-right',
            'angle-up',
            'angle-down',
            'angle-double-left',
            'angle-double-right',
            'angle-double-up',
            'angle-double-down',
            'long-arrow-left',
            'long-arrow-right',
            'long-arrow-up',
            'long-arrow-down',
            'arrow-circle-o-left',
            'arrow-circle-o-right',
            'arrow-circle-o-up',
            'arrow-circle-o-down',
            'chevron-circle-left',
            'chevron-circle-right',
            'chevron-circle-up',
            'chevron-circle-down',
            'caret-square-o-left',
            'caret-square-o-right',
            'caret-square-o-up',
            'caret-square-o-down',
        );
        
        $this->_ChanceToShow = array(
            '1' => __( 'Show on mouse over', 'cnhk-ss' ),
            '2' => __( 'always shown', 'cnhk-ss' ),
        );
        
    }
    
    // enqueue styles on post edit page
    public function postnew_styles( $styles ) {
        $styles['cnhk-nav-arrow-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-arrows/css/post-new.css',
            'version' => CNHK_VERSION,
        );
        return $styles;
    }
    
    // enqueue script on post edit pages
    public function postnew_scripts( $scripts ) {
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        $scripts['cnhk-nav-arrow-postnew'] = array(
            'url' => CNHK_URL . 'modules/nav-arrows/js/post-new' . $mini. '.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        $scripts['cnhk-nav-arrow-handler'] = array(
            'url' => CNHK_URL . 'modules/nav-arrows/js/nav-handler' . $mini . '.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
        );
        return $scripts;
    }
    
    // print the admin form in the navigation metabox
    public function admin_params() {
        include_once CNHK_PATH . 'modules/nav-arrows/includes/admin-params.php';
    }
    
    // render arrows on front end
    public function render( $data, $options, $offset = array( 'left' => 0, 'top' => 0 ) ) {
        
        $DP = floatval( $options['$DisplayPieces'] );
        $PO = floatval( $options['$PlayOrientation'] );
        
        $DPFactor = $DP;
        if ( $DP <= 1 ) {
            $DP = 1;
            $DPFactor = 1;
        } else if ( 2 <= $DP ) {
            $DP = floor( $DP );
            $DPFactor = $DP;
        } else {
            $DP = 2;
        }
        
        $SP = 0;
        $hSP = 0;
        $vSP = 0;
        
        if ( 2 <= $DP ) {
            $SP = 5;
            if ( 0 == ( $PO % 2 ) ) {
                // vertical
                $vSP = $DP * $SP;
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
        
        $sw = floatval( $options['w'] );
        $sh = floatval( $options['h'] );
        
        $sw = ( $sw * ( 1 + ( ( $PO % 2 ) * ( $DPFactor - 1 ) ) ) ) + $vSP;
        $sh = ( $sh * ( 1 + ( pow( 0, $PO % 2 ) ) * ( $DPFactor - 1 ) ) ) + $hSP;
        
        $pos = explode( '-', $data['position'] );
        $orientation = $data['orientation'];
        $spacing = $data['spacing'];
        $as = floatval( $data['size'] ) * floatval( $options['$DisplayPieces'] );
        $color = ( $data['color'] )? $data['color'] : false;
        $i = intval( $pos[0] );
        $j = floor( ( $i - 0.1 ) / 3 );
        $m = 0.05;
        $l = ( 1 + ( 2 * $m ) ) * $as;
        
        $bx = $l + ( ( ( $sw / 2 ) - $l ) * ( ( $i + 2 ) % 3 ) );
        $by = $l + ( ( ( $sh / 2 ) - $l ) * $j );
        
        // grouped icons
        $pleft = $bx - $l;
        $ptop = $by - ( ( 2 * $m ) * $as );
        $nleft = $bx;
        $ntop = $by - ( ( 2 * $m ) * $as );
        if ( 'spaced' == $spacing ) {
            // spaced icons
            if ( 'horizontal' == $orientation ) {
                $pleft = $l / 4;
                $ptop = $by - ( $l / 2 );
                $nleft = $sw - ( 1.25 * $l );
                $ntop = $by - ( $l / 2 );
            } else {
                $pleft = $bx - ( $l / 2 );
                $ptop = $l / 4;
                $nleft = $bx - ( $l / 2 );
                $ntop = $sh - ( 1.25 * $l );
            }
        }
        
        $icon_style =   'font-size:' . $as . 'px;' .
                        'position:absolute;' .
                        'width:' . $as . 'px;' .
                        'height:' . $as . 'px;' .
                        'left:' . $m * $as . 'px;' .
                        'top:' . $m * $as . 'px;' .
        
        $data_hbg = '';
        if ( 'use' == $data['bg'] && '0' != $data['bgOpacity'] && $data['bgColor'] ) {
            $rgb = cnhk_hex_to_rgb( $data['bgColor'] );
            $data_hbg .= ' data-hbg="rgba(' . $rgb[0] . ',' . $rgb[1] . ',' . $rgb[2] . ',' . $data['bgOpacity'] . ')"';
        }
        
        if ( $color ) $icon_style .='color:' . $color . ';';
        
        $br = 0;
        if ( 'round' == $data['round'] ) {
            $br = ( 0.5 + $m ) * $as;
        }
        
        $pleft += $offset['left'];
        $ptop += $offset['top'];
        $nleft += $offset['left'];
        $ntop += $offset['top'];
        
        $picon =    '<div ' . $data_hbg . ' data-u="arrowleft" class="navarrow" ' .
                            'style="width:' . ( ( 1 + ( 2 * $m ) )* $as ) . 'px;' .
                            'height:' . ( ( 1 + ( 2 * $m ) )* $as ) . 'px;' .
                            'border-radius:' . $br . 'px;' .
                            'left:' . $pleft . 'px;' .
                            'top:' . $ptop . 'px;">' .
                        '<span class="fa fa-' . $data['picon'] . '" style="' . $icon_style . '"></span>' .
                    '</div>';
        
        $nicon =    '<div ' . $data_hbg . ' data-u="arrowright" class="navarrow" ' .
                            'style="width:' . ( ( 1 + ( 2 * $m ) )* $as ) . 'px;' .
                            'height:' . ( ( 1 + ( 2 * $m ) )* $as ) . 'px;' .
                            'border-radius:' . $br . 'px;' .
                            'left:' . $nleft . 'px;' .
                            'top:' . $ntop . 'px;">' . 
                        '<span class="fa fa-' . $data['nicon'] . '" style="' . $icon_style . '"></span>' .
                    '</div>';
        
        echo $picon . $nicon;
    }
    
    // return the unique instance of the class
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
