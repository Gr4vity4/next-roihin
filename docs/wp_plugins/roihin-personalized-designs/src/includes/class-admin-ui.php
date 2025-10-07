<?php
/**
 * Admin UI Enhancements
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_Admin_UI {
    /**
     * Initialize the class
     */
    public static function init() {
        // Custom admin columns
        add_filter('manage_personalized_design_posts_columns', [__CLASS__, 'custom_columns']);
        add_action('manage_personalized_design_posts_custom_column', [__CLASS__, 'custom_column_content'], 10, 2);
        add_filter('manage_edit-personalized_design_sortable_columns', [__CLASS__, 'sortable_columns']);

        // Bulk actions
        add_filter('bulk_actions-edit-personalized_design', [__CLASS__, 'register_bulk_actions']);
        add_filter('handle_bulk_actions-edit-personalized_design', [__CLASS__, 'handle_bulk_actions'], 10, 3);

        // Admin notices
        add_action('admin_notices', [__CLASS__, 'admin_notices']);

        // Enqueue admin styles and scripts
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);

        // Add meta boxes
        add_action('add_meta_boxes', [__CLASS__, 'add_meta_boxes']);

        // Quick edit support
        add_action('quick_edit_custom_box', [__CLASS__, 'quick_edit_fields'], 10, 2);
    }

    /**
     * Add custom admin columns
     */
    public static function custom_columns($columns) {
        $new_columns = [];

        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;

            if ($key === 'title') {
                $new_columns['design_thumbnail'] = __('Thumbnail', 'roihin-personalized');
                $new_columns['designer'] = __('Designer', 'roihin-personalized');
                $new_columns['design_date'] = __('Design Date', 'roihin-personalized');
                $new_columns['stones_count'] = __('Stones', 'roihin-personalized');
                $new_columns['avg_rating'] = __('Avg Rating', 'roihin-personalized');
            }
        }

        return $new_columns;
    }

    /**
     * Display custom column content
     */
    public static function custom_column_content($column, $post_id) {
        switch ($column) {
            case 'design_thumbnail':
                $gallery = get_field('design_gallery', $post_id);
                if ($gallery && !empty($gallery)) {
                    $first_image = reset($gallery);
                    if (isset($first_image['sizes']['thumbnail'])) {
                        echo '<img src="' . esc_url($first_image['sizes']['thumbnail']) . '" width="50" height="50" style="object-fit:cover;border-radius:4px;" />';
                    }
                } else {
                    echo '—';
                }
                break;

            case 'designer':
                $designer_info = get_field('designer_info', $post_id);
                echo esc_html($designer_info['designer_name'] ?? '—');
                break;

            case 'design_date':
                $designer_info = get_field('designer_info', $post_id);
                if ($designer_info && !empty($designer_info['design_date'])) {
                    echo date_i18n('j F Y', strtotime($designer_info['design_date']));
                } else {
                    echo '—';
                }
                break;

            case 'stones_count':
                $stones = get_field('stones_used', $post_id);
                echo count($stones ?: []);
                break;

            case 'avg_rating':
                $energy_props = get_field('energy_properties', $post_id);
                if ($energy_props && is_array($energy_props)) {
                    $ratings = array_column($energy_props, 'rating');
                    if (!empty($ratings)) {
                        $total = array_sum($ratings);
                        $avg = $total / count($ratings);
                        echo number_format($avg, 1) . '/8';
                    } else {
                        echo '—';
                    }
                } else {
                    echo '—';
                }
                break;
        }
    }

    /**
     * Make columns sortable
     */
    public static function sortable_columns($columns) {
        $columns['design_date'] = 'design_date';
        $columns['stones_count'] = 'stones_count';
        return $columns;
    }

    /**
     * Register bulk actions
     */
    public static function register_bulk_actions($bulk_actions) {
        $bulk_actions['rpd_duplicate'] = __('Duplicate', 'roihin-personalized');
        $bulk_actions['rpd_export_json'] = __('Export as JSON', 'roihin-personalized');
        return $bulk_actions;
    }

    /**
     * Handle bulk actions
     */
    public static function handle_bulk_actions($redirect_to, $action, $post_ids) {
        if ($action === 'rpd_duplicate') {
            foreach ($post_ids as $post_id) {
                self::duplicate_design($post_id);
            }
            $redirect_to = add_query_arg('rpd_duplicated', count($post_ids), $redirect_to);
        }

        if ($action === 'rpd_export_json') {
            self::export_designs_json($post_ids);
            exit;
        }

        return $redirect_to;
    }

    /**
     * Duplicate a design
     */
    private static function duplicate_design($post_id) {
        $post = get_post($post_id);
        if (!$post) {
            return false;
        }

        $new_post = [
            'post_title'   => $post->post_title . ' (' . __('Copy', 'roihin-personalized') . ')',
            'post_content' => $post->post_content,
            'post_status'  => 'draft',
            'post_type'    => 'personalized_design',
            'post_author'  => get_current_user_id(),
        ];

        $new_post_id = wp_insert_post($new_post);

        if (!is_wp_error($new_post_id)) {
            // Copy ACF fields
            $fields = get_fields($post_id);
            if ($fields) {
                foreach ($fields as $key => $value) {
                    update_field($key, $value, $new_post_id);
                }
            }

            // Copy taxonomies
            $taxonomies = ['budget_level', 'stone_type'];
            foreach ($taxonomies as $taxonomy) {
                $terms = wp_get_post_terms($post_id, $taxonomy, ['fields' => 'ids']);
                if (!is_wp_error($terms)) {
                    wp_set_post_terms($new_post_id, $terms, $taxonomy);
                }
            }

            // Copy featured image
            $thumbnail_id = get_post_thumbnail_id($post_id);
            if ($thumbnail_id) {
                set_post_thumbnail($new_post_id, $thumbnail_id);
            }
        }

        return $new_post_id;
    }

    /**
     * Export designs as JSON
     */
    private static function export_designs_json($post_ids) {
        $designs = [];

        foreach ($post_ids as $post_id) {
            $post = get_post($post_id);
            if (!$post) {
                continue;
            }

            $designs[] = [
                'title'      => $post->post_title,
                'content'    => $post->post_content,
                'acf_fields' => get_fields($post_id),
                'budget_level' => wp_get_post_terms($post_id, 'budget_level', ['fields' => 'names']),
                'stone_types'  => wp_get_post_terms($post_id, 'stone_type', ['fields' => 'names']),
            ];
        }

        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="personalized-designs-export-' . date('Y-m-d') . '.json"');
        echo json_encode($designs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Display admin notices
     */
    public static function admin_notices() {
        if (isset($_GET['rpd_duplicated'])) {
            $count = intval($_GET['rpd_duplicated']);
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p>' . sprintf(_n('%d design duplicated.', '%d designs duplicated.', $count, 'roihin-personalized'), $count) . '</p>';
            echo '</div>';
        }
    }

    /**
     * Enqueue admin styles and scripts
     */
    public static function enqueue_admin_assets($hook) {
        // Only load on personalized_design edit pages
        if (!in_array($hook, ['post.php', 'post-new.php', 'edit.php'])) {
            return;
        }

        $screen = get_current_screen();
        if ($screen->post_type !== 'personalized_design') {
            return;
        }

        wp_enqueue_style(
            'rpd-admin-styles',
            RPD_PLUGIN_URL . 'admin/css/admin-styles.css',
            [],
            RPD_VERSION
        );

        wp_enqueue_script(
            'rpd-admin-scripts',
            RPD_PLUGIN_URL . 'admin/js/admin-scripts.js',
            ['jquery'],
            RPD_VERSION,
            true
        );
    }

    /**
     * Add custom meta boxes
     */
    public static function add_meta_boxes() {
        add_meta_box(
            'rpd_design_info',
            __('Design Information', 'roihin-personalized'),
            [__CLASS__, 'render_design_info_metabox'],
            'personalized_design',
            'side',
            'default'
        );
    }

    /**
     * Render design info meta box
     */
    public static function render_design_info_metabox($post) {
        $modification_count = get_post_meta($post->ID, '_modification_count', true);
        $last_modified_by = get_post_meta($post->ID, '_last_modified_by', true);

        echo '<div class="rpd-design-info">';
        echo '<p><strong>' . __('Modifications:', 'roihin-personalized') . '</strong> ' . ($modification_count ?: 0) . '</p>';

        if ($last_modified_by) {
            $user = get_userdata($last_modified_by);
            if ($user) {
                echo '<p><strong>' . __('Last Modified By:', 'roihin-personalized') . '</strong> ' . esc_html($user->display_name) . '</p>';
            }
        }
        echo '</div>';
    }

    /**
     * Quick edit fields
     */
    public static function quick_edit_fields($column_name, $post_type) {
        if ($post_type !== 'personalized_design') {
            return;
        }

        if ($column_name === 'budget_level') {
            $terms = get_terms(['taxonomy' => 'budget_level', 'hide_empty' => false]);
            ?>
            <fieldset class="inline-edit-col-right">
                <div class="inline-edit-col">
                    <label>
                        <span class="title"><?php _e('Budget Level', 'roihin-personalized'); ?></span>
                        <select name="budget_level">
                            <option value=""><?php _e('— No Change —', 'roihin-personalized'); ?></option>
                            <?php foreach ($terms as $term): ?>
                                <option value="<?php echo esc_attr($term->term_id); ?>">
                                    <?php echo esc_html($term->name); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </label>
                </div>
            </fieldset>
            <?php
        }
    }
}
