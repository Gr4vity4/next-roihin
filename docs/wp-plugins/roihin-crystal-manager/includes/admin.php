<?php
/**
 * Admin UI Customization
 *
 * Customizes the WordPress admin interface for Crystal post type
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Customize admin columns for Crystal post type
 */
add_filter('manage_crystal_posts_columns', 'roihin_crystal_admin_columns');

function roihin_crystal_admin_columns($columns) {
    // Remove default columns
    unset($columns['date']);

    // Add custom columns
    $new_columns = [
        'cb' => $columns['cb'],
        'thumbnail' => __('Image', 'roihin-crystal'),
        'title' => __('Crystal Name', 'roihin-crystal'),
        'name_en' => __('English Name', 'roihin-crystal'),
        'name_th' => __('Thai Name', 'roihin-crystal'),
        'colors' => __('Colors', 'roihin-crystal'),
        'energy' => __('Energy Properties', 'roihin-crystal'),
        'zodiac' => __('Zodiac Signs', 'roihin-crystal'),
        'taxonomy-crystal_category' => __('Category', 'roihin-crystal'),
        'date' => __('Date', 'roihin-crystal'),
    ];

    return $new_columns;
}

/**
 * Populate custom admin columns
 */
add_action('manage_crystal_posts_custom_column', 'roihin_crystal_admin_column_content', 10, 2);

function roihin_crystal_admin_column_content($column, $post_id) {
    $acf = get_fields($post_id);

    switch ($column) {
        case 'thumbnail':
            $thumbnail_id = get_post_thumbnail_id($post_id);
            if ($thumbnail_id) {
                echo wp_get_attachment_image($thumbnail_id, [60, 60], false, [
                    'style' => 'border-radius: 4px;'
                ]);
            } else {
                echo '<span style="color: #999;">—</span>';
            }
            break;

        case 'name_en':
            echo esc_html($acf['crystal_name_en'] ?? '—');
            break;

        case 'name_th':
            echo esc_html($acf['crystal_name_th'] ?? '—');
            break;

        case 'colors':
            if (!empty($acf['color_filter']) && is_array($acf['color_filter'])) {
                $color_badges = [];
                foreach ($acf['color_filter'] as $color) {
                    $color_badges[] = roihin_crystal_get_color_badge($color);
                }
                echo implode(' ', $color_badges);
            } else {
                echo '<span style="color: #999;">—</span>';
            }
            break;

        case 'energy':
            if (!empty($acf['energy_properties']) && is_array($acf['energy_properties'])) {
                $energy_labels = array_map('roihin_crystal_get_energy_label', $acf['energy_properties']);
                echo '<span style="font-size: 12px;">' . implode(', ', array_slice($energy_labels, 0, 2)) . '</span>';
                if (count($energy_labels) > 2) {
                    echo '<br><span style="color: #999; font-size: 11px;">+' . (count($energy_labels) - 2) . ' more</span>';
                }
            } else {
                echo '<span style="color: #999;">—</span>';
            }
            break;

        case 'zodiac':
            if (!empty($acf['zodiac_signs']) && is_array($acf['zodiac_signs'])) {
                $zodiac_count = count($acf['zodiac_signs']);
                $first_three = array_slice($acf['zodiac_signs'], 0, 3);
                $zodiac_labels = array_map('roihin_crystal_get_zodiac_label', $first_three);
                echo '<span style="font-size: 12px;">' . implode(', ', $zodiac_labels) . '</span>';
                if ($zodiac_count > 3) {
                    echo '<br><span style="color: #999; font-size: 11px;">+' . ($zodiac_count - 3) . ' more</span>';
                }
            } else {
                echo '<span style="color: #999;">—</span>';
            }
            break;
    }
}

/**
 * Make custom columns sortable
 */
add_filter('manage_edit-crystal_sortable_columns', 'roihin_crystal_sortable_columns');

function roihin_crystal_sortable_columns($columns) {
    $columns['name_en'] = 'name_en';
    $columns['name_th'] = 'name_th';
    return $columns;
}

/**
 * Handle sorting for custom columns
 */
add_action('pre_get_posts', 'roihin_crystal_column_orderby');

