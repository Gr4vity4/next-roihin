<?php
/**
 * Plugin Name: ROIHIN Personalized Designs Manager
 * Plugin URI: https://roihin.precisiondevlab.com
 * Description: Manage personalized bracelet designs with energy properties, stone compositions, and ratings
 * Version: 1.0.0
 * Author: ROIHIN Stone & Bracelet
 * Author URI: https://roihin.precisiondevlab.com
 * Text Domain: roihin-personalized
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('RPD_VERSION', '1.0.0');
define('RPD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RPD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('RPD_PLUGIN_FILE', __FILE__);
define('RPD_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Require dependencies
require_once RPD_PLUGIN_DIR . 'includes/class-post-type.php';
require_once RPD_PLUGIN_DIR . 'includes/class-taxonomies.php';
require_once RPD_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once RPD_PLUGIN_DIR . 'includes/class-admin-ui.php';
require_once RPD_PLUGIN_DIR . 'includes/class-validation.php';
require_once RPD_PLUGIN_DIR . 'includes/class-i18n.php';

/**
 * Initialize plugin
 */
function rpd_init() {
    // Load text domain
    RPD_I18n::init();

    // Register post type and taxonomies
    RPD_Post_Type::init();
    RPD_Taxonomies::init();

    // Setup REST API
    RPD_REST_API::init();

    // Setup admin UI
    if (is_admin()) {
        RPD_Admin_UI::init();
    }

    // Setup validation
    RPD_Validation::init();
}
add_action('plugins_loaded', 'rpd_init');

/**
 * Activation hook
 */
register_activation_hook(__FILE__, 'rpd_activate');
function rpd_activate() {
    // Check ACF Pro is installed and activated
    if (!function_exists('acf_add_local_field_group')) {
        deactivate_plugins(RPD_PLUGIN_BASENAME);
        wp_die(
            __('ROIHIN Personalized Designs Manager requires Advanced Custom Fields PRO to be installed and activated.', 'roihin-personalized'),
            __('Plugin Activation Error', 'roihin-personalized'),
            ['back_link' => true]
        );
    }

    // Register post type and flush rewrite rules
    RPD_Post_Type::init();
    RPD_Taxonomies::init();
    flush_rewrite_rules();

    // Add capabilities
    rpd_add_capabilities();

    // Create default budget level terms
    rpd_create_default_budget_levels();

    // Set plugin version
    update_option('rpd_version', RPD_VERSION);
}

/**
 * Deactivation hook
 */
register_deactivation_hook(__FILE__, 'rpd_deactivate');
function rpd_deactivate() {
    flush_rewrite_rules();
}

/**
 * Add custom capabilities to roles
 */
function rpd_add_capabilities() {
    $role = get_role('administrator');
    if ($role) {
        $caps = [
            'edit_personalized_design',
            'edit_personalized_designs',
            'edit_others_personalized_designs',
            'publish_personalized_designs',
            'read_personalized_design',
            'read_private_personalized_designs',
            'delete_personalized_design',
            'delete_personalized_designs',
        ];

        foreach ($caps as $cap) {
            $role->add_cap($cap);
        }
    }

    // Editor role - can edit but not delete
    $editor = get_role('editor');
    if ($editor) {
        $editor_caps = [
            'edit_personalized_design',
            'edit_personalized_designs',
            'publish_personalized_designs',
            'read_personalized_design',
        ];

        foreach ($editor_caps as $cap) {
            $editor->add_cap($cap);
        }
    }
}

/**
 * Create default budget level taxonomy terms
 */
function rpd_create_default_budget_levels() {
    $levels = [
        ['slug' => 'budget', 'name' => 'ระดับประหยัด (ต่ำกว่า 3,000)', 'name_en' => 'Budget (Under 3,000 THB)'],
        ['slug' => 'standard', 'name' => 'ระดับกลาง (3,000 - 5,000)', 'name_en' => 'Standard (3,000 - 5,000 THB)'],
        ['slug' => 'premium', 'name' => 'ระดับสูง (5,000 - 8,000)', 'name_en' => 'Premium (5,000 - 8,000 THB)'],
        ['slug' => 'luxury', 'name' => 'ระดับสูงสุด (8,000 ขึ้นไป)', 'name_en' => 'Luxury (8,000+ THB)'],
    ];

    foreach ($levels as $level) {
        if (!term_exists($level['slug'], 'budget_level')) {
            $term = wp_insert_term($level['name'], 'budget_level', ['slug' => $level['slug']]);

            // Store English name as term meta
            if (!is_wp_error($term) && isset($term['term_id'])) {
                update_term_meta($term['term_id'], 'name_en', $level['name_en']);
            }
        }
    }
}

/**
 * Helper function to get energy category names
 */
function rpd_get_energy_category_name($category, $lang = 'th') {
    $categories = [
        'finance_fortune' => [
            'th' => __('การเงิน โชคลาภ', 'roihin-personalized'),
            'en' => __('Finance & Fortune', 'roihin-personalized'),
        ],
        'work_business' => [
            'th' => __('การงาน ธุรกิจ การลงทุน', 'roihin-personalized'),
            'en' => __('Work, Business, Investment', 'roihin-personalized'),
        ],
        'love_happiness' => [
            'th' => __('ความรัก ความสุข โชคดี', 'roihin-personalized'),
            'en' => __('Love, Happiness, Luck', 'roihin-personalized'),
        ],
        'health_balance' => [
            'th' => __('สุขภาพ สมดุลชีวิต', 'roihin-personalized'),
            'en' => __('Health, Life Balance', 'roihin-personalized'),
        ],
        'spirituality' => [
            'th' => __('จิตวิญญาณ ความมั่นคง', 'roihin-personalized'),
            'en' => __('Spirituality, Stability', 'roihin-personalized'),
        ],
    ];

    return $categories[$category][$lang] ?? $category;
}

/**
 * Helper function to get rating labels
 */
function rpd_get_rating_label($rating, $lang = 'th') {
    $labels = [
        'excellent' => [
            'th' => __('ดีเยี่ยมที่สุด', 'roihin-personalized'),
            'en' => __('Excellent', 'roihin-personalized'),
        ],
        'very_good' => [
            'th' => __('ดีมาก', 'roihin-personalized'),
            'en' => __('Very Good', 'roihin-personalized'),
        ],
        'moderate' => [
            'th' => __('ปานกลาง', 'roihin-personalized'),
            'en' => __('Moderate', 'roihin-personalized'),
        ],
        'fair' => [
            'th' => __('พอใช้', 'roihin-personalized'),
            'en' => __('Fair', 'roihin-personalized'),
        ],
        'none' => [
            'th' => __('ไม่มี', 'roihin-personalized'),
            'en' => __('None', 'roihin-personalized'),
        ],
    ];

    if ($rating >= 5 && $rating <= 8) {
        return $labels['excellent'][$lang];
    } elseif ($rating === 4) {
        return $labels['very_good'][$lang];
    } elseif ($rating === 3) {
        return $labels['moderate'][$lang];
    } elseif ($rating >= 1 && $rating <= 2) {
        return $labels['fair'][$lang];
    } else {
        return $labels['none'][$lang];
    }
}
