<div id="image-edit-toolbar">
    <label><?php _e( 'width: ', 'cnhk-ss' ); ?><input type="number" name="image-edit-width" min="0" step="1" id="image-width" value="" /></label>
    <label><?php _e( 'height: ', 'cnhk-ss' ); ?><input type="number" name="image-edit-height" min="0" step="1" id="image-height" value="" /></label>
    <label><?php _e( 'alignment: ', 'cnhk-ss' ); ?>
        <select id="image-edit-alignment" name="image-edit-alignment">
            <option value="none"><?php _e( 'none', 'cnhk-ss' ); ?></option>
            <option value="left"><?php _e( 'left', 'cnhk-ss' ); ?></option>
            <option value="right"><?php _e( 'right', 'cnhk-ss' ); ?></option>
            <option value="center"><?php _e( 'center', 'cnhk-ss' ); ?></option>
        </select>
    </label><br />
    <em id="natural-size"><?php _e( 'natural size: ', 'cnhk-ss' ); ?><span id="nat-size-width"></span>x<span id="nat-size-height"></span></em>
</div>
<div id="image-edit-preview">

</div>
<div id="image-edit-submit">
    <button class="button button-secondary" id="cancel-edit-image"><?php _e( 'cancel', 'cnhk-ss' ); ?></button>
    <input type="submit" class="button button-primary" id="apply-edit-image" value="<?php echo esc_attr( __( 'apply changes', 'cnhk-ss' ) ); ?>" />
</div>
