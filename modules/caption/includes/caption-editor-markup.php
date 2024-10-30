<?php
ob_start();
?>
<div class="after-editor-submit">
    <div class="after-editor-submit-inner">
        <button class="button-secondary" id="close-caption-editor"><?php _e( 'cancel', 'cnhk-ss' ); ?></button>
        <button class="button-primary" id="apply-caption-editor"><?php _e( 'apply changes', 'cnhk-ss' ); ?></button>
    </div>
</div>
<?php
$after = ob_get_clean();

$options = array(
    'fontSize' => '24',
    'allowFullScreen' => true,
    'alwaysFullScreen' => true,
    'afterEditor' => $after,
);
?>
<div id="caption-editor-wrap" style="display:none;">
    <?php cnhk_editor( $options, '', 'captions' ); ?>
</div>
