<?php
/**
 * REST API Customization
 *
 * Extends WordPress REST API with custom endpoints and filtering for Crystal post type
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API fields for Crystal post type
 */
add_action('rest_api_init', 'roihin_crystal_register_rest_fields');

function roihin_crystal_register_rest_fields() {
    // Register ACF fields in REST API response
    register_rest_field('crystal', 'acf', [
        'get_callback' => 'roihin_crystal_get_acf_fields',
        'update_callback' => 'roihin_crystal_update_acf_fields',
        'schema' => roihin_crystal_acf_schema(),
    ]);

    // Add total pages header to response
    add_filter('rest_prepare_crystal', 'roihin_crystal_add_total_pages_header', 10, 3);
}

/**
 * Get ACF fields for REST API
 */
function roihin_crystal_get_acf_fields($object, $field_name, $request) {
    $post_id = $object['id'];
    $acf_data = get_fields($post_id);

    if (!$acf_data) {
        return null;
    }

    // Process image fields to include all sizes
    if (isset($acf_data['crystal_main_image']) && is_array($acf_data['crystal_main_image'])) {
        $acf_data['crystal_main_image'] = roihin_crystal_process_image_field($acf_data['crystal_main_image']);
    }

    if (isset($acf_data['crystal_gallery_images']) && is_array($acf_data['crystal_gallery_images'])) {
        $acf_data['crystal_gallery_images'] = array_map(
            'roihin_crystal_process_image_field',
            $acf_data['crystal_gallery_images']
        );
    }

    // Process related products
    if (isset($acf_data['related_products']) && is_array($acf_data['related_products'])) {
        $acf_data['related_products'] = roihin_crystal_get_related_products($acf_data['related_products']);
    }

    return $acf_data;
}

/**
 * Process image field to include all sizes
 */
function roihin_crystal_process_image_field($image) {
    if (!is_array($image) || !isset($image['ID'])) {
        return $image;
    }

    $image_id = $image['ID'];

    return [
        'id' => $image_id,
        'url' => $image['url'] ?? wp_get_attachment_url($image_id),
        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
        'title' => $image['title'] ?? get_the_title($image_id),
        'width' => $image['width'] ?? 0,
        'height' => $image['height'] ?? 0,
        'sizes' => [
            'thumbnail' => wp_get_attachment_image_src($image_id, 'crystal-thumbnail')[0] ?? '',
            'medium' => wp_get_attachment_image_src($image_id, 'crystal-medium')[0] ?? '',
            'large' => wp_get_attachment_image_src($image_id, 'crystal-large')[0] ?? '',
            'full' => wp_get_attachment_image_src($image_id, 'full')[0] ?? '',
        ],
    ];
}

/**
 * Get related products with full data
 */
function roihin_crystal_get_related_products($product_ids) {
    if (empty($product_ids)) {
        return [];
    }

    $related = [];
    foreach ($product_ids as $product_id) {
        $post = get_post($product_id);
        if (!$post) {
            continue;
        }

        $acf = get_fields($product_id);
        $thumbnail_id = get_post_thumbnail_id($product_id);

        $related[] = [
            'id' => $product_id,
            'slug' => $post->post_name,
            'nameEn' => $acf['crystal_name_en'] ?? get_the_title($product_id),
            'nameTh' => $acf['crystal_name_th'] ?? get_the_title($product_id),
            'image' => $thumbnail_id ? wp_get_attachment_image_src($thumbnail_id, 'crystal-medium')[0] : '',
        ];
    }

    return $related;
}

/**
 * Update ACF fields via REST API
 */
function roihin_crystal_update_acf_fields($value, $object, $field_name) {
    $post_id = $object->ID;

    // Validate and sanitize the data
    $validated_data = roihin_crystal_validate_acf_data($value);

    if (is_wp_error($validated_data)) {
        return $validated_data;
    }

    // Update each field
    foreach ($validated_data as $field_key => $field_value) {
        update_field($field_key, $field_value, $post_id);
    }

    return true;
}

/**
 * ACF Schema for REST API
 */
function roihin_crystal_acf_schema() {
    return [
        'type' => 'object',
        'description' => __('Advanced Custom Fields data', 'roihin-crystal'),
        'context' => ['view', 'edit'],
    ];
}

/**
 * Add custom query filters to REST API
 */
add_filter('rest_crystal_query', 'roihin_crystal_rest_query_filters', 10, 2);

function roihin_crystal_rest_query_filters($args, $request) {
    // Initialize meta_query if not set
    if (!isset($args['meta_query'])) {
        $args['meta_query'] = [];
    }

    // Add relation if multiple meta queries
    if (count($args['meta_query']) > 1) {
        $args['meta_query']['relation'] = 'AND';
    }

    // Color Filter
    if ($color_filter = $request->get_param('color_filter')) {
        $colors = is_array($color_filter) ? $color_filter : explode(',', $color_filter);
        $args['meta_query'][] = roihin_crystal_build_meta_query('color_filter', $colors);
    }

    // Energy Properties Filter
    if ($energy_properties = $request->get_param('energy_properties')) {
        $energy = is_array($energy_properties) ? $energy_properties : explode(',', $energy_properties);
        $args['meta_query'][] = roihin_crystal_build_meta_query('energy_properties', $energy);
    }

    // Zodiac Signs Filter
    if ($zodiac_signs = $request->get_param('zodiac_signs')) {
        $zodiac = is_array($zodiac_signs) ? $zodiac_signs : explode(',', $zodiac_signs);
        $args['meta_query'][] = roihin_crystal_build_meta_query('zodiac_signs', $zodiac);
    }

    // Element Type Filter
    if ($element_type = $request->get_param('element_type')) {
        $elements = is_array($element_type) ? $element_type : explode(',', $element_type);
        $args['meta_query'][] = roihin_crystal_build_meta_query('element_type', $elements);
    }

    // Language Filter (for multi-language support)
    if ($lang = $request->get_param('lang')) {
        // This can be extended with WPML or Polylang integration
        // For now, we'll just pass it through
    }

    return $args;
}

