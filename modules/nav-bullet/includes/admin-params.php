<?php
global $post;
$hndle = cnhk_ss::get_instance()->get_template_handler_by( 'id', $post->ID );
if ( ! $hndle ) return;
$data = $hndle->data;
?>
<div class="form-field">
    <label>
        <input type="checkbox" id="use-nav-bullet" value="1" <?php if ( isset( $data['navs'] ) && isset( $data['navs']['bullet'] ) ) echo 'checked="checked"'; ?> />
        <?php _e( 'use bullets navigator', 'cnhk-ss' ); ?>
    </label>
</div>
<div class="form-field">
    <label><?php _e( 'bullet color', 'cnhk-ss' ); ?></label>
    <?php $bgColor = ( isset( $data['navs']['bullet']['color'] ) )? $data['navs']['bullet']['color'] : '' ; ?>
    <input name="navs[bullet][color]" id="navs-bullet-color" value="<?php echo $bgColor; ?>" />
    <button disabled="disabled" class="button-secondary" id="select-bullet-color"><?php _e( 'Select Color', 'cnhk-ss' ); ?></button>
    <p class="description"><?php _e( 'by default bullets have the same color as the font used in the place where the slider is used. You can choose your own color here.', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'bullet size', 'cnhk-ss' ); ?></label>
    <?php $bullet_size = ( isset( $data['navs']['bullet']['size'] ) )? $data['navs']['bullet']['size'] : 16; ?>
    <input name="navs[bullet][size]" id="navs-bullet-size" type="number" min="8"  class="cnhk-number cnhk-int" data-default="16" value="<?php echo $bullet_size; ?>" />
    <p class="description"><?php _e( 'bullet size in pixels', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'bullets position', 'cnhk-ss' ); ?></label>
    <?php $bullet_position = ( isset( $data['navs']['bullet']['position'] ) )? $data['navs']['bullet']['position'] : 'inside'; ?>
    <select name="navs[bullet][position]" id="navs-bullet-position">
        <option value="inside" <?php selected( ( 'inside' == $bullet_position ) ); ?>><?php _e( 'inside', 'cnhk-ss' ); ?></option>
        <option value="outside" <?php selected( ( 'outside' == $bullet_position ) ); ?>><?php _e( 'outside', 'cnhk-ss' ); ?></option>
    </select>
</div>