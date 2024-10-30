<?php
global $post;
$hndle = cnhk_ss::get_instance()->get_template_handler_by( 'id', $post->ID );
if ( ! $hndle ) return;
$data = $hndle->data;
?>
<table style="width:100%"><tbody><tr>
    <td style="width:50%">
        <div class="form-field">
            <label>
                <input type="checkbox" id="use-nav-arrows" value="1" <?php if ( isset( $data['navs'] ) && isset( $data['navs']['arrows'] ) ) echo 'checked="checked"'; ?> />
                <?php _e( 'use arrows', 'cnhk-ss' ); ?>
            </label>
        </div>
        <div class="form-field">
            <label><?php _e( 'orientation', 'cnhk-ss' ); ?></label>
            <select name="navs[arrows][orientation]" id="navs-arrows-orientation">
                <option value="horizontal" <?php selected( isset( $data['navs']['arrows']['orientation'] ) && 'horizontal' == $data['navs']['arrows']['orientation'] ); ?>><?php _e( 'horizontal', 'cnhk-ss' ) ?></option>
                <option value="vertical" <?php selected( isset( $data['navs']['arrows']['orientation'] ) && 'vertical' == $data['navs']['arrows']['orientation'] ); ?>><?php _e( 'vertical', 'cnhk-ss' ) ?></option>
            </select>
            <p class="description"><?php _e( 'should be the same as the slider play orientation', 'cnhk-ss' ); ?></p>
        </div>
        <div class="form-field">
            <label><?php _e( 'spacing', 'cnhk-ss' ); ?></label>
            <select name="navs[arrows][spacing]" id="navs-arrows-spacing">
                <option value="spaced" <?php selected( isset( $data['navs']['arrows']['spacing'] ) && 'spaced' == $data['navs']['arrows']['spacing'] ); ?>><?php _e( 'spaced', 'cnhk-ss' ) ?></option>
                <option value="grouped" <?php selected( isset( $data['navs']['arrows']['spacing'] ) && 'grouped' == $data['navs']['arrows']['spacing'] ); ?>><?php _e( 'grouped', 'cnhk-ss' ) ?></option>
            </select>
            <p class="description"><?php _e( 'grouped or symmetrically spaced arrows', 'cnhk-ss' ); ?></p>
        </div>
        <div class="form-field">
            <label><?php _e( 'hide on mouse out', 'cnhk-ss' ); ?></label>
            <select name="navs[arrows][_ChanceToShow]" id="navs-arrows-_ChanceToShow">
                <?php $the_chance = ( isset( $data['navs']['arrows']['$ChanceToShow'] ) )? $data['navs']['arrows']['$ChanceToShow'] : '1'; ?>
                <?php foreach ( $this->_ChanceToShow as $key => $value ) : ?>
                    <option value="<?php echo $key; ?>" <?php selected( $key, $the_chance ); ?>><?php echo $value; ?></option>
                <?php endforeach; ?>
            </select>
            <p class="description"><?php _e( 'show arrows only on mouse over', 'cnhk-ss' ); ?></p>
        </div>
        <div class="form-field">
            <label><?php _e( 'icon size', 'cnhk-ss' ); ?></label>
            <?php $icon_size = ( isset( $data['navs']['arrows']['size'] ) )? $data['navs']['arrows']['size'] : 24; ?>
            <input name="navs[arrows][size]" id="navs-arrows-size" type="number" min="12" class="cnhk-number" value="<?php echo $icon_size; ?>" />
            <p class="description"><?php _e( 'icon size in pixels', 'cnhk-ss' ); ?></p>
        </div>
    </td>
    <td style="width:50%">
        <h4><?php _e( 'Arrows position', 'cnhk-ss' ); ?></h4>
        <?php 
        $the_position = ( isset( $data['navs']['arrows']['position'] ) )? $data['navs']['arrows']['position'] : '4-6';
        $pos_array = explode( '-', $the_position );
        ?>
        <input type="hidden" name="navs[arrows][position]" id="navs-arrows-position" value="<?php echo $the_position; ?>" />
        <table id="nav-arrows-grid"><tbody>
        <?php 
        for ( $i = 1; $i < 10; $i++ ) {
            if ( 1 == $i ) {
                ?><tr><?php
            } elseif ( 4 == $i || 7 == $i ) {
                ?></tr><tr><?php
            }
            if ( 5 == $i ) {
                ?><td class="arrow-grid neutral"></td><?php
            } else {
                ?><td class="arrow-grid" data-index="<?php echo $i; ?>"></td><?php
            }
            if ( 9 == $i ) {
                ?></tr><?php
            }
        }
        ?>
        </tbody></table>
    </td>
