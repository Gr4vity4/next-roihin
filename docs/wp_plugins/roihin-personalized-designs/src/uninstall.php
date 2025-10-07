<?php
/**
 * Uninstall Script
 *
 * Fired when the plugin is uninstalled.
 *
 * @package ROIHIN_Personalized_Designs
 */

// If uninstall not called from WordPress, exit.
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Delete all personalized_design posts
 */
function rpd_delete_all_posts() {
    $posts = get_posts([
        'post_type'      => 'personalized_design',
        'posts_per_page' => -1,
        'post_status'    => 'any',
    ]);

    foreach ($posts as $post) {
        // Delete associated meta
        delete_post_meta($post->ID, '_last_modified_by');
        delete_post_meta($post->ID, '_modification_count');

        // Force delete (skip trash)
        wp_delete_post($post->ID, true);
    }
}

/**
 * Delete all taxonomies and terms
 */
function rpd_delete_taxonomies() {
    $taxonomies = ['budget_level', 'stone_type'];

    foreach ($taxonomies as $taxonomy) {
        $terms = get_terms([
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        ]);

        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                wp_delete_term($term->term_id, $taxonomy);
            }
        }
    }
}

/**
 * Remove capabilities from roles
 */
function rpd_remove_capabilities() {
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

    // Remove from administrator
    $role = get_role('administrator');
    if ($role) {
        foreach ($caps as $cap) {
            $role->remove_cap($cap);
        }
    }

    // Remove from editor
    $editor = get_role('editor');
    if ($editor) {
        $editor_caps = [
            'edit_personalized_design',
            'edit_personalized_designs',
            'publish_personalized_designs',
            'read_personalized_design',
        ];

        foreach ($editor_caps as $cap) {
            $editor->remove_cap($cap);
        }
    }
}

/**
 * Delete plugin options
 */
function rpd_delete_options() {
    delete_option('rpd_version');
    delete_option('rpd_settings');

    // Delete transients
    delete_transient('rpd_designs_cache');
}

/**
 * Clean up database
 */
function rpd_cleanup_database() {
    global $wpdb;

    // Delete orphaned post meta
    $wpdb->query("DELETE FROM {$wpdb->postmeta} WHERE post_id NOT IN (SELECT ID FROM {$wpdb->posts})");

    // Delete orphaned term relationships
    $wpdb->query("DELETE FROM {$wpdb->term_relationships} WHERE object_id NOT IN (SELECT ID FROM {$wpdb->posts})");

    // Optimize tables
    $wpdb->query("OPTIMIZE TABLE {$wpdb->posts}");
    $wpdb->query("OPTIMIZE TABLE {$wpdb->postmeta}");
    $wpdb->query("OPTIMIZE TABLE {$wpdb->terms}");
    $wpdb->query("OPTIMIZE TABLE {$wpdb->term_taxonomy}");
    $wpdb->query("OPTIMIZE TABLE {$wpdb->term_relationships}");
}

/**
 * Optional: Delete uploaded images
 * WARNING: This will permanently delete all gallery images
 * Comment out this function call if you want to keep the images
 */
function rpd_delete_uploaded_images() {
    // Get all personalized design posts
    $posts = get_posts([
        'post_type'      => 'personalized_design',
        'posts_per_page' => -1,
        'post_status'    => 'any',
    ]);

    foreach ($posts as $post) {
        // Get gallery images
        $gallery = get_field('design_gallery', $post->ID);

        if ($gallery && is_array($gallery)) {
            foreach ($gallery as $image) {
                // Only delete if attachment exists
                if (isset($image['id'])) {
                    wp_delete_attachment($image['id'], true);
                }
            }
        }

        // Delete featured image
        $thumbnail_id = get_post_thumbnail_id($post->ID);
        if ($thumbnail_id) {
            wp_delete_attachment($thumbnail_id, true);
        }
    }
}

/**
 * Run uninstall procedures
 */
function rpd_uninstall() {
    // Only proceed if user has proper permissions
    if (!current_user_can('activate_plugins')) {
        return;
    }

    // Verify the request
    check_admin_referer('bulk-plugins');

    // Delete all posts and meta
    rpd_delete_all_posts();

    // Delete taxonomies and terms
    rpd_delete_taxonomies();

    // Remove capabilities
    rpd_remove_capabilities();

    // Delete options
    rpd_delete_options();

    // Clean up database
    rpd_cleanup_database();

    // Optional: Delete uploaded images (commented out by default for safety)
    // Uncomment the next line if you want to delete all uploaded images
    // rpd_delete_uploaded_images();

    // Flush rewrite rules
    flush_rewrite_rules();

    // Log uninstall
    error_log('ROIHIN Personalized Designs Manager has been uninstalled');
}

// Execute uninstall
rpd_uninstall();
