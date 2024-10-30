<?php
echo '<input type="hidden" name="code-type" value="ss" />';

?>
<h3><?php _e( 'Slider preview', 'cnhk-ss' ); ?></h3>
<div id="ss" style="position: relative; width: 800px; height: 450px; margin: auto;">
    <?php include CNHK_PATH . 'admin/views/slides-no-captions.php'; ?>
</div>
<hr />
<?php
$_fx = cnhk_ss::get_instance()->get_fx();
$_fx_family = cnhk_ss::get_instance()->get_fx_families();
?>
<div class="top-commands">
    <h3><?php _e( 'Load a slide transition code', 'cnhk-ss'); ?></h3>
    <label for="ssfx-predefined"><b><?php _e( 'Predefined Slide transition', 'cnhk-ss'); ?></b>:</label><br />
    <select id="ssfx-predefined">
        <option value=""></option>
        <?php foreach ( $_fx as $fam_key => $fx_by_fam ) : ?>
            <option value="">---- <?php echo $_fx_family[ $fam_key ] ?> ----</option>
            <?php foreach ( $fx_by_fam as $key => $value ) : ?>
            <option value="<?php echo esc_attr( $value['value'] ); ?>"><?php echo $value['name']; ?></option>
            <?php endforeach; ?>
        <?php endforeach; ?>
    </select><button class="button button-secondary" id="load-slidefx"><?php _e( 'Load', 'cnhk-ss' ); ?></button>
    <div id="load-slidefx-ph" style="width: 18px; height: 18px; padding: 0; margin: 0; display: inline-block;"></div>
    <br />
    <br />
    <label for="ssfx-selection"><b><?php _e( 'Your collections', 'cnhk-ss'); ?></b>:</label><br />
    <input type="hidden" id="ssfx-selection" class="fx-picker" data-root="slide" value="" />
    <button class="button button-secondary" id="load-selection"><?php _e( 'Load', 'cnhk-ss' ); ?></button>
    <div id="load-selection-ph" style="width: 18px; height: 18px; padding: 0; margin: 0; display: inline-block;"></div>
</div>
<hr />
<label for="the-code">
    <b><?php _e( 'Effect code', 'cnhk-ss' ); ?>&nbsp;:&nbsp;</b>
</label>
<input type="text" class="fxcode-input" name="the-code" readonly id="the-code" value="" style="width: 95%; padding: 4px;" />
<p>
    <button class="button button-primary" id="save-to-selection" data-root="slide" disabled="disabled"><?php _e( 'add to collection', 'cnhk-ss' ); ?></button>
    <button class="button button-secondary" id="play"><?php _e( 'play transition', 'cnhk-ss' ) ?></button>
</p>
<hr />
<?php
$fx_type = 'ss';
include CNHK_PATH . 'admin/views/builder-template.php';