function roihin_crystal_column_orderby($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    $orderby = $query->get('orderby');

    if ($orderby === 'name_en') {
        $query->set('meta_key', 'crystal_name_en');
        $query->set('orderby', 'meta_value');
    } elseif ($orderby === 'name_th') {
        $query->set('meta_key', 'crystal_name_th');
        $query->set('orderby', 'meta_value');
    }
}

/**
 * Get color badge HTML
 */
function roihin_crystal_get_color_badge($color) {
    $color_map = [
        'purple' => ['bg' => '#9333ea', 'label' => 'Purple'],
        'blue' => ['bg' => '#2563eb', 'label' => 'Blue'],
        'teal' => ['bg' => '#14b8a6', 'label' => 'Teal'],
        'green' => ['bg' => '#16a34a', 'label' => 'Green'],
        'yellow' => ['bg' => '#facc15', 'label' => 'Yellow'],
        'orange' => ['bg' => '#f97316', 'label' => 'Orange'],
        'red' => ['bg' => '#dc2626', 'label' => 'Red'],
        'light-blue' => ['bg' => '#38bdf8', 'label' => 'Sky'],
        'pink' => ['bg' => '#f472b6', 'label' => 'Pink'],
        'black' => ['bg' => '#000000', 'label' => 'Black'],
        'white' => ['bg' => '#ffffff', 'label' => 'White'],
        'beige' => ['bg' => '#fde68a', 'label' => 'Beige'],
    ];

    $color_info = $color_map[$color] ?? ['bg' => '#999', 'label' => ucfirst($color)];
    $border = ($color === 'white') ? 'border: 1px solid #ddd;' : '';

    return sprintf(
        '<span style="display: inline-block; width: 20px; height: 20px; background: %s; border-radius: 50%%; margin: 0 2px; vertical-align: middle; %s" title="%s"></span>',
        esc_attr($color_info['bg']),
        $border,
        esc_attr($color_info['label'])
    );
}

/**
 * Get energy property label
 */
function roihin_crystal_get_energy_label($key) {
    $labels = [
        'finance_fortune' => __('Finance', 'roihin-crystal'),
        'work_business' => __('Work', 'roihin-crystal'),
        'love_happiness' => __('Love', 'roihin-crystal'),
        'health_balance' => __('Health', 'roihin-crystal'),
        'spirituality_stability' => __('Spirituality', 'roihin-crystal'),
    ];

    return $labels[$key] ?? ucfirst(str_replace('_', ' ', $key));
}

/**
 * Get zodiac sign label
 */
function roihin_crystal_get_zodiac_label($key) {
    $labels = [
        'aries' => __('Aries', 'roihin-crystal'),
        'taurus' => __('Taurus', 'roihin-crystal'),
        'gemini' => __('Gemini', 'roihin-crystal'),
        'cancer' => __('Cancer', 'roihin-crystal'),
        'leo' => __('Leo', 'roihin-crystal'),
        'virgo' => __('Virgo', 'roihin-crystal'),
        'libra' => __('Libra', 'roihin-crystal'),
        'scorpio' => __('Scorpio', 'roihin-crystal'),
        'sagittarius' => __('Sagittarius', 'roihin-crystal'),
        'capricorn' => __('Capricorn', 'roihin-crystal'),
        'aquarius' => __('Aquarius', 'roihin-crystal'),
        'pisces' => __('Pisces', 'roihin-crystal'),
    ];

    return $labels[$key] ?? ucfirst($key);
}

/**
 * Add filters to admin list
 */
add_action('restrict_manage_posts', 'roihin_crystal_admin_filters');

