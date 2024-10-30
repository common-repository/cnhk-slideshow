<?php $general_options = cnhk_db::get_instance()->options( 'general' ); ?>
<input type="hidden" name="template" value="classic" />
<div id="slides-list">
<?php if( ! empty( $this->data['slides'] ) ) : ?>
    <?php
    foreach ( $this->data['slides'] as $slide_id => $slide ) {
        $hndle = cnhk_ss::get_instance()->get_slide_type_handler( $slide['type'] );
        if ( $hndle ) {
            $context['slide'] = $slide;
            $context['slide_id'] = $slide_id;
            $context['template'] = 'classic';
            $hndle->admin_params( $context );
        } else {
            ?>
            <div class="error notice-on-the-fly">
                <p>
                    <?php _e( 'This slider makes use of missing modules. ( slide type: ', 'cnhk-ss' ); echo ' <code>' . $slide['type'] . '</code> '; ?>
                    <?php _e( ' ). You might lose data if you keep working on it.', 'cnhk-ss' ); ?>
                </p>
            </div>
            <?php
        }
    }
    ?>
<?php endif; ?>
</div><!-- #slide-list -->
