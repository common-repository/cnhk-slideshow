<?php
/**
 *  admin panel main class
 */
class cnhk_admin{
    
    // associative array of nonce used in admin panel
	private $nonce = array();
    
    // the unique instance of the class
	protected static $instance = null;

	private function __construct() {
		add_action( 'add_meta_boxes_' . CNHK_CPT, array( $this, 'meta_boxes_action' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_print_scripts', array( $this, 'print_scripts' ) );
		add_action( 'admin_print_scripts', array( $this, 'priority_print_scripts' ), 5, 1 );
		add_action( 'wp_loaded', array( $this, 'wp_loaded' ) );
		add_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
		add_filter( 'manage_' . CNHK_CPT . '_posts_columns', array( $this, 'set_admin_columns' ) );
		add_action( 'manage_' . CNHK_CPT . '_posts_custom_column', array( $this, 'admin_columns' ), 10, 2 );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}
    
	/**	
	 * enqueue all hooked styling files
     *
     * @param [string] $hook_name, the name of the hook to apply
     * @param [array] $default_style, array of stylesheet
	 */
	private function style_filter( $hook_name, $default_style ) {
		$styles = apply_filters( $hook_name, $default_style );
		
		foreach ( $styles as $hndle => $value ) {
			if ( empty( $hndle ) ) continue;
			if ( empty( $value ) ) {
				wp_enqueue_style( $hndle );
				continue;
			}
			if ( ! isset( $value['dep'] ) || empty( $value['dep'] ) ) $value['dep'] = array();
			
			if ( ! isset( $value['version'] ) || empty( $value['version'] ) ) $value['version'] = null;
			
			wp_enqueue_style( $hndle, $value['url'], $value['dep'], $value['version'] );		
		}
	}

	/**
	 *  equivalent as above but for scripts
	 */
	private function script_filter( $hook_name, $default_script ) {
		$scripts = apply_filters( $hook_name, $default_script );
		foreach ( $scripts as $hndle => $value ) {
			if ( empty( $hndle ) ) continue;
			if ( empty( $value ) ) {
				wp_enqueue_script( $hndle );
				continue;
			}
			if ( ! isset( $value['dep'] ) || empty( $value['dep'] ) ) $value['dep'] = array();
			if ( ! isset( $value['version'] ) || empty( $value['version'] ) ) $value['version'] = null;
            if ( isset( $value['locale'] ) && isset( $value['translations'] ) && is_array( $value['translations'] ) ) {
                wp_register_script( $hndle, $value['url'], $value['dep'], $value['version'] );
                wp_localize_script( $hndle, $value['locale'], $value['translations'] );
                wp_enqueue_script( $hndle );
            } else {
                wp_enqueue_script( $hndle, $value['url'], $value['dep'], $value['version'] );
            }
		}
	}
    
    /**
     *  strip (base64_encode) html string in order to be correctly serializable
     *  
     *  @param [array] $data, associative array, part of $_POST
     *  @param [array] $data, the cleaned data
     */
    private function strip_html( $data ) {
        $result = array();
        if ( ! is_array( $data ) ) return false;
        foreach ( $data as $key => $value ) {
            $_val; 
            if ( 'html' == $key ) {
                $_val = base64_encode( $value );
            } elseif ( is_array( $value ) ) {
                $_val = $this->strip_html( $value );
            } else {
                $_val = $value;
            }
            $result[$key] = $_val;
        }
        return $result;
    }
    
    /**
     *  reformat key of associative array data
     *  
     *  @param [array] $data the array to be cleaned
     *  @return [array] $result, the cleaned array
     */
    private function reformat_post_data( $data ) {
        $result = array();
        if ( ! is_array( $data ) ) return false;
        foreach ( $data as $key => $value ) {
            $_val;
            $_key;
            $_key = str_replace( '_', '$', $key );
            if ( is_array( $value ) ) {
                $_val = $this->reformat_post_data( $value );
            } else {
                $_val = $value;
            }
            $result[$_key] = $_val;
        }
        return $result;
    }
    
	/**
	 *  create admin pages and menu items
	 */
	public function admin_menu() {
		global $cnhk_admin;
		$cnhk_admin['settings_page'] = add_submenu_page(
			'edit.php?post_type=' . CNHK_CPT,
            __( 'Settings', 'cnhk-ss' ),
			__( 'Settings', 'cnhk-ss' ),
			'manage_options',
			'settings',
			array( $this, 'settings_cb' )
        );
        
		$cnhk_admin['builder_page'] = add_submenu_page(
			'edit.php?post_type=' . CNHK_CPT,
            __( 'Effect Builder', 'cnhk-ss' ),
			__( 'Effect Builder', 'cnhk-ss' ),
			'manage_options',
			'fx-builder',
			array( $this, 'fx_builder_cb' )
        );
    }

	/**
	 *  settings page callback
	 */
	public function settings_cb() {
		require_once( CNHK_PATH . 'admin/views/settings.php' );
	}
    
	/**
	 *  effect builder page callback
	 */
	public function fx_builder_cb() {
		require_once( CNHK_PATH . 'admin/views/fx-builder.php' );
	}

	/**
	 * add custom columns to slider CPT list page
     *
     * @param [array] $columns, array of column slug in the page
     * @return [array] $columns, the modified array
	 */
	public function set_admin_columns( $columns ) {
		$columns['slider_type'] = __( 'Slider template', 'cnhk-ss' );
		$columns['template_tag'] = __( 'Template Tag', 'cnhk-ss' );
		$columns['code'] = __( 'Shortcode', 'cnhk-ss' );
		$date = $columns['date'];
		unset( $columns['date'] );
		$columns['date'] = $date;
		return $columns;
	}

	/**
	 * creates the content of our custom columns
     *
     * @param [string] $column, the slug of the current column
     * @param [int] $post_id, the current post ID
	 */
	public function admin_columns( $column, $post_id ) {
        $the_post = get_post( $post_id );
        $the_post_array = unserialize( $the_post->post_content );
		switch ( $column ) {
			case 'slider_type' :
                $th = cnhk_ss::get_instance()->get_template_handler_by( 'slug', $the_post_array['template'] );
                if ( $th ) {
                    ?><strong><?php echo $th->name; ?></strong><?php
                } else {
                    _e( 'unknown template', 'cnhk-ss' );
                    echo ' ( <code>' . $the_post_array['template'] . '</code> )';
                }
                break;
			case 'template_tag' :
                echo '<code style="font-size:0.9em;"> &lt;?php if ( function_exists( "cnhk_slideshow" ) cnhk_slideshow( ' . $post_id . ' ); ?&gt; </code>';
				break;
			case 'code' :
				echo '<code> [cnhk_slideshow id=' . $post_id . '] </code><br />';
				break;
		}
	}
	
	/**	
	 * save slider post's data
     *
     * @param [int] $ID, the post ID
	 */
	public function save_post( $ID ) {
        if ( isset( $_POST['new-template'] ) ) {
            if ( isset( $_POST['duplicate-slider'] ) ) {
                // creating a new slider from another one
                $_post = get_post( $ID );
                $org = get_post( intval( $_POST['original-slider'] ) );
                $_post->post_content = $org->post_content;
                remove_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
                wp_update_post( $_post );
                add_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
            } else {
                // At this point a new slider is created, so put default value in post content
                $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'slug', $_POST['new-template'] );
                if ( $hndle ) {
                    $_post = get_post( $ID );
                    $_post->post_content = $hndle->get_default_data( true );
                    remove_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
                    wp_update_post( $_post );
                    add_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
                }
            }
            
        } elseif ( isset( $_POST['options']['w'] ) ) {
            
            // normal post saving
            $_post = get_post( $ID );
            $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'data', $_post->post_content );
            if ( $hndle ) {
                $data = array();
                
                $_slides = wp_unslash( $_POST['slides'] );
                
                $_options = wp_unslash( $_POST['options'] );
                $_navs = ( isset( $_POST['navs'] ) )? wp_unslash( $_POST['navs'] ) : null;
                $data['template'] = $_POST['template'];
                
                $data['slides'] = $this->strip_html( $_slides );
                $data['options'] = $this->reformat_post_data( $_options );
                if ( $_navs ) {
                    $data['navs'] = $this->reformat_post_data( $_navs );
                }
                
                $default_data = $hndle->get_default_data();
                
                // deals with boolean values (check boxes) of template options data
                foreach ( $default_data['options'] as $key => $value ) {
                    if ( is_bool( $value ) ) {
                        if ( isset( $data['options'][ $key ] ) ) {
                            $data['options'][ $key ] = true;
                        } else {
                            $data['options'][ $key ] = false;
                        }
                    }
                }
                
                $_post->post_content = serialize( $data );
                remove_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
                wp_update_post( $_post );
                add_action( 'save_post_' . CNHK_CPT, array( $this, 'save_post' ) );
            }
            
        }
	}
    
