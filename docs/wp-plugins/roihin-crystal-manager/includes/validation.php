<?php
/**
 * Validation and Sanitization Functions
 *
 * Handles data validation, sanitization, and auto-generation for Crystal post type
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Validate ACF data before saving
 */
add_filter('acf/validate_save_post', 'roihin_crystal_validate_before_save', 10, 0);

function roihin_crystal_validate_before_save() {
    // Get post ID from various possible sources
    $post_id = 0;
    if (isset($_POST['post_ID'])) {
        $post_id = intval($_POST['post_ID']);
    } elseif (isset($_POST['post_id'])) {
        $post_id = intval($_POST['post_id']);
    }

    // Skip validation if no post ID found
    if (empty($post_id)) {
        return;
    }

    // Skip validation for autosaves
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Skip validation for revisions
    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Only validate for crystal post type
    if (get_post_type($post_id) !== 'crystal') {
        return;
    }

    // Skip validation if ACF data is not present in the request
    if (!isset($_POST['acf']) || !is_array($_POST['acf'])) {
        return;
    }

    $errors = [];

    // Validate required text fields
    $required_text_fields = [
        'crystal_name_en' => __('Crystal Name (English) is required', 'roihin-crystal'),
        'crystal_name_th' => __('Crystal Name (Thai) is required', 'roihin-crystal'),
        'energy_element' => __('Energy Element is required', 'roihin-crystal'),
        'crystal_attributes' => __('Crystal Attributes is required', 'roihin-crystal'),
    ];

    foreach ($required_text_fields as $field => $error_message) {
        if (!isset($_POST['acf'][$field]) || empty($_POST['acf'][$field]) || trim($_POST['acf'][$field]) === '') {
            $errors[] = $error_message;
        }
    }

    // Validate English name format (alphanumeric + spaces)
    if (isset($_POST['acf']['crystal_name_en']) && !empty($_POST['acf']['crystal_name_en'])) {
        $name_en = $_POST['acf']['crystal_name_en'];
        if (!preg_match('/^[a-zA-Z0-9\s\-\']+$/u', $name_en)) {
            $errors[] = __('English name should contain only letters, numbers, spaces, hyphens, and apostrophes', 'roihin-crystal');
        }
        if (strlen($name_en) > 200) {
            $errors[] = __('English name cannot exceed 200 characters', 'roihin-crystal');
        }
    }

    // Validate Thai name length
    if (isset($_POST['acf']['crystal_name_th']) && !empty($_POST['acf']['crystal_name_th']) && strlen($_POST['acf']['crystal_name_th']) > 200) {
        $errors[] = __('Thai name cannot exceed 200 characters', 'roihin-crystal');
    }

    // Validate attributes length
    if (isset($_POST['acf']['crystal_attributes']) && !empty($_POST['acf']['crystal_attributes']) && strlen($_POST['acf']['crystal_attributes']) > 2000) {
        $errors[] = __('Attributes cannot exceed 2000 characters', 'roihin-crystal');
    }

    // Validate required array fields (at least one selection)
    $required_array_fields = [
        'chakra' => __('At least one Chakra must be selected', 'roihin-crystal'),
        'zodiac_compatibility' => __('At least one Zodiac Compatibility must be selected', 'roihin-crystal'),
        'crystal_colors' => __('At least one Crystal Color must be selected', 'roihin-crystal'),
        'energy_properties' => __('At least one Energy Property must be selected', 'roihin-crystal'),
        'zodiac_signs' => __('At least one Zodiac Sign must be selected', 'roihin-crystal'),
        'element_type' => __('At least one Element Type must be selected', 'roihin-crystal'),
        'color_filter' => __('At least one Color Filter must be selected', 'roihin-crystal'),
    ];

    foreach ($required_array_fields as $field => $error_message) {
        if (!isset($_POST['acf'][$field]) || empty($_POST['acf'][$field]) || !is_array($_POST['acf'][$field]) || count($_POST['acf'][$field]) === 0) {
            $errors[] = $error_message;
        }
    }

    // Validate ruling planet
    if (!isset($_POST['acf']['ruling_planet']) || empty($_POST['acf']['ruling_planet'])) {
        $errors[] = __('Ruling Planet must be selected', 'roihin-crystal');
    }

    // Validate description paragraphs
    if (!isset($_POST['acf']['description_paragraphs']) || empty($_POST['acf']['description_paragraphs']) || count($_POST['acf']['description_paragraphs']) === 0) {
        $errors[] = __('At least one Description Paragraph is required', 'roihin-crystal');
    } else {
        // Check if all paragraphs have content
        foreach ($_POST['acf']['description_paragraphs'] as $index => $paragraph) {
            if (!isset($paragraph['paragraph_text']) || empty($paragraph['paragraph_text']) || trim($paragraph['paragraph_text']) === '') {
                $errors[] = sprintf(__('Description Paragraph #%d cannot be empty', 'roihin-crystal'), $index + 1);
            }
        }
    }

    // Validate main image
    if (!isset($_POST['acf']['crystal_main_image']) || empty($_POST['acf']['crystal_main_image'])) {
        $errors[] = __('Main Image is required', 'roihin-crystal');
    }

    // Validate slug uniqueness
    if (isset($_POST['acf']['crystal_slug']) && !empty($_POST['acf']['crystal_slug'])) {
        $slug = sanitize_title($_POST['acf']['crystal_slug']);
        $existing = roihin_crystal_check_slug_exists($slug, $post_id);
        if ($existing) {
            $errors[] = sprintf(
                __('Slug "%s" is already in use. Please choose a different slug.', 'roihin-crystal'),
                $slug
            );
        }
    }

    // If there are errors, show them and prevent save
    if (!empty($errors)) {
        foreach ($errors as $error) {
            acf_add_validation_error('', $error);
        }
    }
}

