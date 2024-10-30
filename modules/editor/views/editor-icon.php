<?php
$raw_icons = file_get_contents( CNHK_PATH . 'admin/assets/json/fa.json' );
$icons = json_decode( $raw_icons, true );
?>
<div id="icons-all">
    <div id="main-wrap">
        <div id="icon-filter">
            <label><?php _e( 'Search icon', 'cnhk-ss' ); ?>
                <input id="icon-filter-input" style="width: 15em;" />
            </label>
        </div>
        <div id="icons-list">
        <?php foreach( $icons as $key => $value ) : ?>
            <div class="icon-block" data-key="<?php echo $key; ?>" data-val="<?php echo $value; ?>">
                <i class="fa <?php echo $key; ?>"></i>
                <span class="icon-name"><?php echo $value; ?></span>
            </div>
        <?php endforeach; ?>
        <p id="no-icon-found" style="display:none;"><?php _e('No icon found', 'cnhk-ss' ); ?></p>
        </div>
    </div>
</div>
<div id="icon-preview">
    <div id="preview-wrap">
        <p id="no-icon-selected"><?php _e( 'No icon selected', 'cnhk-ss' ); ?></p>
        <p id="icon-zone"></p>
    </div>
    <div id="icon-com">
        <label><b><?php _e( 'Size', 'cnhk-ss' ); ?></b>:</label>
        <input type="number" class="cnhk-number" id="icon-size" value="" />
        <p class="description"><?php _e( 'icon size in pixels', 'cnhk-ss' ); ?></p>
    </div>
</div>
<div id="insert-icon-div">
    <button id="insert-icon" class="button button-primary" disabled="disabled"><?php _e( 'insert', 'cnhk-ss' ); ?></button>
    <button id="remove-icon" class="button button-secondary" style="display:none;" ><?php _e( 'delete icon', 'cnhk-ss' ); ?></button>
    <button id="apply-icon" class="button button-primary" style="display:none;" ><?php _e( 'apply', 'cnhk-ss' ); ?></button>
</div>
