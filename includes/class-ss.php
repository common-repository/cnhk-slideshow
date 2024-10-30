<?php
/**
 *  main plugin class
 */
class cnhk_ss
{
	/**
	 *  slide effect families (jssor's predefined)
	 *  
	 *  @var [array]
	 */
	protected $fx_family;
    
	/**
	 *  slide effects (jssor's predefined)
	 *  
	 *  @var [array]
	 */
	protected $fx;
    
	/**
	 *  caption effect families (jssor's predefined)
	 *  
	 *  @var [array]
	 */
	protected $cafx_family;
    
	/**
	 *  caption effects (jssor's predefined)
	 *  
	 *  @var [array]
	 */
	protected $cafx;
	
    /**
     *  registered slider template list
     *  
     *  @var [array] associative array of template handler object
     */
    protected $template_list;
    
    /**
     *  registered slide type list
     *  
     *  @var [array] associative array of slide handler object
     */
    protected $slide_type_list;
    
    /**
     *  registered navigators
     *  
     *  @var [array] array of navigator handler object
     */
    protected $navs;
    
    /**
     *  registered pluggable modules
     *  
     *  @var [array]
     */
    protected $modules;
    
	/**
	 * The unique instance of the class.
	 */
	static private $instance = null;
	
	private function __construct() {
        // load predefined effects
		$this->load_fx();
        
        // load text domain
		load_plugin_textdomain( 'cnhk-ss', false, basename( CNHK_PATH ) . '/languages' );
        
        // register pluggable modules and load the active ones
        $this->register_modules();
        $this->load_active_modules();
        
        // tasks when WordPress is fully loaded
        add_action( 'wp_loaded', array( $this, 'on_wp_loaded' ) );
        
        // init action
		add_action( 'init', array( $this, 'init' ) );
        
        // activate plugin when new blog is added on multisites
        add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );
        
