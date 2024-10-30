<?php
$slide = ( isset( $context['slide'] ) )? $context['slide'] : array();
$slide += array( 'type' => 'html', 'layers' => array(), 'name' => '' );
$_th = cnhk_ss::get_instance()->get_template_handler_by( 'slug', $context['template'] );
?>
<div class="slide">
    <input type="hidden" class="slide-type" name="slides[<?php echo $slide_id; ?>][type]" value="html" />
    <input type="hidden" class="slide-id" value="<?php echo $slide_id; ?>" />
    <input type="hidden" class="caption-handler" value="std" />
    <div class="slide-content">
        <div class="slide-header">
            <span class="dashicons dashicons-editor-code slide-type-icon" title="<?php esc_attr_e( 'HTML', 'cnhk-ss' ); ?>"></span>|
            <span class="dashicons dashicons-sort" title="<?php esc_attr_e( 'sort', 'cnhk-ss' ); ?>"></span>
            <span class="slide-name-head"><?php echo ( $slide['name'] )? esc_html( $slide['name'] ) : '&nbsp;'; ?></span>
            <span class="dashicons dashicons-no remove-slide alignright" title="<?php esc_attr_e( 'remove', 'cnhk-ss' ); ?>"></span>
            <span class="alignright static-content-head" style="color:blue;font-weight:bold;font-style:italic;"><?php if( isset( $slide['isStatic'] ) ) _e( 'static content', 'cnhk-ss' ); ?></span>
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
                                <div class="param-header"><?php _e( 'Layers', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                <?php cnhk_layer_html::admin_params( $slide['layers'], $slide_id ); ?>
                                </div>
                                <div class="param-header"><?php _e( 'Background', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <div class="form-field slhtml-bg-image-field">
                                        <h4><?php _e( 'background image', 'cnhk-ss' ); ?></h4>
                                        <input type="hidden" class="slide-bg-image-url" name="slides[<?php echo $slide_id; ?>][bgImage]" value="<?php echo esc_url( $slide['bgImage'] ); ?>" />
                                        <button class="button-secondary slide-bg-image"><?php _e( 'select an image', 'cnhk-ss' ); ?></button>
                                        <button class="button-secondary slide-bg-remove-image" <?php if ( empty( $slide['bgImage'] ) ) echo 'disabled="disabled"'; ?>><?php _e( 'remove image', 'cnhk-ss' ); ?></button>
                                        <p class="slide-bg-notice" style="color:red;"></p>
                                    </div>
                                    <h4><?php _e( 'background color', 'cnhk-ss' ); ?></h4>
                                    <table class="widefat fixed slhtml-bg-color-field" style="border:1px solid #e5e5e5;">
                                        <thead>
                                        <tr class="alternate">
                                            <th><?php _e( 'color', 'cnhk-ss' ); ?></th>
                                            <th><?php _e( 'opacity', 'cnhk-ss' ); ?></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input name="slides[<?php echo $slide_id; ?>][bgColor]" class="colorpicker slide-bg-color" value="<?php echo $slide['bgColor']; ?>" />
                                                </td>
                                                <td>
                                                    <input type="hidden" name="slides[<?php echo $slide_id; ?>][bgOpacity]" value="<?php echo $slide['bgOpacity']; ?>" />
                                                    <div class="slide-bg-opacity slider" data-min="0" data-max="1" data-step="0.025"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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
                                    <input class="sldu cnhk-number cnhk-int" data-default="" type="number" min="100" name="slides[<?php echo $slide_id; ?>][sldu]" value="<?php echo $slide['sldu']; ?>" />
                                    <p class="description"><?php _e( 'Duration ( in ms ) of the transition effect', 'cnhk-ss' ); ?></p>
                                </div>
                                <?php endif; ?>
                                <?php
                                    if ( $_th->supports_caption ) {
                                        cnhk_caption_admin::get_instance()->accordion( $slide_id, $slide );
                                    }
                                ?>
                                <?php if ( isset( $_th->supports_static ) && $_th->supports_static ) : ?>
                                <div class="param-header"><?php _e( 'Static content', 'cnhk-ss' ); ?></div>
                                <div class="param-inside">
                                    <label>
                                        <input type="checkbox" class="setStatic" name="slides[<?php echo $slide_id; ?>][isStatic]" <?php checked( isset( $slide['isStatic'] ) ); ?>value="1" />
                                        <?php _e( 'Set as static content', 'cnhk-ss' ) ?>
                                    </label>
                                    <p class="description">
                                        <?php _e( 'If set as static, it will not be a slide any more. The content will not move and remains in its place, no matter which slide is being displayed. ', 'cnhk-ss' ); ?>
                                        <?php _e( 'Every transitions and captions will be ignored, and also the background image as it covers all the surface.', 'cnhk-ss' ); ?>
                                    </p>
                                </div>
                                <?php endif; ?>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <?php cnhk_admin::slide_toolbar(); ?>
        </div>
    </div>
</div>
