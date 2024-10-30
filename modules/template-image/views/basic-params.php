<?php
$ssfx = cnhk_db::get_instance()->options( 'ssfx_preset' );
?>
<input type="hidden" name="options[_DisplayPieces]" id="options-_DisplayPieces" value="1" />
<h4><?php _e( 'Slider aspect ratio', 'cnhk-ss' ); ?></h4>
<div class="form-field">
    <label>
        <?php  _e( 'Width (in px)', 'cnhk-ss' ); ?>&nbsp:&nbsp;
        <input type="number" name="options[w]" id="options-w" class="cnhk-number cnhk-int" data-default="1300" value="<?php echo $this->data['options']['w'] ?>" />
    </label>
    <p class="desc"><?php _e( 'slide width', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label>
        <?php  _e( 'Height (in px)', 'cnhk-ss' ); ?>&nbsp:&nbsp;
        <input type="number" name="options[h]" id="options-h" class="cnhk-number cnhk-int" data-default="500" value="<?php echo $this->data['options']['h'] ?>" />
    </label>
    <p class="desc"><?php _e( 'slide height', 'cnhk-ss' ); ?></p>
</div>
<hr />
<?php cnhk_admin::loading_bg( $this ); ?>
<hr />
<?php cnhk_admin::boxed_admin_params( $this ); ?>
<hr />
<h4><?php _e( 'Slide transitions', 'cnhk-ss' ); ?></h4>
<div class="form-field">
    <label><?php _e( 'Default transition effect', 'cnhk-ss' ); ?></label>
    <?php 
        $ssfx = ( isset( $this->data['options']['ssfx'] ) )? $this->data['options']['ssfx']  : '';
        $args = array(
            'root' => 'slide',
            'name' => 'options[ssfx]',
            'id' => 'options-ssfx',
            'code' => $ssfx,
        );
        cnhk_fx_picker( $args );
    ?>
    <p class="desc"><?php _e( "visual effect for slide transition. Overridden by the slide's individual value (if it is set).", 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Default transition duration (in ms)', 'cnhk-ss' ); ?>&nbsp:&nbsp;</label>
    <input type="number" class="cnhk-number cnhk-int" data-default="1500" name="options[ssdu]" id="options-ssdu" value="<?php echo $this->data['options']['ssdu'] ?>" />
    <p class="desc"><?php _e( "duration of the slide transition. Overridden by the slide's individual value (if it is set).", 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Slide display time (in ms)', 'cnhk-ss' ); ?>&nbsp:&nbsp;</label>
    <input type="number" class="cnhk-number cnhk-int" data-default="8000" name="options[_AutoPlayInterval]" id="options-_AutoPlayInterval" value="<?php echo $this->data['options']['$AutoPlayInterval'] ?>" />
    <p class="desc"><?php _e( 'time before switching to the next slide automatically ( if auto play is enabled )', 'cnhk-ss' ); ?></p>
</div>
