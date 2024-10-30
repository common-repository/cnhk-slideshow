<div class="caption">
    <div class="caption-head">
        <span class="caption-name-head"><?php echo ( $this->data['name'] )? $this->data['name'] : '&nbsp;'; ?></span>
        <span class="alignright" title="<?php esc_attr_e( 'remove', 'cnhk-ss' ); ?>">
            <i class="dashicons dashicons-no remove-caption"></i>
        </span>
        <span class="alignright" >
            <i class="dashicons dashicons-sort" title="<?php esc_attr_e( 'sort', 'cnhk-ss' ); ?>"></i>
        </span>
    </div>
    <div class="caption-inside">
        <input type="hidden" class="caption-id" value="<?php echo $this->data['id']; ?>" />
        <input type="hidden" class="parent-slide-id" value="<?php echo $this->data['slide']; ?>" />
        <input type="hidden" class="caption-html" name="slides[<?php echo $this->data['slide']; ?>][captions][<?php echo $this->data['id']; ?>][html]" id="html-<?php echo $this->data['id']; ?>" value="<?php echo esc_attr( $this->data['html'] ); ?>" />
        
        <input type="hidden" name="slides[<?php echo $this->data['slide']; ?>][captions][<?php echo $this->data['id']; ?>][styling]" class="ca-styling" value="<?php echo esc_attr( $this->data['styling'] ); ?>" />    
        <input type="hidden" name="slides[<?php echo $this->data['slide']; ?>][captions][<?php echo $this->data['id']; ?>][timing]" class="ca-timing" value="<?php echo esc_attr( $this->data['timing'] ); ?>" />        
        <div class="form-field">
            <label><b><?php _e( 'Caption name', 'cnhk-ss' ); ?></b></label>
            <input type="text" class="caption-name" name="slides[<?php echo $this->data['slide']; ?>][captions][<?php echo $this->data['id']; ?>][name]" value="<?php echo esc_attr( $this->data['name'] ); ?>" />
            <p class="desc"><?php _e( 'The caption name is for administration only.', 'cnhk-ss' ); ?></p>
        </div>
        
        <div class="caption-toolbar">
            <span class="caption-edit"><i class="dashicons dashicons-edit"></i><?php _e( 'Edit content', 'cnhk-ss' ); ?></span>
            <span class="caption-styling"><i class="dashicons dashicons-art"></i><?php _e( 'Style and position', 'cnhk-ss' ); ?></span>
            <span class="caption-timing"><i class="dashicons dashicons-clock"></i><?php _e( 'Transition and timing', 'cnhk-ss' ); ?></span>
            <span class="caption-duplicate"><i class="dashicons dashicons-format-gallery"></i><?php _e( 'Duplicate caption', 'cnhk-ss' ); ?></span>
        </div>
    </div>
</div>
