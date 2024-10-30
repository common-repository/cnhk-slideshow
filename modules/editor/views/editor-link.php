<div id="link-settings">
    <div id="link-settings-wrap">
        <div class="form-group">
            <label>URL</label>
            <input type="text" id="link-url" value="" />
        </div>
        <div>
            <label><input type="checkbox" id="link-target" value="1" />&nbsp;<?php _e( 'open in new tab/window', 'cnhk-ss' ); ?></label>
        </div>
        <br />
        <div class="form-group">
            <label><?php _e( 'class attribute', 'cnhk-ss' ); ?></label>
            <input type="text" id="link-class" value="" />
            <p class="description"><?php _e( 'space separated list as in normal HTML', 'cnhk-ss' ); ?></p>
        </div>
        <br />
        <div class="form-group">
            <label><?php _e( 'id attribute', 'cnhk-ss' ); ?></label>
            <input type="text" id="link-id" value="" />
            <p class="description"><?php _e( 'unique identifier', 'cnhk-ss' ); ?></p>
        </div>
    </div>
</div>
<div id="existing-posts">
<?php
    $posts = get_posts( array(
        'post_type' => array( 'post', 'page' ),
        'post_status' => 'publish',
        'posts_per_page' => -1,
    ) );
?>
    <h3 id="exist-heading"><?php  _e( 'Link to existing content', 'cnhk-ss' ); ?></h3>
    <div id="links-relwrap" style="position:relative;">
        <div id="links-abswrap" style="position:absolute;overflow-y:scroll;">
            <table class="widefat">
                <thead>
                    <tr>
                        <th><?php _e( 'Title', 'cnhk-ss' ); ?></th>
                        <th><?php _e( 'Type', 'cnhk-ss' ); ?></th>
                    </tr>
                </thead>
                <tbody>
                <?php if ( empty( $posts ) ) : ?>
                    <tr class="alternate"><td colspan="2" style="text-align:center;"><em><?php _e( 'No content available','cnhk-ss' ); ?></em></td></tr>
                <?php else : ?>
                    <?php foreach ( $posts as $post ) : ?>
                    <?php $alt = ( isset( $alt ) && $alt == 'alternate' )? $alt = '' : 'alternate'; ?>
                    <tr class="<?php echo $alt; ?>" data-permalink="<?php echo esc_url( get_permalink( $post->ID ) ); ?>">
                        <td><?php echo $post->post_title; ?></td>
                        <td><?php echo $post->post_type; ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div id="link-submit">
    <button class="button-secondary" id="cancel-link"><?php _e( 'cancel', 'cnhk-ss' ); ?></button>
    <button class="button-primary" id="insert-link"><?php _e( 'insert', 'cnhk-ss' ); ?></button>
<div>