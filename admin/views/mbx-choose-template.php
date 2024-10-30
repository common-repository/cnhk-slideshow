<?php
$tpl = cnhk_ss::get_instance()->get_template_list();
?>
<table class="widefat fixed">
    <thead>
        <tr class="alternate">
            <th><?php _e( 'Template', 'cnhk-ss' ); ?></th>
            <th colspan="2"><?php _e( 'Description', 'cnhk-ss' ); ?></th>
        </tr>
    </thead>
    <tbody id="template-tbody" class="stripped">
    <?php 
        $alt = 'alternate';
        $alt = ( 'alternate' == $alt )? '' : 'alternate';
    ?>
    <?php foreach( $tpl as $slug => $handler ) :  ?>
        <tr class="<?php echo $alt; ?>">
            <td>
                <strong><?php echo $handler->name; ?></strong>
            </td>
            <td>
                <?php echo $handler->desc; ?>
            </td>
            <td>
                <input type="submit" data-slug="<?php echo $slug; ?>" class="choose-template button button-secondary" value="<?php _e( 'choose', 'cnhk-ss' ); ?>" />
            </td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
<input type="hidden" name="new-template" id="new-template" value="" />
<?php
$args = array(
    'posts_per_page' => -1,
    'post_type' => CNHK_CPT,
    'post_status' => 'any',
);
$sliders = get_posts( $args );
if ( empty( $sliders ) ) return; 
?>
<h4><?php _e( 'Or duplicate an existing slider', 'cnhk-ss' ); ?></h4>
<select name="original-slider">
<?php foreach( $sliders as $slider ) : ?>
    <?php
     $data = unserialize( $slider->post_content );
     if ( ! isset( $data['template'] ) ) continue;
     $th = cnhk_ss::get_instance()->get_template_handler_by( 'slug', $data['template'] );
     $name = ( $th )? $th->name : __( 'unknown template', 'cnhk-ss' );
     $title = ( $slider->post_title )? $slider->post_title : __( 'no title', 'cnhk-ss' );
    ?>
    <option value="<?php echo $slider->ID; ?>"><?php echo $title . ' (' . $name . ')'; ?></option>
<?php endforeach; ?>
</select>
<input type="submit" class="button-secondary" name="duplicate-slider" value="<?php _e( 'duplicate', 'cnhk-ss' ); ?>" <?php if ( ! $sliders ) echo 'disabled'; ?> />
