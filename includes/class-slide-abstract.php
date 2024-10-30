<?php
/**
 * pattern class for slide type
 */
abstract class cnhk_slide_abstract
{
	/**
	 * slide type slug
	 *
	 * used is several place in markup, DB and javascript
	 * so this should be a valid PHP and js name
	 */
	public $slug = 'slug';
	
	/**
	 * the displayed name in admin panel
     * set in the subclass's constructor in order to be localized
	 */
	public $name = 'name';
    
    /**
     *  slide type description
     *  also set in the subclass's constructor in order to be localized
     */
    public $desc = 'desc';
    	
	/**
	 * Constructor
	 */
	protected function __construct() {
		
	}
	
    /**
	 *  display slide param in metabox
	 *  
	 *  @param [array] $context, contains context variable in which the method is called (such as whether plugin settings or slider template's data)
	 *  @return void
	 */
	abstract public function admin_params( $context );
	
    /**
     *  render the slide in the front end
     *  
     *  @param [array] $data, the slide's data (associatice array)
     *  @param [string] $slide_id, the slide ID
     *  @param [array] $options, the slider template's options (part of the data - associative array)
     *  @param [int] $sli, the slide's index in the slider
     */
	abstract public function render( $data, $slide_id, $options, $sli );
}
