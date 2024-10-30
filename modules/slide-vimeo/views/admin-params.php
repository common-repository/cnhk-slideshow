<?php
$slide = ( isset( $context['slide'] ) )? $context['slide'] : array();
$slide += array( 'type' => 'vimeo', 'name' => '', 'videoid' => '', 'params' => array() );
?>
<div class="slide">
    <input type="hidden" class="slide-type" name="slides[<?php echo $slide_id; ?>][type]" value="vimeo" />
    <input type="hidden" class="slide-id" value="<?php echo $slide_id; ?>" />
    <div class="slide-content">
        <div class="slide-header">
            <span class="dashicons dashicons-format-video slide-type-icon" title="<?php esc_attr_e( 'Vimeo', 'cnhk-ss' ); ?>"></span>|
            <span class="dashicons dashicons-sort" title="<?php esc_attr_e( 'sort', 'cnhk-ss' ); ?>"></span>
            <span class="slide-name-head"><?php echo ( $slide['name'] )? esc_html( $slide['name'] ) : '&nbsp;'; ?></span>
            <span class="dashicons dashicons-no remove-slide alignright" title="<?php esc_attr_e( 'remove', 'cnhk-ss' ); ?>"></span>
        </div>
        <div class="slide-inside">
            <table class="widefat fixed">
                <tbody>
                    <tr>
                        <td class="slide-preview">
                        <div class="slide-main-content">
                            <div style="text-align:center;width:100%;line-height:250px;height:250px;">
                                <i class="fa fa-vimeo-square" style="vertical-align:middle;font-size:64px"></i>
                            </div>
                        </div>
                        </td>
                        <td colspan="2">
                            <div class="form-field">
                                <label><?php _e( 'Slide name', 'cnhk-ss' ); ?></label>
                                <input type="text" class="slide-name" name="slides[<?php echo $slide_id; ?>][name]" value="<?php echo esc_attr( $slide['name'] ); ?>" />
                                <p class="desc"><?php _e( 'The slide name is for administration only', 'cnhk-ss' ); ?></p>
                            </div>
                            <div class="slide-params">
                                <div class="param-header"><?php _e( 'Video ID', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <input type="text" class="vimeo-vid" name="slides[<?php echo $slide_id; ?>][videoid]" value="<?php echo esc_attr( $slide['videoid'] ); ?>" />
                                    <button class="button-secondary vimeo-from-url"><?php _e( 'get id from url', 'cnhk-ss' ); ?></button>
                                    <div class="vimeo-url-pastediv" style="display:none;">
                                        <i class="dashicons dashicons-no alignright close-vimeo-pastediv"></i>
                                        <em><?php _e( 'paste the video url in the field bellow:', 'cnhk-ss' ); ?></em><br /><br />
                                        <textarea style="width:80%;height:100px;resize:none;"></textarea><br />
                                        <button class="button-secondary parse-vimeo-url"><?php _e( 'parse', 'cnhk-ss' ); ?></button>
                                        <p class="pastediv-error"></p>
                                    </div>
                                </div>
                                <div class="param-header"><?php _e( 'Byline', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( "Show the user's byline on the video", 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][byline]" value="1" <?php checked( '1', $slide['params']['byline'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][byline]" value="0" <?php checked( '0', $slide['params']['byline'] ); ?> /><?php _e( 'do not show', 'cnhk-ss' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'Portrait', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( "Show the user's portrait on the video", 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][portrait]" value="1" <?php checked( '1', $slide['params']['portrait'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][portrait]" value="0" <?php checked( '0', $slide['params']['portrait'] ); ?> /><?php _e( 'do not show', 'cnhk-ss' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'Title', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( 'Show the title on the video', 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][title]" value="1" <?php checked( '1', $slide['params']['title'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][title]" value="0" <?php checked( '0', $slide['params']['title'] ); ?> /><?php _e( 'do not show', 'cnhk-ss' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'Color', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <input type="text" class="vimeo-control-color" name="slides[<?php echo $slide_id; ?>][params][color]" value="<?php echo ( $slide['params']['color'] )? $slide['params']['color'] : '#00adef'; ?>" />
                                    <p class="desc"><?php _e( 'Video controls color', 'cnhk-ss' ); ?></p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <?php cnhk_admin::slide_toolbar(); ?>
        </div>
    </div>
</div>
