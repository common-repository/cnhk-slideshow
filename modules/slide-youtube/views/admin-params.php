<?php
$slide = ( isset( $context['slide'] ) )? $context['slide'] : array();
$slide += array( 'type' => 'youtube', 'name' => '', 'videoid' => '', 'params' => array() );
?>
<div class="slide">
    <input type="hidden" class="slide-type" name="slides[<?php echo $slide_id; ?>][type]" value="youtube" />
    <input type="hidden" class="slide-id" value="<?php echo $slide_id; ?>" />
    <div class="slide-content">
        <div class="slide-header">
            <span class="dashicons dashicons-format-video slide-type-icon" title="<?php esc_attr_e( 'YouTube', 'cnhk-ss' ); ?>"></span>|
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
                                <i class="fa fa-youtube" style="vertical-align:middle;font-size:64px"></i>
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
                                    <input type="text" class="youtube-vid" name="slides[<?php echo $slide_id; ?>][videoid]" value="<?php echo esc_attr( $slide['videoid'] ); ?>" />
                                    <button class="button-secondary youtube-from-url"><?php _e( 'get id from url', 'cnhk-ss' ); ?></button>
                                    <div class="youtube-url-pastediv" style="display:none;">
                                        <i class="dashicons dashicons-no alignright close-youtube-pastediv"></i>
                                        <em><?php _e( 'paste the video url in the field bellow:', 'cnhk-ss' ); ?></em><br /><br />
                                        <textarea style="width:80%;height:100px;resize:none;"></textarea><br />
                                        <button class="button-secondary parse-youtube-url"><?php _e( 'parse', 'cnhk-ss' ); ?></button>
                                        <p class="pastediv-error"></p>
                                    </div>
                                </div>
                                <div class="param-header"><?php _e( 'Related videos', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( 'Show related video after playback', 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][rel]" value="1" <?php checked( '1', $slide['params']['rel'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][rel]" value="0" <?php checked( '0', $slide['params']['rel'] ); ?> /><?php _e( 'do not show' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'Full screen', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( 'Allow full screen', 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][fs]" value="1" <?php checked( '1', $slide['params']['fs'] ); ?> /><?php _e( 'allow', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][fs]" value="0" <?php checked( '0', $slide['params']['fs'] ); ?> /><?php _e( 'forbid', 'cnhk-ss' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'Video info', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( 'Show info on the video', 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][info]" value="1" <?php checked( '1', $slide['params']['info'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][info]" value="0" <?php checked( '0', $slide['params']['info'] ); ?> /><?php _e( 'do not show', 'cnhk-ss' ); ?></label><br />
                                </div>
                                <div class="param-header"><?php _e( 'YouTube Logo', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <p class="desc"><?php _e( 'Display the YouTube logo on the player (before the video starts)', 'cnhk-ss' ); ?></p>
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][logo]" value="1" <?php checked( '1', $slide['params']['logo'] ); ?> /><?php _e( 'show', 'cnhk-ss' ); ?></label>&nbsp;&nbsp;&nbsp;
                                    <label><input type="radio" name="slides[<?php echo $slide_id; ?>][params][logo]" value="0" <?php checked( '0', $slide['params']['logo'] ); ?> /><?php _e( 'do not show', 'cnhk-ss' ); ?></label><br />
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
