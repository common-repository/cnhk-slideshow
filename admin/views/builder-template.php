<?php
if ( !isset( $fx_type ) || ( 'ss' != $fx_type && 'ca' != $fx_type ) ) {
    echo '<div class="error"><p>Effect type not defined</p></div>';
    return;
}
$is_ss = ( 'ss' == $fx_type )? true : false;
$_easing = jssor_get_easing_array();
$_formation = array(
    '$JssorSlideshowFormations$.$FormationStraight' => __( 'Straight', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationStraightStairs' => __( 'Straight Stairs', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationSwirl' => __( 'Swirl', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationZigZag' => __( 'ZigZag', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationSquare' => __( 'Square', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationRectangle' => __( 'Rectangle', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationCircle' => __( 'Circle', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationCross' => __( 'Cross', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationRectangleCross' => __( 'Rectangle Cross', 'cnhk-ss' ),
    '$JssorSlideshowFormations$.$FormationRandom' => __( 'Random', 'cnhk-ss' ),
);
$_assembly = array(
    '2049' => __( 'Bottom to Left', 'cnhk-ss' ),
    '2050' => __( 'Bottom to Right', 'cnhk-ss' ),
    '513' => __( 'Top to Left', 'cnhk-ss' ),
    '514' => __( 'Top to Right', 'cnhk-ss' ),
    '260' => __( 'Left to Top', 'cnhk-ss' ),
    '264' => __( 'Left to Bottom', 'cnhk-ss' ),
    '1028' => __( 'Right to Top', 'cnhk-ss' ),
    '1032' => __( 'Right to Bottom', 'cnhk-ss' ),
);
$_duration = array(
    '200' => 200,
    '300' => 300,
    '400' => 400,
    '500' => 500,
    '600' => 600,
    '700' => 700,
    '800' => 800,
    '900' => 900,
    '1000' => 1000,
    '1100' => 1100,
    '1200' => 1200,
    '1500' => 1500,
    '1800' => 1800,
    '2000' => 2000,
    '2500' => 2500,
    '3000' => 3000,
    '4000' => 4000,
    '5000' => 5000,
);

$_delay = array(
    '0' => 0,
    '10' => 10,
    '20' => 20,
    '30' => 30,
    '40' => 40,
    '50' => 50,
    '60' => 60,
    '80' => 80,
    '100' => 100,
    '120' => 120,
    '150' => 150,
    '160' => 160,
    '200' => 200,
    '300' => 300,
    '400' => 400,
    '500' => 500,
    '600' => 600,
    '800' => 800,
);
$_round = array(
    '0.1' => 0.1,
    '0.2' => 0.2,
    '0.25' => 0.25,
    '0.3' => 0.3,
    '0.4' => 0.4,
    '0.5' => 0.5,
    '0.6' => 0.6,
    '0.7' => 0.7,
    '0.75' => 0.75,
    '0.8' => 0.8,
    '0.85' => 0.85,
    '0.9' => 0.9,
    '0.95' => 0.95,
    '1' => 1,
    '1.1' => 1.1,
    '1.2' => 1.2,
    '1.25' => 1.25,
    '1.3' => 1.3,
    '1.5' => 1.5,
    '1.6' => 1.6,
    '1.7' => 1.7,
    '1.75' => 1.75,
    '1.8' => 1.8,
    '2' => 2,
    '2.5' => 2.5,
    '3' => 3,
    '3.5' => 3.5,
    '4' => 4,
    '4.5' => 4.5,
    '5' => 5,
);

$_clip = array(
    '15' => __( 'Around', 'cnhk-ss' ),
    '3' => __( 'Left & Right', 'cnhk-ss' ),
    '12' => __( 'Top & Bottom', 'cnhk-ss' ),
    '5' => __( 'Top & Left', 'cnhk-ss' ),
    '6' => __( 'Top & Right', 'cnhk-ss' ),
    '9' => __( 'Bottom & Left', 'cnhk-ss' ),
    '10' => __( 'Bottom & Right', 'cnhk-ss' ),
    '4' => __( 'Top', 'cnhk-ss' ),
    '8' => __( 'Bottom', 'cnhk-ss' ),
    '1' => __( 'Left', 'cnhk-ss' ),
    '2' => __( 'Right', 'cnhk-ss' ),
    '11' => __( 'Exclude Top', 'cnhk-ss' ),
    '7' => __( 'Exclude Bottom', 'cnhk-ss' ),
    '14' => __( 'Exclude Left', 'cnhk-ss' ),
    '13' => __( 'Exclude Right', 'cnhk-ss' ),
);

$code = array();

/**
 *  Single component effect / $Easing is not an array, so it is causing troubles
 */
$_components = array(
    'x' => false, // Fly Horizontal
    'y' => false , // Fly Vertical
    '$Clip' => false , // Zoom
    '$Rotate' => false , // Rotate
    '$Opacity' => false , // Fade
);
$_component_count = 0;
$_the_component = '';
foreach ( $_components as $key => $value ) {
    if ( isset( $code[ $key ] ) ) {
        $_components[ $key ] = true;
        $_the_component = $key;
        $_component_count++;
    }
}

if ( 1 == $_component_count && isset( $code['$Easing'] ) && ! isset( $code['$Easing'][ $_the_component ] ) ) {
    $code['$Easing'][ $_the_component ] = $code['$Easing'];
    unset( $code['$Easing'] );
}

?>
<div id="fx-builder" style="padding: 6px;">
    <?php if ( $is_ss ) : ?>
    <p>
        <?php $twin_caution = __( '<strong>Caution:</strong> Animating simultaneously two big slides can be really heavy depending on the complexity of the transitions and the nature of the slide', 'cnhk-ss' ); ?>
        <div class="caution" style="margin-left:5px;">
            <span class="dashicons dashicons-info"></span>
            <div class="caution-content clearfix"><?php echo $twin_caution; ?></div>
        </div>
        <button class="button-secondary" id="open-brother"><?php _e( 'edit twin effect', 'cnhk-ss' ); ?></button>
        <button class="button-secondary" id="clear-brother"><?php _e( 'clear', 'cnhk-ss' ); ?></button><br />
        <em style="color: #666;margin:5px;"><i class="dashicons dashicons-info"></i>&nbsp;<?php _e( 'twin effect applies to the other slide involved in the transition', 'cnhk-ss' ); ?></em>
    </p>
    <hr />
    <?php endif; ?>
    <p>
        <span style="display: inline-block; vertical-align: middle; width: 36px; height: 18px; padding:0; border: 1px solid #ddd;" class="nouse-field field-tip"></span>&nbsp;<em><?php _e( 'Field with no impact', 'cnhk-ss' ); ?></em>
        <span style="display: inline-block; vertical-align: middle; width: 36px; height: 18px; padding:0; border: 1px solid #ddd;" class="invalid-field field-tip"></span>&nbsp;<em><?php _e( 'Field with invalid value', 'cnhk-ss' ); ?></em>
        <span style="display: inline-block; vertical-align: middle; width: 36px; height: 18px; padding:0; border: 1px solid #ddd;" class="modified-field field-tip"></span>&nbsp;<em><?php _e( 'Modified field', 'cnhk-ss' ); ?></em>
    </p>
    <table class="widefat fixed">
        <tbody>
            <tr>
                <th><b><?php if ( $is_ss ) : _e( 'Main parameters', 'cnhk-ss'); endif; ?></b></th>
                <th><b><?php if ( $is_ss ) : _e( 'Rows and columns (blocks)', 'cnhk-ss'); endif; ?></b></th>
                <th><b><?php if ( $is_ss ) : _e( 'Options', 'cnhk-ss'); endif; ?></b></th>
            </tr>
            <tr>
                <td>
                    <?php if ( $is_ss ) : ?>
                    <label><?php _e( 'Formation', 'cnhk-ss'); ?>
                        <select name="ssFormation" id="ssFormation" data-orv="<?php echo ( isset( $code['$Formation'] ) )? esc_attr( $code['$Formation'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach( $_formation as $key => $value ) : ?>
                            <option value="<?php echo esc_attr( $key ); ?>" <?php selected( isset( $code['$Formation'] ) && $key == $code['$Formation'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Shape that assembly blocks as', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Assembly', 'cnhk-ss' ); ?>
                        <select name="ssAssembly" id="ssAssembly" data-orv="<?php echo ( isset( $code['$Assembly'] ) )? esc_attr( $code['$Assembly'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach ( $_assembly as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Assembly'] ) && intval( $key ) == $code['$Assembly'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'The way to assembly blocks', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php endif; // $is_ss ?>
                    <label><?php _e( 'Duration', 'cnhk-ss' ); ?>
                        <select name="ssDuration" id="ssDuration" data-orv="<?php echo ( isset( $code['$Duration'] ) )? esc_attr( $code['$Duration'] ) : ''; ?>">
                            <?php foreach ( $_duration as $key => $value ) : ?>
                            <option value="<?php echo $key ?>" <?php selected( isset( $code['$Duration'] ) && $value == $code['$Duration'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Duration of the whole transition (in ms)', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td>
                    <?php if ( $is_ss ) : ?>
                    <label><?php _e( 'Columns', 'cnhk-ss' ); ?>
                        <select name="ssCols" id="ssCols" data-orv="<?php echo ( isset( $code['$Cols'] ) )? esc_attr( $code['$Cols'] ) : '1'; ?>">
                            <?php for ( $i = 1; $i < 15; $i++) : ?>
                            <option value="<?php echo $i; ?>" <?php selected( ( isset( $code['$Cols'] ) && $code['$Cols'] == $i ) || ( 1 == $i && ! isset( $code['$Cols'] ) ) ); ?>><?php echo $i; ?></option>
                            <?php endfor; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Number of columns', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Rows', 'cnhk-ss' ); ?>
                        <select name="ssRows" id="ssRows" data-orv="<?php echo ( isset( $code['$Rows'] ) )? esc_attr( $code['$Rows'] ) : '1'; ?>">
                            <?php for ( $i = 1; $i < 15; $i++) : ?>
                            <option value="<?php echo $i; ?>" <?php selected( ( isset( $code['$Rows'] ) && $code['$Rows'] == $i ) || ( 1 == $i && ! isset( $code['$Rows'] ) ) ); ?>><?php echo $i; ?></option>
                            <?php endfor; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Number of rows', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Delay', 'cnhk-ss' ); ?>
                        <select name="ssDelay" id="ssDelay" data-orv="<?php echo ( isset( $code['$Delay'] ) )? esc_attr( $code['$Delay'] ) : '0'; ?>">
                        <?php foreach ( $_delay as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( ( isset( $code['$Delay'] ) && $value == $code['$Delay'] ) || ( ! isset( $code['$Delay'] ) && $value == 0 ) ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Delay to assembly blocks (in ms)', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php endif; // $is_ss ?>
                </td>
                <td>
                    <?php if ( $is_ss ) : ?>
                    <label><?php _e( 'Reverse', 'cnhk-ss' ); ?>
                        <input type="checkbox" data-orv="<?php echo ( isset( $code['$Reverse'] ) )? var_export( $code['$Reverse'] ) : 'false'; ?>"
                            id="scReverse" name="scReverse" <?php checked( isset( $code['$Reverse'] ) && $code['$Reverse'] ); ?> />
                        <p class="fx-desc"><?php _e( 'Reverse the assembly order', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Slide Out', 'cnhk-ss' ); ?>
                        <input type="checkbox" data-orv="<?php echo ( isset( $code['$SlideOut'] ) )? var_export( $code['$SlideOut'] ) : 'false'; ?>"
                            id="scSlideOut" name="scSlideOut" <?php checked( isset( $code['$SlideOut'] ) && $code['$SlideOut'] ); ?> />
                        <p class="fx-desc"><?php _e( 'Apply effects when slide goes out', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Play Outside', 'cnhk-ss' ); ?>
                        <input type="checkbox" data-orv="<?php echo ( isset( $code['$Outside'] ) )? var_export( $code['$Outside'] ) : 'false'; ?>"
                            id="scOutside" name="scOutside" <?php checked( isset( $code['$Outside'] ) && $code['$Outside'] ); ?> />
                    </label>
                        <?php 
                            $caution = __( '<b>Caution</b>: When used in combination with a zoom, rotate or fly effect, with a too big scale, it might cause the page ( or some parts of the page ) to be enlarged. ( might break the page design ) ', 'cnhk-ss' );
                        ?>
                        <div class="caution">
                            <span class="dashicons dashicons-info alignright"></span>
                            <div class="caution-content clearfix"><?php echo $caution; ?></div>
                        </div>
                        <p class="fx-desc">
                            <?php _e( 'Display slides/blocks even when outside the slider area', 'cnhk-ss' ); ?>
                        </p>
                    <?php endif; // $is_ss ?>
                    <label><?php _e( 'Move', 'cnhk-ss' ); ?>
                        <?php 
                            $nomove_clipping = array( 15, 3, 12 );
                            $move_disabled = 'disabled="disabled" ';
                            if ( isset( $code['$Move'] ) && ! in_array( $code['$Move'], $nomove_clipping ) ) {
                                $move_disabled = '';
                            }
                        ?>
                        <input type="checkbox" data-orv="<?php echo ( isset( $code['$Move'] ) )? var_export( $code['$Move'] ) : 'false'; ?>"
                            id="scMove" name="scMove" <?php echo $move_disabled; checked( isset( $code['$Move'] ) && $code['$Move'] ); ?>/>
                        <p class="fx-desc"><?php _e( 'Move block while clipping', 'cnhk-ss' ); ?></p>
                    </label>
                
            </tr>
            <tr><td colspan="3"><hr /></td></tr>
            <tr>
                <th><b><?php _e( 'Fly (horz)', 'cnhk-ss' ); ?></b></th>
                <th><b><?php _e( 'Fly (vert)', 'cnhk-ss' ); ?></b></th>
                <th><b><?php _e( 'Clip', 'cnhk-ss' ); ?></b></th>
            </tr>
            <tr>
                <td>
                    <label><?php _e( 'Fly (horz)', 'cnhk-ss' ); ?>
                        <?php
                            $_flyHorz_orv = '0';
                            if ( isset( $code['x'] ) && 0 != $code['x'] ) {
                                if ( 0 < $code['x'] ) {
                                    $_flyHorz_orv = '1';
                                } else {
                                    $_flyHorz_orv = '-1';
                                }
                            }
                        ?>
                        <select name="ssFlyHorizontal" id="ssFlyHorizontal" data-orv="<?php echo $_flyHorz_orv; ?>">
                            <option value="0" <?php selected( ! isset( $code['x'] ) || 0 == $code['x'] ); ?>></option>
                            <option value="-1" <?php selected( isset( $code['x'] ) && 0 > floatval( $code['x'] ) ); ?>><?php _e( 'To Right', 'cnhk-ss' ); ?></option>
                            <option value="1" <?php selected( isset( $code['x'] ) && 0 < floatval( $code['x'] ) ); ?>><?php _e( 'To Left', 'cnhk-ss' ); ?></option>
                        </select>
                        <p class="fx-desc"><?php _e( 'Horizontal fly effect', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'During (horz)', 'cnhk-ss' ); ?></label>
                    <input name="stDuringBeginHor" type="text" id="stDuringBeginHor" 
                        value="<?php echo ( isset( $code['$During']['$Left'] ) )? esc_attr( $code['$During']['$Left'][0] ) : ''; ?>" 
                        data-orv="<?php echo isset( $code['$During']['$Left'] )? esc_attr( $code['$During']['$Left'][0] ): ''; ?>" />
                    &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                    <input name="stDuringLengthHor" type="text" id="stDuringLengthHor" 
                        value="<?php echo ( isset( $code['$During']['$Left'] ) )? esc_attr( $code['$During']['$Left'][0] + $code['$During']['$Left'][1] ) : ''; ?>"
                        data-orv="<?php echo isset( $code['$During']['$Left'] )? esc_attr( $code['$During']['$Left'][0] + $code['$During']['$Left'][1] ): ''; ?>" />
                    <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    <label><?php _e( 'Easing (horz)', 'cnhk-ss' ); ?>
                    <select name="ssEasingHorizontal" id="ssEasingHorizontal" data-orv="<?php echo isset( $code['$Easing']['$Left'] )? esc_attr( $code['$Easing']['$Left'] ) : '' ?>">
                        <option value=""></option>
                        <?php foreach ( $_easing as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Left'] ) && $key == $code['$Easing']['$Left'] ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                    </select>
                    <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php 
                        $scale_horz = '';
                        if ( isset( $code['x'] ) ) {
                            $scale_horz = abs( floatval( $code['x'] ) );
                        }
                    ?>
                    <label><?php _e( 'Scale (horz)', 'cnhk-ss' ); ?>
                        <input name="stScaleHorizontal" type="text" id="stScaleHorizontal" value="<?php echo $scale_horz; ?>" data-orv="<?php echo $scale_horz; ?>" />
                        <p class="fx-desc"><?php _e( 'Distance covered by the effect.<br /> 1 corresponds to one time the slide width', 'cnhk-ss' ); ?></p>
                    </label>
                    <label><?php _e( 'Round (horz)', 'cnhk-ss' ); ?>
                        <select name="ssRoundHorizontal" id="ssRoundHorizontal" data-orv="<?php echo ( isset( $code['$Round']['$Left'] ) )? esc_attr( $code['$Round']['$Left'] ) : ''; ?>">
                            <option value =""></option>
                            <?php foreach ( $_round as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Left'] ) && $value == $code['$Round']['$Left'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                    <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td>
                    <label><?php _e( 'Fly (vert)', 'cnhk-ss' ); ?>
                        <?php
                            $_flyVert_orv = '0';
                            if ( isset( $code['y'] ) && 0 != $code['y'] ) {
                                if ( 0 < $code['y'] ) {
                                    $_flyVert_orv = '1';
                                } else {
                                    $_flyVert_orv = '-1';
                                }
                            }
                        ?>
                        <select name="ssFlyVertical" id="ssFlyVertical" data-orv="<?php echo $_flyVert_orv; ?>">
                            <option value="0" <?php selected( ! isset( $code['y'] ) || 0 == $code['y'] ); ?>></option>
                            <option value="-1" <?php selected( isset( $code['y'] ) && 0 > floatval( $code['y'] ) ); ?>><?php _e( 'To Bottom', 'cnhk-ss' ); ?></option>
                            <option value="1" <?php selected( isset( $code['y'] ) && 0 < floatval( $code['y'] ) ); ?>><?php _e( 'To Top', 'cnhk-ss' ); ?></option>
                        </select>
                        <p class="fx-desc"><?php _e( 'Vertical fly effect', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'During (vert)', 'cnhk-ss' ); ?></label>
                    <input name="stDuringBeginVer" type="text" id="stDuringBeginVer" 
                        value="<?php echo ( isset( $code['$During']['$Top'] ) )? esc_attr( $code['$During']['$Top'][0] ): ''; ?>"
                        data-orv="<?php echo isset( $code['$During']['$Top'] )? esc_attr( $code['$During']['$Top'][0] ): ''; ?>" />
                    &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                    <input name="stDuringLengthVer" type="text" id="stDuringLengthVer" 
                        value="<?php echo ( isset( $code['$During']['$Top'] ) )? esc_attr( $code['$During']['$Top'][0] + $code['$During']['$Top'][1] ) : ''; ?>"
                        data-orv="<?php echo isset( $code['$During']['$Top'] )? esc_attr( $code['$During']['$Top'][0] + $code['$During']['$Top'][1] ) : ''; ?>" />
                    <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    
                    <label><?php _e( 'Easing (vert)', 'cnhk-ss' ); ?>
                    <select name="ssEasingVertical" id="ssEasingVertical" data-orv="<?php echo isset( $code['$Easing']['$Top'] )? esc_attr( $code['$Easing']['$Top'] ) : ''; ?>">
                        <option value=""></option>
                        <?php foreach ( $_easing as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Top'] ) && $key == $code['$Easing']['$Top'] ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                    </select>
                    <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <?php 
                        $scale_vert = '';
                        if ( isset( $code['y'] ) ) {
                            $scale_vert = abs( floatval( $code['y'] ) );
                        }
                    ?>
                    <label><?php _e( 'Scale (vert)', 'cnhk-ss' ); ?>
                        <input name="stScaleVertical" type="text" id="stScaleVertical" value="<?php echo $scale_vert; ?>" data-orv="<?php echo $scale_vert; ?>" />
                        <p class="fx-desc"><?php _e( 'Distance covered by the effect.<br /> 1 corresponds to one time the slide height', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Round (vert)', 'cnhk-ss' ); ?>
                    <select name="ssRoundVertical" id="ssRoundVertical" data-orv="<?php echo ( isset( $code['$Round']['$Top'] ) )? esc_attr( $code['$Round']['$Top'] ) : ''; ?>">
                        <option value=""></option>
                        <?php foreach ( $_round as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Top'] ) && $value == $code['$Round']['$Top'] ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                    </select>
                    <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td>
                    <label><?php _e( 'Clip', 'cnhk-ss' ); ?>
                    <select name="ssClip" id="ssClip" data-orv="<?php echo ( isset( $code['$Clip'] ) )? esc_attr( $code['$Clip'] ): ''; ?>">
                        <option value=""></option>
                        <?php foreach( $_clip as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Clip'] ) && intval( $key ) == $code['$Clip'] ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                    </select>
                    <p class="fx-desc"><?php _e( 'Clip blocks', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'During (clip)', 'cnhk-ss' ); ?></label>
                    <input name="stDuringBeginClip" type="text" id="stDuringBeginClip"
                        value="<?php echo ( isset( $code['$During']['$Clip'] ) )? esc_attr( $code['$During']['$Clip'][0] ): ''; ?>"
                        data-orv="<?php echo isset( $code['$During']['$Clip'] )? esc_attr( $code['$During']['$Clip'][0] ): ''; ?>" />
                    &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                    <input name="stDuringLengthClip" type="text" id="stDuringLengthClip"
                        value="<?php echo ( isset( $code['$During']['$Clip'] ) )? esc_attr( $code['$During']['$Clip'][0] + $code['$During']['$Clip'][1] ) : ''; ?>"
                        data-orv="<?php echo isset( $code['$During']['$Clip'] )? esc_attr( $code['$During']['$Clip'][0] + $code['$During']['$Clip'][1] ): ''; ?>" />
                    <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    
                    <label><?php _e( 'Easing (clip)', 'cnhk-ss' ); ?>
                        <select style="width: 135px;" name="ssEasingClip" id="ssEasingClip" data-orv="<?php echo isset( $code['$Easing']['$Clip'] )? esc_attr( $code['$Easing']['$Clip'] ) : '' ?>">
                        <option value=""></option>
                        <?php foreach ( $_easing as $key => $value ) : ?>
                        <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Clip'] ) && $key == $code['$Easing']['$Clip'] ); ?>><?php echo $value; ?></option>
                        <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <?php 
                        $scale_clip = '';
                        if ( isset( $code['$ScaleClip'] ) ) {
                            $scale_clip = abs( floatval( $code['$ScaleClip'] ) );
                        } else {
                            if ( isset( $code['$Clip'] ) ) {
                                $scale_clip = 1;
                            }
                        }
                    ?>
                    <label><?php _e( 'Scale (clip)', 'cnhk-ss' ); ?>
                        <input name="stScaleClip" type="text" id="stScaleClip" value="<?php echo $scale_clip; ?>" data-orv="<?php echo $scale_clip; ?>" />
                        <p class="fx-desc"><?php _e( 'Clip proportion. 1 means clip blocks entirely', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Round (clip)', 'cnhk-ss' ); ?>
                        <select name="ssRoundClip" id="ssRoundClip" data-orv="<?php echo ( isset( $code['$Round']['$Clip'] ) )? esc_attr( $code['$Round']['$Clip'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach ( $_round as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Clip'] ) && $value == $code['$Round']['$Clip'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
            </tr>
            <tr><td colspan="3"><hr /></td></tr>
            <tr>
                <th><b><?php _e( 'Zoom', 'cnhk-ss' ); ?></b></th>
                <th><b><?php _e( 'Rotate', 'cnhk-ss' ); ?></b></th>
                <th><b><?php _e( 'Fade', 'cnhk-ss' ); ?></b></th>
            </tr>
            <tr>
                <td>
                    <label><?php _e( 'Zoom', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scZoom" name="scZoom" <?php checked( isset( $code['$Zoom'] ) ); ?>
                             data-orv="<?php echo ( isset( $code['$Zoom'] ) )? 'true' : 'false'; ?>" />
                    </label><br /><br />
                    
                    <label><?php _e( 'During (zoom)', 'cnhk-ss' ); ?>
                        <input name="stDuringBeginZoom" type="text" id="stDuringBeginZoom"
                            value="<?php echo ( isset( $code['$During']['$Zoom'] ) )? esc_attr( $code['$During']['$Zoom'][0] ): ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Zoom'] )? esc_attr( $code['$During']['$Zoom'][0] ): ''; ?>" />
                        &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                        <input name="stDuringLengthZoom" type="text" id="stDuringLengthZoom"
                            value="<?php echo ( isset( $code['$During']['$Zoom'] ) )? esc_attr( $code['$During']['$Zoom'][0] + $code['$During']['$Zoom'][1] ) : ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Zoom'] )? esc_attr( $code['$During']['$Zoom'][0] + $code['$During']['$Zoom'][1] ): ''; ?>" />
                        <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Easing (zoom)', 'cnhk-ss' ); ?>
                        <select style="width: 135px;" name="ssEasingZoom" id="ssEasingZoom" data-orv="<?php echo isset( $code['$Easing']['$Zoom'] )? esc_attr( $code['$Easing']['$Zoom'] ) : '' ?>">
                            <option value=""></option>
                            <?php foreach ( $_easing as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Zoom'] ) && $key == $code['$Easing']['$Zoom'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php
                    $scale_zoom = '';
                    if ( isset( $code['$Zoom'] ) ) {
                        $scale_zoom = 1 - floatval( $code['$Zoom'] );
                    }
                    ?>
                    <label><?php _e( 'Scale (zoom)', 'cnhk-ss' ); ?>
                        <input name="stScaleZoom" type="text" id="stScaleZoom" value="<?php echo $scale_zoom ?>" data-orv="<?php echo $scale_zoom; ?>"/>
                        <p class="fx-desc"><?php _e( 'Zoom intensity. 0 corresponds to a completely disappeared block.', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Round (zoom)', 'cnhk-ss' ); ?>
                        <select name="ssRoundZoom" id="ssRoundZoom" data-orv="<?php echo ( isset( $code['$Round']['$Zoom'] ) )? esc_attr( $code['$Round']['$Zoom'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach ( $_round as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Zoom'] ) && $value == $code['$Round']['$Zoom'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td>                    
                    <label><?php _e( 'Rotate', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scRotate" name="scRotate" <?php checked( isset( $code['$Rotate'] ) ); ?>
                             data-orv="<?php echo ( isset( $code['$Rotate'] ) )? 'true' : 'false'; ?>" />
                    </label><br /><br />
                    
                    <label><?php _e( 'During (rotate)', 'cnhk-ss' ); ?>
                        <input name="stDuringBeginRotate" type="text" id="stDuringBeginRotate"
                            value="<?php echo ( isset( $code['$During']['$Rotate'] ) )? esc_attr( $code['$During']['$Rotate'][0] ): ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Rotate'] )? esc_attr( $code['$During']['$Rotate'][0] ): ''; ?>" />
                        &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                        <input name="stDuringLengthRotate" type="text" id="stDuringLengthRotate"
                            value="<?php echo ( isset( $code['$During']['$Rotate'] ) )? esc_attr( $code['$During']['$Rotate'][0] + $code['$During']['$Rotate'][1] ) : ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Rotate'] )? esc_attr( $code['$During']['$Rotate'][0] + $code['$During']['$Rotate'][1] ): ''; ?>" />
                        <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Easing (rotate)', 'cnhk-ss' ); ?>
                        <select style="width: 135px;" name="ssEasingRotate" id="ssEasingRotate" data-orv="<?php echo isset( $code['$Easing']['$Rotate'] )? esc_attr( $code['$Easing']['$Rotate'] ) : '' ?>">
                            <option value=""></option>
                            <?php foreach ( $_easing as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Rotate'] ) && $key == $code['$Easing']['$Rotate'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php
                    $scale_rotate = '';
                    if ( isset( $code['$Rotate'] ) ) {
                        $scale_rotate = floatval( $code['$Rotate'] );
                    }
                    ?>
                    <label><?php _e( 'Scale (rotate)', 'cnhk-ss' ); ?>
                        <input name="stScaleRotate" type="text" id="stScaleRotate" value="<?php echo $scale_rotate; ?>" data-orv="<?php echo $scale_rotate; ?>" />
                        <p class="fx-desc"><?php _e( '1 corresponds to a 360 degrees rotation<br />(-1 for a clockwise rotation)', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Round (rotate)', 'cnhk-ss' ); ?>
                        <select name="ssRoundRotate" id="ssRoundRotate" data-orv="<?php echo ( isset( $code['$Round']['$Rotate'] ) )? esc_attr( $code['$Round']['$Rotate'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach ( $_round as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Rotate'] ) && $value == $code['$Round']['$Rotate'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td>
                    <label><?php _e( 'Fade', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scFade" name="scFade" <?php checked( isset( $code['$Opacity'] ) ); ?>
                             data-orv="<?php echo ( isset( $code['$Opacity'] ) )? 'true' : 'false'; ?>" />
                    </label><br /><br />
                    
                    <label><?php _e( 'During (fade)', 'cnhk-ss' ); ?>
                        <input name="stDuringBeginFade" type="text" id="stDuringBeginFade"
                            value="<?php echo ( isset( $code['$During']['$Opacity'] ) )? esc_attr( $code['$During']['$Opacity'][0] ): ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Opacity'] )? esc_attr( $code['$During']['$Opacity'][0] ) : ''; ?>" />
                        &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                        <input name="stDuringLengthFade" type="text" id="stDuringLengthFade"
                            value="<?php echo ( isset( $code['$During']['$Opacity'] ) )? esc_attr( $code['$During']['$Opacity'][0] + $code['$During']['$Opacity'][1] ) : ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$Opacity'] )? esc_attr( $code['$During']['$Opacity'][0] + $code['$During']['$Opacity'][1] ) : ''; ?>" />
                        <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Easing (fade)', 'cnhk-ss' ); ?>
                        <select name="ssEasingFade" id="ssEasingFade" data-orv="<?php echo isset( $code['$Easing']['$Opacity'] )? esc_attr( $code['$Easing']['$Opacity'] ) : '' ?>">
                            <option value=""></option>
                            <?php foreach ( $_easing as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Opacity'] ) && $key == $code['$Easing']['$Opacity'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php
                    $scale_fade = '';
                    if ( isset( $code['$Opacity'] ) ) {
                        $scale_fade = floatval( $code['$Opacity'] ) - 1;
                    }
                    ?>
                    <label><?php _e( 'Scale (fade)', 'cnhk-ss' ); ?>
                        <input name="stScaleFade" type="text" id="stScaleFade" value="<?php echo $scale_fade; ?>" data-orv="<?php echo $scale_fade; ?>" />
                        <p class="fx-desc"><?php _e( 'Fade intensity. ( 0 to 1 )', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
            </tr>
            <tr><td colspan="3"><hr /></td></tr>
            <tr>
                <th><b><?php _e( 'Z-index', 'cnhk-ss' ); ?></b></th>
                <th colspan="2"><?php if ( $is_ss ) : ?><b><?php _e( 'Chess Mode (fly and move effect)', 'cnhk-ss' ); ?></b><?php endif; ?></th>
            </tr>
            <tr>
                <td>
                    <label><?php _e( 'Z-index', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scZIndex" name="scZIndex" <?php checked( isset( $code['$ZIndex'] ) ); ?>
                             data-orv="<?php echo ( isset( $code['$ZIndex'] ) )? 'true' : 'false'; ?>" />
                    </label><br /><br />
                    
                    <label><?php _e( 'During (z-index)', 'cnhk-ss' ); ?>
                        <input name="stDuringBeginZIndex" type="text" id="stDuringBeginZIndex"
                            value="<?php echo ( isset( $code['$During']['$ZIndex'] ) )? esc_attr( $code['$During']['$ZIndex'][0] ) : ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$ZIndex'] )? esc_attr( $code['$During']['$ZIndex'][0] ): ''; ?>" />
                        &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                        <input name="stDuringLengthZIndex" type="text" id="stDuringLengthZIndex"
                            value="<?php echo ( isset( $code['$During']['$ZIndex'] ) )? esc_attr( $code['$During']['$ZIndex'][0] + $code['$During']['$ZIndex'][1] ) : ''; ?>"
                            data-orv="<?php echo isset( $code['$During']['$ZIndex'] )? esc_attr( $code['$During']['$ZIndex'][0] + $code['$During']['$ZIndex'][1] ): ''; ?>" />
                        <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Scale (z-index)', 'cnhk-ss' ); ?>
                        <input name="stScaleZIndex" type="text" id="stScaleZIndex"
                            value="<?php echo ( isset( $code['$ZIndex'] ) )? $code['$ZIndex'] : ''; ?>"
                            data-orv="<?php echo ( isset( $code['$ZIndex'] ) )? intval( $code['$ZIndex'] ) : ''; ?>" />
                        <p class="fx-desc"><?php _e( 'The final z-index to reach.', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Easing (z-index)', 'cnhk-ss' ); ?></label>
                        <select style="width: 135px;" name="ssEasingZIndex" id="ssEasingZIndex" data-orv="<?php echo isset( $code['$Easing']['$ZIndex'] )? esc_attr( $code['$Easing']['$ZIndex'] ) : '' ?>">
                            <option value=""></option>
                            <?php foreach ( $_easing as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$ZIndex'] ) && $key == $code['$Easing']['$ZIndex'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Round (z-index)', 'cnhk-ss' ); ?>
                        <select name="ssRoundZIndex" id="ssRoundZIndex" data-orv="<?php echo ( isset( $code['$Round']['$ZIndex'] ) )? esc_attr( $code['$Round']['$ZIndex'] ) : ''; ?>">
                            <option value=""></option>
                            <?php foreach ( $_round as $key => $value ) : ?>
                            <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$ZIndex'] ) && $value == $code['$Round']['$ZIndex'] ); ?>><?php echo $value; ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                    </label>
                </td>
                <td colspan="2">
                    <?php if ( $is_ss ) : ?>
                    <label><?php _e( 'Chess column Horizontal', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scChessColHorizontal" name="scChessColHorizontal"
                            data-orv="<?php echo ( isset( $code['$ChessMode']['$Column'] ) && ( 1 == ( $code['$ChessMode']['$Column'] % 2 ) ) )? 'true' : 'false'; ?>"
                            <?php checked( isset( $code['$ChessMode']['$Column'] ) && ( 1 == ( $code['$ChessMode']['$Column'] % 2 ) ) ); ?> />
                        <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by column for horizontal effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Chess column Vertical', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scChessColVertical" name="scChessColVertical"
                        data-orv="<?php echo ( isset( $code['$ChessMode']['$Column'] ) &&  3 < $code['$ChessMode']['$Column'] )? 'true' : 'false'; ?>"
                        <?php checked( isset( $code['$ChessMode']['$Column'] ) &&  3 < $code['$ChessMode']['$Column'] ); ?> />
                        <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by column for vertical effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Chess row Horizontal', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scChessRowHorizontal" name="scChessRowHorizontal"
                        data-orv="<?php echo ( isset( $code['$ChessMode']['$Row'] ) && ( 1 == ( $code['$ChessMode']['$Row'] % 2 ) ) )? 'true' : 'false'; ?>"
                        <?php checked( isset( $code['$ChessMode']['$Row'] ) && ( 1 == ( $code['$ChessMode']['$Row'] % 2 ) ) ); ?> />
                        <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by row for horizontal effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                    </label>
                    
                    <label><?php _e( 'Chess row Vertical', 'cnhk-ss' ); ?>
                        <input type="checkbox" id="scChessRowVertical" name="scChessRowVertical"
                        data-orv="<?php echo ( isset( $code['$ChessMode']['$Row'] ) &&  3 < $code['$ChessMode']['$Row'] )? 'true' : 'false'; ?>"
                        <?php checked( isset( $code['$ChessMode']['$Row'] ) &&  3 < $code['$ChessMode']['$Row'] ); ?> />
                        <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by row for vertical effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                    </label>
                    <?php endif; // $is_ss ?>
                </td>
            </tr>
            <tr><td colspan="3"><hr /></td></tr>          
        </tbody>
    </table>
    <?php if ( $is_ss ) : ?>
    <input type="hidden" id="shBrother" value="" />
    <div id="brother-builder" style="display:none">
        <div id="brother-builder-wrap" style="overflow-y:scroll;">
            <p>
                <label><b><?php _e( 'twin effect code', 'cnhk-ss' ); ?></b></label>
                <input type="text" id="brother-code" style="width:95%;background-color:#fff!important;" readonly />
            </p>
            <table class="widefat fixed">
                <tbody>
                    <tr>
                        <th><b><?php if ( $is_ss ) : _e( 'Main parameters', 'cnhk-ss'); endif; ?></b></th>
                        <th><b><?php if ( $is_ss ) : _e( 'Rows and columns (blocks)', 'cnhk-ss'); endif; ?></b></th>
                        <th><b><?php if ( $is_ss ) : _e( 'Options', 'cnhk-ss'); endif; ?></b></th>
                    </tr>
                    <tr>
                        <td>
                            <label><?php _e( 'Formation', 'cnhk-ss'); ?>
                                <select id="ssFormation-bro" data-orv="<?php echo ( isset( $code['$Formation'] ) )? esc_attr( $code['$Formation'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach( $_formation as $key => $value ) : ?>
                                    <option value="<?php echo esc_attr( $key ); ?>" <?php selected( isset( $code['$Formation'] ) && $key == $code['$Formation'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Shape that assembly blocks as', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'Assembly', 'cnhk-ss' ); ?>
                                <select id="ssAssembly-bro" data-orv="<?php echo ( isset( $code['$Assembly'] ) )? esc_attr( $code['$Assembly'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_assembly as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Assembly'] ) && intval( $key ) == $code['$Assembly'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'The way to assembly blocks', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'Duration', 'cnhk-ss' ); ?>
                                <select id="ssDuration-bro" data-orv="<?php echo ( isset( $code['$Duration'] ) )? esc_attr( $code['$Duration'] ) : ''; ?>">
                                    <?php foreach ( $_duration as $key => $value ) : ?>
                                    <option value="<?php echo $key ?>" <?php selected( isset( $code['$Duration'] ) && $value == $code['$Duration'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc">
                                    <?php _e( 'Duration of the whole transition (in ms)', 'cnhk-ss' ); ?>
                                </p>
                            </label>
                        </td>
                        <td>
                            <label><?php _e( 'Columns', 'cnhk-ss' ); ?>
                                <select id="ssCols-bro" data-orv="<?php echo ( isset( $code['$Cols'] ) )? esc_attr( $code['$Cols'] ) : '1'; ?>">
                                    <?php for ( $i = 1; $i < 15; $i++) : ?>
                                    <option value="<?php echo $i; ?>" <?php selected( ( isset( $code['$Cols'] ) && $code['$Cols'] == $i ) || ( 1 == $i && ! isset( $code['$Cols'] ) ) ); ?>><?php echo $i; ?></option>
                                    <?php endfor; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Number of columns', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'Rows', 'cnhk-ss' ); ?>
                                <select id="ssRows-bro" data-orv="<?php echo ( isset( $code['$Rows'] ) )? esc_attr( $code['$Rows'] ) : '1'; ?>">
                                    <?php for ( $i = 1; $i < 15; $i++) : ?>
                                    <option value="<?php echo $i; ?>" <?php selected( ( isset( $code['$Rows'] ) && $code['$Rows'] == $i ) || ( 1 == $i && ! isset( $code['$Rows'] ) ) ); ?>><?php echo $i; ?></option>
                                    <?php endfor; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Number of rows', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'Delay', 'cnhk-ss' ); ?>
                                <select id="ssDelay-bro" data-orv="<?php echo ( isset( $code['$Delay'] ) )? esc_attr( $code['$Delay'] ) : '0'; ?>">
                                <?php foreach ( $_delay as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( ( isset( $code['$Delay'] ) && $value == $code['$Delay'] ) || ( ! isset( $code['$Delay'] ) && $value == 0 ) ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Delay to assembly blocks (in ms)', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td>
                            <label><?php _e( 'Move', 'cnhk-ss' ); ?>
                                <?php 
                                    // $nomove_clipping = array( 15, 3, 12 );
                                    // $move_disabled = 'disabled="disabled" ';
                                    // if ( isset( $code['$Move'] ) && ! in_array( $code['$Move'], $nomove_clipping ) ) {
                                        // $move_disabled = '';
                                    // }
                                ?>
                                <input type="checkbox" data-orv="<?php echo ( isset( $code['$Move'] ) )? var_export( $code['$Move'] ) : 'false'; ?>"
                                    id="scMove-bro" <?php echo $move_disabled; checked( isset( $code['$Move'] ) && $code['$Move'] ); ?>/>
                                <p class="fx-desc"><?php _e( 'Move block while clipping', 'cnhk-ss' ); ?></p>
                            </label>
                        
                    </tr>
                    <tr><td colspan="3"><hr /></td></tr>
                    <tr>
                        <th><b><?php _e( 'Fly (horz)', 'cnhk-ss' ); ?></b></th>
                        <th><b><?php _e( 'Fly (vert)', 'cnhk-ss' ); ?></b></th>
                        <th><b><?php _e( 'Clip', 'cnhk-ss' ); ?></b></th>
                    </tr>
                    <tr>
                        <td>
                            <label><?php _e( 'Fly (horz)', 'cnhk-ss' ); ?>
                                <?php
                                    $_flyHorz_orv = '0';
                                    if ( isset( $code['x'] ) && 0 != $code['x'] ) {
                                        if ( 0 < $code['x'] ) {
                                            $_flyHorz_orv = '1';
                                        } else {
                                            $_flyHorz_orv = '-1';
                                        }
                                    }
                                ?>
                                <select id="ssFlyHorizontal-bro" data-orv="<?php echo $_flyHorz_orv; ?>">
                                    <option value="0" <?php selected( ! isset( $code['x'] ) || 0 == $code['x'] ); ?>></option>
                                    <option value="-1" <?php selected( isset( $code['x'] ) && 0 > floatval( $code['x'] ) ); ?>><?php _e( 'To Right', 'cnhk-ss' ); ?></option>
                                    <option value="1" <?php selected( isset( $code['x'] ) && 0 < floatval( $code['x'] ) ); ?>><?php _e( 'To Left', 'cnhk-ss' ); ?></option>
                                </select>
                                <p class="fx-desc"><?php _e( 'Horizontal fly effect', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'During (horz)', 'cnhk-ss' ); ?></label>
                            <input type="text" id="stDuringBeginHor-bro" 
                                value="<?php echo ( isset( $code['$During']['$Left'] ) )? esc_attr( $code['$During']['$Left'][0] ) : ''; ?>" 
                                data-orv="<?php echo isset( $code['$During']['$Left'] )? esc_attr( $code['$During']['$Left'][0] ): ''; ?>" />
                            &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                            <input type="text" id="stDuringLengthHor-bro" 
                                value="<?php echo ( isset( $code['$During']['$Left'] ) )? esc_attr( $code['$During']['$Left'][0] + $code['$During']['$Left'][1] ) : ''; ?>"
                                data-orv="<?php echo isset( $code['$During']['$Left'] )? esc_attr( $code['$During']['$Left'][0] + $code['$During']['$Left'][1] ): ''; ?>" />
                            <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            <label><?php _e( 'Easing (horz)', 'cnhk-ss' ); ?>
                            <select id="ssEasingHorizontal-bro" data-orv="<?php echo isset( $code['$Easing']['$Left'] )? esc_attr( $code['$Easing']['$Left'] ) : '' ?>">
                                <option value=""></option>
                                <?php foreach ( $_easing as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Left'] ) && $key == $code['$Easing']['$Left'] ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                            </select>
                            <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            <?php 
                                $scale_horz = '';
                                if ( isset( $code['x'] ) ) {
                                    $scale_horz = abs( floatval( $code['x'] ) );
                                }
                            ?>
                            <label><?php _e( 'Scale (horz)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleHorizontal-bro" value="<?php echo $scale_horz; ?>" data-orv="<?php echo $scale_horz; ?>" />
                                <p class="fx-desc"><?php _e( 'Distance covered by the effect.<br /> 1 corresponds to one time the slide width', 'cnhk-ss' ); ?></p>
                            </label>
                            <label><?php _e( 'Round (horz)', 'cnhk-ss' ); ?>
                                <select id="ssRoundHorizontal-bro" data-orv="<?php echo ( isset( $code['$Round']['$Left'] ) )? esc_attr( $code['$Round']['$Left'] ) : ''; ?>">
                                    <option value =""></option>
                                    <?php foreach ( $_round as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Left'] ) && $value == $code['$Round']['$Left'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td>
                            <label><?php _e( 'Fly (vert)', 'cnhk-ss' ); ?>
                                <?php
                                    $_flyVert_orv = '0';
                                    if ( isset( $code['y'] ) && 0 != $code['y'] ) {
                                        if ( 0 < $code['y'] ) {
                                            $_flyVert_orv = '1';
                                        } else {
                                            $_flyVert_orv = '-1';
                                        }
                                    }
                                ?>
                                <select id="ssFlyVertical-bro" data-orv="<?php echo $_flyVert_orv; ?>">
                                    <option value="0" <?php selected( ! isset( $code['y'] ) || 0 == $code['y'] ); ?>></option>
                                    <option value="-1" <?php selected( isset( $code['y'] ) && 0 > floatval( $code['y'] ) ); ?>><?php _e( 'To Bottom', 'cnhk-ss' ); ?></option>
                                    <option value="1" <?php selected( isset( $code['y'] ) && 0 < floatval( $code['y'] ) ); ?>><?php _e( 'To Top', 'cnhk-ss' ); ?></option>
                                </select>
                                <p class="fx-desc"><?php _e( 'Vertical fly effect', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'During (vert)', 'cnhk-ss' ); ?></label>
                            <input type="text" id="stDuringBeginVer-bro" 
                                value="<?php echo ( isset( $code['$During']['$Top'] ) )? esc_attr( $code['$During']['$Top'][0] ): ''; ?>"
                                data-orv="<?php echo isset( $code['$During']['$Top'] )? esc_attr( $code['$During']['$Top'][0] ): ''; ?>" />
                            &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                            <input type="text" id="stDuringLengthVer-bro" 
                                value="<?php echo ( isset( $code['$During']['$Top'] ) )? esc_attr( $code['$During']['$Top'][0] + $code['$During']['$Top'][1] ) : ''; ?>"
                                data-orv="<?php echo isset( $code['$During']['$Top'] )? esc_attr( $code['$During']['$Top'][0] + $code['$During']['$Top'][1] ) : ''; ?>" />
                            <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            
                            <label><?php _e( 'Easing (vert)', 'cnhk-ss' ); ?>
                            <select id="ssEasingVertical-bro" data-orv="<?php echo isset( $code['$Easing']['$Top'] )? esc_attr( $code['$Easing']['$Top'] ) : ''; ?>">
                                <option value=""></option>
                                <?php foreach ( $_easing as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Top'] ) && $key == $code['$Easing']['$Top'] ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                            </select>
                            <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <?php 
                                $scale_vert = '';
                                if ( isset( $code['y'] ) ) {
                                    $scale_vert = abs( floatval( $code['y'] ) );
                                }
                            ?>
                            <label><?php _e( 'Scale (vert)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleVertical-bro" value="<?php echo $scale_vert; ?>" data-orv="<?php echo $scale_vert; ?>" />
                                <p class="fx-desc"><?php _e( 'Distance covered by the effect.<br /> 1 corresponds to one time the slide height', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Round (vert)', 'cnhk-ss' ); ?>
                            <select id="ssRoundVertical-bro" data-orv="<?php echo ( isset( $code['$Round']['$Top'] ) )? esc_attr( $code['$Round']['$Top'] ) : ''; ?>">
                                <option value=""></option>
                                <?php foreach ( $_round as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Top'] ) && $value == $code['$Round']['$Top'] ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                            </select>
                            <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td>
                            <label><?php _e( 'Clip', 'cnhk-ss' ); ?>
                            <select id="ssClip-bro" data-orv="<?php echo ( isset( $code['$Clip'] ) )? esc_attr( $code['$Clip'] ): ''; ?>">
                                <option value=""></option>
                                <?php foreach( $_clip as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Clip'] ) && intval( $key ) == $code['$Clip'] ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                            </select>
                            <p class="fx-desc"><?php _e( 'Clip blocks', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'During (clip)', 'cnhk-ss' ); ?></label>
                            <input type="text" id="stDuringBeginClip-bro"
                                value="<?php echo ( isset( $code['$During']['$Clip'] ) )? esc_attr( $code['$During']['$Clip'][0] ): ''; ?>"
                                data-orv="<?php echo isset( $code['$During']['$Clip'] )? esc_attr( $code['$During']['$Clip'][0] ): ''; ?>" />
                            &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                            <input type="text" id="stDuringLengthClip-bro"
                                value="<?php echo ( isset( $code['$During']['$Clip'] ) )? esc_attr( $code['$During']['$Clip'][0] + $code['$During']['$Clip'][1] ) : ''; ?>"
                                data-orv="<?php echo isset( $code['$During']['$Clip'] )? esc_attr( $code['$During']['$Clip'][0] + $code['$During']['$Clip'][1] ): ''; ?>" />
                            <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            
                            <label><?php _e( 'Easing (clip)', 'cnhk-ss' ); ?>
                                <select style="width: 135px;" id="ssEasingClip-bro" data-orv="<?php echo isset( $code['$Easing']['$Clip'] )? esc_attr( $code['$Easing']['$Clip'] ) : '' ?>">
                                <option value=""></option>
                                <?php foreach ( $_easing as $key => $value ) : ?>
                                <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Clip'] ) && $key == $code['$Easing']['$Clip'] ); ?>><?php echo $value; ?></option>
                                <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <?php 
                                $scale_clip = '';
                                if ( isset( $code['$ScaleClip'] ) ) {
                                    $scale_clip = abs( floatval( $code['$ScaleClip'] ) );
                                } else {
                                    if ( isset( $code['$Clip'] ) ) {
                                        $scale_clip = 1;
                                    }
                                }
                            ?>
                            <label><?php _e( 'Scale (clip)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleClip-bro" value="<?php echo $scale_clip; ?>" data-orv="<?php echo $scale_clip; ?>" />
                                <p class="fx-desc"><?php _e( 'Clip proportion. 1 means clip blocks entirely', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Round (clip)', 'cnhk-ss' ); ?>
                                <select id="ssRoundClip-bro" data-orv="<?php echo ( isset( $code['$Round']['$Clip'] ) )? esc_attr( $code['$Round']['$Clip'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_round as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Clip'] ) && $value == $code['$Round']['$Clip'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                    </tr>
                    <tr><td colspan="3"><hr /></td></tr>
                    <tr>
                        <th><b><?php _e( 'Zoom', 'cnhk-ss' ); ?></b></th>
                        <th><b><?php _e( 'Rotate', 'cnhk-ss' ); ?></b></th>
                        <th><b><?php _e( 'Fade', 'cnhk-ss' ); ?></b></th>
                    </tr>
                    <tr>
                        <td>
                            <label><?php _e( 'Zoom', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scZoom-bro" <?php checked( isset( $code['$Zoom'] ) ); ?>
                                     data-orv="<?php echo ( isset( $code['$Zoom'] ) )? 'true' : 'false'; ?>" />
                            </label><br /><br />
                            
                            <label><?php _e( 'During (zoom)', 'cnhk-ss' ); ?>
                                <input type="text" id="stDuringBeginZoom-bro"
                                    value="<?php echo ( isset( $code['$During']['$Zoom'] ) )? esc_attr( $code['$During']['$Zoom'][0] ): ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Zoom'] )? esc_attr( $code['$During']['$Zoom'][0] ): ''; ?>" />
                                &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                                <input type="text" id="stDuringLengthZoom-bro"
                                    value="<?php echo ( isset( $code['$During']['$Zoom'] ) )? esc_attr( $code['$During']['$Zoom'][0] + $code['$During']['$Zoom'][1] ) : ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Zoom'] )? esc_attr( $code['$During']['$Zoom'][0] + $code['$During']['$Zoom'][1] ): ''; ?>" />
                                <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Easing (zoom)', 'cnhk-ss' ); ?>
                                <select style="width: 135px;" id="ssEasingZoom-bro" data-orv="<?php echo isset( $code['$Easing']['$Zoom'] )? esc_attr( $code['$Easing']['$Zoom'] ) : '' ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_easing as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Zoom'] ) && $key == $code['$Easing']['$Zoom'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            <?php
                            $scale_zoom = '';
                            if ( isset( $code['$Zoom'] ) ) {
                                $scale_zoom = 1 - floatval( $code['$Zoom'] );
                            }
                            ?>
                            <label><?php _e( 'Scale (zoom)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleZoom-bro" value="<?php echo $scale_zoom ?>" data-orv="<?php echo $scale_zoom; ?>"/>
                                <p class="fx-desc"><?php _e( 'Zoom intensity. 0 corresponds to a completely disappeared block.', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Round (zoom)', 'cnhk-ss' ); ?>
                                <select id="ssRoundZoom-bro" data-orv="<?php echo ( isset( $code['$Round']['$Zoom'] ) )? esc_attr( $code['$Round']['$Zoom'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_round as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Zoom'] ) && $value == $code['$Round']['$Zoom'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td>                    
                            <label><?php _e( 'Rotate', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scRotate-bro" <?php checked( isset( $code['$Rotate'] ) ); ?>
                                     data-orv="<?php echo ( isset( $code['$Rotate'] ) )? 'true' : 'false'; ?>" />
                            </label><br /><br />
                            
                            <label><?php _e( 'During (rotate)', 'cnhk-ss' ); ?>
                                <input type="text" id="stDuringBeginRotate-bro"
                                    value="<?php echo ( isset( $code['$During']['$Rotate'] ) )? esc_attr( $code['$During']['$Rotate'][0] ): ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Rotate'] )? esc_attr( $code['$During']['$Rotate'][0] ): ''; ?>" />
                                &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                                <input type="text" id="stDuringLengthRotate-bro"
                                    value="<?php echo ( isset( $code['$During']['$Rotate'] ) )? esc_attr( $code['$During']['$Rotate'][0] + $code['$During']['$Rotate'][1] ) : ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Rotate'] )? esc_attr( $code['$During']['$Rotate'][0] + $code['$During']['$Rotate'][1] ): ''; ?>" />
                                <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Easing (rotate)', 'cnhk-ss' ); ?>
                                <select style="width: 135px;" id="ssEasingRotate-bro" data-orv="<?php echo isset( $code['$Easing']['$Rotate'] )? esc_attr( $code['$Easing']['$Rotate'] ) : '' ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_easing as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Rotate'] ) && $key == $code['$Easing']['$Rotate'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            <?php
                            $scale_rotate = '';
                            if ( isset( $code['$Rotate'] ) ) {
                                $scale_rotate = floatval( $code['$Rotate'] );
                            }
                            ?>
                            <label><?php _e( 'Scale (rotate)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleRotate-bro" value="<?php echo $scale_rotate; ?>" data-orv="<?php echo $scale_rotate; ?>" />
                                <p class="fx-desc"><?php _e( '1 corresponds to a 360 degrees rotation<br />(-1 for a clockwise rotation)', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Round (rotate)', 'cnhk-ss' ); ?>
                                <select id="ssRoundRotate-bro" data-orv="<?php echo ( isset( $code['$Round']['$Rotate'] ) )? esc_attr( $code['$Round']['$Rotate'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_round as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$Rotate'] ) && $value == $code['$Round']['$Rotate'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td>
                            <label><?php _e( 'Fade', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scFade-bro" <?php checked( isset( $code['$Opacity'] ) ); ?>
                                     data-orv="<?php echo ( isset( $code['$Opacity'] ) )? 'true' : 'false'; ?>" />
                            </label><br /><br />
                            
                            <label><?php _e( 'During (fade)', 'cnhk-ss' ); ?>
                                <input type="text" id="stDuringBeginFade-bro"
                                    value="<?php echo ( isset( $code['$During']['$Opacity'] ) )? esc_attr( $code['$During']['$Opacity'][0] ): ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Opacity'] )? esc_attr( $code['$During']['$Opacity'][0] ) : ''; ?>" />
                                &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                                <input type="text" id="stDuringLengthFade-bro"
                                    value="<?php echo ( isset( $code['$During']['$Opacity'] ) )? esc_attr( $code['$During']['$Opacity'][0] + $code['$During']['$Opacity'][1] ) : ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$Opacity'] )? esc_attr( $code['$During']['$Opacity'][0] + $code['$During']['$Opacity'][1] ) : ''; ?>" />
                                <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Easing (fade)', 'cnhk-ss' ); ?>
                                <select id="ssEasingFade-bro" data-orv="<?php echo isset( $code['$Easing']['$Opacity'] )? esc_attr( $code['$Easing']['$Opacity'] ) : '' ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_easing as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$Opacity'] ) && $key == $code['$Easing']['$Opacity'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            <?php
                            $scale_fade = '';
                            if ( isset( $code['$Opacity'] ) ) {
                                $scale_fade = floatval( $code['$Opacity'] ) - 1;
                            }
                            ?>
                            <label><?php _e( 'Scale (fade)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleFade-bro" value="<?php echo $scale_fade; ?>" data-orv="<?php echo $scale_fade; ?>" />
                                <p class="fx-desc"><?php _e( 'Fade intensity. ( 0 to 1 )', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                    </tr>
                    <tr><td colspan="3"><hr /></td></tr>
                    <tr>
                        <th><b><?php _e( 'Z-index', 'cnhk-ss' ); ?></b></th>
                        <th colspan="2"><?php if ( $is_ss ) : ?><b><?php _e( 'Chess Mode (fly and move effect)', 'cnhk-ss' ); ?></b><?php endif; ?></th>
                    </tr>
                    <tr>
                        <td>
                            <label><?php _e( 'Z-index', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scZIndex-bro" <?php checked( isset( $code['$ZIndex'] ) ); ?>
                                     data-orv="<?php echo ( isset( $code['$ZIndex'] ) )? 'true' : 'false'; ?>" />
                            </label><br /><br />
                            
                            <label><?php _e( 'During (z-index)', 'cnhk-ss' ); ?>
                                <input type="text" id="stDuringBeginZIndex-bro"
                                    value="<?php echo ( isset( $code['$During']['$ZIndex'] ) )? esc_attr( $code['$During']['$ZIndex'][0] ) : ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$ZIndex'] )? esc_attr( $code['$During']['$ZIndex'][0] ): ''; ?>" />
                                &nbsp;<?php _e( 'to', 'cnhk-ss' ); ?>&nbsp;
                                <input type="text" id="stDuringLengthZIndex-bro"
                                    value="<?php echo ( isset( $code['$During']['$ZIndex'] ) )? esc_attr( $code['$During']['$ZIndex'][0] + $code['$During']['$ZIndex'][1] ) : ''; ?>"
                                    data-orv="<?php echo isset( $code['$During']['$ZIndex'] )? esc_attr( $code['$During']['$ZIndex'][0] + $code['$During']['$ZIndex'][1] ): ''; ?>" />
                                <p class="fx-desc"><?php _e( 'Start and end time of the effect<br />(relative to the total transition duration)', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Scale (z-index)', 'cnhk-ss' ); ?>
                                <input type="text" id="stScaleZIndex-bro"
                                    value="<?php echo ( isset( $code['$ZIndex'] ) )? $code['$ZIndex'] : ''; ?>"
                                    data-orv="<?php echo ( isset( $code['$ZIndex'] ) )? intval( $code['$ZIndex'] ) : ''; ?>" />
                                <p class="fx-desc"><?php _e( 'The final z-index to reach.', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Easing (z-index)', 'cnhk-ss' ); ?></label>
                                <select style="width: 135px;" id="ssEasingZIndex-bro" data-orv="<?php echo isset( $code['$Easing']['$ZIndex'] )? esc_attr( $code['$Easing']['$ZIndex'] ) : '' ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_easing as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Easing']['$ZIndex'] ) && $key == $code['$Easing']['$ZIndex'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Speed variation', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Round (z-index)', 'cnhk-ss' ); ?>
                                <select id="ssRoundZIndex-bro" data-orv="<?php echo ( isset( $code['$Round']['$ZIndex'] ) )? esc_attr( $code['$Round']['$ZIndex'] ) : ''; ?>">
                                    <option value=""></option>
                                    <?php foreach ( $_round as $key => $value ) : ?>
                                    <option value="<?php echo $key; ?>" <?php selected( isset( $code['$Round']['$ZIndex'] ) && $value == $code['$Round']['$ZIndex'] ); ?>><?php echo $value; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="fx-desc"><?php _e( 'Repetition', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                        <td colspan="2">
                            <label><?php _e( 'Chess column Horizontal', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scChessColHorizontal-bro" 
                                    data-orv="<?php echo ( isset( $code['$ChessMode']['$Column'] ) && ( 1 == ( $code['$ChessMode']['$Column'] % 2 ) ) )? 'true' : 'false'; ?>"
                                    <?php checked( isset( $code['$ChessMode']['$Column'] ) && ( 1 == ( $code['$ChessMode']['$Column'] % 2 ) ) ); ?> />
                                <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by column for horizontal effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Chess column Vertical', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scChessColVertical-bro" 
                                data-orv="<?php echo ( isset( $code['$ChessMode']['$Column'] ) &&  3 < $code['$ChessMode']['$Column'] )? 'true' : 'false'; ?>"
                                <?php checked( isset( $code['$ChessMode']['$Column'] ) &&  3 < $code['$ChessMode']['$Column'] ); ?> />
                                <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by column for vertical effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Chess row Horizontal', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scChessRowHorizontal" name="scChessRowHorizontal"
                                data-orv="<?php echo ( isset( $code['$ChessMode']['$Row'] ) && ( 1 == ( $code['$ChessMode']['$Row'] % 2 ) ) )? 'true' : 'false'; ?>"
                                <?php checked( isset( $code['$ChessMode']['$Row'] ) && ( 1 == ( $code['$ChessMode']['$Row'] % 2 ) ) ); ?> />
                                <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by row for horizontal effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                            </label>
                            
                            <label><?php _e( 'Chess row Vertical', 'cnhk-ss' ); ?>
                                <input type="checkbox" id="scChessRowVertical-bro" 
                                data-orv="<?php echo ( isset( $code['$ChessMode']['$Row'] ) &&  3 < $code['$ChessMode']['$Row'] )? 'true' : 'false'; ?>"
                                <?php checked( isset( $code['$ChessMode']['$Row'] ) &&  3 < $code['$ChessMode']['$Row'] ); ?> />
                                <p class="fx-desc"><?php _e( 'Alternate blocks movement direction by row for vertical effects ( fly and clip )', 'cnhk-ss' ); ?></p>
                            </label>
                        </td>
                    </tr>
                    <tr><td colspan="3"><hr /></td></tr>          
                </tbody>
            </table>
        </div>
        <div id="submit-brother"><button class="button-primary" id="apply-brother"><?php _e( 'apply changes', 'cnhk-ss' ); ?></button></div>
    </div>
    <?php endif; ?>
</div>
