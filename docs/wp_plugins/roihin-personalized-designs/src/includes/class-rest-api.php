<?php
/**
 * REST API Customizations
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_REST_API {
    /**
     * Initialize the class
     */
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_rest_fields']);
        add_action('rest_api_init', [__CLASS__, 'register_custom_endpoints']);
        add_filter('rest_prepare_personalized_design', [__CLASS__, 'add_translations_to_rest'], 10, 3);
        add_filter('rest_authentication_errors', [__CLASS__, 'rest_authentication']);
    }

    /**
     * Register custom REST API fields
     */
    public static function register_rest_fields() {
        // Register ACF fields in REST API
        register_rest_field('personalized_design', 'acf', [
            'get_callback' => function($post) {
                $fields = get_fields($post['id']);
                return $fields ?: [];
            },
            'update_callback' => function($value, $post) {
                if (function_exists('update_field')) {
                    foreach ($value as $key => $val) {
                        update_field($key, $val, $post->ID);
                    }
                }
                return true;
            },
            'schema' => [
                'description' => __('ACF field data for personalized design', 'roihin-personalized'),
                'type'        => 'object',
            ],
        ]);

        // Add featured image URL
        register_rest_field('personalized_design', 'featured_image_url', [
            'get_callback' => function($post) {
                $image_id = get_post_thumbnail_id($post['id']);
                if ($image_id) {
                    return [
                        'full'      => wp_get_attachment_image_url($image_id, 'full'),
                        'large'     => wp_get_attachment_image_url($image_id, 'large'),
                        'medium'    => wp_get_attachment_image_url($image_id, 'medium'),
                        'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
                    ];
                }
                return null;
            },
            'schema' => [
                'description' => __('Featured image URLs in different sizes', 'roihin-personalized'),
                'type'        => 'object',
            ],
        ]);

        // Add taxonomy terms with full details
        register_rest_field('personalized_design', 'budget_level_details', [
            'get_callback' => function($post) {
                $terms = get_the_terms($post['id'], 'budget_level');
                if (!is_array($terms) || empty($terms)) {
                    return null;
                }

                $term = reset($terms); // Get first term
                return [
                    'id'      => $term->term_id,
                    'slug'    => $term->slug,
                    'name_th' => $term->name,
                    'name_en' => get_term_meta($term->term_id, 'name_en', true) ?: $term->name,
                ];
            },
            'schema' => [
                'description' => __('Budget level details with Thai and English names', 'roihin-personalized'),
                'type'        => 'object',
            ],
        ]);

        register_rest_field('personalized_design', 'stone_types_details', [
            'get_callback' => function($post) {
                $terms = get_the_terms($post['id'], 'stone_type');
                if (!is_array($terms) || empty($terms)) {
                    return [];
                }

                return array_map(function($term) {
                    return [
                        'id'   => $term->term_id,
                        'slug' => $term->slug,
                        'name' => $term->name,
                    ];
                }, $terms);
            },
            'schema' => [
                'description' => __('Stone type details', 'roihin-personalized'),
                'type'        => 'array',
            ],
        ]);
    }

    /**
     * Register custom REST API endpoints
     */
    public static function register_custom_endpoints() {
        // Random designs endpoint
        register_rest_route('roihin/v1', '/personalized-designs/random', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'get_random_designs'],
            'permission_callback' => '__return_true',
            'args'                => [
                'count' => [
                    'default'           => 8,
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0 && $param <= 20;
                    },
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);

        // Legacy photo endpoint for backward compatibility
        register_rest_route('wp/v2', '/photo', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'legacy_photo_endpoint'],
            'permission_callback' => '__return_true',
            'args'                => [
                'uid' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    }

    /**
     * Get random personalized designs
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response
     */
    public static function get_random_designs($request) {
        $count = $request->get_param('count');

        $args = [
            'post_type'      => 'personalized_design',
            'posts_per_page' => $count,
            'orderby'        => 'rand',
            'post_status'    => 'publish',
        ];

        $query = new WP_Query($args);
        $designs = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();
                $gallery = get_field('design_gallery', $post_id);
                $designer_info = get_field('designer_info', $post_id);

                $designs[] = [
                    'id'       => $post_id,
                    'title'    => get_the_title(),
                    'slug'     => get_post_field('post_name', $post_id),
                    'images'   => array_map(function($img) {
                        return $img['url'];
                    }, $gallery ?: []),
                    'designer' => $designer_info['designer_name'] ?? '',
                    'date'     => $designer_info['design_date'] ?? '',
                ];
            }
        }

        wp_reset_postdata();
        return rest_ensure_response($designs);
    }

    /**
     * Legacy photo endpoint for backward compatibility
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public static function legacy_photo_endpoint($request) {
        $uid = $request->get_param('uid');

        // Legacy gallery endpoint
        if ($uid === 'recently-personailzed-bracelet-design') {
            $designs = get_posts([
                'post_type'      => 'personalized_design',
                'posts_per_page' => 20,
                'orderby'        => 'date',
                'order'          => 'DESC',
                'post_status'    => 'publish',
            ]);

            $gallery_urls = [];
            foreach ($designs as $design) {
                $gallery = get_field('design_gallery', $design->ID);
                if ($gallery) {
                    foreach ($gallery as $img) {
                        $gallery_urls[] = $img['url'];
                    }
                }
            }

            return rest_ensure_response([
                [
                    'acf' => [
                        'uid'     => $uid,
                        'gallery' => $gallery_urls,
                    ]
                ]
            ]);
        }

        return new WP_Error('invalid_uid', __('Invalid UID', 'roihin-personalized'), ['status' => 400]);
    }

    /**
     * Add translations to REST API response
     *
     * @param WP_REST_Response $response Response object.
     * @param WP_Post          $post     Post object.
     * @param WP_REST_Request  $request  Request object.
     * @return WP_REST_Response
     */
    public static function add_translations_to_rest($response, $post, $request) {
        $lang = $request->get_param('lang') ?: 'th';

        // Add translated energy property names
        if (isset($response->data['acf']['energy_properties']) && is_array($response->data['acf']['energy_properties'])) {
            $energy_props = $response->data['acf']['energy_properties'];
            foreach ($energy_props as &$prop) {
                $prop['name'] = rpd_get_energy_category_name($prop['category'], $lang);
                $prop['label'] = rpd_get_rating_label($prop['rating'], $lang);
            }
            $response->data['acf']['energy_properties'] = $energy_props;
        }

        // Use appropriate description based on language
        if (isset($response->data['acf']['energy_description'])) {
            $description = $lang === 'en'
                ? ($response->data['acf']['energy_description']['description_en'] ?? '')
                : ($response->data['acf']['energy_description']['description_th'] ?? '');

            $response->data['acf']['energy_description_text'] = $description;
        }

        return $response;
    }

    /**
     * REST API authentication
     *
     * @param WP_Error|null|bool $result Error from another authentication handler, null if none.
     * @return WP_Error|null|bool
     */
    public static function rest_authentication($result) {
        // If a previous authentication check was applied, preserve it
        if (true === $result || is_wp_error($result)) {
            return $result;
        }

        // Check if accessing personalized-designs endpoint
        $route = $_SERVER['REQUEST_URI'] ?? '';
        if (strpos($route, '/wp-json/wp/v2/personalized-designs') === false) {
            return $result;
        }

        // Allow GET requests without authentication
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            return true;
        }

        // Require authentication for POST, PUT, DELETE
        if (!is_user_logged_in()) {
            return new WP_Error(
                'rest_not_logged_in',
                __('You are not currently logged in.', 'roihin-personalized'),
                ['status' => 401]
            );
        }

        // Check capabilities
        if (!current_user_can('edit_personalized_designs')) {
            return new WP_Error(
                'rest_forbidden',
                __('You do not have permission to manage designs.', 'roihin-personalized'),
                ['status' => 403]
            );
        }

        return true;
    }
}
