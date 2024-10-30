=== Cnhk Slideshow [ENDED] ===
Contributors: cnhk_systems
Tags: slideshow, slider, images, responsive slider, banner rotator, mobile slider, swipe, touch slider, youtube slider, vimeo slider, layer, animated layer, animated caption
Requires at least: 4.3
Tested up to: 4.5
Stable tag: 3.1.1
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.de.html

Fast setup and easy to use, responsive and touch enabled slideshow plugin for WordPress with WYSIWYG editors and animation builders.

== Description ==

> Development ended. No more enhancement will be added, but I will still fix critical bugs (if any)

Cnhk Slideshow is an easy to use but powerful slider plugin. You can use images, videos or HTML contents. The plugin is based on [Jssor Slider](http://www.jssor.com/). You can use one of the hundreds of predefined effects or build your own.

> <strong>Features</strong>
>
> * Responsive and touch enabled
> * Layers and animated captions
> * YouTube and Vimeo slides with an auto-pause function when video is played
> * Allow usage of Google Fonts and [Font Awesome](http://fontawesome.io/icons/)
> * Animation builders
> * WYSIWYG editors for content, style and animation timing
> * Multiple combinations of navigators (arrows, bullets and thumbnails for images)

For detailed instructions on how to use those features see the [online manual](http://cnhk-systems.com/getting-started/). A [live demo](http://cnhk-systems.com/slider/) is also available.

= Use in themes =

`<?php if ( function_exists( "cnhk_slideshow" ) ) cnhk_slideshow( 121 ); ?>`

= Shortcode =

`[cnhk_slideshow id=121]`

= Widget =

A slider widget is also available.

Localization: French

= Important warning for users of old 1.x and 2.x versions =
The version 3 is a totally new plugin, it was designed with completely different principles and use different assets and therefore is not compatible with all older versions.
An upgrade will just erase your existing sliders.

== Installation ==

= Using The WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Search for 'cnhk slideshow'
3. Click 'Install Now'
4. Activate Cnhk Slideshow on the Plugin dashboard

= Uploading in WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `cnhk-slideshow.zip` from your computer
4. Click 'Install Now'
4. Activate Cnhk Slideshow on the Plugin dashboard

= Using FTP =

1. Download `cnhk-slideshow.zip`
2. Extract the `cnhk-slideshow` directory to your computer
3. Upload the `cnhk-slideshow` directory to the `/wp-content/plugins/` directory
4. Activate Cnhk Slideshow on the Plugin dashboard

== Frequently Asked Questions ==

= Does this plugin support Multisite =

Yes, from the version 3 it works on multisite installations.

== Screenshots ==

1. The slider edit page
2. The style editor
3. Google Fonts page
4. The timing editor

== Changelog ==

= 3.1.1 =

* fix fatal error when calling slider directly by template tags
* fix typo in generating custom columns content in slider list in the dashboard

= 3.1 =

* fix not same origin error for nav-thumb

= 3.0.3 =

* fix the 1 pixel movement bug with style editor when positions are entered manually

= 3.0.2 =

* added the missing template tag (cnhk_slideshow)
* load textdomain earlier in ss class

= 3.0.1 =

* added French translations
* misc typos correction
* fixed a PHP warning in the DB class ./includes/class-db.php
* added the block for eventual DB update in the future

= 3.0 =

* totally new plugin
* use custom post type
* use Jssor
* use squire
* use Font Awesome

= 2.2 =

* Multiple files upload possibility added.
* Random display order capability added.
* Changed the slide representation to a simple <div /> tag in slide sorting page (ease of use in case of numerous slides).

= 2.1.1 =

* Fixed a small bug in the main class

= 2.1 =

* Added the caption capability.
* Misc css adjustment.
* Put some texts in the "common texts" array property of the main class, in order to avoid possible issues on translated versions.

= 2.0.2 =

* Fixed bugs reported on the support forum of wordpress.org.
* Added tile transitions from cycle2. (tileBlend and tileSlide).
* Prev/Next button image resized. (48x48 => 36x36)

= 2.0.1 =

* Added the forgotten swipe functionality related file.
* Added a fix for the swipe functionality with iOS 6.

= 2.0 =

* Source code structure completely renewed. Switched to OOP.
* Moved the slides directory in a subfolder of the standard uploads directory. So, slides are no more deleted when upgrading the plugin.
* Removed the background functionality.
* Added launch methods and the capability to skip all uncompletely loaded images.
* Slide can now be used multiple times in one or more slideshow.
* Switched to jQuery.Cycle2 plugin.
* Navigation buttons redesigned, new graphics created for admin pages icons.
* Translation ready.

= 1.1.1 =

* Fixed bugs. An image with 'none' as src was added if there is no background.
* Background is now resized to fit the container before the slideshow starts.
* Fixed bug in ajax.php which causes problem when trying to set a slide as "Unused" while it is still used (and ordered) inside a slideshow.

= 1.1 =

* Added transparency support *(.png files)*
* Added dynamic edition *(ajax)* of slide's properties
* Added optional background image
* Added new navigation buttons
* Added uninstall.php for a separate (from deactivation) uninstallation process

= 1.0 =

* initial release
