<?php
/**
 * Custom Post Type Registration
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_Post_Type {
    /**
     * Initialize the class
     */
    public static function init() {
        add_action('init', [__CLASS__, 'register_post_type']);
        add_filter('post_updated_messages', [__CLASS__, 'updated_messages']);
    }

    /**
     * Register the personalized_design custom post type
     */
    public static function register_post_type() {
        $labels = [
            'name'                  => _x('Personalized Designs', 'Post type general name', 'roihin-personalized'),
            'singular_name'         => _x('Personalized Design', 'Post type singular name', 'roihin-personalized'),
            'menu_name'             => _x('Personalized Designs', 'Admin Menu text', 'roihin-personalized'),
            'name_admin_bar'        => _x('Personalized Design', 'Add New on Toolbar', 'roihin-personalized'),
            'add_new'               => __('Add New Design', 'roihin-personalized'),
            'add_new_item'          => __('Add New Personalized Design', 'roihin-personalized'),
            'new_item'              => __('New Design', 'roihin-personalized'),
            'edit_item'             => __('Edit Design', 'roihin-personalized'),
            'view_item'             => __('View Design', 'roihin-personalized'),
            'all_items'             => __('All Designs', 'roihin-personalized'),
            'search_items'          => __('Search Designs', 'roihin-personalized'),
            'parent_item_colon'     => __('Parent Designs:', 'roihin-personalized'),
            'not_found'             => __('No designs found.', 'roihin-personalized'),
            'not_found_in_trash'    => __('No designs found in Trash.', 'roihin-personalized'),
            'featured_image'        => _x('Featured Image', 'Overrides the "Featured Image" phrase', 'roihin-personalized'),
            'set_featured_image'    => _x('Set featured image', 'Overrides the "Set featured image" phrase', 'roihin-personalized'),
            'remove_featured_image' => _x('Remove featured image', 'Overrides the "Remove featured image" phrase', 'roihin-personalized'),
            'use_featured_image'    => _x('Use as featured image', 'Overrides the "Use as featured image" phrase', 'roihin-personalized'),
            'archives'              => _x('Design archives', 'The post type archive label', 'roihin-personalized'),
            'insert_into_item'      => _x('Insert into design', 'Overrides the "Insert into post"/"Insert into page" phrase', 'roihin-personalized'),
            'uploaded_to_this_item' => _x('Uploaded to this design', 'Overrides the "Uploaded to this post"/"Uploaded to this page" phrase', 'roihin-personalized'),
            'filter_items_list'     => _x('Filter designs list', 'Screen reader text for the filter links', 'roihin-personalized'),
            'items_list_navigation' => _x('Designs list navigation', 'Screen reader text for the pagination', 'roihin-personalized'),
            'items_list'            => _x('Designs list', 'Screen reader text for the items list', 'roihin-personalized'),
        ];

        $args = [
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => ['slug' => 'personalized-designs', 'with_front' => false],
            'capability_type'    => ['personalized_design', 'personalized_designs'],
            'map_meta_cap'       => true,
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 26,
            'menu_icon'          => 'dashicons-art',
            'supports'           => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'personalized-designs',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        ];

        register_post_type('personalized_design', $args);
    }

    /**
     * Custom post updated messages
     *
     * @param array $messages Existing messages.
     * @return array Updated messages.
     */
    public static function updated_messages($messages) {
        global $post, $post_ID;

        $permalink = get_permalink($post_ID);

        $messages['personalized_design'] = [
            0  => '', // Unused. Messages start at index 1.
            1  => sprintf(__('Design updated. <a href="%s">View design</a>', 'roihin-personalized'), esc_url($permalink)),
            2  => __('Custom field updated.', 'roihin-personalized'),
            3  => __('Custom field deleted.', 'roihin-personalized'),
            4  => __('Design updated.', 'roihin-personalized'),
            /* translators: %s: date and time of the revision */
            5  => isset($_GET['revision']) ? sprintf(__('Design restored to revision from %s', 'roihin-personalized'), wp_post_revision_title((int) $_GET['revision'], false)) : false,
            6  => sprintf(__('Design published. <a href="%s">View design</a>', 'roihin-personalized'), esc_url($permalink)),
            7  => __('Design saved.', 'roihin-personalized'),
            8  => sprintf(__('Design submitted. <a target="_blank" href="%s">Preview design</a>', 'roihin-personalized'), esc_url(add_query_arg('preview', 'true', $permalink))),
            9  => sprintf(
                /* translators: 1: Publish box date format, see https://secure.php.net/date */
                __('Design scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview design</a>', 'roihin-personalized'),
                date_i18n(__('M j, Y @ G:i', 'roihin-personalized'), strtotime($post->post_date)),
                esc_url($permalink)
            ),
            10 => sprintf(__('Design draft updated. <a target="_blank" href="%s">Preview design</a>', 'roihin-personalized'), esc_url(add_query_arg('preview', 'true', $permalink))),
        ];

        return $messages;
    }
}
