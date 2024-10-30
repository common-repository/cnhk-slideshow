<?php
global $post;
$hndle = cnhk_ss::get_instance()->get_template_handler_by( 'id', $post->ID );
if ( ! $hndle ) return;
$data = $hndle->data;
?>
<div class="form-field">
    <label>
        <input type="checkbox" id="use-nav-progress" value="1" <?php if ( isset( $data['navs'] ) && isset( $data['navs']['progress'] ) ) echo 'checked="checked"'; ?> />
        <?php _e( 'use progress bar', 'cnhk-ss' ); ?>
    </label>
</div>
<div class="form-field">
    <label><?php _e( 'progress bar color', 'cnhk-ss' ); ?></label>
    <?php $bgColor = ( isset( $data['navs']['progress']['color'] ) )? $data['navs']['progress']['color'] : '#ffffff' ; ?>
    <input name="navs[progress][color]" id="navs-progress-color" value="<?php echo $bgColor; ?>" />
    <button disabled="disabled" class="button-secondary" id="select-progress-color"><?php _e( 'Select Color', 'cnhk-ss' ); ?></button></div>
<div class="form-field">
    <label><?php _e( 'progress bar opacity', 'cnhk-ss' ); ?></label>
    <?php $progress_opacity = ( isset( $data['navs']['progress']['opacity'] ) )? $data['navs']['progress']['opacity'] : 0.6; ?>
    <input name="navs[progress][opacity]"type="hidden" value="<?php echo $progress_opacity; ?>" />
    <div id="navs-progress-opacity" style="margin:1em;width:18em;"></div>
    <p class="description"><?php _e( 'progress bar opacity', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'progress bar thickness', 'cnhk-ss' ); ?></label>
    <?php $progress_size = ( isset( $data['navs']['progress']['size'] ) )? $data['navs']['progress']['size'] : 5; ?>
    <input name="navs[progress][size]" id="navs-progress-size" type="number" min="1" class="cnhk-number cnhk-int" data-default="5" value="<?php echo $progress_size; ?>" />
    <p class="description"><?php _e( 'progress bar thickness in pixels', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'progress bar position', 'cnhk-ss' ); ?></label>
    <?php $progress_position = ( isset( $data['navs']['progress']['position'] ) )? $data['navs']['progress']['position'] : 'top'; ?>
    <select name="navs[progress][position]" id="navs-progress-position">
        <option value="left" <?php selected( ( 'left' == $progress_position ) ); ?>><?php _e( 'left', 'cnhk-ss' ); ?></option>
        <option value="top" <?php selected( ( 'top' == $progress_position ) ); ?>><?php _e( 'top', 'cnhk-ss' ); ?></option>
        <option value="right" <?php selected( ( 'right' == $progress_position ) ); ?>><?php _e( 'right', 'cnhk-ss' ); ?></option>
        <option value="bottom" <?php selected( ( 'bottom' == $progress_position ) ); ?>><?php _e( 'bottom', 'cnhk-ss' ); ?></option>
    </select>
</div>
