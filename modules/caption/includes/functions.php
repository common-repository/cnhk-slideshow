<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 *  print caption markup
 *  
 *  @param [array] $data, caption's data
 *  @param [string] $slide_id
 *  @param [string] $caption_id
 *  @param [array] $cadu, caption duration array
 */
function cnhk_caption_render( $data, $slide_id, $ca_id, $cadu ) {
    $styling = json_decode( $data['styling'], true );
    $timing = json_decode( $data['timing'], true );
    
    $width = $styling['w'];
    $height = $styling['h'];
    
    if ( 'none' != $styling['bdStyle'] ) {
        $width = $styling['w'] + ( 2 * $styling['bdWidth'] );
        $height = $styling['h'] + ( 2 * $styling['bdWidth'] );
    }
    
    $pad_array = explode( '_', $styling['pad'] );
    $padH = floatval( $pad_array[0] );
    $padV = floatval( $pad_array[1] );
    
    $border_style = false;
    if ( 'none' != $styling['bdStyle'] ) {
        $border_style = $styling['bdWidth'] . 'px ' . $styling['bdStyle'] . ' ' . $styling['bdColor'];
    }
    $bg_color = false;
    if ( 0 != $styling['bgOpacity'] && ! empty( $styling['bgColor'] ) ) {
        $rgb = cnhk_hex_to_rgb( $styling['bgColor'] );
        $bg_color .= 'rgba(' . $rgb[0] . ',' . $rgb[1] . ',' . $rgb[2] . ',' . $styling['bgOpacity'] . ')';
    }
    $t1 = 'NO';
    if ( ! empty( $timing['cafx'] ) ) {
        $t1 = $slide_id . '|' . $ca_id . '|1';
        $du = intval( $cadu[0] ) * $timing['cadu'];
        $b = intval( $cadu[0] ) * $timing['cas'];
    }
    $t2 = false;
    if ( ! empty( $timing['cafx2'] ) ) {
        $t2 = $slide_id . '|' . $ca_id . '|2';
        $du2 = intval( $cadu[1] ) * $timing['cadu2'];
        $b2 = intval( $cadu[1] ) * $timing['cas2'];
    }
    $t3 = false;
    if ( ! empty( $timing['cafx3'] ) ) {
        $t3 = $slide_id . '|' . $ca_id . '|3';
        $du3 = intval( $cadu[2] ) * $timing['cadu3'];
        $b3 = intval( $cadu[2] ) * $timing['cas3'];
    }
    $ca_style = 'position:absolute;left:' . $styling['left'] . 'px;top:' . $styling['top'] . 'px;width:' . $width . 'px;height:' . $height . 'px;';
    $le = ( $styling['le'] )? $styling['le'] : 32;
    $ca_style .= 'margin:0;padding:0;line-height:' . $le . 'px;';
    if ( $styling['fgColor'] ) {
        $ca_style .= 'color:' . $styling['fgColor'] . ';';
    }
    if ( $styling['font'] ) {
        $fonts = cnhk_ss::get_instance()->get_font_stacks();
        $ca_style .= 'font-family:' . $fonts[$styling['font']] . ';';
    }
    
    $ca_border = '';
    if ( $bg_color ) {
        $ca_border .= 'background-color:' . $styling['bgColor'] . ';'; // IE < 9
        $ca_border .= 'background-color:' . $bg_color . ';';
    }
    if ( $border_style ) {
        $ca_border .= 'border:' . $border_style . ';';
    }
    // border radius
    $bdr = explode( '_', $styling['bdRadius'] );
    $ca_border .= 'border-top-left-radius:' . $bdr[0] . 'px;';
    $ca_border .= 'border-top-right-radius:' . $bdr[1] . 'px;';
    $ca_border .= 'border-bottom-left-radius:' . $bdr[2] . 'px;';
    $ca_border .= 'border-bottom-right-radius:' . $bdr[3] . 'px;';
    // $ca_border .= 'margin:0;padding:0;width:' . $styling['w'] . 'px;height:' . $styling['h'] . 'px;';
    $ca_border .= 'margin:0;padding:0;width:' . $width . 'px;height:' . $height . 'px;';
        
    $ca_padding = 'padding-left:' . $padH . '%;padding-right:' . $padH . '%;';
    $ca_padding .= 'padding-top:' . $padV . '%;padding-bottom:' . $padV . '%;';
    $ca_padding .= 'width:100%;height:100%;'; 
    ?>
    <div data-u="caption" 
        style="<?php echo $ca_style; ?>"
        data-t="<?php echo $t1; ?>"
        <?php if ( 'NO' != $t1 ) : ?>
            data-du="<?php echo $du; ?>"
            data-b="<?php echo $b; ?>"
        <?php endif; ?>
        <?php if ( $t2 ) : ?>
            data-t2="<?php echo $t2; ?>"
            data-du2="<?php echo $du2; ?>"
            data-b2="<?php echo $b2; ?>"
        <?php else : ?>
            data-t2="NO"
        <?php endif; ?>
        <?php if ( $t3 ) : ?>
            data-t3="<?php echo $t3; ?>"
            data-du3="<?php echo $du3; ?>"
            data-d3="<?php echo $b3; ?>"
        <?php endif; ?>
        >
        <?php if ( $ca_border ) : ?>
        <div style="<?php echo $ca_border; ?>">
        <?php endif; ?>
            <div style="<?php echo $ca_padding; ?>"><?php echo $data['html']; ?></div>
        <?php if ( $ca_border ) : // close the border div ?>
        </div>
        <?php endif; ?>
    </div>
    <?php
}
