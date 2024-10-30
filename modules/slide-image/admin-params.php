<?php
$slide = ( isset( $context['slide'] ) )? $context['slide'] : array();
$slide += array( 'type' => 'image', 'src' => '', 'link' => '', 'alt' => '', 'name' => '' );
$_th = cnhk_ss::get_instance()->get_template_handler_by( 'slug', $context['template'] );
?>
<div class="slide">
    <input type="hidden" class="slide-type" name="slides[<?php echo $slide_id; ?>][type]" value="image" />
    <input type="hidden" class="slide-id" value="<?php echo $slide_id; ?>" />
    <input type="hidden" class="caption-handler" value="std" />
    <div class="slide-content">
        <div class="slide-header">
            <span class="dashicons dashicons-format-image slide-type-icon" title="<?php esc_attr_e( 'Image', 'cnhk-ss' ); ?>"></span>|
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
                        
                        </div>
                        </td>
                        <td colspan="2">
                            <div class="form-field">
                                <label><?php _e( 'Slide name', 'cnhk-ss' ); ?></label>
                                <input type="text" class="slide-name" name="slides[<?php echo $slide_id; ?>][name]" value="<?php echo esc_attr( $slide['name'] ); ?>" />
                                <p class="desc"><?php _e( 'The slide name is for administration only', 'cnhk-ss' ); ?></p>
                            </div>
                            <div class="slide-params">
                                <div class="param-header"><?php _e( 'Image', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <button class="button button-secondary slide-image-btn"><?php _e( 'select image', 'cnhk-ss' ); ?></button>
                                    <input type="hidden" class="slide-image-src" name="slides[<?php echo $slide_id; ?>][src]" value="<?php echo esc_attr( $slide['src'] ); ?>" />
                                    <p class="desc"><?php _e( 'select an image from your library', 'cnhk-ss' ); ?></p>
                                    <p class="slide-image-notice" style="color:red;"></p>
                                </div>
                                <div class="param-header"><?php _e( 'Link', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <input type="text" class="image-link" style="width: 100%;" name="slides[<?php echo $slide_id; ?>][link]" value="<?php echo esc_attr( $slide['link'] ); ?>" />
                                    <p class="desc"><?php _e( 'where to go when clicking this image (can be empty)', 'cnhk-ss' ); ?></p>
                                </div>
                                <div class="param-header"><?php _e( 'Alt tag', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <input type="text" class="image-alt" style="width: 100%;" name="slides[<?php echo $slide_id; ?>][alt]" value="<?php echo esc_attr( $slide['alt'] ); ?>" />
                                </div>
                                <?php if ( $_th->supports_fx ) : ?>
                                <div class="param-header"><?php _e( 'Slide transition', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <label><?php _e( 'Transition effect', 'cnhk-ss' ); ?></label>
                                    <?php
                                        $args = array(
                                            'root' => 'slide',
                                            'name' => 'slides[' . $slide_id . '][slfx]',
                                            'class' => 'slfx',
                                            'code' => $slide['slfx'],
                                        );
                                        cnhk_fx_picker( $args );
                                    ?>
                                    <p class="description"><?php _e( 'If set, this effect is used instead of the  one defined as basic parameter', 'cnhk-ss' ); ?></p>
                                    <label><?php _e( 'Transition speed', 'cnhk-ss' ); ?></label>
                                    <input class="sldu cnhk-number cnhk-int" type="number" data-default="" min="100" name="slides[<?php echo $slide_id; ?>][sldu]" value="<?php echo $slide['sldu']; ?>" />
                                    <p class="description"><?php _e( 'Duration ( in ms ) of the transition effect', 'cnhk-ss' ); ?></p>
                                </div>
                                <?php endif; ?>
                                <?php
                                    if ( $_th->supports_caption ) {
                                        cnhk_caption_admin::get_instance()->accordion( $slide_id, $slide );
                                    }
                                ?>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <?php cnhk_admin::slide_toolbar(); ?>
        </div>
    </div>
</div>
