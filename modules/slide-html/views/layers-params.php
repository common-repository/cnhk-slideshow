<div class="layers">
<?php foreach ( $layers as $layer ) : ?>
<?php cnhk_layer_html::single_layer_params( $layer, $slide_id ); ?>
<?php endforeach; ?>
</div>
<hr />
<button class="button button-primary add-layer"><?php _e( 'add layer', 'cnhk-ss' ); ?></button>
<span class="add-layer-ph"></span>
<button class="button button-secondary paste-layer-copy alignright" disabled="disabled"><?php _e( 'paste the copied layer', 'cnhk-ss' ); ?></button>