	/**
	 * catching form submission
	 */
	public function wp_loaded() {
		if ( isset( $_POST['cnhk-form-name'] ) ) {
			if ( false !== wp_verify_nonce( $_POST['nonce'], stripslashes( $_POST['cnhk-form-name'] ) ) ) {
				$go = $this->form_treatment( stripslashes( $_POST['cnhk-form-name'] ) );
                $this->refresh_page( $go );
			}
        }
        $this->nonce = array(
            'cnhk-settings' => wp_create_nonce( 'cnhk-settings' ),
            'cnhk-builder' => wp_create_nonce( 'cnhk-builder' ),
        );
	}
    
	/**	
	 * submitted form processing
     *
     * @param [string] $form_name, the form name submitted in $_POST['cnhk-form-name']
     * @return [mixed], the url for redirecting or NULL or any empty value to load the same page
	 */
	private function form_treatment( $form_name ) {
		switch( $form_name ) {
			case 'cnhk-settings' :
            
                // settings page
                
                $tab = ( isset( $_POST['form-tab'] ) )? stripslashes( $_POST['form-tab'] ) : '';
                switch ( $tab ) {
                    case 'general' :
                        if ( isset( $_POST['modules'] ) ) {
                            cnhk_db::get_instance()->set_options( 'active_modules', $_POST['modules'] );
                        } else {
                            cnhk_db::get_instance()->set_options( 'active_modules', array() );
                        }
                        
                        $notice = array(
                            'css' => 'updated',
                            'msg' => __( 'Settings updated', 'cnhk-ss' ),
                        );
                        set_transient( 'cnhk-admin-notice', $notice );
                        break;
                    case 'fonts' :
                        if ( isset( $_POST['save-new-font'] ) ) {
                            $db = cnhk_db::get_instance();
                            $fonts = $db->options( 'fonts' );
                            $fonts[ $_POST['new-font-name'] ] = array(
                                'name' => $_POST['new-font-name'],
                                'url' => $_POST['new-font-url'],
                                'family' => $_POST['new-font-family'],
                            );
                            $db->set_options( 'fonts', $fonts );
                            $notice = array(
                                'css' => 'updated',
                                'msg' => __( 'Font added', 'cnhk-ss' ),
                            );
                            set_transient( 'cnhk-admin-notice', $notice );
                        } elseif ( isset( $_POST['save-font-changes'] ) ) {
                            $fonts = array();
                            foreach ( $_POST['font-name'] as $index => $enc_name ) {
                                $fonts[rawurldecode( $enc_name )]['family'] = rawurldecode( $_POST['font-family'][$index] );
                                $fonts[rawurldecode( $enc_name )]['name'] = rawurldecode( $enc_name );
                                $fonts[rawurldecode( $enc_name )]['url'] = rawurldecode( $_POST['font-url'][$index] );
                            }
                            if ( isset( $_POST['font-admin'] ) ) {
                                foreach ( $_POST['font-admin'] as $enc_name ) {
                                    $fonts[rawurldecode( $enc_name )]['admin'] = '1';
                                }
                            }
                            if ( isset( $_POST['font-front'] ) ) {
                                foreach ( $_POST['font-front'] as $enc_name ) {
                                    $fonts[rawurldecode( $enc_name )]['front'] = '1';
                                }
                            }
                            cnhk_db::get_instance()->set_options( 'fonts', $fonts );
                            $notice = array(
                                'css' => 'updated',
                                'msg' => __( 'Updated', 'cnhk-ss' ),
                            );
                            set_transient( 'cnhk-admin-notice', $notice );
                        }
                        break;
                    default :
                }
				break;
            case 'cnhk-builder' :
                
                // effect builder page
                
                $code = stripslashes( $_POST['the-code'] );
                $name = stripslashes( $_POST['the-name'] );
                switch ( $_POST['code-type'] ) {
                    case 'ss':
                        $ssfx_preset = cnhk_db::get_instance()->options( 'ssfx_preset' );
                        $ssfx_preset[$name] = $code;
                        cnhk_db::get_instance()->set_options( 'ssfx_preset', $ssfx_preset );
                        $notice = array(
                            'css' => 'updated',
                            'msg' => __( 'Updated', 'cnhk-ss' ),
                        );
                        set_transient( 'cnhk-admin-notice', $notice );
                        break;
                    case 'ca' :
                        $cafx_preset = cnhk_db::get_instance()->options( 'cafx_preset' );
                        $cafx_preset[$name] = $code;
                        cnhk_db::get_instance()->set_options( 'cafx_preset', $cafx_preset );
                        $notice = array(
                            'css' => 'updated',
                            'msg' => __( 'Updated', 'cnhk-ss' ),
                        );
                        set_transient( 'cnhk-admin-notice', $notice );
                        break;
                    default:
                }
                break;
			default :
				do_action( 'cnhk-form-' . $form_name );
		}
        return;
	}
    
