<?php $general_options = cnhk_db::get_instance()->options( 'general' ); ?>
<input type="hidden" name="template" value="image" />
<div id="slides-list">
<?php if( ! empty( $this->data['slides'] ) ) : ?>
    <?php
    foreach ( $this->data['slides'] as $slide_id => $slide ) {
        $hndle = cnhk_ss::get_instance()->get_slide_type_handler( $slide['type'] );
        if ( $hndle ) {
            $context['slide'] = $slide;
            $context['slide_id'] = $slide_id;
            $context['template'] = 'image';
            $hndle->admin_params( $context );
        }
    }
    ?>
<?php endif; ?>
</div><!-- #slide-list -->