</tr></tbody></table>
<table class="widefat fixed">
    <thead><tr class="alternate"><th colspan="2"><strong><?php _e( 'previous slide icon', 'cnhk-ss' ) ?></strong></th><th colspan="2"><strong><?php _e( 'next slide icon', 'cnhk-ss' ) ?></strong></th></tr></thead>
    <tbody>
        <tr>
        <?php 
            $picon = ( isset( $data['navs']['arrows']['picon'] ) )? $data['navs']['arrows']['picon'] : 'chevron-circle-left';
            $nicon = ( isset( $data['navs']['arrows']['nicon'] ) )? $data['navs']['arrows']['nicon'] : 'chevron-circle-right';
        ?>
            <td>
                <label><?php _e( 'select an icon', 'cnhk-ss' ); ?></label>
                <select name="navs[arrows][picon]" id="navs-arrows-picon">
                    <?php foreach( $this->icons as $icon ) : ?>
                    <option value="<?php echo $icon; ?>" <?php selected( $icon == $picon ); ?>><?php echo str_replace( '-', ' ', $icon ); ?></option>
                    <?php endforeach; ?>
                </select>
            </td>
            <td style="vertical-align:middle" class="alternate">
                <div style="font-size:36px; text-align:center" id="picon-preview"></div>
            </td>
            <td>
                <label><?php _e( 'select an icon', 'cnhk-ss' ); ?></label>
                <select name="navs[arrows][nicon]" id="navs-arrows-nicon">
                    <?php foreach( $this->icons as $icon ) : ?>
                    <option value="<?php echo $icon; ?>" <?php selected( $icon == $nicon ); ?>><?php echo str_replace( '-', ' ', $icon ); ?></option>
                    <?php endforeach; ?>
                </select>
            </td>
            <td style="vertical-align:middle" class="alternate">
                <div style="font-size:36px; text-align:center" id="nicon-preview"></div>
            </td>
        </tr>
    </tbody>
</table>
<div class="form-field">
    <label><?php _e( 'icon color', 'cnhk-ss' ); ?></label>
    <?php $color = ( isset( $data['navs']['arrows']['color'] ) )? $data['navs']['arrows']['color'] : '#222222' ; ?>
    <input name="navs[arrows][color]" id="navs-arrows-color" value="<?php echo $color; ?>" /><button disabled="disabled" class="button-secondary" id="select-arrows-color"><?php _e( 'Select Color', 'cnhk-ss' ); ?></button>
    <p class="description"><?php _e( 'icons color', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label>
        <input type="hidden" name="navs[arrows][bg]" value="<?php echo ( isset( $data['navs']['arrows']['bg'] ) )? $data['navs']['arrows']['bg'] : ''; ?>" />
        <input type="checkbox" id="navs-arrows-bg" value="1" <?php checked( ( isset( $data['navs']['arrows']['bg'] ) && 'use' == $data['navs']['arrows']['bg']) ); ?> />
        <?php _e( 'arrow background', 'cnhk-ss' ); ?>
    </label>
    <p class="description"><?php _e( 'add a background to arrows. useful on slider with both light and dark slides', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label>
        <input type="hidden" name="navs[arrows][round]" value="<?php echo ( isset( $data['navs']['arrows']['round'] ) )? $data['navs']['arrows']['round'] : ''; ?>" />
        <input type="checkbox" id="navs-arrows-round" value="1" <?php checked( ( isset( $data['navs']['arrows']['round'] ) && 'round' == $data['navs']['arrows']['round']) ); ?> />
        <?php _e( 'round background', 'cnhk-ss' ); ?>
    </label>
    <p class="description"><?php _e( 'use circular background. mostly suitable on circled icons', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'background color', 'cnhk-ss' ); ?></label>
    <?php $bgColor = ( isset( $data['navs']['arrows']['bgColor'] ) )? $data['navs']['arrows']['bgColor'] : '#eeeeee' ; ?>
    <input name="navs[arrows][bgColor]" id="navs-arrows-bgColor" value="<?php echo $bgColor; ?>" /><button disabled="disabled" class="button-secondary" id="select-arrows-bgColor"><?php _e( 'Select Color', 'cnhk-ss' ); ?></button>
    <p class="description"><?php _e( 'arrow icon background color', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'background opacity', 'cnhk-ss' ); ?></label>
    <?php $bgOp = ( isset( $data['navs']['arrows']['bgOpacity'] ) )? $data['navs']['arrows']['bgOpacity'] : '0.4' ; ?>
    <input type="hidden" name="navs[arrows][bgOpacity]" value="<?php echo $bgOp; ?>" />
    <div id="navs-arrows-bgOpacity" style="margin:1em;width:18em;"></div>
    <p class="description"><?php _e( 'arrow icon background opacity', 'cnhk-ss' ); ?></p>
</div>