/**
 * Check if slug already exists
 */
function roihin_crystal_check_slug_exists($slug, $post_id = 0) {
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta}
         WHERE meta_key = 'crystal_slug'
         AND meta_value = %s
         AND post_id != %d",
        $slug,
        $post_id
    );

    return $wpdb->get_var($query) !== null;
}

/**
 * Auto-generate slug from English name
 */
add_filter('acf/update_value/name=crystal_slug', 'roihin_crystal_auto_generate_slug', 10, 3);

function roihin_crystal_auto_generate_slug($value, $post_id, $field) {
    // If slug is empty, generate from English name
    if (empty($value)) {
        $name_en = get_field('crystal_name_en', $post_id);
        if (!empty($name_en)) {
            $value = sanitize_title($name_en);
        }
    } else {
        // Sanitize the provided slug
        $value = sanitize_title($value);
    }

    return $value;
}

/**
 * Sanitize and validate ACF data for REST API
 */
function roihin_crystal_validate_acf_data($data) {
    $errors = new WP_Error();
    $validated = [];

    // Text fields sanitization
    $text_fields = [
        'crystal_name_en',
        'crystal_name_th',
        'crystal_slug',
        'energy_element',
        'ruling_planet',
    ];

    foreach ($text_fields as $field) {
        if (isset($data[$field])) {
            $validated[$field] = sanitize_text_field($data[$field]);
        }
    }

    // Textarea fields sanitization
    $textarea_fields = [
        'crystal_attributes',
    ];

    foreach ($textarea_fields as $field) {
        if (isset($data[$field])) {
            $validated[$field] = wp_kses_post($data[$field]);
        }
    }

    // Array fields sanitization
    $array_fields = [
        'chakra',
        'zodiac_compatibility',
        'crystal_colors',
        'energy_properties',
        'zodiac_signs',
        'element_type',
        'color_filter',
    ];

    foreach ($array_fields as $field) {
        if (isset($data[$field]) && is_array($data[$field])) {
            $validated[$field] = array_map('sanitize_text_field', $data[$field]);
        }
    }

    // Description paragraphs sanitization
    if (isset($data['description_paragraphs']) && is_array($data['description_paragraphs'])) {
        $validated['description_paragraphs'] = [];
        foreach ($data['description_paragraphs'] as $paragraph) {
            if (!empty($paragraph['paragraph_text'])) {
                $validated['description_paragraphs'][] = [
                    'paragraph_text' => wp_kses_post($paragraph['paragraph_text']),
                ];
            }
        }
    }

    // Image fields validation
    if (isset($data['crystal_main_image'])) {
        if (is_numeric($data['crystal_main_image'])) {
            $validated['crystal_main_image'] = absint($data['crystal_main_image']);
        } elseif (is_array($data['crystal_main_image']) && isset($data['crystal_main_image']['ID'])) {
            $validated['crystal_main_image'] = absint($data['crystal_main_image']['ID']);
        }
    }

    // Gallery images validation
    if (isset($data['crystal_gallery_images']) && is_array($data['crystal_gallery_images'])) {
        $validated['crystal_gallery_images'] = [];
        foreach ($data['crystal_gallery_images'] as $image) {
            if (is_numeric($image)) {
                $validated['crystal_gallery_images'][] = absint($image);
            } elseif (is_array($image) && isset($image['ID'])) {
                $validated['crystal_gallery_images'][] = absint($image['ID']);
            }
        }
    }

    // Related products validation
    if (isset($data['related_products']) && is_array($data['related_products'])) {
        $validated['related_products'] = array_map('absint', $data['related_products']);
    }

    // Validate required fields
    if (empty($validated['crystal_name_en'])) {
        $errors->add('missing_field', __('Crystal Name (English) is required', 'roihin-crystal'));
    }

    if (empty($validated['crystal_name_th'])) {
        $errors->add('missing_field', __('Crystal Name (Thai) is required', 'roihin-crystal'));
    }

    // Return errors if any
    if ($errors->has_errors()) {
        return $errors;
    }

    return $validated;
}