function roihin_crystal_admin_filters($post_type) {
    if ($post_type !== 'crystal') {
        return;
    }

    // Color filter
    $selected_color = isset($_GET['admin_color_filter']) ? $_GET['admin_color_filter'] : '';
    ?>
    <select name="admin_color_filter">
        <option value=""><?php _e('All Colors', 'roihin-crystal'); ?></option>
        <option value="purple" <?php selected($selected_color, 'purple'); ?>><?php _e('Purple', 'roihin-crystal'); ?></option>
        <option value="blue" <?php selected($selected_color, 'blue'); ?>><?php _e('Blue', 'roihin-crystal'); ?></option>
        <option value="teal" <?php selected($selected_color, 'teal'); ?>><?php _e('Teal', 'roihin-crystal'); ?></option>
        <option value="green" <?php selected($selected_color, 'green'); ?>><?php _e('Green', 'roihin-crystal'); ?></option>
        <option value="yellow" <?php selected($selected_color, 'yellow'); ?>><?php _e('Yellow', 'roihin-crystal'); ?></option>
        <option value="orange" <?php selected($selected_color, 'orange'); ?>><?php _e('Orange', 'roihin-crystal'); ?></option>
        <option value="red" <?php selected($selected_color, 'red'); ?>><?php _e('Red', 'roihin-crystal'); ?></option>
        <option value="light-blue" <?php selected($selected_color, 'light-blue'); ?>><?php _e('Light Blue', 'roihin-crystal'); ?></option>
        <option value="pink" <?php selected($selected_color, 'pink'); ?>><?php _e('Pink', 'roihin-crystal'); ?></option>
        <option value="black" <?php selected($selected_color, 'black'); ?>><?php _e('Black', 'roihin-crystal'); ?></option>
        <option value="white" <?php selected($selected_color, 'white'); ?>><?php _e('White', 'roihin-crystal'); ?></option>
        <option value="beige" <?php selected($selected_color, 'beige'); ?>><?php _e('Beige', 'roihin-crystal'); ?></option>
    </select>

    <?php
    // Energy properties filter
    $selected_energy = isset($_GET['admin_energy_filter']) ? $_GET['admin_energy_filter'] : '';
    ?>
    <select name="admin_energy_filter">
        <option value=""><?php _e('All Energy Properties', 'roihin-crystal'); ?></option>
        <option value="finance_fortune" <?php selected($selected_energy, 'finance_fortune'); ?>><?php _e('Finance, Fortune', 'roihin-crystal'); ?></option>
        <option value="work_business" <?php selected($selected_energy, 'work_business'); ?>><?php _e('Work, Business', 'roihin-crystal'); ?></option>
        <option value="love_happiness" <?php selected($selected_energy, 'love_happiness'); ?>><?php _e('Love, Happiness', 'roihin-crystal'); ?></option>
        <option value="health_balance" <?php selected($selected_energy, 'health_balance'); ?>><?php _e('Health, Balance', 'roihin-crystal'); ?></option>
        <option value="spirituality_stability" <?php selected($selected_energy, 'spirituality_stability'); ?>><?php _e('Spirituality, Stability', 'roihin-crystal'); ?></option>
    </select>
    <?php
}

/**
 * Apply admin filters
 */
add_filter('parse_query', 'roihin_crystal_admin_filter_query');

function roihin_crystal_admin_filter_query($query) {
    global $pagenow;

    if (!is_admin() || $pagenow !== 'edit.php' || !isset($_GET['post_type']) || $_GET['post_type'] !== 'crystal') {
        return;
    }

    $meta_query = [];

    // Color filter
    if (!empty($_GET['admin_color_filter'])) {
        $meta_query[] = [
            'key' => 'color_filter',
            'value' => '"' . sanitize_text_field($_GET['admin_color_filter']) . '"',
            'compare' => 'LIKE',
        ];
    }

    // Energy filter
    if (!empty($_GET['admin_energy_filter'])) {
        $meta_query[] = [
            'key' => 'energy_properties',
            'value' => '"' . sanitize_text_field($_GET['admin_energy_filter']) . '"',
            'compare' => 'LIKE',
        ];
    }

    if (!empty($meta_query)) {
        $query->set('meta_query', $meta_query);
    }
}

/**
 * Add admin notices for validation errors
 */
add_action('admin_notices', 'roihin_crystal_admin_notices');

function roihin_crystal_admin_notices() {
    global $post, $pagenow;

    if ($pagenow !== 'post.php' && $pagenow !== 'post-new.php') {
        return;
    }

    if (!isset($post) || $post->post_type !== 'crystal') {
        return;
    }

    // Check if there are any validation errors stored in transients
    $errors = get_transient('roihin_crystal_validation_errors_' . get_current_user_id());

    if ($errors && is_array($errors)) {
        foreach ($errors as $error) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p><strong><?php _e('Crystal Validation Error:', 'roihin-crystal'); ?></strong> <?php echo esc_html($error); ?></p>
            </div>
            <?php
        }
        delete_transient('roihin_crystal_validation_errors_' . get_current_user_id());
    }
}

