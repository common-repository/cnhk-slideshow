<?php
/**
 * Plugin Name:     Cnhk Slideshow
 * Description:     Fast setup and easy to use, responsive and touch enabled slideshow plugin for WordPress with WYSIWYG editors and animation builders.
 * Version:         3.0.2
 * Author URI:      http://cnhk-systems.com/
 * License:         GLPv3
 * License URI:     http://www.gnu.org/licenses/gpl-3.0.de.html
 * Text Domain:     cnhk-ss
 * Domain Path:     /languages
 *
 * This program is a free software. you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'CNHK_VERSION', '3.0.2' );
define( 'CNHK_PATH', plugin_dir_path( __FILE__ ) );
define( 'CNHK_URL', plugin_dir_url( __FILE__ ) );
define( 'CNHK_CPT', 'cnhkss' );

// use minified scripts
define( 'CNHK_MINIFIED', true );

// main plugin class & WordPress related init ( CPT, widget )
require_once CNHK_PATH . 'includes/class-slider-widget.php';
require_once CNHK_PATH . 'includes/class-ss.php';
add_action( 'plugins_loaded', array( 'cnhk_ss', 'get_instance' ), 11 );

// plugin general options handling class
require_once CNHK_PATH . 'includes/class-db.php';
cnhk_db::get_instance();

// effects options handling
require_once CNHK_PATH . 'includes/class-fx.php';
cnhk_fx::get_instance();

// (de)activation functions
register_activation_hook( __FILE__, array( 'cnhk_ss', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'cnhk_ss', 'deactivate' ) );

// abstract classes
require_once CNHK_PATH . 'includes/class-template-abstract.php';
require_once CNHK_PATH . 'includes/class-slide-abstract.php';
require_once CNHK_PATH . 'includes/class-nav-abstract.php';

if ( is_admin() ) {
    // main admin files
    require_once CNHK_PATH . 'admin/admin-functions.php';
    require_once CNHK_PATH . 'admin/class-admin.php';
    cnhk_admin::get_instance();
    
    // admin only modules
    require_once CNHK_PATH . 'modules/overlay/overlay.php';
    require_once CNHK_PATH . 'modules/editor/editor.php';
    
    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
        // main class for AJAX
        include_once CNHK_PATH . 'admin/class-admin-ajax.php';
    }
} else {
    // front files
    require_once CNHK_PATH . 'public/class-public.php';
    require_once CNHK_PATH . 'public/functions.php';
    cnhk_public::get_instance();
}

cnhk_ss::load_modules( CNHK_PATH . 'modules' );
