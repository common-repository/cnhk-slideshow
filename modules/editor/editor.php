<?php
/**
 *  @module: editor
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 *  print the markup for the RTE editor
 */
function cnhk_editor( $options = array(), $content = '', $id = '' ) {
    $default_options = array(
        'inputName' => '',
        'fontSize' => '16',
        'allowFullScreen' => false,
        'alwaysFullScreen' => false,
        'afterEditor' => false,
        'beforeEditor' => false,
    );
    $_options = $options + $default_options;
?>
<div class="cnhk-editor-wrap">
    <div class="tabs cnhk-editor" style="border:none;">
    <?php if ( ! empty( $_options['beforeEditor'] ) ) echo $_options['beforeEditor']; ?>
        <ul style="border-bottom-right-radius:0;border-bottom-left-radius:0;">
            <li><a href="#tab-visual-<?php echo $id; ?>"><?php _e( 'visual', 'cnhk-ss' ); ?></a></li>
            <li><a href="#tab-html-<?php echo $id; ?>">html</a></li>
        </ul>
        <div id="tab-visual-<?php echo $id; ?>" class="tab-visual">
            <div class="cnhk-editor-toolbar">
                <div class="editor-btn disabled" data-fn="undo">
                    <i class="dashicons dashicons-undo"></i>
                    <div class="btn-tip"><?php _e( 'Undo', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn disabled" data-fn="redo">
                    <i class="dashicons dashicons-redo"></i>
                    <div class="btn-tip"><?php _e( 'Redo', 'cnhk-ss' ); ?></div>
                </div>
                |
                <div class="editor-btn" data-fn="bold" data-fn2="removeBold">
                    <i class="dashicons dashicons-editor-bold"></i>
                    <div class="btn-tip"><?php _e( 'Bold', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn="underline" data-fn2="removeUnderline">
                    <i class="dashicons dashicons-editor-underline"></i>
                    <div class="btn-tip"><?php _e( 'Underline', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn="italic" data-fn2="removeItalic">
                    <i class="dashicons dashicons-editor-italic"></i>
                    <div class="btn-tip"><?php _e( 'Italic', 'cnhk-ss' ); ?></div>
                </div>
                |
                <select class="font-size" style="height: 22px;padding: 0 3px;">
                    <option value=""><?php _e( 'font size', 'cnhk-ss' ); ?></option>
                    <?php foreach ( cnhk_ss::font_sizes() as $i ) : ?>
                    <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
                    <?php endforeach; ?>
                </select>
                |
                <div class="editor-btn" data-fn3="text-align" data-param="left">
                    <i class="dashicons dashicons-editor-alignleft"></i>
                    <div class="btn-tip"><?php _e( 'Align left', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="text-align" data-param="center">
                    <i class="dashicons dashicons-editor-aligncenter"></i>
                    <div class="btn-tip"><?php _e( 'Align center', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="text-align" data-param="right">
                    <i class="dashicons dashicons-editor-alignright"></i>
                    <div class="btn-tip"><?php _e( 'Align right', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="text-align" data-param="justify">
                    <i class="dashicons dashicons-editor-justify"></i>
                    <div class="btn-tip"><?php _e( 'Justify', 'cnhk-ss' ); ?></div>
                </div>
                |
                <div class="editor-btn" data-fn="makeUnorderedList" data-fn2="removeList">
                    <i class="dashicons dashicons-editor-ul"></i>
                    <div class="btn-tip"><?php _e( 'List', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn="makeOrderedList" data-fn2="removeList">
                    <i class="dashicons dashicons-editor-ol"></i>
                    <div class="btn-tip"><?php _e( 'Ordered list', 'cnhk-ss' ); ?></div>
                </div>
                |
                <div class="editor-btn" data-fn3="media-lib">
                    <i class="dashicons dashicons-format-image"></i>
                    <div class="btn-tip"><?php _e( 'Insert image', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="faw">
                    <i class="dashicons dashicons-info"></i>
                    <div class="btn-tip"><?php _e( 'Insert icon', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="link">
                    <i class="dashicons dashicons-admin-links"></i>
                    <div class="btn-tip"><?php _e( 'Insert link', 'cnhk-ss' ); ?></div>
                </div>
                <div class="editor-btn" data-fn3="unlink">
                    <i class="dashicons dashicons-editor-unlink"></i>
                    <div class="btn-tip"><?php _e( 'Remove link', 'cnhk-ss' ); ?></div>
                </div>
                <?php if ( $_options['allowFullScreen'] && ! $_options['alwaysFullScreen'] ) : ?>
                |
                <div class="editor-btn" data-fn3="expand-contract">
                    <i class="dashicons dashicons-editor-expand"></i>
                    <div class="btn-tip"><?php _e( 'Expand', 'cnhk-ss' ); ?></div>
                </div>
                <?php endif; ?>
            </div>
            <iframe class="cnhk-editor-visual" id="cnhk-editor-visual-<?php echo $id; ?>" src="<?php echo esc_url( CNHK_URL . 'lib/squire/document.html' ); ?>"></iframe>
        </div>
        <div id="tab-html-<?php echo $id; ?>" class="tab-html">
            <textarea class="cnhk-editor-html"
                <?php if ( ! empty( $_options['inputName'] ) ) echo 'name="' . $_options['inputName'] . '"'; ?>
                id="cnhk-editor-html-<?php echo $id; ?>"
                class="cnhk-editor-html"><?php echo $content; ?></textarea>
        </div>
    <?php if ( ! empty( $_options['afterEditor'] ) ) echo $_options['afterEditor']; ?>
    </div>
</div>
<?php
}

// enqueue all RTE editor related scripts and styles
function cnhk_editor_scripts() {
    // Enqueue media library related files
    wp_enqueue_media();
    
    // use minified scripts
    $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
    
    // CSS
    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_style( 'cnhk-editor', CNHK_URL . 'modules/editor/css/editor.css', array(), CNHK_VERSION );
    wp_enqueue_style( 'cnhk-editor-image', CNHK_URL . 'modules/editor/css/editor-image.css', array(), CNHK_VERSION );
    wp_enqueue_style( 'cnhk-editor-icon', CNHK_URL . 'modules/editor/css/editor-icon.css', array(), CNHK_VERSION );
    wp_enqueue_style( 'cnhk-editor-link', CNHK_URL . 'modules/editor/css/editor-link.css', array(), CNHK_VERSION );
    wp_enqueue_style( 'cnhk-fa', CNHK_URL . 'lib/font-awesome/css/font-awesome.min.css', array(), '4.3' );
    
    // JS
    wp_enqueue_script(
        'squire',
        CNHK_URL . 'lib/squire/squire.js',
        array(),
        CNHK_VERSION
    );
    
    wp_enqueue_script(
        'cnhk-overlay',
        CNHK_URL . 'modules/overlay/overlay' . $mini . '.js',
        array( 'jquery' ),
        CNHK_VERSION
    );
    
    $image_locale = array(
        'overlayTitle' => __( 'Image size and alignment', 'cnhk-ss' ),
    );
    wp_register_script( 
        'cnhk-editor-image',
        CNHK_URL . 'modules/editor/js/editor-image' . $mini . '.js',
        array( 'jquery', 'cnhk-overlay' ),
        CNHK_VERSION
    );
    wp_localize_script( 'cnhk-editor-image', 'cnhkEditorImageLocale', $image_locale );
    wp_enqueue_script( 'cnhk-editor-image' );
    
    $icon_locale = array(
        'overlayTitle' => __( 'Select an icon', 'cnhk-ss' ),
    );
    wp_register_script( 
        'cnhk-editor-icon',
        CNHK_URL . 'modules/editor/js/editor-icon' . $mini . '.js',
        array( 'jquery', 'cnhk-overlay' ),
        CNHK_VERSION
    );
    wp_localize_script( 'cnhk-editor-icon', 'cnhkEditorIconLocale', $icon_locale );
    wp_enqueue_script( 'cnhk-editor-icon' );
    
    $link_locale = array(
        'overlayTitle' => __( 'Links', 'cnhk-ss' ),
    );
    wp_register_script( 
        'cnhk-editor-link',
        CNHK_URL . 'modules/editor/js/editor-link' . $mini . '.js',
        array( 'jquery', 'cnhk-overlay' ),
        CNHK_VERSION
    );
    wp_localize_script( 'cnhk-editor-link', 'cnhkEditorLinkLocale', $link_locale );
    wp_enqueue_script( 'cnhk-editor-link' );
    
    $media_locale = array(
        'insert' => __( 'insert', 'cnhk-ss' ),
        'selectImage' => __( 'select an image', 'cnhk-ss' ),
    );
    wp_register_script( 
        'cnhk-editor-media',
        CNHK_URL . 'modules/editor/js/editor-media.js',
        array( 'jquery' ),
        CNHK_VERSION
    );
    wp_localize_script( 'cnhk-editor-media', 'cnhkEditorMediaLocale', $media_locale );
    wp_enqueue_script( 'cnhk-editor-media' );
    
    wp_register_script(
        'cnhk-editor',
        CNHK_URL . 'modules/editor/js/editor' . $mini . '.js',
        array(
            'wp-color-picker',
            'jquery-ui-tabs',
            'jquery-ui-slider',
            'cnhk-editor-image',
            'cnhk-editor-image',
            'cnhk-editor-icon',
            'cnhk-editor-link',
            'cnhk-editor-media',
            'squire',
        ),
        CNHK_VERSION
    );
    $editor_locale = array(
        'expand' => __( 'Expand', 'cnhk-ss' ),
        'contract' => __( 'Contract', 'cnhk-ss' ),
    );
    wp_localize_script( 'cnhk-editor', 'cnhkEditorLocale', $editor_locale );
    wp_enqueue_script( 'cnhk-editor' );
    
}

if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
    require_once CNHK_PATH . 'modules/editor/editor-ajax.php';
}