        // widget init
        add_action( 'widgets_init', array( $this, 'widgets_init' ) );
        
	}
	
    /**
     *  register the slider widget
     */
    public function widgets_init() {
		register_widget( 'CNHK_SLIDER_WIDGET' );
    }
    
    /**
     *  tasks on 'wp_loaded' action
     */
    public function on_wp_loaded() {
        $this->register_templates();
        $this->register_slide_types();
        $this->register_navs();
    }
    
    /**
     *  construct active modules instances
     */
    public function load_active_modules() {
        $db = cnhk_db::get_instance();
        $active_modules = $db->options( 'active_modules' );
        
        foreach ( $active_modules as $slug ) {
            require_once $this->modules[$slug]['activator'];
        }
    }
    
    /**
     *  load jssor predefined effects
     */
    private function load_fx() {
        $raw_ss_fx = file_get_contents( CNHK_PATH . 'admin/assets/json/ss-fx.json' );
        $raw_ss_fx_family = file_get_contents( CNHK_PATH . 'admin/assets/json/ss-fx-family.json' );
        $raw_ca_fx = file_get_contents( CNHK_PATH . 'admin/assets/json/ca-fx.json' );
        $raw_ca_fx_family = file_get_contents( CNHK_PATH . 'admin/assets/json/ca-fx-family.json' );
        
        $fx = json_decode( $raw_ss_fx, true );
        $fx_family = json_decode( $raw_ss_fx_family, true );
        $cafx = json_decode( $raw_ca_fx, true );
        $cafx_family = json_decode( $raw_ca_fx_family, true );
        
        $this->fx = ( $fx ) ? $fx : array();
        $this->fx_family = ( $fx_family ) ? $fx_family : array();
        $this->cafx = ( $cafx ) ? $cafx : array();
        $this->cafx_family = ( $cafx_family ) ? $cafx_family : array();
    }
    
	/**
	 *  create CPT on init
	 */
	public function init(){
        self::create_post_types();
	}
    
    /**
     *  register navigators objects
     */
    public function register_navs(){
        $navs = array();
        $this->navs = apply_filters( 'cnhk-nav-list', $navs );
    }
    
    /**
     *  register slider template objects
     */
    public function register_templates() {
        $templates = array();
        $this->template_list = apply_filters( 'cnhk-template-list', $templates );
    }
    
    /**
     *  register slide type object
     */
    public function register_slide_types() {
        $slides = array();
        $this->slide_type_list = apply_filters( 'cnhk-slide-list', $slides );
    }
    
    /**
     *  register pluggable modules
     */
    public function register_modules() {
        $modules = array();
        $this->modules = apply_filters( 'cnhk-module-list', $modules );
    }
    
    /**
     * registers slider post type ( CPT )
     */
    public static function create_post_types() {
		
        $cpt_labels = array( 
            'name' => __( 'Sliders', 'cnhk-ss' ),
            'singular_name' => __( 'Slider', 'cnhk-ss' ),
            'add_new' => __( 'New Slider', 'cnhk-ss' ),
            'add_new_item' => __( 'Add New Slider', 'cnhk-ss' ),
            'edit' => __( 'Edit', 'cnhk-ss' ),
            'edit_item' => __( 'Edit Slider', 'cnhk-ss' ),
            'new_item' => __( 'New Slider', 'cnhk-ss' ),
            'view' => __( 'View', 'cnhk-ss' ),
            'view_item' => __( 'View Slider', 'cnhk-ss' ),
            'search_items' => __( 'Search Slider', 'cnhk-ss' ),
            'not_found' => __( 'No Slider found', 'cnhk-ss' ),
            'not_found_in_trash' => __( 'No Slider found in Trash', 'cnhk-ss' ),
            'parent' => __( 'Parent Slider', 'cnhk-ss' ),
         );

        $cpt_params = array( 
            'labels' => $cpt_labels,
            'singular_label' => __( 'Slider', 'cnhk-ss' ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
			'exclude_from_search' => true,
			'publicly_queryable' => true,
            'hierarchical' => false,
            'capability_type' => 'page',
            'has_archive' => false,
			'rewrite' => CNHK_CPT,
            'query_var' => false,
            'supports' => array( 'title' ),
			'menu_icon' => 'dashicons-format-gallery',
        );
		
		if ( ! post_type_exists( CNHK_CPT ) ) {
			register_post_type( CNHK_CPT, $cpt_params );
		}
		
	}
    
    /**
     * fired when the plugin is activated.
     *
     * @param	[boolean]	$network_wide   True if multisite superadmin uses
     *                                		"Network Activate" action, false if
     *                                 		multisite is disabled or plugin is
     *                                  	activated on an individual blog.
     */
    public static function activate( $network_wide ) {
        if ( function_exists( 'is_multisite' ) && is_multisite() ) {
            if ( $network_wide ) {
                // get all blog ids
                $blog_ids = self::get_blog_ids();

                foreach ( $blog_ids as $blog_id ) {
                    switch_to_blog( $blog_id );
                    self::single_activate();
                }

                restore_current_blog();
            } else {
                self::single_activate();
            }
        } else {
            self::single_activate();
        }
    }
	
    /**
     * fired when the plugin is deactivated.
     *
     * @param	[boolean]	$network_wide
     */
    public static function deactivate( $network_wide ) {
        if ( function_exists( 'is_multisite' ) && is_multisite() ) {
            if ( $network_wide ) {
                // get all blog ids
                $blog_ids = self::get_blog_ids();
                
                foreach ( $blog_ids as $blog_id ) {
                    switch_to_blog( $blog_id );
                    self::single_deactivate();
                }

                restore_current_blog();
            } else {
                self::single_deactivate();
            }
        } else {
            self::single_deactivate();
        }
    }
	
    /**
     * fired when a new site is activated with a multisite installation.
     *
     * @param [int] $blog_id, ID of the new blog.
     */
    public function activate_new_site( $blog_id ) {
        if ( 1 !== did_action( 'wpmu_new_blog' ) ) {
            return;
        }
        switch_to_blog( $blog_id );
        self::single_activate();
        restore_current_blog();
    }
	
    /**
     * get all blog ids of blogs in the current network that are:
     * - not archived
     * - not spam
     * - not deleted
     *
     * @return [array|false] the blog ids, false if no matches.
     */
    private static function get_blog_ids() {
        global $wpdb;
        // get an array of blog ids
        $sql = "SELECT blog_id FROM $wpdb->blogs
			WHERE archived = '0' AND spam = '0'
			AND deleted = '0'";

        return $wpdb->get_col( $sql );
    }

    /**
     *  fired for each single blog on activation
     */
    private static function single_activate() {		
        // load custom post type
        self::create_post_types();
        
        // flush rewrite rules
        flush_rewrite_rules();
    }
	
    /**
     *  fired for each single blog on deactivation
     */
    private static function single_deactivate() {
        // flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     *  get slide transition effect families (predefined effects)
     */
    public function get_fx_families() {
        return $this->fx_family;
    }
    
    /**
     *  get slide transition effects (predefined)
     */
    public function get_fx() {
        return $this->fx;
    }
    
    /**
     *  get caption transition effect families (predefined)
     */
    public function get_cafx_families() {
        return $this->cafx_family;
    }
    
    /**
     *  get caption transition effects (predefined)
     */
    public function get_cafx() {
        return $this->cafx;
    }
    
    /**
     *  return all navigator objects
     */
    public function get_nav_list() {
        return $this->navs;
    }
    
    /**
     *  return all slider template objects
     */
    public function get_template_list() {
        return $this->template_list;
    }
    
    /**
     *  return all slide type objects
     */
    public function get_slide_type_list() {
        return $this->slide_type_list;
    }
    
    /**
     *  get a slide type handler object based on its slug
     *  
     *  @param [string] $slug, the slide type slug
     */
    public function get_slide_type_handler( $slug ) {
        if ( isset( $this->slide_type_list[ $slug ] ) ) {
            return $this->slide_type_list[ $slug ];
        }
        return false;
    }
    
    /**
     *  get the list of pluggable modules
     */
    public function get_pluggable_modules() {
        return $this->modules;
    }
    
    /**
     *  decode (base64_decode) html in slide data
     *  
     *  @var [array] $data, slide data
     *  
     *  @return $data, slide data with html decoded
     */
    public function recover_html( $data ) {
        $result = array();
        if ( ! is_array( $data ) ) return false;
        foreach ( $data as $key => $value ) {
            $_val;
            // html strings are stored in a field named 'html'
            if ( 'html' == $key ) {
                $_val = base64_decode( $value );
            } elseif ( is_array( $value ) ) {
                $_val = $this->recover_html( $value );
            } else {
                $_val = $value;
            }
            $result[$key] = $_val;
        }
        return $result;
    }
    
    /**
     *  retrieve the template handler object based on one of its parameter
     *  
     *  @param [string] $what, which parameter : template slug, post ID or post data (serialized)
     *  @param [mixed] $value, value of the parameter
     *  @return [mixed], the handler object if any or FALSE
     */
    public function get_template_handler_by( $what, $value ) {
        // if no value, no handler to return
        if ( ! isset( $value ) || empty( $value ) ) return false;
        
        // if an unexpected parameter
        if ( ! in_array( $what, array( 'slug', 'ID', 'id', 'data' ) ) ) {
            throw new Exception( 'Not a correct parameter' );
        }
        
        switch( $what ) {
            case 'slug':
                if ( isset( $this->template_list[ $value ] ) ) {
                    return $this->template_list[ $value ];
                } else {
                    return false;
                }
                break;
            case 'id':
            case 'ID':
                $_post = get_post( intval( $value ) );
                if ( ! $_post ) return false;
                $data = unserialize( $_post->post_content );
                if ( false == $data || ! isset( $data['template'] ) ) return false;
                if ( isset( $this->template_list[ $data['template'] ] ) ) {
                    return $this->template_list[ $data['template'] ];
                } else {
                    return false;
                }
                
                break;
            case 'data':            
                $data = unserialize( $value );
                if ( false == $data || ! isset( $data['template'] ) ) return false;
                
                if ( isset( $this->template_list[ $data['template'] ] ) ) {
                    return $this->template_list[ $data['template'] ];
                } else {
                    return false;
                }
                break;
            default:
        }
    }
    
    /**
     *  get font stacks
     */
    public function get_font_stacks()
    {
        $safe_fonts = array(
            'Arial' => 'Arial, Helvetica Neue, Helvetica, sans-serif, serif',
            'Baskerville' => 'Baskerville, Times New Roman, Times, sans-serif, serif',
            'Georgia' => 'Georgia, Times, Times New Roman, sans-serif, serif',
            'Helvetica' => 'Helvetica Neue, Helvetica, Arial, sans-serif, seriff',
            'Lucida' => 'Lucida Sans, Lucida Grande, Lucida Sans Unicode, sans-serif, serif',
            'Monaco' => 'Monaco, Menlo, Consolas, Courier New, monospace, sans-serif, serif',
            'Palatino' => 'Palatino, Palatino Linotype, Georgia, Times, Times New Roman, sans-serif, serif',
            'Tahoma' => 'Tahoma, Geneva, Verdana, sans-serif',
            'Times' => 'Times New Roman, Times, serif',
            'Trebuchet' => 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, sans-serif, serif',
            'Verdana' => 'Verdana, Geneva, Tahoma, sans-serif, serif',
        );
        return apply_filters( 'cnhk_fonts', $safe_fonts );
    }
    
    /**
     *  helper - return array of font size
     */
    public static function font_sizes() {
        return array( 
            6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            18, 20, 22, 24, 26, 28,
            32, 36, 40, 44, 48,
            54, 60, 66, 75,
            80, 88, 96,
        );
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
	
    /**
     *  include modules file
     *  
     *  @param [string] $path, absolute path to modules folder
     */
    public static function load_modules( $path ) {
        $module_dir = new DirectoryIterator( $path );
        $modules = array();
        $DS = DIRECTORY_SEPARATOR;
        foreach ( $module_dir as $d ) {
            
            if ( $d->isDot() ) continue;
            
            if ( $d->isDir() ) {
                $mod = new DirectoryIterator( $path . $DS . $d->getFilename() );
                foreach ( $mod as $fl ) {
                    if ( $fl->isFile() ) {
                        $file = $fl->getPath() . $DS . $fl->getFilename();
                        $fh = fopen( $file, 'r' );
                        if ( $fh ) {
                            while ( ( $l = fgets( $fh ) ) !== false ) {
                                $line = trim( $l );
                                if ( 0 !== strpos( $line, '<' ) && 0 !== strpos( $line, '/' ) &&  0 !== strpos( $line, '*' ) ) {
                                    // is not PHP opening tag nor is comment
                                    continue 2;
                                }
                                if ( false !== stripos( $line, '@module' ) ) {
                                    $modules[] = $file;
                                }
                            }
                        }
                    }
                }
            }
        }
        foreach ( $modules as $file ) {
            require_once $file;
        }
    }
    
}