/**
 * Add help tab to Crystal edit screen
 */
add_action('load-post.php', 'roihin_crystal_add_help_tab');
add_action('load-post-new.php', 'roihin_crystal_add_help_tab');

function roihin_crystal_add_help_tab() {
    $screen = get_current_screen();

    if (!$screen || $screen->post_type !== 'crystal') {
        return;
    }

    $screen->add_help_tab([
        'id' => 'roihin_crystal_help',
        'title' => __('Crystal Fields Help', 'roihin-crystal'),
        'content' => '
            <h3>' . __('Crystal Product Fields', 'roihin-crystal') . '</h3>
            <p>' . __('Fill in all required fields to create a complete crystal product:', 'roihin-crystal') . '</p>
            <ul>
                <li><strong>' . __('Basic Information:', 'roihin-crystal') . '</strong> ' . __('Enter English and Thai names, upload main image and gallery.', 'roihin-crystal') . '</li>
                <li><strong>' . __('Properties:', 'roihin-crystal') . '</strong> ' . __('Select chakra, zodiac compatibility, planet, and colors.', 'roihin-crystal') . '</li>
                <li><strong>' . __('Description:', 'roihin-crystal') . '</strong> ' . __('Add detailed paragraphs and attributes summary.', 'roihin-crystal') . '</li>
                <li><strong>' . __('Filter Settings:', 'roihin-crystal') . '</strong> ' . __('Select categories for frontend filtering (color, energy, zodiac, element).', 'roihin-crystal') . '</li>
                <li><strong>' . __('Related Products:', 'roihin-crystal') . '</strong> ' . __('Optionally select up to 8 related products.', 'roihin-crystal') . '</li>
            </ul>
            <p><strong>' . __('Image Requirements:', 'roihin-crystal') . '</strong> ' . __('Main image should be at least 800x800px, square format, max 5MB.', 'roihin-crystal') . '</p>
        ',
    ]);
}

/**
 * Customize post updated messages
 */
add_filter('post_updated_messages', 'roihin_crystal_updated_messages');

function roihin_crystal_updated_messages($messages) {
    global $post;

    $messages['crystal'] = [
        0  => '',
        1  => __('Crystal updated.', 'roihin-crystal'),
        2  => __('Custom field updated.', 'roihin-crystal'),
        3  => __('Custom field deleted.', 'roihin-crystal'),
        4  => __('Crystal updated.', 'roihin-crystal'),
        5  => isset($_GET['revision']) ? sprintf(__('Crystal restored to revision from %s', 'roihin-crystal'), wp_post_revision_title((int) $_GET['revision'], false)) : false,
        6  => __('Crystal published.', 'roihin-crystal'),
        7  => __('Crystal saved.', 'roihin-crystal'),
        8  => __('Crystal submitted.', 'roihin-crystal'),
        9  => sprintf(
            __('Crystal scheduled for: <strong>%s</strong>.', 'roihin-crystal'),
            date_i18n(__('M j, Y @ G:i', 'roihin-crystal'), strtotime($post->post_date))
        ),
        10 => __('Crystal draft updated.', 'roihin-crystal'),
    ];

    return $messages;
}

/**
 * Add quick edit support (basic fields only)
 */
add_action('quick_edit_custom_box', 'roihin_crystal_quick_edit', 10, 2);

function roihin_crystal_quick_edit($column_name, $post_type) {
    if ($post_type !== 'crystal') {
        return;
    }

    if ($column_name === 'name_en') {
        ?>
        <fieldset class="inline-edit-col-left">
            <div class="inline-edit-col">
                <label>
                    <span class="title"><?php _e('English Name', 'roihin-crystal'); ?></span>
                    <span class="input-text-wrap">
                        <input type="text" name="crystal_name_en" value="">
                    </span>
                </label>
            </div>
        </fieldset>
        <?php
    }
}
