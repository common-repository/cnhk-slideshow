<div id="styling-preview-area">
    <div id="styling-preview-grid">
        <div id="grid-hndle"></div>
        <div id="grid-form">
            <b><?php _e( 'Grid', 'cnhk-ss' ); ?></b><br />
            <label><input type="checkbox" id="enable-grid" /><em><?php _e( 'enable', 'cnhk-ss' ); ?></em></label><br />
            <?php _e( 'grid size', 'cnhk-ss' );?>
            <select id="preview-grid-size">
                <option value="5" selected="selected">5</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="125">125</option>
                <option value="200">200</option>
            </select>
        </div>
    </div>
    <div id="slide-container">
    
    </div>
</div>
<div id="styling-fields-area">
    <div id="styling-fields-com">
        <div class="style-com prev-field">
            <i class="fa fa-arrow-circle-o-left"></i>
        </div>
        <div class="style-com next-field">
            <i class="fa fa-arrow-circle-o-right"></i>
        </div>
    </div>
    <div id="styling-fields-wrap">
        <div id="styling-form-scroll">
            <div class="styling-block-wrap" data-id="">
                <div class="styling-block-relwrap">
                    <div class="styling-block">
                        <p class="caption-para"><h4><?php _e( 'Caption name: ', 'cnhk-ss' ); ?><span class="caption-name-head"></span></h4></p>
                        <input type="hidden" class="editor-bg-color" value="" />
                        
                        <p class="fields-head"><?php _e( 'Preview', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <input type="checkbox" class="show-bounds" />
                            <p class="desc"><?php _e( 'show bounds', 'cnhk-ss' );?></p>
                        </div>
                        <div class="styling-field">
                            <input type="checkbox" class="always-visible" />
                            <p class="desc"><?php _e( 'always visible on the preview', 'cnhk-ss' );?></p>
                        </div>
                        
                        <p class="fields-head"><?php _e( 'Position', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <input class="pos-left cnhk-number" value="" type="number" /><button class="apply-pos-left button-secondary"><?php _e( 'set', 'cnhk-ss' ); ?></button>
                            <p class="desc"><?php _e( 'horizontal distance from the left border of slide', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <input class="pos-top cnhk-number" value="" type="number" /><button class="apply-pos-top button-secondary"><?php _e( 'set', 'cnhk-ss' ); ?></button>
                            <p class="desc"><?php _e( 'vertical distance from the top border of slide', 'cnhk-ss' ); ?></p>
                        </div>
                        
                        <p class="fields-head"><?php _e( 'Size', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <input class="size-w cnhk-number" value="" type="number"  /><button class="apply-size-w button-secondary"><?php _e( 'set', 'cnhk-ss' ); ?></button>
                            <p class="desc"><?php _e( 'width (in pixels)', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <input class="size-h cnhk-number" value="" type="number"  /><button class="apply-size-h button-secondary"><?php _e( 'set', 'cnhk-ss' ); ?></button>
                            <p class="desc"><?php _e( 'height (in pixels)', 'cnhk-ss' ); ?></p>
                        </div>
                        <p class="fields-head"><?php _e( 'Content', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <input class="color-input fg-color" value="" />
                            <p class="desc"><?php _e( 'text and icons color', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <input class="le cnhk-number" value="" min="1" type="number"  />
                            <p class="desc"><?php _e( 'line height (in pixels)', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <?php $fonts = cnhk_ss::get_instance()->get_font_stacks(); ?>
                            <select class="font">
                            <option value=""></option>
                            <?php foreach( $fonts as $key => $value ) : ?>
                            <option value="<?php echo esc_attr( $key ); ?>" data-ff="<?php echo esc_attr( $value ); ?>"><?php echo $key; ?></option>
                            <?php endforeach; ?>
                            </select>
                            <p class="desc"><?php _e( 'font family', 'cnhk-ss' ); ?></p>
                        </div>
                        <p class="fields-head"><?php _e( 'Background', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <input class="color-input bg-color" value="" />
                            <p class="desc"><?php _e( 'background color', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <div class="slider-input bg-opacity" data-val="" data-min="0" data-max="1" data-step="0.05"></div>
                            <p class="desc">
                                <?php _e( 'background opacity', 'cnhk-ss' ); ?><br />
                                <i class="dashicons dashicons-info"></i><em><?php _e( ' (does not work in IE 8)', 'cnhk-ss' ); ?></em>
                            </p>
                        </div>
                        
                        <p class="fields-head"><?php _e( 'Padding', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <div class="slider-input pad-horz" data-val="" data-min="0" data-max="30" data-step="0.5"></div>
                            <p class="desc"><?php _e( 'horizontal padding', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <div class="slider-input pad-vert" data-val="" data-min="0" data-max="30" data-step="0.5"></div>
                            <p class="desc"><?php _e( 'vertical padding', 'cnhk-ss' ); ?></p>
                        </div>
                        <p class="fields-head"><?php _e( 'Border', 'cnhk-ss' ); ?></p>
                        <div class="styling-field">
                            <select class="border-style">
                                <option value="none"><?php _e( 'none', 'cnhk-ss' ); ?></option>
                                <option value="solid"><?php _e( 'solid', 'cnhk-ss' ); ?></option>
                                <option value="dashed"><?php _e( 'dashed', 'cnhk-ss' ); ?></option>
                                <option value="dotted"><?php _e( 'dotted', 'cnhk-ss' ); ?></option>
                            </select>
                            <p class="desc"><?php _e( 'border style', 'cnhk-ss' );?></p>
                        </div>
                        <div class="styling-field">
                            <div class="slider-input border-width" data-val="" data-min="1" data-max="10" data-step="1"></div>
                            <p class="desc"><?php _e( 'border width', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                            <input class="color-input border-color" value="" />
                            <p class="desc"><?php _e( 'border color', 'cnhk-ss' ); ?></p>
                        </div>
                        <div class="styling-field">
                        <p class="fields-head"><?php _e( 'rounded corner (in px)', 'cnhk-ss' ); ?></p>
                            <span><?php _e( 'Top left', 'cnhk-ss' ); ?>:&nbsp;&nbsp;<input type="number" class="cnhk-number bdr bdr-tl" value=""/></span><br />
                            <span><?php _e( 'Top right', 'cnhk-ss' ); ?>:&nbsp;&nbsp;<input type="number" class="cnhk-number bdr bdr-tr" value=""/></span><br />
                            <span><?php _e( 'Bottom left', 'cnhk-ss' ); ?>:&nbsp;&nbsp;<input type="number" class="cnhk-number bdr bdr-bl" value=""/></span><br />
                            <span><?php _e( 'Bottom right', 'cnhk-ss' ); ?>:&nbsp;&nbsp;<input type="number" class="cnhk-number bdr bdr-br" value=""/></span><br />
                            <p class="desc">
                                <i class="dashicons dashicons-info"></i><em><?php _e( ' (not working in IE 8)', 'cnhk-ss' ); ?></em>
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="apply-styling-div">
    <button id="apply-caption-styling" class="button button-primary alignright"><?php _e( 'Apply changes', 'cnhk-ss' ); ?></button>
</div>
