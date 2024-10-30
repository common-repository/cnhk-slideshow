<div id="scroll-wrap">
    <div id="caption-timing-wrap">
        <div id="timing-du-wrap">
            <div id="du-list">
                <div class="du" data-id="">
                    <input type="hidden" value="" class="cafx" />
                    <div class="du-com">
                        <div class="du-btn fx-list-btn">
                            <i class="fa fa-sign-in"></i>
                            <div class="du-tip"><?php _e( 'play in effect', 'cnhk-ss' ); ?></div>
                            <div class="fx-list">
                                <p>
                                    <label><?php _e( 'Your collections', 'cnhk-ss' ); ?></label><br/>
                                    <?php
                                        $args = array(
                                            'root' => 'caption',
                                            'class' => 'fx-select',
                                        );
                                        cnhk_fx_picker( $args );
                                    ?>
                                </p>
                                <p><button class="button-secondary load-cafx"><?php _e( 'load effect', 'cnhk-ss' ); ?></button></p>
                            </div>
                        </div>
                        <div class="du-btn t3-btn">
                            <i class="fa fa-sign-out"></i>
                            <div class="du-tip"><?php _e( 'immediate play out', 'cnhk-ss' ); ?></div>
                        </div>
                        <div class="du-btn remove-btn">
                            <i class="dashicons dashicons-no"></i>
                            <div class="du-tip"><?php _e( 'remove effect', 'cnhk-ss' ); ?></div>
                        </div>
                        <span class="caption-name-head"></span>
                    </div>
                    <div class="duration">
                        <div class="duration-hndle">
                        </div>
                    </div>
                </div>
                <div class="du2" data-id="">
                    <input type="hidden" value="" class="cafx" />
                    <div class="du-com">
                        <div class="du-btn fx-list-btn">
                            <i class="fa fa-sign-in"></i>
                            <div class="du-tip"><?php _e( 'play out effect', 'cnhk-ss' ); ?></div>
                            <div class="fx-list">
                                <p>
                                    <label><?php _e( 'Your collections', 'cnhk-ss' ); ?></label><br/>
                                    <?php
                                        $args = array(
                                            'root' => 'caption',
                                            'class' => 'fx-select',
                                        );
                                        cnhk_fx_picker( $args );
                                    ?>
                                </p>
                                <p><button class="button-secondary load-cafx"><?php _e( 'load effect', 'cnhk-ss' ); ?></button></p>
                            </div>
                        </div>
                        <div class="du-btn remove-btn">
                            <i class="dashicons dashicons-no"></i>
                            <div class="du-tip"><?php _e( 'remove effect', 'cnhk-ss' ); ?></div>
                        </div>
                        <span class="caption-name-head"></span>
                    </div>
                    <div class="duration">
                        <div class="duration-hndle">
                        </div>
                    </div>
                </div>
                <div class="du3" data-id="">
                    <input type="hidden" value="" class="cafx" />
                    <div class="du-com">
                        <span style="margin-left:1em;"><?php _e( 'Immediate play out transition', 'cnhk-ss' ); ?></span>
                        <div class="du-btn fx-list-btn">
                            <i class="fa fa-sign-out"></i>
                            <div class="du-tip"><?php _e( 'play out effect', 'cnhk-ss' ); ?></div>
                            <div class="fx-list">
                                <p>
                                    <label><?php _e( 'Your collections', 'cnhk-ss' ); ?></label><br/>
                                    <?php
                                        $args = array(
                                            'root' => 'caption',
                                            'class' => 'fx-select',
                                        );
                                        cnhk_fx_picker( $args );
                                    ?>
                                </p>
                                <p><button class="button-secondary load-cafx"><?php _e( 'load effect', 'cnhk-ss' ); ?></button></p>
                            </div>
                        </div>
                        <div class="du-btn remove-btn">
                            <i class="dashicons dashicons-no"></i>
                            <div class="du-tip"><?php _e( 'remove effect', 'cnhk-ss' ); ?></div>
                        </div>
                    </div>
                    <div class="duration">
                        <div class="duration-hndle" style="width:60%;"></div>
                    </div>
                </div>
            </div>
            <span id="duration"><?php _e( 'Play in duration (ms)', 'cnhk-ss' ); ?>&nbsp;:&nbsp;<input type="number" id="cadu" value="" /></span>
            <span id="du-com">
                <div class="com">
                    <i class="dashicons dashicons-visibility" id="goto-preview2"></i>
                    <div class="com-tip"><?php _e( 'Preview', 'cnhk-ss' ); ?></div>
                </div>
                <div class="com">
                    <i class="dashicons dashicons-arrow-right-alt2" id="goto-du2"></i>
                    <div class="com-tip"><?php _e( 'out effects', 'cnhk-ss' ); ?></div>
                </div>
            </span>
        </div>
        <div id="timing-du2-wrap">
            <div id="du2-list">
            </div>
            <span id="duration2"><?php _e( 'Play out duration (ms)', 'cnhk-ss' ); ?>&nbsp;:&nbsp;<input type="number" id="cadu2" value="" /></span>
            <span id="du2-com">
                <div class="com">
                    <i class="dashicons dashicons-arrow-left-alt2" id="goto-du1"></i>
                    <div class="com-tip"><?php _e( 'in effects', 'cnhk-ss' ); ?></div>
                </div>
                <div class="com">
                    <i class="dashicons dashicons-visibility" id="goto-preview"></i>
                    <div class="com-tip"><?php _e( 'Preview', 'cnhk-ss' ); ?></div>
                </div>
            </span>
        </div>
    </div>
    <div id="slide-preview-wrap">
        <div id="slide-preview-com">
            <div class="com">
                <i class="dashicons dashicons-controls-skipforward" id="replay"></i>
                <div class="com-tip"><?php _e( 'Play', 'cnhk-ss' ); ?></div>
            </div>
            <div class="com">
                <i class="dashicons dashicons-admin-generic" id="goto-du"></i>
                <div class="com-tip"><?php _e( 'Settings', 'cnhk-ss' ); ?></div>
            </div>
        </div>
        <div id="slide-preview"></div>
    </div>
</div>
<div id="apply-timing-wrap">
    <button id="apply-timing" class="button-primary"><?php _e( 'Apply changes', 'cnhk-ss' ); ?></button>
    <button id="cancel-timing" class="button-secondary"><?php _e( 'cancel', 'cnhk-ss' ); ?></button>
</div>