	/**
	 * refresh page after processing $_POST forms
     *
     * @param [mixed] $go, the url for the redirection or NULL or any empty value for a simple page refresh
	 */
	private function refresh_page( $go = null ) {
		if ( ! empty( $go ) ) {
			wp_redirect( $go );
            die();
		}
		$running = $_SERVER['PHP_SELF'];
		if ( ! empty( $_SERVER['QUERY_STRING'] ) ) {
			$running .= '?' . $_SERVER['QUERY_STRING'];
		}
		wp_redirect( site_url( $running ) );
		die();
    }
    
    /**
     *  print most needed javascript code with high priority
     */
    public function priority_print_scripts() {
        ?>
        <script type="text/javascript">
            /* <![CDATA[ */
            var cnhkAdminUrl = '<?php echo admin_url(); ?>';
            var cnhkSquireUrl = '<?php echo CNHK_URL . 'lib/squire/document.html'; ?>';
            var cnhkSlideHandler = {};
            var cnhkTemplateHandler = {};
            var cnhkCaptionHandler = {};
            var cnhkNavHandler = {};
            /* ]]> */
        </script>
        <?php
    }
    
	/**	
	 * print admin scripts in head section
     *
     * @since   1.0
	 */
	public function print_scripts() {
		global $post_type, $pagenow, $cnhk_admin, $post;
        
        // nonce used for each ajax call from admin panel
        $ajax_nonce = wp_create_nonce( 'cnhk_ajax_nonce' );
        ?>
        <script type="text/javascript">
            /* <![CDATA[ */
            var cnhkAjaxNonce = '<?php echo $ajax_nonce; ?>';
            var cnhkUrl = '<?php echo CNHK_URL; ?>';
            /* ]]> */
        </script>
        <?php
        if ( ( 'edit.php' == $pagenow ) && CNHK_CPT == $post_type ) {
            // hide the password protected field on quick edit form ( post listing page )
            ?><style type="text/css">
                .inline-edit-col-left .inline-edit-group {
                    display: none;
                }
            </style><?php
        }
        if ( ( 'post-new.php' == $pagenow || 'post.php' == $pagenow ) && CNHK_CPT == $post_type ) {
            // edit slider page
            $fonts = cnhk_ss::get_instance()->get_font_stacks();
            ?>
            <script type="text/javascript">
            /* <![CDATA[ */
            var cnhkFonts = <?php echo json_encode( $fonts ); ?>;
            /* ]]> */
            </script>
            <?php
            do_action( 'cnhk-postnew-print-scripts' );
        } elseif ( $cnhk_admin['settings_page'] == get_current_screen()->id ) {
            // settings page
            do_action( 'cnhk-settings-print-scripts' );
        } elseif ( $cnhk_admin['builder_page'] == get_current_screen()->id ) {
            // builder page
            do_action( 'cnhk-builder-print-scripts' );
        }
	}

