<?php
/**
 * Taxonomy Registration
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_Taxonomies {
    /**
     * Initialize the class
     */
    public static function init() {
        add_action('init', [__CLASS__, 'register_taxonomies']);
    }

    /**
     * Register custom taxonomies
     */
    public static function register_taxonomies() {
        self::register_stone_type_taxonomy();
        self::register_budget_level_taxonomy();
    }

    /**
     * Register Stone Types taxonomy
     */
    private static function register_stone_type_taxonomy() {
        $labels = [
            'name'                       => _x('Stone Types', 'taxonomy general name', 'roihin-personalized'),
            'singular_name'              => _x('Stone Type', 'taxonomy singular name', 'roihin-personalized'),
            'search_items'               => __('Search Stone Types', 'roihin-personalized'),
            'popular_items'              => __('Popular Stone Types', 'roihin-personalized'),
            'all_items'                  => __('All Stone Types', 'roihin-personalized'),
            'parent_item'                => null,
            'parent_item_colon'          => null,
            'edit_item'                  => __('Edit Stone Type', 'roihin-personalized'),
            'update_item'                => __('Update Stone Type', 'roihin-personalized'),
            'add_new_item'               => __('Add New Stone Type', 'roihin-personalized'),
            'new_item_name'              => __('New Stone Type Name', 'roihin-personalized'),
            'separate_items_with_commas' => __('Separate stone types with commas', 'roihin-personalized'),
            'add_or_remove_items'        => __('Add or remove stone types', 'roihin-personalized'),
            'choose_from_most_used'      => __('Choose from the most used stone types', 'roihin-personalized'),
            'not_found'                  => __('No stone types found.', 'roihin-personalized'),
            'menu_name'                  => __('Stone Types', 'roihin-personalized'),
            'back_to_items'              => __('&larr; Back to Stone Types', 'roihin-personalized'),
        ];

        $args = [
            'hierarchical'          => false,
            'labels'                => $labels,
            'show_ui'               => true,
            'show_admin_column'     => true,
            'show_in_rest'          => true,
            'rest_base'             => 'stone-types',
            'update_count_callback' => '_update_post_term_count',
            'query_var'             => true,
            'rewrite'               => ['slug' => 'stone', 'with_front' => false],
            'capabilities'          => [
                'manage_terms' => 'manage_categories',
                'edit_terms'   => 'manage_categories',
                'delete_terms' => 'manage_categories',
                'assign_terms' => 'edit_personalized_designs',
            ],
        ];

        register_taxonomy('stone_type', ['personalized_design'], $args);
    }

    /**
     * Register Budget Level taxonomy
     */
    private static function register_budget_level_taxonomy() {
        $labels = [
            'name'                       => _x('Budget Levels', 'taxonomy general name', 'roihin-personalized'),
            'singular_name'              => _x('Budget Level', 'taxonomy singular name', 'roihin-personalized'),
            'search_items'               => __('Search Budget Levels', 'roihin-personalized'),
            'popular_items'              => __('Popular Budget Levels', 'roihin-personalized'),
            'all_items'                  => __('All Budget Levels', 'roihin-personalized'),
            'parent_item'                => __('Parent Budget Level', 'roihin-personalized'),
            'parent_item_colon'          => __('Parent Budget Level:', 'roihin-personalized'),
            'edit_item'                  => __('Edit Budget Level', 'roihin-personalized'),
            'view_item'                  => __('View Budget Level', 'roihin-personalized'),
            'update_item'                => __('Update Budget Level', 'roihin-personalized'),
            'add_new_item'               => __('Add New Budget Level', 'roihin-personalized'),
            'new_item_name'              => __('New Budget Level Name', 'roihin-personalized'),
            'separate_items_with_commas' => __('Budget levels do not support multiple selections', 'roihin-personalized'),
            'add_or_remove_items'        => __('Add or remove budget levels', 'roihin-personalized'),
            'choose_from_most_used'      => __('Choose from the most used budget levels', 'roihin-personalized'),
            'not_found'                  => __('No budget levels found.', 'roihin-personalized'),
            'no_terms'                   => __('No budget levels', 'roihin-personalized'),
            'menu_name'                  => __('Budget Levels', 'roihin-personalized'),
            'items_list_navigation'      => __('Budget Levels list navigation', 'roihin-personalized'),
            'items_list'                 => __('Budget Levels list', 'roihin-personalized'),
            'most_used'                  => _x('Most Used', 'budget level', 'roihin-personalized'),
            'back_to_items'              => __('&larr; Back to Budget Levels', 'roihin-personalized'),
        ];

        $args = [
            'hierarchical'          => true,
            'labels'                => $labels,
            'show_ui'               => true,
            'show_admin_column'     => true,
            'show_in_rest'          => true,
            'rest_base'             => 'budget-levels',
            'query_var'             => true,
            'rewrite'               => ['slug' => 'budget', 'with_front' => false, 'hierarchical' => true],
            'capabilities'          => [
                'manage_terms' => 'manage_categories',
                'edit_terms'   => 'manage_categories',
                'delete_terms' => 'manage_categories',
                'assign_terms' => 'edit_personalized_designs',
            ],
        ];

        register_taxonomy('budget_level', ['personalized_design'], $args);
    }
}
