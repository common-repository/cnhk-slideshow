<?php
$default_code = '';
$_code = '';
if ( isset( $_GET['code'] ) ) {
    $_code = urldecode( $_GET['code'] );
} elseif ( isset( $the_code ) ) {
    $code = $the_code;
} else {
    $_code = $default_code;
}

// print the transition type
echo '<input type="hidden" name="code-type" value="ca" />';

?>
<h3><?php _e( 'Slider preview', 'cnhk-ss' ); ?></h3>
<div id="ss" style="position: relative; width: 800px; height: 450px; margin: auto;">
    <?php include CNHK_PATH . 'admin/views/slides-with-captions.php'; ?>
</div>
<hr />
<?php
$_fx = cnhk_ss::get_instance()->get_cafx();
$_fx_family = cnhk_ss::get_instance()->get_cafx_families();
?>
<div class="top-commands">
    <h3><?php _e( 'Load a caption transition code', 'cnhk-ss'); ?></h3>
    <label for="cafx-predefined"><b><?php _e( 'Predefined caption transition', 'cnhk-ss'); ?></b>:</label>
    <select id="cafx-predefined">
        <option value=""></option>
        <?php foreach ( $_fx as $fam_key => $fx_by_fam ) : ?>
            <option value="">---- <?php echo $_fx_family[ $fam_key ] ?> ----</option>
            <?php foreach ( $fx_by_fam as $key => $value ) : ?>
            <option value="<?php echo esc_attr( $value['value'] ); ?>"><?php echo $value['name']; ?></option>
            <?php endforeach; ?>
        <?php endforeach; ?>
    </select>
    <button class="button button-secondary" id="load-predefined"><?php _e( 'Load', 'cnhk-ss' ); ?></button>
    <br />
    <br />
    <label for="cafx-selection"><b><?php _e( 'Your collections', 'cnhk-ss'); ?></b>:</label><br />
    <input type="hidden" id="cafx-selection" class="fx-picker" data-root="caption" value="" />
    <button class="button button-secondary" id="load-collection"><?php _e( 'Load', 'cnhk-ss' ); ?></button>
</div>
<hr />
<label for="the-code">
    <b><?php _e( 'Effect code', 'cnhk-ss' ); ?>&nbsp;:&nbsp;</b>
</label>
<input type="text" class="fxcode-input" name="the-code" id="the-code" readonly="readonly" value="" style="width: 90%; padding: 5px;" />
<input type="hidden" id="the-name" name="the-name" value="" />
<p>
    <input type="submit" class="button button-primary" data-root="caption" id="save-to-selection" value="<?php _e( 'add to collection', 'cnhk-ss' ); ?>" />
    <button class="button button-secondary" id="play"><?php _e( 'play transition', 'cnhk-ss' ) ?></button>
</p>
    
<hr />
<?php
$fx_type = 'ca';
include CNHK_PATH . 'admin/views/builder-template.php';
