<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}
/**
 * get the easing array with translated name
 */
function jssor_get_easing_array() {
    $easing = array(
        '$JssorEasing$.$EaseSwing' => __( 'Ease Swing', 'cnhk-ss' ),
        '$JssorEasing$.$EaseLinear' => __( 'Ease Linear', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInQuad' => __( 'Ease In Quad', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutQuad' => __( 'Ease Out Quad', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutQuad' => __( 'Ease In Out Quad', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInCubic' => __( 'Ease In Cubic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutCubic' => __( 'Ease Out Cubic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutCubic' => __( 'Ease In Out Cubic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInQuart' => __( 'Ease In Quart', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutQuart' => __( 'Ease Out Quart', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutQuart' => __( 'Ease In Out Quart', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInQuint' => __( 'Ease In Quint', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutQuint' => __( 'Ease Out Quint', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutQuint' => __( 'Ease In Out Quint', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInSine' => __( 'Ease In Sine', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutSine' => __( 'Ease Out Sine', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutSine' => __( 'Ease In Out Sine', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInExpo' => __( 'Ease In Expo', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutExpo' => __( 'Ease Out Expo', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutExpo' => __( 'Ease In Out Expo', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInCirc' => __( 'Ease In Circ', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutCirc' => __( 'Ease Out Circ', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutCirc' => __( 'Ease In Out Circ', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInElastic' => __( 'Ease In Elastic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutElastic' => __( 'Ease Out Elastic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutElastic' => __( 'Ease In Out Elastic', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInBack' => __( 'Ease In Back', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutBack' => __( 'Ease Out Back', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutBack' => __( 'Ease In Out Back', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInBounce' => __( 'Ease In Bounce', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutBounce' => __( 'Ease Out Bounce', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInOutBounce' => __( 'Ease In Out Bounce', 'cnhk-ss' ),
        '$JssorEasing$.$EaseGoBack' => __( 'Ease Go Back', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInWave' => __( 'Ease In Wave', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutWave' => __( 'Ease Out Wave', 'cnhk-ss' ),
        '$JssorEasing$.$EaseOutJump' => __( 'Ease Out Jump', 'cnhk-ss' ),
        '$JssorEasing$.$EaseInJump' => __( 'Ease In Jump', 'cnhk-ss' ),
    );
    return $easing;
    
}

/**
 *  translate jssor $FillMode parameter to literal value used in caption setup ( see /admin/assets/js/slide-wrap.js )
 *  
 *  @param [mixed] $code, the '$FillMode' code ans integer os string
 *  @return str , the literal equivalent
 */
function cnhk_fill_mode( $code = 2 ) {
    $eq = array(
        0 => 'stretch',
        1 => 'contain',
        2 => 'cover',
        4 => 'asIs',
        5 => 'mix',
    );
    return ( isset( $eq[ intval( $code ) ] ) )? $eq[ intval( $code ) ] : 'cover';
}

/**
 *  convert hex color to rgb
 *  
 *  @param [string] $hex, hex color
 *  @return [array] $rgb, r, g and b components of the color
 */
function cnhk_hex_to_rgb( $hex ) {
    $hex = trim( str_replace( '#', '', $hex ) );

    if( strlen( $hex ) == 3 ) {
        $r = hexdec( substr( $hex, 0, 1 ).substr( $hex, 0, 1 ) );
        $g = hexdec( substr( $hex, 1, 1 ).substr( $hex, 1, 1 ) );
        $b = hexdec( substr( $hex, 2, 1 ).substr( $hex, 2, 1 ) );
    } else { 
        $r = hexdec( substr( $hex, 0, 2 ) );
        $g = hexdec( substr( $hex, 2, 2 ) );
        $b = hexdec( substr( $hex, 4, 2 ) );
    }
    $rgb = array( $r, $g, $b );
   
    return $rgb;
}

/**
 *  markup for effect picker used in javascript
 */
function cnhk_fx_picker_markup() {
    ?>
    <div id="fx-picker-container" style="display:none;">
        <span class="current-name"></span>
        <button class="button-secondary select-fx"><?php _e( 'Select', 'cnhk-ss' ); ?></button>
        <button class="button-secondary clear-fx"><?php _e( 'Clear', 'cnhk-ss' ); ?></button>
        <div class="fx-picker-wrap" style="display:none;">
            <i class="alignright dashicons dashicons-no"></i>
            <div class="picker-head">
                <span><?php _e( 'collection', 'cnhk-ss' ); ?>&nbsp;:&nbsp;</span><select class="select-collection"></select>
                <span class="delete-collection"><?php _e( 'delete collection', 'cnhk-ss' ); ?></span>
            </div>
            <div class="picker-body">
            </div>
        </div>
    </div>
    <?php
}

/**
 *  markup for effect saver used in javascript
 */
function cnhk_fx_saver_markup() {
    ?>
    <div id="fx-saver-container" style="display:none;">
        <i class="alignright dashicons dashicons-no"></i>
        <label>
            <input type="checkbox" class="add-to-collection" checked="checked" value="" />
            <?php _e( 'add to existing collection', 'cnhk-ss' ); ?>
        </label><br />
        <select class="select-collection"></select><br />
        <label>
            <input type="checkbox" class="add-new-collection" value="" />
            <?php _e( 'add to new collection', 'cnhk-ss' ); ?><br />
            <input type="text" disabled="disabled" class="new-collection-name" />
        </label><br />
        <label><?php _e( 'effect name', 'cnhk-ss' ); ?></label><br />
        <input type="text" class="new-fx-name" />
        <p><button class="button-secondary save-new-fx"><?php _e( 'save', 'cnhk-ss' ); ?></button></p>
        <p class="saver-notice"></p>
    </div>
    <?php
}

/**
 *  helper function for printing an effect picker and the associated saver if needed
 */
function cnhk_fx_picker( $args ) {
    $default_args = array(
        'root' => 'slide',
        'class' => '',
        'name' => '',
        'id' => '',
        'code' => '',
    );
    $args = $args + $default_args;
    $output = '<input type="hidden" data-root="' . $args['root'] . '"';
    $output .= ' class="fx-autopicker ' . $args['class'] . '"';
    if ( ! empty( $args['id'] ) ) {
        $output .= ' id="' . $args['id'] . '"';
    }
    if ( ! empty( $args['name'] ) ) {
        $output .= ' name="' . $args['name'] . '"';
    }
    $output .= ' value="' . esc_attr( $args['code'] ) . '"';
    $output .= ' />';
    
    if ( ! empty( $args['code'] ) ) {
        $fx_handler = cnhk_fx::get_instance();
        $code_name = $fx_handler->get_name( $args['root'], $args['code'] );
        if ( ! $code_name['collection'] ) {
            $output .= '<button class="button-secondary fx-autosaver" data-root="' . $args['root'] . '" disabled="disabled">' . __( 'add to collection', 'cnhk-ss' ) . '</button>';
        }
    }
    
    echo $output;
}
