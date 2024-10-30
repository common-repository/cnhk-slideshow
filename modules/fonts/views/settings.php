<?php
    $gfont_url = 'https://www.google.com/fonts';
    $fonts = cnhk_db::get_instance()->options( 'fonts' );
?>
<input type="hidden" name="form-tab" value="fonts" />
<div class="wrap nosubsub">
    <div id="col-container">
        <div id="col-right">
            <div class="col-wrap">
                <h3><?php _e( 'Available Google Fonts', 'cnhk-ss' ); ?></h3>
                <table class="widefat fixed">
                    <thead>
                        <th><?php _e( 'Name', 'cnhk-ss' ); ?></th>
                        <th><?php _e( 'Font Family Name', 'cnhk-ss' ); ?></th>
                        <th><?php _e( 'Include in admin', 'cnhk-ss' ); ?></th>
                        <th><?php _e( 'Include in front end', 'cnhk-ss' ); ?></th>
                    </thead>
                    <tbody>
                    <?php if ( empty( $fonts ) ) : ?>
                        <tr class="alternate"><td colspan="4" style="text-align:center;"><em><?php _e( 'no saved font yet', 'cnhk-ss' ); ?></em></td></tr>
                    <?php else : $alt = ''; ?>
                        <?php foreach ( $fonts as $name => $value ) : $alt = ( ' alternate' == $alt )? '' : ' alternate'; ?>
                        <tr class="<?php echo $alt; ?>">
                            <input type="hidden" name="font-name[]" value="<?php echo rawurlencode( $name ); ?>" />
                            <input type="hidden" name="font-family[]" value="<?php echo rawurlencode( $value['family'] ); ?>" />
                            <input type="hidden" name="font-url[]" value="<?php echo rawurlencode( $value['url'] ); ?>" />
                            <td>
                                <?php echo $name; ?>
                                <div class="row-actions">
                                    <span class="delete"><a href="#"><?php _e( 'delete', 'cnhk-ss' ); ?></a></span>
                                </div>
                            </td>
                            <td>
                                <?php echo $value['family']; ?>
                                <div class="row-actions"><code style="color:#444;"><?php echo $value['url']; ?></code></div>
                            </td>
                            <td>
                                <?php $in_admin = ( isset( $value['admin'] ) )?  true : false; ?>
                                <input type="checkbox" name="font-admin[]" value="<?php echo rawurlencode( $name ); ?>" <?php checked( $in_admin ); ?> />&nbsp;&nbsp;
                                <strong><?php echo ( $in_admin )? __( 'yes', 'cnhk-ss' ) : __( 'no', 'cnhk-ss' ) ; ?></strong>
                            </td>
                            <td>
                                <?php $in_front = ( isset( $value['front'] ) )?  true : false; ?>
                                <input type="checkbox" name="font-front[]" value="<?php echo rawurlencode( $name ); ?>" <?php checked( $in_front ); ?> />&nbsp;&nbsp;
                                <strong><?php echo ( $in_front )? __( 'yes', 'cnhk-ss' ) : __( 'no', 'cnhk-ss' ) ; ?></strong>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    </tbody>
                </table>
                <br />
                <p class="description"><i class="dashicons dashicons-info"></i><?php _e( 'Do not include too much Google Fonts on the front end. They impact the page load time.', 'cnhk-ss' );?></p>
                <p class="description"><i class="dashicons dashicons-info"></i><?php _e( 'Some Google Fonts might already be included by your theme in the front end. In this case, you just need to include them in admin pages.', 'cnhk-ss' );?></p>
                <hr />
                <p class="submit">
                    <input type="submit" class="button button-primary alignright" id="save-font-changes" name="save-font-changes" value="<?php echo esc_attr_e( 'Save Settings', 'cnhk-ss' ); ?>" />
                </p>
                <br class="clear">
            </div>
        </div>
        <div id="col-left">
            <div class="col-wrap">
                <h3><?php _e( 'Add New Google Font', 'cnhk-ss' ); ?></h3>
                <div class="form-field">
                    <label><?php _e( 'Font code', 'cnhk-ss' ); ?></label>
                    <textarea id="new-font-pastecode" rows="10" style="resize:none;width:100%;"></textarea>
                    <p class="description"><?php _e( 'Paste the code from ', 'cnhk-ss' ); ?><a href="<?php echo $gfont_url; ?>" target="_blank">Google Fonts</a><?php _e( ' in this field', 'cnhk-ss' ); ?></p>
                    
                    <button class="button-secondary" id="parse-new-font"><?php _e( 'parse code', 'cnhk-ss' ); ?></button>
                    <br />
                    <p id="parse-result" style="min-height:1em;"></p>
                </div>
                <div class="form-field">
                    <label><?php _e( 'Font Name (administration)', 'cnhk-ss' ); ?></label>
                    <input type="text" id="new-font-name" name="new-font-name" value="" />
                    <input type="hidden" id="new-font-url" name="new-font-url" value="" />
                    <input type="hidden" id="new-font-family" name="new-font-family" value="" />
                    <p class="description"><?php _e( 'The name for administration. Not necessarily the font family name from Google.', 'cnhk-ss' ); ?></p>
                </div>
                <hr />
                <p class="submit"><input type="submit" id="save-new-font" class="button-primary" name="save-new-font" value="<?php echo esc_attr_e( 'Add New Font', 'cnhk-ss' ); ?>" /></p>
            </div>
        </div>
    </div>
</div>
