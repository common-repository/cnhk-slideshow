<input type="hidden" value="1" />
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
<?php cnhk_admin::bg_admin_params( $this ); ?>
<hr />
<div class="form-field">
    <label><?php _e( 'Slide display time (in ms)', 'cnhk-ss' ); ?>&nbsp:&nbsp;</label>
    <input type="number" class="cnhk-number cnhk-int" data-default="1500" name="options[_AutoPlayInterval]" id="options-_AutoPlayInterval" value="<?php echo $this->data['options']['$AutoPlayInterval'] ?>" />
    <p class="desc"><?php _e( 'time before switching to the next slide automatically ( if auto play is enabled )', 'cnhk-ss' ); ?></p>
</div>
<div class="form-field">
    <label><?php _e( 'Transition speed (in ms)', 'cnhk-ss' ); ?>&nbsp:&nbsp;</label>
    <input type="number" class="cnhk-number cnhk-int" data-default="6000" name="options[_SlideDuration]" id="options-_SlideDuration" value="<?php echo $this->data['options']['$SlideDuration'] ?>" />
    <p class="desc"><?php _e( 'auto play transition duration', 'cnhk-ss' ); ?></p>
</div>
