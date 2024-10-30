<?php
/**
 *  general options handling class
 */
class cnhk_db
{	
    /**
     * option name
     */
    const OPT_NAME = 'cnhkss';
    
    /**
     * the unique instance of this class
     */
    private static $instance = null;
	
	/**
	 * default plugin's options
     *
     * @var [array]
	 */
	private $default_data = array( 
		'version' => CNHK_VERSION,
        'active_modules' => array(),
        'fonts' => array(),
	 );
	
    /**
     *  the data
     */
	private $data = null;
	
	private function __construct() {
        // setup options
		$options = get_option( self::OPT_NAME, false );
		if ( ! $options ) {
			$this->data = $this->default_data;
		} else {
			$this->data = $options;
		}
        if ( version_compare( $this->data['version'], CNHK_VERSION, '<' ) ) {
            // database upgrade goes here
            
            $this->data['version'] = CNHK_VERSION;
            update_option( self::OPT_NAME, $this->data );
        }
        // add filter for Google fonts loaded from options
        add_filter( 'cnhk_fonts', array( $this, 'add_fonts' ) );
	}
    
    /**
     *  add saved Google fonts via filter
     *  
     *  @param [array] $stacks the default font stack
     *  @return [array] $stacks the modified font stack
     */
    public function add_fonts( $stacks ) {
        $fonts = array();
        foreach ( $this->data['fonts'] as $name => $value ) {
            $fonts[ $value['family'] ] = $value['family'] . ', sans-serif, serif';
        }
        $stacks += $fonts;
        ksort( $stacks );
        return $stacks;
    }
    
	/**
	 * get plugin's options
     *
     * @param   [string] $field, the name of the field in the option that need to be retrieved. If empty, all fields will be returned.
     * @return  [mixed] the content of the field, or an array of all fields
	 */
	public function options( $field = '' ) {
        if ( empty( $field ) ) {
            return $this->data;
        } else {
            if ( isset( $this->data[$field] ) ) {
                return $this->data[$field];
            } else {
                return false;
            }
        }
    }
    
    /**
     * set plugin's options
     *
     * @param [mixed] $field, field name or array of fiel name
     * @param [mixed] $value, field value or array of value
     * 
     * @return void
     */
    public function set_options( $field, $value ) {
        // no field name provided, abort
        if ( !isset( $field ) ) throw new Exception( 'Missing field name' );
        if ( is_array( $field ) ) {
            if ( is_array( $value ) && count( $value ) == count( $field ) ) {
                $combi = array_combine( $field, $value );
                $this->data = array_merge( $this->data, $combi );
                update_option( self::OPT_NAME, $this->data );
            }
        } else {
            $this->data[$field] = $value;
            update_option( self::OPT_NAME, $this->data );
        }
    }
    
    /**
     *  get plugin's version stored in DB
     */
    public function version() {
        return $this->data['version'];
    }
    
    /**
     * return the unique instance of this class.
     */
    public static function get_instance() {
        if ( null == self::$instance ) {
            self::$instance = new self;
        }
        return self::$instance;
    }
		
}
