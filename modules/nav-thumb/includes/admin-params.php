<?php
global $post;
$hndle = cnhk_ss::get_instance()->get_template_handler_by( 'id', $post->ID );
if ( ! $hndle ) return;
$data = $hndle->data;
?>
<div class="form-field">
    <label>
        <input type="checkbox" id="use-nav-thumb" value="1" <?php if ( isset( $data['navs'] ) && isset( $data['navs']['thumb'] ) ) echo 'checked="checked"'; ?> />
        <?php _e( 'use thumbnail navigator', 'cnhk-ss' ); ?>
    </label>
</div>
<div class="form-field">
    <label><?php _e( 'Thumbnail width', 'cnhk-ss' ); ?></label>
    <?php $thumb_width = ( isset( $data['navs']['thumb']['width'] ) )? $data['navs']['thumb']['width'] : 120; ?>
    <input name="navs[thumb][width]" id="navs-thumb-width" type="number" min="10" class="cnhk-number cnhk-int" data-default="120" value="<?php echo $thumb_width; ?>" />
    <p class="description"><?php _e( 'thumbnail width in pixels', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Thumbnail height', 'cnhk-ss' ); ?></label>
    <?php $thumb_height = ( isset( $data['navs']['thumb']['height'] ) )? $data['navs']['thumb']['height'] : 90; ?>
    <input name="navs[thumb][height]" id="navs-thumb-height" type="number" min="10" class="cnhk-number cnhk-int" data-default="90" value="<?php echo $thumb_height; ?>" />
    <p class="description"><?php _e( 'thumbnail height in pixels', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Lane', 'cnhk-ss' ); ?></label>
    <?php $thumb_lane = ( isset( $data['navs']['thumb']['lane'] ) )? $data['navs']['thumb']['lane'] : 1; ?>
    <input name="navs[thumb][lane]" id="navs-thumb-lane" type="number" min="1" class="cnhk-number cnhk-int" data-default="1" value="<?php echo $thumb_lane; ?>" />
    <p class="description"><?php _e( 'in how many lanes the thumbnails should be arranged', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Pieces to display', 'cnhk-ss' ); ?></label>
    <?php $thumb_pieces = ( isset( $data['navs']['thumb']['pieces'] ) )? $data['navs']['thumb']['pieces'] : 3; ?>
    <input name="navs[thumb][pieces]" id="navs-thumb-pieces" type="number" min="1" class="cnhk-number cnhk-int" data-default="3" value="<?php echo $thumb_pieces; ?>" />
    <p class="description"><?php _e( 'how many pieces ( per lane ) are displayed', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Thumbnails position', 'cnhk-ss' ); ?></label>
    <?php $thumb_position = ( isset( $data['navs']['thumb']['position'] ) )? $data['navs']['thumb']['position'] : 'bottom'; ?>
    <select name="navs[thumb][position]" id="navs-thumb-position">
        <option value="bottom" <?php selected( ( 'bottom' == $thumb_position ) ); ?>><?php _e( 'bottom', 'cnhk-ss' ); ?></option>
        <option value="top" <?php selected( ( 'top' == $thumb_position ) ); ?>><?php _e( 'top', 'cnhk-ss' ); ?></option>
        <option value="left" <?php selected( ( 'left' == $thumb_position ) ); ?>><?php _e( 'left', 'cnhk-ss' ); ?></option>
        <option value="right" <?php selected( ( 'right' == $thumb_position ) ); ?>><?php _e( 'right', 'cnhk-ss' ); ?></option>
    </select>
</div>
