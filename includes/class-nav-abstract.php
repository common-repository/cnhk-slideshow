<?php
/**
 *  pattern for navigator class
 */
abstract class cnhk_nav_abstract
{
    /**
     *  nav type slug
     *  
     *  @var [string]
     */
    public $slug = 'slug';
    
    /**
     *  nav name
     *  @var [string]
     */
    public $name = 'name';
    
    /**
     *  print out the admin form in the navigation metabox
     *  
     *  @return void
     */
    abstract public function admin_params();
    
    /**
     *  get navigator markup size
     *  
     *  @return [array] $size ( associative with width and height )
     */
    public function get_size( $data ) {
        return array( 'width' => 0, 'height' => 0, 'left' => 0, 'top' => 0 );
    }
    
    /**
     *  print the HTML in the front end
     *  
     *  @param [array] $data slider data
     *  @param [array] $options slider options
     *  
     *  @return void
     */
    abstract public function render( $data, $options );
    
}
