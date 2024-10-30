<div class="layer">
    <div class="layer-head">
        <span class="layer-name-head"><?php echo ( $layer['name'] )? $layer['name'] : '&nbsp;'; ?></span>
        <span class="alignright" title="<?php echo esc_attr( 'remove', 'cnhk-ss' ); ?>">
            <i class="dashicons dashicons-no remove-layer"></i>
        </span>
        <span class="alignright" >
            <i class="dashicons dashicons-sort" title="<?php echo esc_attr( 'sort', 'cnhk-ss' ); ?>"></i>
        </span>
    </div>
    <div class="layer-inside">
        <input type="hidden" class="layer-id" value="<?php echo $layer['id']; ?>" />
        <input type="hidden" class="parent-slide-id" value="<?php echo $slide_id; ?>" />
        <?php foreach( $layer as $prop => $value ) : ?>
        <?php if ( 'name' == $prop ) continue; ?>
        <input type="hidden" name="slides[<?php echo $slide_id; ?>][layers][<?php echo $layer['id']; ?>][<?php echo $prop; ?>]" class="layer-<?php echo $prop; ?>" value="<?php echo esc_attr( $value ); ?>" />
        <?php endforeach; ?>
        
        <div class="form-field">
            <label><b><?php _e( 'Layer name', 'cnhk-ss' ); ?></b></label>
            <input type="text" class="layer-name" name="slides[<?php echo $slide_id; ?>][layers][<?php echo $layer['id']; ?>][name]" value="<?php echo esc_attr( $layer['name'] ); ?>" />
            <p class="desc"><?php _e( 'The layer name is for administration only.', 'cnhk-ss' ); ?></p>
        </div>
        
        <div class="layer-toolbar">
            <span class="layer-edit"><i class="dashicons dashicons-edit"></i><?php _e( 'Edit content', 'cnhk-ss' ); ?></span>
            <span class="layer-styling"><i class="dashicons dashicons-art"></i><?php _e( 'Style and position', 'cnhk-ss' ); ?></span>
            <span class="layer-duplicate"><i class="dashicons dashicons-format-gallery"></i><?php _e( 'Duplicate layer', 'cnhk-ss' ); ?></span>
        </div>
    </div>
</div>
