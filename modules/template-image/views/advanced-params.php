<div class="form-field">
    <label for="options-_FillMode"><?php _e( 'Fill Mode', 'cnhk-ss'); ?></label>
    <select id="options-_FillMode" name="options[_FillMode]" class="with-tip">
        <?php foreach( $this->FillMode as $mode ) : ?>
        <option value="<?php echo $mode['value']; ?>"
            <?php selected( $this->data['options']['$FillMode'], $mode['value'] ); ?>
            data-tip="<?php echo '<b>' . esc_attr( $mode['readable'] . '</b>: ' . $mode['desc'] ); ?>"
        ><?php echo $mode['readable'] ?>
        </option>
        <?php endforeach; ?>
    </select>
    <p class="desc">
        <?php _e( 'The way images will fill slide. This applies to image slides but also to background image of HTML slides.', 'cnhk-ss' );?><br /><br />
        <i class="dashicons dashicons-info"></i>
        <span class="select-tip"><?php echo '<b>' . $this->FillMode[$this->data['options']['$FillMode']]['readable'] . '</b>: ' . $this->FillMode[$this->data['options']['$FillMode']]['desc']; ?></span>
    </p>
    <hr />
</div>
<div class="form-field">
    <label>
        <input type="checkbox" name="options[_AutoPlay]" id="options-_AutoPlay" value="1" <?php checked( $this->data['options']['$AutoPlay'] );?> />
        &nbsp;<?php _e( 'Auto play', 'cnhk-ss' ); ?>
    </label>
    <p class="desc"><?php _e( 'If unchecked, transition happens only following a manual action', 'cnhk-ss' ); ?></p>
    <hr />
</div>
<div class="form-field">
    <label for="options-_PauseOnHover"><?php _e( 'Pause on hover', 'cnhk-ss'); ?></label>
    <select id="options-_PauseOnHover" name="options[_PauseOnHover]" class="with-tip">
        <?php foreach( $this->PauseOnHover as $mode ) : ?>
        <option value="<?php echo $mode['value']; ?>"
            <?php selected( $this->data['options']['$PauseOnHover'], $mode['value'] ); ?>
            data-tip="<?php echo '<b>' . esc_attr( $mode['readable'] . '</b>: ' . $mode['desc'] ); ?>"
        ><?php echo $mode['readable'] ?>
        </option>
        <?php endforeach; ?>
    </select>
    <p class="desc">
        <?php _e( 'Pause slider on mouse over if auto play is enabled', 'cnhk-ss' );?><br /><br />
        <i class="dashicons dashicons-info"></i>
        <span class="select-tip"><?php echo '<b>' . $this->PauseOnHover[$this->data['options']['$PauseOnHover']]['readable'] . '</b>: ' . $this->PauseOnHover[$this->data['options']['$PauseOnHover']]['desc']; ?></span>
    </p>
    <hr />
</div>
<div class="form-field">
    <label for="options-_PlayOrientation"><?php _e( 'Play orientation', 'cnhk-ss'); ?></label>
    <select id="options-_PlayOrientation" name="options[_PlayOrientation]">
        <?php foreach( $this->PlayOrientation as $mode ) : ?>
        <option value="<?php echo $mode['value']; ?>" <?php selected( $this->data['options']['$PlayOrientation'], $mode['value'] ); ?>>
            <?php echo $mode['readable'] ?>
        </option>
        <?php endforeach; ?>
    </select>
    <p class="desc">
        <?php _e( 'Slider playing orientation', 'cnhk-ss' );?>
    </p>
    <hr />
</div>