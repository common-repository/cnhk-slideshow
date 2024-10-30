<div class="wrap">
<?php
$tabs = array(
    'ss' => array(
        'title' => __( 'Slide transitions', 'cnhk-ss' ),
        'file' => CNHK_PATH . 'admin/views/fx-builder-slides.php',
    ),
    'ca' => array(
        'title' => __( 'Caption Effects', 'cnhk-ss' ),
        'file' => CNHK_PATH . 'admin/views/fx-builder-captions.php',
    ),
);
$tabs = apply_filters( 'cnhk-builder-tabs', $tabs );
$base_url = admin_url( 'edit.php?post_type=' . CNHK_CPT . '&page=fx-builder' );
$current_tab = ( isset( $_GET['tab'] ) && array_key_exists( $_GET['tab'], $tabs ) ) ? $_GET['tab'] : 'ss';

?>
    <h2 class="nav-tab-wrapper">
    <?php _e( 'Effect builder', 'cnhk-ss' ); ?><br /><br />
    <?php foreach ( $tabs as $tab_slug => $tab ) : ?>
    <a href="<?php echo esc_url( $base_url . '&tab=' . $tab_slug ); ?>" class="nav-tab<?php if ( $current_tab == $tab_slug ) echo ' nav-tab-active'; ?>"><?php echo $tab['title']; ?></a>
    <?php endforeach; ?>
    </h2>
    <?php
        $notice = get_transient( 'cnhk-admin-notice' );
        if ( $notice ) {
            delete_transient( 'cnhk-admin-notice' );
            ?>
            <div class="<?php echo $notice['css']; ?>">
                <span class="screen-reader-text"><?php _e( 'Dismiss this notice.', 'cnhk-ss' ); ?></span>
                <i class="cnhk-notice-dismiss dashicons dashicons-no"></i>
                <p><?php echo $notice['msg'] ?></p>
            </div>
            <?php
        }
    ?>
    <?php cnhk_fx_picker_markup(); ?>
    <?php cnhk_fx_saver_markup(); ?>
    <div id="wrap-<?php echo $current_tab ?>">
    <form method="post" id="cnhk-builder-form">
        <input type="hidden" name="cnhk-form-name" value="cnhk-builder" />
        <input type="hidden" name="nonce" value="<?php echo $this->nonce['cnhk-builder']; ?>" />
        <?php include $tabs[$current_tab]['file']; ?>
    </div>
    </form>
</div>