/**
 * Validate image uploads
 */
add_filter('acf/upload_prefilter/name=crystal_main_image', 'roihin_crystal_validate_main_image');

function roihin_crystal_validate_main_image($errors, $file, $field) {
    // Check file size (max 5MB)
    $max_size = 5 * 1024 * 1024; // 5MB in bytes
    if ($file['size'] > $max_size) {
        $errors[] = sprintf(
            __('Image file size must not exceed 5MB. Your file is %s.', 'roihin-crystal'),
            size_format($file['size'])
        );
    }

    // Check file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!in_array($file['type'], $allowed_types)) {
        $errors[] = __('Image must be JPG, PNG, WebP, or AVIF format.', 'roihin-crystal');
    }

    // Check dimensions (minimum 800x800)
    $image_size = getimagesize($file['tmp_name']);
    if ($image_size) {
        $width = $image_size[0];
        $height = $image_size[1];

        if ($width < 800 || $height < 800) {
            $errors[] = sprintf(
                __('Image dimensions must be at least 800x800px. Your image is %dx%dpx.', 'roihin-crystal'),
                $width,
                $height
            );
        }
    }

    return $errors;
}

/**
 * Validate gallery image uploads
 */
add_filter('acf/upload_prefilter/name=crystal_gallery_images', 'roihin_crystal_validate_gallery_images');

function roihin_crystal_validate_gallery_images($errors, $file, $field) {
    // Check file size (max 3MB for gallery)
    $max_size = 3 * 1024 * 1024; // 3MB in bytes
    if ($file['size'] > $max_size) {
        $errors[] = sprintf(
            __('Gallery image file size must not exceed 3MB. Your file is %s.', 'roihin-crystal'),
            size_format($file['size'])
        );
    }

    // Check file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        $errors[] = __('Gallery image must be JPG, PNG, or WebP format.', 'roihin-crystal');
    }

    // Check dimensions (minimum 800x800)
    $image_size = getimagesize($file['tmp_name']);
    if ($image_size) {
        $width = $image_size[0];
        $height = $image_size[1];

        if ($width < 800 || $height < 800) {
            $errors[] = sprintf(
                __('Gallery image dimensions must be at least 800x800px. Your image is %dx%dpx.', 'roihin-crystal'),
                $width,
                $height
            );
        }
    }

    return $errors;
}