	/**
	 * enqueue scripts/styles
     *
     * @param [string] $hook, hook to the displayed page
	 */
	public function enqueue_scripts( $hook ) {
		global $post_type, $cnhk_admin;
        
        // whether to use minified JS or not
        $mini = ( defined( 'CNHK_MINIFIED' ) && CNHK_MINIFIED )? '.min' : '';
        
        // general scripts and styles
        wp_enqueue_style( 'cnhk-general-css', CNHK_URL . 'admin/assets/css/admin-general.css', array(), CNHK_VERSION );
        wp_enqueue_style( 'cnhk-jqueryui-css', CNHK_URL . 'lib/jQuery-UI-css/jquery-ui.min.css', array(), CNHK_VERSION );
        
        // effect picker
        wp_register_script( 'cnhk-fx-picker', CNHK_URL . 'admin/assets/js/fx-picker' . $mini . '.js', array( 'jquery' ), CNHK_VERSION );
        $picker_locale = array(
            'empty' => __( 'empty', 'cnhk-ss' ),
            'deleteFx' => __( 'delete effect', 'cnhk-ss' ),
            'customCode' => __( 'custom code', 'cnhk-ss' ),
            'actionFailed' => __( 'this action failed', 'cnhk-ss' ),
        );
        wp_localize_script( 'cnhk-fx-picker', 'fxPickerLocale', $picker_locale );
        wp_enqueue_script( 'cnhk-fx-picker' );
        
        // effect saver
        wp_register_script( 'cnhk-fx-saver', CNHK_URL . 'admin/assets/js/fx-saver' . $mini . '.js', array( 'jquery' ), CNHK_VERSION );
        $saver_locale = array(
            'actionFailed' => __( 'action failed', 'cnhk-ss' ),
            'invalidCollName' => __( 'invalid collection name', 'cnhk-ss' ),
            'invalidFxName' => __( 'invalid effect name', 'cnhk-ss' ),
            'fxExists' => __( 'This name already exists in the collection. Replace it?', 'cnhk-ss' ),
        );
        wp_localize_script( 'cnhk-fx-saver', 'fxSaverLocale', $saver_locale );
        wp_enqueue_script( 'cnhk-fx-saver' );
        
        // edit/new slider page
        if ( ( 'post-new.php' == $hook || 'post.php' == $hook ) && CNHK_CPT == $post_type ) {
            // Disable autosave
            wp_dequeue_script( 'autosave' );
            
            // custom Rich Text Editor (RTE) editor
            cnhk_editor_scripts();
            
            // default CSS for new/edit slider page
            $default_style = array(
                'cnhk-post-new-css' => array(
                    'url' => CNHK_URL . 'admin/assets/css/post-new.css',
                ),
            );
            $this->style_filter( 'cnhk-postnew-styles', $default_style );
            
            $default_locale = array(
                'preview' => __( 'Preview', 'cnhk-ss' ),
            );
            
            // default script for edit/new slider page
            $default_script = array(
                'cnhk-post-new-js' => array(
                    'url' => CNHK_URL . 'admin/assets/js/post-new' . $mini . '.js',
                    'dep' => array( 'jquery', 'jquery-ui-sortable', 'jquery-ui-accordion' ),
                    'locale' => 'mainScriptLocale',
                    'translations' => $default_locale,
                    'version' => CNHK_VERSION,
                ),
            );
            
            $default_script['jssor-js'] = array(
                'url' => CNHK_URL . 'lib/jssor/jssor.slider.mini.js',
                'dep' => array(),
                'version' => CNHK_VERSION
            );
            
            $func_locale = array(
                'cancel' => __( 'cancel', 'cnhk-ss' ),
                'edited' => __( 'edited', 'cnhk-ss' ),
                'code' => __( 'Code', 'cnhk-ss' ),
                'invalidCode' => __( 'invalid code', 'cnhk-ss' ),
                'change' => __( 'Change', 'cnhk-ss' ),
                'duration' => __( 'Duration (in ms)', 'cnhk-ss' ),
                'mainDuration' => __( 'Main duration (in ms)', 'cnhk-ss' ),
                'secondaryDuration' => __( 'Secondary duration (in ms)', 'cnhk-ss' ),
            );
            
            // admin JS functions
            $default_script['cnhk-functions-js'] = array(
                'url' => CNHK_URL . 'admin/assets/js/functions' . $mini . '.js',
                'dep' => array( 'jquery', 'jssor-js' ),
                'version' => CNHK_VERSION,
                'locale' => 'cnhkLocale',
                'translations' => $func_locale,
            );
            
            // slide wrapper for preview
            $default_script['cnhk-slide-wrap'] = array(
                'url' => CNHK_URL . 'admin/assets/js/slide-wrap' . $mini . '.js',
                'dep' => array( 'jquery' ),
                'version' => CNHK_VERSION,
            );
            
            $image_frame_locale = array(
                'title' => __( 'select an image', 'cnhk-ss' ),
                'button' => __( 'select', 'cnhk-ss' ),
                'invalidFileType' => __( 'invalid file type', 'cnhk-ss' ),
            );
            
            // helper for image media library
            $default_script['cnhk-image-frame'] = array(
                'url' => CNHK_URL . 'admin/assets/js/image-frame' . $mini . '.js',
                'dep' => array( 'jquery' ),
                'version' => CNHK_VERSION,
                'locale' => 'cnhkImageFrameLocale',
                'translations' => $image_frame_locale,
            );
            
            $this->script_filter( 'cnhk-postnew-scripts', $default_script );
        }
        
        // Settings page script
        if ( $cnhk_admin['settings_page'] == get_current_screen()->id ) {
            
            // font awesome
            $default_style = array(
                'cnhk-fa' => array(
                    'url' => CNHK_URL . 'lib/font-awesome/css/font-awesome.min.css',
                    'version' => '4.4',
                ),
            );
            $this->style_filter( 'cnhk-settings-styles', $default_style );
            
            $translations = array(
                'cancel' => __( 'cancel', 'cnhk-ss' ),
                'edited' => __( 'edited', 'cnhk-ss' ),
                'code' => __( 'Code', 'cnhk-ss' ),
                'invalidCode' => __( 'invalid code', 'cnhk-ss' ),
                'change' => __( 'Change', 'cnhk-ss' ),
                'duration' => __( 'Duration (in ms)', 'cnhk-ss' ),
                'mainDuration' => __( 'Main duration (in ms)', 'cnhk-ss' ),
                'secondaryDuration' => __( 'Secondary duration (in ms)', 'cnhk-ss' ),
            );
            
            // admin funtions
            $default_script = array(
                'cnhk-functions-js' => array(
                    'url' => CNHK_URL . 'admin/assets/js/functions' . $mini . '.js',
                    'dep' => array( 'jquery' ),
                    'version' => CNHK_VERSION,
                    'locale' => 'cnhkLocale',
                    'translations' => $translations,
                ),
            );
            if ( ! isset( $_GET['tab'] ) ) $_GET['tab'] = 'general';
            switch ( $_GET['tab'] ) {
                case 'general' :
                    
                    $default_script['general-settings-js'] = array(
                        'url' => CNHK_URL . 'admin/assets/js/settings.js',
                        'dep' => array( 'jquery' ),
                        'version' => CNHK_VERSION,
                    );
                    break;
                default :
            }
            $this->script_filter( 'cnhk-settings-scripts', $default_script );
        }
        
        // Effect builder page script
        if ( $cnhk_admin['builder_page'] == get_current_screen()->id ) {
            $default_style = array(
                'cnhk-fa' => array(
                    'url' => CNHK_URL . 'lib/font-awesome/css/font-awesome.min.css',
                    'version' => '4.4',
                ),
            );            
            $this->style_filter( 'cnhk-builder-styles', $default_style );
            
            $translations = array(
                'cancel' => __( 'cancel', 'cnhk-ss' ),
                'edited' => __( 'edited', 'cnhk-ss' ),
                'code' => __( 'Code', 'cnhk-ss' ),
                'invalidCode' => __( 'invalid code', 'cnhk-ss' ),
                'change' => __( 'Change', 'cnhk-ss' ),
                'duration' => __( 'Duration (in ms)', 'cnhk-ss' ),
                'mainDuration' => __( 'Main duration (in ms)', 'cnhk-ss' ),
                'secondaryDuration' => __( 'Secondary duration (in ms)', 'cnhk-ss' ),
            );
            
            // admin functions
            $default_script = array(
                'cnhk-functions-js' => array(
                    'url' => CNHK_URL . 'admin/assets/js/functions' . $mini . '.js',
                    'dep' => array( 'jquery' ),
                    'version' => CNHK_VERSION,
                    'locale' => 'cnhkLocale',
                    'translations' => $translations,
                ),
            );
            
            $default_script['jssor-js'] = array(
                'url' => CNHK_URL . 'lib/jssor/jssor.slider.mini.js',
                'dep' => array(),
                'version' => CNHK_VERSION
            );
            
            $builder_translations = array(
                'empty' => __( 'empty', 'cnhk-ss' ),
                'clear' => __( 'clear', 'cnhk-ss' ),
                'addTwin' => __( 'add twin effect', 'cnhk-ss' ),
                'editTwin' => __( 'edit twin effect', 'cnhk-ss' ),
            );
            
            // jssor effect builder
            $default_script['cnhk-effect-builder'] = array(
                'url' => CNHK_URL . 'admin/assets/js/effect-builder' . $mini . '.js',
                'dep' => array( 'jquery' ),
                'version' => CNHK_VERSION,
                'locale' => 'BuilderLocale',
                'translations' => $builder_translations,
            );
            
            $_builder_tab = ( isset( $_GET['tab'] ) )? $_GET['tab'] : 'ss';
            switch ( $_builder_tab ) {
                case 'ca' :
                
                    // caption effect builder page
                    $default_script['cafx-builder-js'] = array(
                        'url' => CNHK_URL . 'admin/assets/js/cafx-builder' . $mini . '.js',
                        'dep' => array( 'jssor-js' ),
                        'version' => CNHK_VERSION,
                    );
                    break;
                case 'ss' :
                
                    // slide effect builder page
                    $bro_translations = array(
                        'overlayTitle' => __( 'twin effect', 'cnhk-ss' ),
                    );
                    
                    // twin effect builder
                    $default_script['brother-builder-js'] = array(
                        'url' => CNHK_URL . 'admin/assets/js/brother-builder' . $mini . '.js',
                        'dep' => array( 'jssor-js' ),
                        'version' => CNHK_VERSION,
                        'locale' => 'brotherLocale',
                        'translations' => $bro_translations,
                    );
                    
                    // standard slide effect builder
                    $default_script['ssfx-builder-js'] = array(
                        'url' => CNHK_URL . 'admin/assets/js/ssfx-builder' . $mini . '.js',
                        'dep' => array( 'jssor-js' ),
                        'version' => CNHK_VERSION,
                    );
                    break;
                default:
            }
            $this->script_filter( 'cnhk-builder-scripts', $default_script );
        }
	}
    