/**
 * Build meta query for filter
 */
function roihin_crystal_build_meta_query($key, $values) {
    // Clean up values
    $values = array_map('sanitize_text_field', $values);
    $values = array_filter($values);

    if (empty($values)) {
        return [];
    }

    // For checkbox fields stored as serialized arrays
    $meta_query = [
        'relation' => 'OR',
    ];

    foreach ($values as $value) {
        $meta_query[] = [
            'key' => $key,
            'value' => '"' . $value . '"',
            'compare' => 'LIKE',
        ];
    }

    return $meta_query;
}

/**
 * Register custom REST API query parameters
 */
add_filter('rest_crystal_collection_params', 'roihin_crystal_collection_params', 10, 1);

function roihin_crystal_collection_params($params) {
    $params['color_filter'] = [
        'description' => __('Filter by color (comma-separated values)', 'roihin-crystal'),
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ];

    $params['energy_properties'] = [
        'description' => __('Filter by energy properties (comma-separated values)', 'roihin-crystal'),
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ];

    $params['zodiac_signs'] = [
        'description' => __('Filter by zodiac signs (comma-separated values)', 'roihin-crystal'),
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ];

    $params['element_type'] = [
        'description' => __('Filter by element type (comma-separated values)', 'roihin-crystal'),
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ];

    $params['lang'] = [
        'description' => __('Language code (en or th)', 'roihin-crystal'),
        'type' => 'string',
        'enum' => ['en', 'th'],
        'sanitize_callback' => 'sanitize_text_field',
    ];

    return $params;
}

/**
 * Add total pages header to response
 */
function roihin_crystal_add_total_pages_header($response, $post, $request) {
    // This is already handled by WordPress, but we can customize it if needed
    return $response;
}

/**
 * Add CORS headers for API requests
 */
add_action('rest_api_init', 'roihin_crystal_add_cors_headers');

function roihin_crystal_add_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}

/**
 * Add cache headers for API responses
 */
add_filter('rest_post_dispatch', 'roihin_crystal_add_cache_headers', 10, 3);

function roihin_crystal_add_cache_headers($response, $server, $request) {
    // Only apply to crystal endpoints
    if (strpos($request->get_route(), '/wp/v2/crystal') === false) {
        return $response;
    }

    // Check if it's a GET request
    if ($request->get_method() !== 'GET') {
        return $response;
    }

    // Add cache headers (5 minutes for production, no cache for development)
    $is_production = defined('WP_ENV') && WP_ENV === 'production';

    if ($is_production) {
        $response->header('Cache-Control', 'public, max-age=300, s-maxage=300');
        $response->header('X-Cache-Status', 'MISS');
    } else {
        $response->header('Cache-Control', 'no-cache, no-store, must-revalidate');
        $response->header('Pragma', 'no-cache');
        $response->header('Expires', '0');
    }

    return $response;
}

/**
 * Register custom endpoint for auto-suggest related products
 */
add_action('rest_api_init', 'roihin_crystal_register_custom_routes');

function roihin_crystal_register_custom_routes() {
    // Auto-suggest related products endpoint
    register_rest_route('roihin-crystal/v1', '/related/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'roihin_crystal_get_auto_related',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
            ],
            'limit' => [
                'default' => 8,
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
}

/**
 * Get auto-suggested related products
 */
function roihin_crystal_get_auto_related($request) {
    $crystal_id = $request->get_param('id');
    $limit = $request->get_param('limit');

    // Get current crystal's properties
    $acf = get_fields($crystal_id);
    if (!$acf) {
        return new WP_Error('not_found', __('Crystal not found', 'roihin-crystal'), ['status' => 404]);
    }

    // Build query to find similar crystals
    $args = [
        'post_type' => 'crystal',
        'posts_per_page' => $limit,
        'post__not_in' => [$crystal_id],
        'post_status' => 'publish',
        'meta_query' => [
            'relation' => 'OR',
        ],
    ];

    // Add meta queries for similar properties
    if (!empty($acf['color_filter'])) {
        $args['meta_query'][] = roihin_crystal_build_meta_query('color_filter', $acf['color_filter']);
    }

    if (!empty($acf['energy_properties'])) {
        $args['meta_query'][] = roihin_crystal_build_meta_query('energy_properties', $acf['energy_properties']);
    }

    if (!empty($acf['zodiac_signs'])) {
        $args['meta_query'][] = roihin_crystal_build_meta_query('zodiac_signs', $acf['zodiac_signs']);
    }

    $query = new WP_Query($args);
    $related = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $post_acf = get_fields($post_id);
            $thumbnail_id = get_post_thumbnail_id($post_id);

            $related[] = [
                'id' => $post_id,
                'slug' => get_post_field('post_name', $post_id),
                'nameEn' => $post_acf['crystal_name_en'] ?? get_the_title($post_id),
                'nameTh' => $post_acf['crystal_name_th'] ?? get_the_title($post_id),
                'image' => $thumbnail_id ? wp_get_attachment_image_src($thumbnail_id, 'crystal-medium')[0] : '',
            ];
        }
        wp_reset_postdata();
    }

    return rest_ensure_response($related);
}
