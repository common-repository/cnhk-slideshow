<?php
echo '<input type="hidden" name="form-tab" value="general" />';
$active_modules = cnhk_db::get_instance()->options( 'active_modules' );
$plugged_modules = cnhk_ss::get_instance()->get_pluggable_modules();

$args = array(
    'post_type' => CNHK_CPT,
    'post_status' => 'any',
    'posts_per_page' => -1,
);
$posts = get_posts( $args );

$used_modules = array();
foreach ( $plugged_modules as $slug => $module ) {
    $used_modules[ $slug ] = call_user_func( $module['is_used'], $posts );
}

?>
<h4><?php _e( 'Disable unused modules to avoid unnecessary processing.', 'cnhk-ss' ); ?></h4>
<table class="widefat">
    <thead>
        <tr>
            <th><?php _e( 'Active', 'cnhk-ss' ); ?></th>
            <th><?php _e( 'Name', 'cnhk-ss' ); ?></th>
            <th><?php _e( 'Description', 'cnhk-ss' ); ?></th>
            <th><?php _e( 'is used ( by at least one slider )', 'cnhk-ss' ); ?></th>
        </tr>
    </thead>
    <tbody>
    <?php foreach( $plugged_modules as $module ) : ?>
    <?php $alt = ( isset( $alt ) && $alt == 'alternate' )? $alt = '' : 'alternate'; ?>
    <?php $disabled = ( in_array( $module['slug'], $active_modules ) && $used_modules[ $module['slug'] ] )? ' disabled="disabled"' : ''; ?>
        <tr class="<?php echo $alt; ?>">
            <td>
                <input <?php echo $disabled; ?> type="checkbox"class="plugged-module" name="module-checkbox[]" value="<?php echo $module['slug'] ?>" <?php checked( in_array( $module['slug'], $active_modules ) ); ?> />
                <?php if ( in_array( $module['slug'], $active_modules ) ) : ?>
                <input type="hidden" name="modules[]" value="<?php echo $module['slug'] ?>" />
                <?php endif; ?>
            </td>
            <td><?php echo $module['name']; ?></td>
            <td><?php echo $module['desc']; ?></td>
            <td><?php echo ( $used_modules[ $module['slug'] ] )? __( 'yes', 'cnhk-ss' ) : __( 'no', 'cnhk-ss' ); ?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
<p class="submit">
    <input type="submit" name="submit" value="<?php _e( 'Save changes', 'cnhk-ss'); ?>" class="button button-primary" />
</p>