	/**	 
	 * meta box creation for slider edit page
     *
     * @param [object] $post, post object
	 */
	public function meta_boxes_action( $post ) {
        if ( '' != $post->post_content ) {
            
            // the slider already created
            
            // slides post box
            add_meta_box(
                'cnhkss-slides-param',
                __( 'Slides', 'cnhk-ss' ),
                array( $this, 'render_slides_meta_box' ),
                CNHK_CPT,
                'normal',
                'default'
            );
            
            // basic parameter post box
            add_meta_box(
                'cnhkss-basic-param',
                __( 'Basic Parameters', 'cnhk-ss' ),
                array( $this, 'render_basic_param_meta_box' ),
                CNHK_CPT,
                'side',
                'default'
            );
            
            $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'data', $post->post_content );
            if ( method_exists( $hndle, 'advanced_params' ) ) {
                
                // advanced parameters
                add_meta_box(
                    'cnhkss-adv-param',
                    __( 'Advanced Parameters', 'cnhk-ss' ),
                    array( $this, 'render_adv_param_meta_box' ),
                    CNHK_CPT,
                    'advanced',
                    'default'
                );
            }
            if ( $hndle ) {
                // display one box for each supported navigator
                
                $nav_types = cnhk_ss::get_instance()->get_nav_list();
                foreach ( $nav_types as $slug => $obj ) {
                    if ( in_array( $slug, $hndle->supported_nav_types ) ) {
                        add_meta_box(
                            'nav-' . $slug . '-params',
                            $obj->name,
                            array( $obj, 'admin_params' ),
                            CNHK_CPT,
                            'advanced',
                            'default'
                        );
                    }
                }
            }
        } else {
            // creation of a new slider
            add_meta_box(
                'cnhkss-template-param',
                __( 'Choose a template', 'cnhk-ss' ),
                array( $this, 'render_template_meta_box' ),
                CNHK_CPT,
                'normal',
                'default'
            );
        }
	}
    
	/**
	 * renders the slides meta box
	 */
	public function render_slides_meta_box() {
        global $post;
        $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'data', $post->post_content );
        if ( $hndle ) {
            $hndle->slide_params();
            ?>
            <div id="admin-new-slide" class="form-field">
                <b><?php _e( 'Add slide', 'cnhk-ss' ); ?></b><br />
                <select id="new-slide-type" class="with-tip">
                <option value="" data-tip=""><?php _e( 'select slide type', 'cnhk-ss' ); ?></option>
                <?php
                    $slide_types = cnhk_ss::get_instance()->get_slide_type_list();
                ?>
                <?php foreach ( $slide_types as $slug => $slide_hndle ) : ?>
                <?php if ( ! in_array( $slug, $hndle->supported_slide_types ) ) continue; ?>
                <option value="<?php echo $slug; ?>" data-tip="<?php echo esc_attr( $slide_hndle->desc ); ?>"><?php echo $slide_hndle->name; ?></option>
                <?php endforeach; ?>
                </select>
                <button class="button button-secondary" id="add-slide"><?php _e( 'add slide', 'cnhk-ss' ); ?></button>
                <p class="desc">
                    <i class="dashicons dashicons-info"></i>
                    <span class="select-tip"></span>
                </p>
            </div>
            <?php
            // Place the markup for the caption editor
            cnhk_caption_admin::editor_markup();
            
            // and the one for html slide layers
            if ( method_exists( 'cnhk_layer_html', 'editor_markup' ) ) {
                cnhk_layer_html::editor_markup();
            }
            
            // and the effect picker
            cnhk_fx_picker_markup();
            
            // and the effect saver
            cnhk_fx_saver_markup();
        }
	}
    
	/**
	 * renders the basic parameters meta box
	 */
	public function render_basic_param_meta_box() {
        global $post;
        $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'data', $post->post_content );
        if ( $hndle ) {
            $hndle->basic_params();
        }
	}

	/**
	 * renders the advanced parameters meta box
	 */
	public function render_adv_param_meta_box() {
        global $post;
        $hndle = cnhk_ss::get_instance()->get_template_handler_by( 'data', $post->post_content );
        if ( $hndle ) {
            $hndle->advanced_params();
        }
	}
    
	/**
	 * renders the meta box for choosing slider template
	 */
    public function render_template_meta_box() {
        require_once CNHK_PATH . 'admin/views/mbx-choose-template.php';
    }
    
	/**
	 * print the slide toolbar and its buttons
	 */
    public static function slide_toolbar() {
        ?><div class="slide-toolbar">
            <span class="duplicate-slide"><i class="dashicons dashicons-format-gallery"></i><?php _e( 'Duplicate slide', 'cnhk-ss' ); ?></span>
            <span class="preview-slide"><i class="dashicons dashicons-controls-play"></i><?php _e( 'Preview slide', 'cnhk-ss' ); ?></span>
        </div><?php
    }
    
    /**
     *  print the loading screen form
     *  
     *  @param [array] $hndle template handler ( with data loaded )
     */
    public static function loading_bg( $hndle ) {
        $bg = ( isset( $hndle->data['options']['loadBg'] ) )? $hndle->data['options']['loadBg'] : '';
        ?>
        <div class="form-field">
            <label><?php _e( 'Loading screen', 'cnhk-ss' ); ?></label>
            <input name="options[loadBg]" class="color-picker" value="<?php echo $bg; ?>" />
            <p class="description">
            <?php _e( 'always use a background color for the loading screen if you do not want the current image to be visible (while still loading)', 'cnhk-ss' ); ?>
            </p>
        </div>
        <?php
    }
    
    /**
     *  print out boxed slider related fields
     *  
     *  @param [array] $hndle template handler ( with data loaded )
     */
    public static function boxed_admin_params( $hndle ) {
        ?>
        <label>
            <input type="checkbox" name="options[b]" id="options-b" value="1" <?php checked( $hndle->data['options']['b'] ); ?> />
            <?php _e( 'Boxed slider', 'cnhk-ss' ) ?>
        </label>
        <div id="boxed-inputs-alt" style="display:none;">
        <input type="hidden" name="options[brw]" value="" disabled="disabled" />
        <input type="hidden" name="options[align]" value="center" disabled="disabled" />
        </div>
        <p class="desc"><?php _e( 'wrap the slider inside of a box (aspect ratio always maintained)', 'cnhk-ss' ); ?></p>
        <div id="boxed-inputs">
            <div class="form-field">
                <label>
                    <?php  _e( 'Relative box width', 'cnhk-ss' ); ?>&nbsp;:&nbsp;
                    <input type="number" min="1" max="100" name="options[brw]" id="options-brw" class="cnhk-number cnhk-int" data-default="80" value="<?php echo $hndle->data['options']['brw'] ?>" />
                </label>
                <p class="description"><?php _e( 'in %, relative to the width of the parent element', 'cnhk-ss' ); ?></p>
            </div>
            <div class="form-field">
                <label for="options-align"><?php _e( 'Box alignment', 'cnhk-ss' ); ?></label>
                <select id="options-align" name="options[align]" class="with-tip">
                <?php foreach ( $hndle->box_align as $key => $value ) : ?>
                    <option value="<?php echo $key; ?>" <?php selected( ( $key == $hndle->data['options']['align'] ) ); ?>
                    data-tip="<?php echo esc_attr( $value['tip'] ); ?>"><?php echo $value['readable']; ?></option>
                <?php endforeach; ?>
                </select>
                <p class="desc">
                    <i class="dashicons dashicons-info"></i>
                    <span class="select-tip"><?php echo $hndle->box_align[$hndle->data['options']['align']]['tip']; ?></span>
                </p>
            </div>
        </div>
        <?php
    }
    
    /**
     *  print out slider background related fields
     *  
     *  @param [array] $hndle template handler ( with data loaded )
     */
    public static function bg_admin_params( $hndle ) {
        ?>
        <label><?php _e( 'Background image', 'cnhk-ss' ); ?></label>
        <input type="hidden" id="slider-bg-src" name="options[bg]" value="<?php echo esc_attr( $hndle->data['options']['bg'] ); ?>" /><br />
        <button class="button-secondary" id="select-slider-bg"><?php _e( 'Select Image', 'cnhk-ss' ); ?></button>
        <button class="button-secondary" id="clear-slider-bg"><?php _e( 'Clear', 'cnhk-ss' ); ?></button>
        <p id="slider-bg-notice" style="color:red;"></p>
        <p class="description"><?php _e( 'add a background image to the slider', 'cnhk-ss' ); ?></p>
        <div id="slider-bg-inputs-alt" style="display:none;">
            <input type="hidden" name="options[bgRepeat]" value="cover" disabled="disabled" />
            <input type="hidden" name="options[bgPosition]" value="center center" disabled="disabled" />
        </div>
        <div id="slider-bg-inputs">
            <div class="form-field">
                <label for="options-bgRepeat"><?php _e( 'Background repeat', 'cnhk-ss' ); ?></label>
                <select id="options-bgRepeat" name="options[bgRepeat]" class="with-tip">
                <?php foreach ( $hndle->bg_repeat as $key => $value ) : ?>
                    <option value="<?php echo $key; ?>" <?php selected( ( $key == $hndle->data['options']['bgRepeat'] ) ); ?>
                    data-tip="<?php echo esc_attr( $value['tip'] ); ?>"><?php echo $value['readable']; ?></option>
                <?php endforeach; ?>
                </select>
                <p class="desc">
                    <i class="dashicons dashicons-info"></i>
                    <span class="select-tip"><?php echo $hndle->bg_repeat[$hndle->data['options']['bgRepeat']]['tip']; ?></span>
                </p>
            </div>
            <div class="form-field">
                <label for="options-bgPosition"><?php _e( 'Background position', 'cnhk-ss' ); ?></label>
                <select id="options-bgPosition" name="options[bgPosition]">
                    <option value="left top" <?php selected( 'left top', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'top left', 'cnhk-ss' ) ?></option>
                    <option value="center top" <?php selected( 'center top', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'top center', 'cnhk-ss' ) ?></option>
                    <option value="right top" <?php selected( 'right top', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'top right', 'cnhk-ss' ) ?></option>
                    <option value="left center" <?php selected( 'left center', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'left middle', 'cnhk-ss' ) ?></option>
                    <option value="center center" <?php selected( 'center center', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'center middle', 'cnhk-ss' ) ?></option>
                    <option value="right center" <?php selected( 'right center', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'right middle', 'cnhk-ss' ) ?></option>
                    <option value="left bottom" <?php selected( 'left bottom', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'bottom left', 'cnhk-ss' ) ?></option>
                    <option value="center bottom" <?php selected( 'center bottom', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'bottom center', 'cnhk-ss' ) ?></option>
                    <option value="right bottom" <?php selected( 'right bottom', $hndle->data['options']['bgPosition'] ); ?>><?php _e( 'bottom right', 'cnhk-ss' ) ?></option>
                </select>
                <p class="desc"><?php _e( 'position of the background image', 'cnhk-ss' ); ?></p>
            </div>
        </div>
        <?php
    }
    
	/**
	 *  return the unique instance of the class
	 */
	public static function get_instance() {
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}
}
