<?php
/**
 * Plugin Name: Roihin Crystal Manager
 * Plugin URI: https://roihin.precisiondevlab.com
 * Description: Manage crystal/mineral products with full CRUD functionality, ACF fields, and REST API integration for Next.js frontend
 * Version: 1.0.0
 * Author: Roihin
 * Author URI: https://roihin.precisiondevlab.com
 * Text Domain: roihin-crystal
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('ROIHIN_CRYSTAL_VERSION', '1.0.0');
define('ROIHIN_CRYSTAL_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ROIHIN_CRYSTAL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ROIHIN_CRYSTAL_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Plugin Class
 */
class Roihin_Crystal_Manager {

    /**
     * Singleton instance
     */
    private static $instance = null;

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        // Load plugin textdomain
        add_action('plugins_loaded', [$this, 'load_textdomain']);

        // Register custom post type
        add_action('init', [$this, 'register_crystal_post_type']);

        // Register custom image sizes
        add_action('after_setup_theme', [$this, 'register_image_sizes']);

        // Include plugin files
        $this->includes();

        // Activation/Deactivation hooks
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
    }

    /**
     * Load plugin textdomain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'roihin-crystal',
            false,
            dirname(ROIHIN_CRYSTAL_PLUGIN_BASENAME) . '/languages'
        );
    }

    /**
     * Include required plugin files
     */
    private function includes() {
        // ACF Field Definitions
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/acf-fields.php';

        // REST API Customization
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/rest-api.php';

        // Admin UI Customization
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/admin.php';

        // Validation Functions
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/validation.php';

        // Sample Data Installer
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/sample-data-installer.php';

        // Sample Data Admin Page
        require_once ROIHIN_CRYSTAL_PLUGIN_DIR . 'includes/admin-sample-data-page.php';
    }

    /**
     * Register Crystal Custom Post Type
     */
    public function register_crystal_post_type() {
        $labels = [
            'name'                  => _x('Crystals', 'Post type general name', 'roihin-crystal'),
            'singular_name'         => _x('Crystal', 'Post type singular name', 'roihin-crystal'),
            'menu_name'             => _x('Crystals', 'Admin Menu text', 'roihin-crystal'),
            'name_admin_bar'        => _x('Crystal', 'Add New on Toolbar', 'roihin-crystal'),
            'add_new'               => __('Add New', 'roihin-crystal'),
            'add_new_item'          => __('Add New Crystal', 'roihin-crystal'),
            'new_item'              => __('New Crystal', 'roihin-crystal'),
            'edit_item'             => __('Edit Crystal', 'roihin-crystal'),
            'view_item'             => __('View Crystal', 'roihin-crystal'),
            'all_items'             => __('All Crystals', 'roihin-crystal'),
            'search_items'          => __('Search Crystals', 'roihin-crystal'),
            'parent_item_colon'     => __('Parent Crystals:', 'roihin-crystal'),
            'not_found'             => __('No crystals found.', 'roihin-crystal'),
            'not_found_in_trash'    => __('No crystals found in Trash.', 'roihin-crystal'),
            'featured_image'        => _x('Crystal Main Image', 'Overrides the "Featured Image" phrase', 'roihin-crystal'),
            'set_featured_image'    => _x('Set main image', 'Overrides the "Set featured image" phrase', 'roihin-crystal'),
            'remove_featured_image' => _x('Remove main image', 'Overrides the "Remove featured image" phrase', 'roihin-crystal'),
            'use_featured_image'    => _x('Use as main image', 'Overrides the "Use as featured image" phrase', 'roihin-crystal'),
            'archives'              => _x('Crystal archives', 'The post type archive label', 'roihin-crystal'),
            'insert_into_item'      => _x('Insert into crystal', 'Overrides the "Insert into post" phrase', 'roihin-crystal'),
            'uploaded_to_this_item' => _x('Uploaded to this crystal', 'Overrides the "Uploaded to this post" phrase', 'roihin-crystal'),
            'filter_items_list'     => _x('Filter crystals list', 'Screen reader text for the filter links', 'roihin-crystal'),
            'items_list_navigation' => _x('Crystals list navigation', 'Screen reader text for the pagination', 'roihin-crystal'),
            'items_list'            => _x('Crystals list', 'Screen reader text for the items list', 'roihin-crystal'),
        ];

        $args = [
            'labels'                => $labels,
            'description'           => __('Crystal and mineral products', 'roihin-crystal'),
            'public'                => true,
            'publicly_queryable'    => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'query_var'             => true,
            'rewrite'               => ['slug' => 'crystal'],
            'capability_type'       => 'post',
            'has_archive'           => true,
            'hierarchical'          => false,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-lightbulb',
            'supports'              => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'show_in_rest'          => true,
            'rest_base'             => 'crystal',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        ];

        register_post_type('crystal', $args);

        // Register taxonomy for crystal categories (optional, for better organization)
        $this->register_crystal_taxonomy();
    }

    /**
     * Register Crystal Category Taxonomy
     */
    private function register_crystal_taxonomy() {
        $labels = [
            'name'              => _x('Crystal Categories', 'taxonomy general name', 'roihin-crystal'),
            'singular_name'     => _x('Crystal Category', 'taxonomy singular name', 'roihin-crystal'),
            'search_items'      => __('Search Categories', 'roihin-crystal'),
            'all_items'         => __('All Categories', 'roihin-crystal'),
            'parent_item'       => __('Parent Category', 'roihin-crystal'),
            'parent_item_colon' => __('Parent Category:', 'roihin-crystal'),
            'edit_item'         => __('Edit Category', 'roihin-crystal'),
            'update_item'       => __('Update Category', 'roihin-crystal'),
            'add_new_item'      => __('Add New Category', 'roihin-crystal'),
            'new_item_name'     => __('New Category Name', 'roihin-crystal'),
            'menu_name'         => __('Categories', 'roihin-crystal'),
        ];

        $args = [
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'crystal-category'],
            'show_in_rest'      => true,
        ];

        register_taxonomy('crystal_category', ['crystal'], $args);
    }

    /**
     * Register custom image sizes for crystals
     */
    public function register_image_sizes() {
        // Thumbnail size (400x400)
        add_image_size('crystal-thumbnail', 400, 400, true);

        // Medium size (800x800)
        add_image_size('crystal-medium', 800, 800, true);

        // Large size (1200x1200)
        add_image_size('crystal-large', 1200, 1200, true);

        // Set JPEG quality
        add_filter('jpeg_quality', function() {
            return 85;
        });

        add_filter('wp_editor_set_quality', function() {
            return 85;
        });
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Register post type
        $this->register_crystal_post_type();

        // Flush rewrite rules
        flush_rewrite_rules();

        // Set plugin version
        update_option('roihin_crystal_version', ROIHIN_CRYSTAL_VERSION);
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}

/**
 * Initialize the plugin
 */
function roihin_crystal_manager_init() {
    return Roihin_Crystal_Manager::get_instance();
}

// Start the plugin
roihin_crystal_manager_init();
