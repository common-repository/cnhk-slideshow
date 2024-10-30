<?php
/**
 *  @module: slide-image
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

// register slide type
require_once CNHK_PATH . 'modules/slide-image/class-slide-image.php';
function cnhk_slide_image( $slides ) {
    $slides['image'] = cnhk_slide_image::get_instance();
    return $slides;
}
add_filter( 'cnhk-slide-list', 'cnhk_slide_image' );

// print script on new/edit slider page
function cnhk_slide_image_postnew_js ( $scripts ) {
    $postnew_translations = array(
        'selectImage' => __( 'Select one image', 'cnhk-ss' ),
        'useImage' => __( 'use this image', 'cnhk-ss' ),
        'invalidFileType' => __( 'invalid file extension', 'cnhk-ss' ),
    );
    $scripts['cnhk-postnew-slide-image'] = array(
        'url' => CNHK_URL . 'modules/slide-image/js/post-new.js',
        'dep' => array( 'jquery', 'jquery-ui-sortable', 'jquery-ui-accordion' ),
        'version' => CNHK_VERSION,
        'locale' => 'SlideImageLocale',
        'translations' => $postnew_translations,
    );
    $scripts['cnhk-slide-handler-image'] = array(
        'url' => CNHK_URL . 'modules/slide-image/js/slide-handler.js',
        'dep' => array( 'jquery' ),
        'version' => CNHK_VERSION,
    );
    return $scripts;
}
add_filter( 'cnhk-postnew-scripts', 'cnhk_slide_image_postnew_js' );
