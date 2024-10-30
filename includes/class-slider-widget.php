<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'CNHK_SLIDER_WIDGET' ) ) {
    class CNHK_SLIDER_WIDGET extends WP_Widget
    {
        // Constructor
        public function CNHK_SLIDER_WIDGET() {
            $widget_ops = array( 'classname' => 'cnhk-slideshow', 'description'	=> __( 'Use this widget to display a slider', 'cnhk-ss' ) );
            $control_ops = array( 'id_base' => 'cnhk-slideshow' );		
            $this->__construct( 'cnhk-slideshow', 'Cnhk Slideshow', $widget_ops, $control_ops );
        }
        
        // Display the widget
        public function widget( $args, $instance ) {
            extract( $args );
            $title = $instance['title'];
            $sid = $instance['sid'];
            if ( ! empty( $sid ) ) {
                echo $before_widget;
                echo $before_title . $title . $after_title;
                cnhk_slideshow( intval( $sid ) );
                echo $after_widget;
            }
        }
        
        // The form displayed when setting up this widget in sidebars
        public function form( $instance ) {
            $defaults = array( 'title' => '', 'sid' => '0' );		
            $instance = wp_parse_args( ( array ) $instance, $defaults );
            $args = array(
                'posts_per_page' => -1,
                'post_type' => CNHK_CPT,
                'post_status' => 'any',
            );
            $sliders = get_posts( $args );
            ?>
            <p>
                <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title', 'cnhk-ss' ); ?></label>
                <input type="text" class="widefat" name="<?php echo $this->get_field_name( 'title' ); ?>" id="<?php echo $this->get_field_id( 'title' ); ?>" value="<?php echo esc_attr( $instance['title'], 'cnhk-ss' ); ?>" />
            </p>
            <p>
                <label for="<?php echo $this->get_field_id( 'sid' ); ?>"><?php _e( 'Select a slider', 'cnhk-ss' ); ?></label><br />
                <select id="<?php echo $this->get_field_id( 'sid' ); ?>" name="<?php echo $this->get_field_name( 'sid' ); ?>">
                <?php if ( empty( $sliders ) ) : ?>
                <option value="" disabled><?php _e( 'no slider found', 'cnhk-ss' ); ?></option>
                <?php else : ?>
                <?php foreach( $sliders as $ss ) : ?>
                <option value="<?php echo $ss->ID; ?>" <?php selected( $ss->ID, intval( $instance['sid'] ) ); ?>><?php echo $ss->post_title; ?></option>
                <?php endforeach; ?>
                <?php endif; ?>
                </select>
            </p>
            <?php
        }
        
        // Update values
        public function update( $new_instance, $old_instance ) {
            $instance = array();		
            $instance['title'] = ( ! empty( $new_instance['title'] ) ? strip_tags(  $new_instance['title'] ): '' );
            $instance['sid'] = ( ! empty( $new_instance['sid'] ) ? $new_instance['sid']: '0' );
            return $instance;
        }
    }
}
