<?php
/**
 *  @module: fonts
 */
class cnhk_fonts
{
    private static $instance = null;
    
    private function __construct() {
        add_filter( 'cnhk-settings-tabs', array( $this, 'settings_tab' ) );
        add_filter( 'cnhk-settings-scripts', array( $this, 'enqueue_script' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_style' ) );
        add_action( 'cnhk-postnew-styles', array( $this, 'postnew' ) );
    }
    
    // enqueue style on slider edit page
    public function postnew( $scripts ) {
        $fonts = cnhk_db::get_instance()->options( 'fonts' );
        foreach ( $fonts as $value ) {
            if ( ! isset( $value['admin'] ) ) continue;
            $clean_fam = str_replace( ' ', '_', $value['family'] );
            $clean_url = 'https://fonts.googleapis.com/css?family=' . $value['url'];
            $scripts[ 'cnhk-fonts-' . $clean_fam ] = array( 
                'url' => $clean_url,
                'version' => null,
            );
        }
        return $scripts;
    }
    
    // enqueue styles on front end
    public function enqueue_style() {
        $fonts = cnhk_db::get_instance()->options( 'fonts' );
        foreach ( $fonts as $value ) {
            if ( ! isset( $value['front'] ) ) continue;
            $clean_fam = str_replace( ' ', '_', $value['family'] );
            $clean_url = 'https://fonts.googleapis.com/css?family=' . $value['url'];
            wp_enqueue_style( 'cnhk-fonts-' . $clean_fam, $clean_url );
        }
    }
    
    // enqueue scrips on settings page
    public function enqueue_script( $scripts ) {
        $fonts_locale = array(
            'noFont' => __( 'No Google Font found', 'cnhk-ss' ),
            'fontFamily' => __( 'Font Family', 'cnhk-ss' ),
            'noMoreFont' => __( 'no more font', 'cnhk-ss' ),
        );
        $scripts['cnhk-fonts-admin'] = array(
            'url' => CNHK_URL . 'modules/fonts/js/admin-fonts.js',
            'dep' => array( 'jquery' ),
            'version' => CNHK_VERSION,
            'locale' => 'cnhkFontsLocale',
            'translations' => $fonts_locale,
        );
        return $scripts;
    }
    
    // add tab on settings page
    public function settings_tab( $tabs ) {
        $tabs['font'] = array(
            'title' => __( 'Google Fonts', 'cnhk-ss' ),
            'file' => CNHK_PATH . 'modules/fonts/views/settings.php',
        );
        return $tabs;
    }
    
    // return the unique instance
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
cnhk_fonts::get_instance();