/**
 * Auto-populate title from English name
 */
add_filter('acf/update_value/name=crystal_name_en', 'roihin_crystal_auto_populate_title', 10, 3);

function roihin_crystal_auto_populate_title($value, $post_id, $field) {
    // Only for crystal post type
    if (get_post_type($post_id) === 'crystal' && !empty($value)) {
        // Update post title
        wp_update_post([
            'ID' => $post_id,
            'post_title' => sanitize_text_field($value),
        ]);
    }

    return $value;
}

/**
 * Set featured image from main image
 */
add_action('acf/save_post', 'roihin_crystal_set_featured_image', 20);

function roihin_crystal_set_featured_image($post_id) {
    // Skip for autosaves and revisions
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Only for crystal post type
    if (get_post_type($post_id) !== 'crystal') {
        return;
    }

    // Get main image
    $main_image = get_field('crystal_main_image', $post_id);

    // Set as featured image if exists
    // Handle both array format (with 'ID' key) and integer format
    if (!empty($main_image)) {
        $image_id = 0;

        if (is_array($main_image) && isset($main_image['ID'])) {
            $image_id = intval($main_image['ID']);
        } elseif (is_numeric($main_image)) {
            $image_id = intval($main_image);
        }

        if ($image_id > 0) {
            set_post_thumbnail($post_id, $image_id);
        }
    }
}

/**
 * Prevent deletion of crystals that are referenced as related products
 */
add_action('before_delete_post', 'roihin_crystal_prevent_deletion_if_related');

function roihin_crystal_prevent_deletion_if_related($post_id) {
    if (get_post_type($post_id) !== 'crystal') {
        return;
    }

    // Check if this crystal is referenced in any related_products fields
    global $wpdb;
    $query = $wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta}
         WHERE meta_key = 'related_products'
         AND meta_value LIKE %s",
        '%"' . $post_id . '"%'
    );

    $related_posts = $wpdb->get_results($query);

    if (!empty($related_posts)) {
        wp_die(
            sprintf(
                __('This crystal cannot be deleted because it is referenced as a related product in %d other crystal(s). Please remove these references first.', 'roihin-crystal'),
                count($related_posts)
            ),
            __('Cannot Delete Crystal', 'roihin-crystal'),
            ['back_link' => true]
        );
    }
}

/**
 * Sanitize color filter values
 */
function roihin_crystal_sanitize_color_filter($colors) {
    $allowed_colors = [
        'purple', 'blue', 'teal', 'green', 'yellow', 'orange',
        'red', 'light-blue', 'pink', 'black', 'white', 'beige'
    ];

    if (!is_array($colors)) {
        return [];
    }

    return array_filter($colors, function($color) use ($allowed_colors) {
        return in_array($color, $allowed_colors);
    });
}

/**
 * Sanitize energy properties values
 */
function roihin_crystal_sanitize_energy_properties($properties) {
    $allowed_properties = [
        'finance_fortune',
        'work_business',
        'love_happiness',
        'health_balance',
        'spirituality_stability'
    ];

    if (!is_array($properties)) {
        return [];
    }

    return array_filter($properties, function($property) use ($allowed_properties) {
        return in_array($property, $allowed_properties);
    });
}

/**
 * Sanitize zodiac signs values
 */
function roihin_crystal_sanitize_zodiac_signs($signs) {
    $allowed_signs = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    if (!is_array($signs)) {
        return [];
    }

    return array_filter($signs, function($sign) use ($allowed_signs) {
        return in_array($sign, $allowed_signs);
    });
}

/**
 * Sanitize element types values
 */
function roihin_crystal_sanitize_element_types($elements) {
    $allowed_elements = ['earth', 'water', 'air', 'fire'];

    if (!is_array($elements)) {
        return [];
    }

    return array_filter($elements, function($element) use ($allowed_elements) {
        return in_array($element, $allowed_elements);
    });
}
