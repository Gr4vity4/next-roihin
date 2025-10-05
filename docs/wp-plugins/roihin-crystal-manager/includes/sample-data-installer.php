<?php
/**
 * Sample Data Installer
 *
 * Handles installation and removal of sample crystal data
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Sample Data Installer Class
 */
class Roihin_Crystal_Sample_Data_Installer {

    /**
     * Option name for storing installed sample data IDs
     */
    const OPTION_NAME = 'roihin_crystal_sample_data_ids';

    /**
     * Category slug for sample data
     */
    const CATEGORY_SLUG = 'sample-data';

    /**
     * Category name for sample data
     */
    const CATEGORY_NAME = 'Sample Data';

    /**
     * Unsplash API Configuration
     * Note: API key is now stored in WordPress options (roihin_crystal_unsplash_api_key)
     * Configure it via Crystals > Sample Data in the WordPress admin
     */
    const UNSPLASH_API_BASE = 'https://api.unsplash.com';

    /**
     * Get the path to sample data JSON file
     */
    private static function get_sample_data_path() {
        return ROIHIN_CRYSTAL_PLUGIN_DIR . 'data/sample-crystals.json';
    }

    /**
     * Check if sample data is installed
     */
    public static function is_installed() {
        $installed_ids = get_option(self::OPTION_NAME, []);
        return !empty($installed_ids);
    }

    /**
     * Get count of installed sample data
     */
    public static function get_installed_count() {
        $installed_ids = get_option(self::OPTION_NAME, []);

        if (empty($installed_ids)) {
            return 0;
        }

        // Verify posts still exist
        $count = 0;
        foreach ($installed_ids as $post_id) {
            if (get_post_status($post_id) !== false) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Install sample data
     */
    public static function install() {
        global $wpdb;

        // Check if already installed
        if (self::is_installed()) {
            return new WP_Error(
                'already_installed',
                __('Sample data is already installed. Please uninstall first.', 'roihin-crystal')
            );
        }

        // Load sample data from JSON
        $sample_data_path = self::get_sample_data_path();

        if (!file_exists($sample_data_path)) {
            return new WP_Error(
                'file_not_found',
                __('Sample data file not found.', 'roihin-crystal')
            );
        }

        $json_content = file_get_contents($sample_data_path);
        $crystals_data = json_decode($json_content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new WP_Error(
                'json_error',
                __('Error parsing sample data file: ', 'roihin-crystal') . json_last_error_msg()
            );
        }

        if (empty($crystals_data) || !is_array($crystals_data)) {
            return new WP_Error(
                'invalid_data',
                __('Invalid sample data format.', 'roihin-crystal')
            );
        }

        // Create or get sample data category
        $category_id = self::get_or_create_sample_category();

        // Track successfully created posts and image stats
        $created_post_ids = [];
        $errors = [];
        $image_stats = [
            'total_images_attempted' => 0,
            'total_images_downloaded' => 0,
            'failed_downloads' => [],
        ];

        // Process each crystal
        foreach ($crystals_data as $index => $crystal_data) {
            $result = self::create_crystal_post($crystal_data, $category_id, $image_stats);

            if (is_wp_error($result)) {
                $errors[] = sprintf(
                    __('Error creating %s: %s', 'roihin-crystal'),
                    $crystal_data['crystal_name_en'] ?? "Crystal #$index",
                    $result->get_error_message()
                );
            } else {
                $created_post_ids[] = $result;
            }
        }

        // Save installed IDs
        if (!empty($created_post_ids)) {
            update_option(self::OPTION_NAME, $created_post_ids);
        }

        // Return results
        if (empty($created_post_ids)) {
            return new WP_Error(
                'installation_failed',
                __('Failed to install any sample data.', 'roihin-crystal') . ' ' . implode(' ', $errors)
            );
        }

        // Build detailed success message
        $message = sprintf(
            __('Successfully installed %d crystal products.', 'roihin-crystal'),
            count($created_post_ids)
        );

        // Add image download statistics
        if ($image_stats['total_images_attempted'] > 0) {
            $message .= sprintf(
                ' ' . __('Images: %d/%d downloaded successfully.', 'roihin-crystal'),
                $image_stats['total_images_downloaded'],
                $image_stats['total_images_attempted']
            );

            if (!empty($image_stats['failed_downloads'])) {
                $message .= ' ' . __('Some images failed to download - check error log for details.', 'roihin-crystal');
            }
        }

        if (!empty($errors)) {
            $message .= ' ' . __('Errors:', 'roihin-crystal') . ' ' . implode(' ', $errors);
        }

        return [
            'success' => true,
            'count' => count($created_post_ids),
            'message' => $message,
            'post_ids' => $created_post_ids,
            'errors' => $errors,
            'image_stats' => $image_stats,
        ];
    }

    /**
     * Uninstall sample data
     */
    public static function uninstall() {
        $installed_ids = get_option(self::OPTION_NAME, []);

        if (empty($installed_ids)) {
            return new WP_Error(
                'not_installed',
                __('No sample data found to uninstall.', 'roihin-crystal')
            );
        }

        $deleted_count = 0;
        $errors = [];

        foreach ($installed_ids as $post_id) {
            // Delete post and all its meta
            $result = wp_delete_post($post_id, true);

            if ($result) {
                $deleted_count++;
            } else {
                $errors[] = sprintf(
                    __('Failed to delete post ID %d', 'roihin-crystal'),
                    $post_id
                );
            }
        }

        // Delete the option
        delete_option(self::OPTION_NAME);

        // Optionally delete the sample data category if empty
        self::maybe_delete_sample_category();

        $message = sprintf(
            __('Successfully deleted %d crystal products.', 'roihin-crystal'),
            $deleted_count
        );

        if (!empty($errors)) {
            $message .= ' ' . __('Errors:', 'roihin-crystal') . ' ' . implode(' ', $errors);
        }

        return [
            'success' => true,
            'count' => $deleted_count,
            'message' => $message,
            'errors' => $errors,
        ];
    }

    /**
     * Create or get sample data category
     */
    private static function get_or_create_sample_category() {
        // Check if category exists
        $term = get_term_by('slug', self::CATEGORY_SLUG, 'crystal_category');

        if ($term) {
            return $term->term_id;
        }

        // Create category
        $result = wp_insert_term(
            self::CATEGORY_NAME,
            'crystal_category',
            [
                'slug' => self::CATEGORY_SLUG,
                'description' => __('Sample crystal data for demonstration purposes', 'roihin-crystal'),
            ]
        );

        if (is_wp_error($result)) {
            return 0;
        }

        return $result['term_id'];
    }

    /**
     * Maybe delete sample data category if empty
     */
    private static function maybe_delete_sample_category() {
        $term = get_term_by('slug', self::CATEGORY_SLUG, 'crystal_category');

        if (!$term) {
            return;
        }

        // Check if category has any posts
        $posts = get_posts([
            'post_type' => 'crystal',
            'tax_query' => [
                [
                    'taxonomy' => 'crystal_category',
                    'field' => 'term_id',
                    'terms' => $term->term_id,
                ],
            ],
            'posts_per_page' => 1,
        ]);

        // Delete if empty
        if (empty($posts)) {
            wp_delete_term($term->term_id, 'crystal_category');
        }
    }

    /**
     * Create a crystal post from data
     */
    private static function create_crystal_post($data, $category_id = 0, &$image_stats = null) {
        // Validate required fields
        if (empty($data['crystal_name_en']) || empty($data['crystal_name_th'])) {
            return new WP_Error(
                'missing_data',
                __('Missing required crystal name fields', 'roihin-crystal')
            );
        }

        // Create post
        $post_data = [
            'post_type' => 'crystal',
            'post_title' => sanitize_text_field($data['crystal_name_en']),
            'post_status' => 'publish',
            'post_author' => get_current_user_id(),
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        // Assign to category
        if ($category_id > 0) {
            wp_set_object_terms($post_id, [$category_id], 'crystal_category');
        }

        // Import and set main image from Unsplash
        $main_image_id = 0;
        if ($image_stats !== null) {
            $image_stats['total_images_attempted']++;
        }

        // Fetch image URL from Unsplash
        $search_query = $data['crystal_name_en'] . ' crystal stone';
        $image_url = self::fetch_unsplash_image_url($search_query, 'main');

        if (!is_wp_error($image_url)) {
            // Download image to media library
            $main_image_id = self::download_image_to_media_library(
                $image_url,
                $post_id,
                $data['crystal_name_en'] . ' - Main Image'
            );
        } else {
            $main_image_id = $image_url; // Pass the error through
        }

        if (!is_wp_error($main_image_id)) {
            update_field('crystal_main_image', $main_image_id, $post_id);
            set_post_thumbnail($post_id, $main_image_id);

            if ($image_stats !== null) {
                $image_stats['total_images_downloaded']++;
            }
        } else {
            if ($image_stats !== null) {
                $image_stats['failed_downloads'][] = [
                    'crystal' => $data['crystal_name_en'],
                    'type' => 'main_image',
                    'error' => $main_image_id->get_error_message(),
                ];
            }
        }

        // Import gallery images from Unsplash (2 images with varied search queries)
        $gallery_count = 2;
        $gallery_ids = [];

        // Use varied search queries for diversity
        $gallery_queries = [
            $data['crystal_name_en'] . ' gemstone',
            $data['crystal_name_en'] . ' healing crystal',
        ];

        for ($i = 0; $i < $gallery_count; $i++) {
            if ($image_stats !== null) {
                $image_stats['total_images_attempted']++;
            }

            // Fetch image URL from Unsplash with varied query
            $gallery_search_query = $gallery_queries[$i];
            $gallery_url = self::fetch_unsplash_image_url($gallery_search_query, 'gallery');

            $image_id = null;
            if (!is_wp_error($gallery_url)) {
                // Download image to media library
                $image_id = self::download_image_to_media_library(
                    $gallery_url,
                    $post_id,
                    $data['crystal_name_en'] . ' - Gallery Image ' . ($i + 1)
                );
            } else {
                $image_id = $gallery_url; // Pass the error through
            }

            if (!is_wp_error($image_id)) {
                $gallery_ids[] = $image_id;

                if ($image_stats !== null) {
                    $image_stats['total_images_downloaded']++;
                }
            } else {
                if ($image_stats !== null) {
                    $image_stats['failed_downloads'][] = [
                        'crystal' => $data['crystal_name_en'],
                        'type' => 'gallery_image_' . ($i + 1),
                        'error' => $image_id->get_error_message(),
                    ];
                }
            }
        }

        if (!empty($gallery_ids)) {
            update_field('crystal_gallery_images', $gallery_ids, $post_id);
        }

        // Set all ACF fields
        $acf_fields = [
            'crystal_name_en',
            'crystal_name_th',
            'crystal_slug',
            'energy_element',
            'chakra',
            'zodiac_compatibility',
            'ruling_planet',
            'crystal_colors',
            'description_paragraphs',
            'crystal_attributes',
            'energy_properties',
            'zodiac_signs',
            'element_type',
            'color_filter',
        ];

        foreach ($acf_fields as $field_name) {
            if (isset($data[$field_name])) {
                update_field($field_name, $data[$field_name], $post_id);
            }
        }

        return $post_id;
    }

    /**
     * Fetch image URL from Unsplash API
     */
    private static function fetch_unsplash_image_url($search_query = 'crystal', $image_type = 'main') {
        // Get API key from WordPress options
        $api_key = get_option('roihin_crystal_unsplash_api_key', '');

        // Validate access key
        if (empty($api_key)) {
            error_log('Roihin Crystal: Unsplash access key not configured');
            return new WP_Error(
                'unsplash_not_configured',
                __('Unsplash API access key not configured. Please configure your API key in the Sample Data settings.', 'roihin-crystal')
            );
        }

        // Build API URL - use search endpoint for specific queries
        $search_url = self::UNSPLASH_API_BASE . '/search/photos';
        $query_params = [
            'query' => sanitize_text_field($search_query),
            'per_page' => 1,
            'orientation' => 'squarish', // Better for product images
        ];

        $api_url = add_query_arg($query_params, $search_url);

        // Make API request
        $response = wp_remote_get($api_url, [
            'timeout' => 15,
            'headers' => [
                'Authorization' => 'Client-ID ' . $api_key,
                'Accept-Version' => 'v1',
            ],
        ]);

        // Check for errors
        if (is_wp_error($response)) {
            error_log('Roihin Crystal: Unsplash API request failed - ' . $response->get_error_message());
            return new WP_Error(
                'unsplash_request_failed',
                sprintf(
                    __('Failed to connect to Unsplash API: %s', 'roihin-crystal'),
                    $response->get_error_message()
                )
            );
        }

        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);

        // Handle API errors
        if ($response_code === 401) {
            error_log('Roihin Crystal: Invalid Unsplash access key');
            return new WP_Error(
                'unsplash_invalid_key',
                __('Invalid Unsplash API access key. Please check your configuration.', 'roihin-crystal')
            );
        }

        if ($response_code === 403) {
            error_log('Roihin Crystal: Unsplash API rate limit exceeded');
            return new WP_Error(
                'unsplash_rate_limit',
                __('Unsplash API rate limit exceeded. Please try again later.', 'roihin-crystal')
            );
        }

        if ($response_code !== 200) {
            error_log('Roihin Crystal: Unsplash API returned error code ' . $response_code);
            return new WP_Error(
                'unsplash_api_error',
                sprintf(__('Unsplash API error (code %d)', 'roihin-crystal'), $response_code)
            );
        }

        // Parse JSON response
        $data = json_decode($response_body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('Roihin Crystal: Failed to parse Unsplash API response - ' . json_last_error_msg());
            return new WP_Error(
                'unsplash_parse_error',
                __('Failed to parse Unsplash API response.', 'roihin-crystal')
            );
        }

        // Check if we got any results
        if (empty($data['results']) || !isset($data['results'][0]['urls']['regular'])) {
            // Fallback to random crystal photo if search returns no results
            error_log('Roihin Crystal: No results for query "' . $search_query . '", trying random crystal photo');

            $random_url = self::UNSPLASH_API_BASE . '/photos/random';
            $random_params = ['query' => 'crystal gemstone', 'orientation' => 'squarish'];
            $random_api_url = add_query_arg($random_params, $random_url);

            $random_response = wp_remote_get($random_api_url, [
                'timeout' => 15,
                'headers' => [
                    'Authorization' => 'Client-ID ' . $api_key,
                    'Accept-Version' => 'v1',
                ],
            ]);

            if (!is_wp_error($random_response) && wp_remote_retrieve_response_code($random_response) === 200) {
                $random_data = json_decode(wp_remote_retrieve_body($random_response), true);
                if (!empty($random_data['urls']['regular'])) {
                    error_log('Roihin Crystal: Using random crystal image as fallback');
                    return $random_data['urls']['regular'];
                }
            }

            return new WP_Error(
                'unsplash_no_results',
                sprintf(__('No images found for query: %s', 'roihin-crystal'), $search_query)
            );
        }

        // Return the image URL (using 'regular' size - good balance of quality and file size)
        $image_url = $data['results'][0]['urls']['regular'];

        error_log('Roihin Crystal: Successfully fetched Unsplash image for "' . $search_query . '"');

        return $image_url;
    }

    /**
     * Import local image file to WordPress media library
     */
    private static function import_local_image_to_media_library($post_id = 0, $description = '') {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        // Path to the local crystal.avif file
        $local_file_path = ROIHIN_CRYSTAL_PLUGIN_DIR . 'assets/crystal.avif';

        // Verify file exists
        if (!file_exists($local_file_path)) {
            error_log('Roihin Crystal: Local image file not found at ' . $local_file_path);
            return new WP_Error(
                'file_not_found',
                __('Local crystal image file not found.', 'roihin-crystal')
            );
        }

        // Get WordPress upload directory
        $upload_dir = wp_upload_dir();
        if ($upload_dir['error']) {
            error_log('Roihin Crystal: Upload directory error - ' . $upload_dir['error']);
            return new WP_Error(
                'upload_dir_error',
                sprintf(__('Upload directory error: %s', 'roihin-crystal'), $upload_dir['error'])
            );
        }

        // Generate unique filename
        $filename = sanitize_file_name($description . '-' . uniqid() . '.avif');
        $dest_file_path = $upload_dir['path'] . '/' . $filename;

        // Copy file to uploads directory
        if (!copy($local_file_path, $dest_file_path)) {
            error_log('Roihin Crystal: Failed to copy image file to uploads directory');
            return new WP_Error(
                'copy_failed',
                __('Failed to copy image file to uploads directory.', 'roihin-crystal')
            );
        }

        // Prepare attachment data
        $file_type = wp_check_filetype($filename, null);
        $attachment_data = [
            'post_mime_type' => $file_type['type'],
            'post_title' => $description,
            'post_content' => '',
            'post_status' => 'inherit',
        ];

        // Insert attachment into database
        $attachment_id = wp_insert_attachment($attachment_data, $dest_file_path, $post_id);

        if (is_wp_error($attachment_id)) {
            error_log(sprintf(
                'Roihin Crystal: Failed to insert attachment for post %d - %s',
                $post_id,
                $attachment_id->get_error_message()
            ));
            @unlink($dest_file_path);
            return $attachment_id;
        }

        // Generate attachment metadata
        $attachment_metadata = wp_generate_attachment_metadata($attachment_id, $dest_file_path);
        wp_update_attachment_metadata($attachment_id, $attachment_metadata);

        // Log success
        error_log(sprintf(
            'Roihin Crystal: Successfully imported local image %d for post %d',
            $attachment_id,
            $post_id
        ));

        return $attachment_id;
    }

    /**
     * Download image from URL to WordPress media library
     */
    private static function download_image_to_media_library($image_url, $post_id = 0, $description = '') {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        // Validate URL
        if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
            return new WP_Error(
                'invalid_url',
                sprintf(__('Invalid image URL: %s', 'roihin-crystal'), $image_url)
            );
        }

        // Download to temp file with timeout
        $temp_file = download_url($image_url, 30); // 30 second timeout

        if (is_wp_error($temp_file)) {
            error_log(sprintf(
                'Roihin Crystal: Failed to download image from %s - %s',
                $image_url,
                $temp_file->get_error_message()
            ));
            return new WP_Error(
                'download_failed',
                sprintf(
                    __('Failed to download image: %s', 'roihin-crystal'),
                    $temp_file->get_error_message()
                )
            );
        }

        // Validate that downloaded file is an image
        $file_type = wp_check_filetype(basename($image_url));
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        if (!in_array($file_type['type'], $allowed_types)) {
            @unlink($temp_file);
            return new WP_Error(
                'invalid_image_type',
                sprintf(__('Invalid image type: %s', 'roihin-crystal'), $file_type['type'])
            );
        }

        // Verify file size (must be > 0 bytes and < 10MB)
        $file_size = filesize($temp_file);
        if ($file_size === 0 || $file_size > 10 * 1024 * 1024) {
            @unlink($temp_file);
            return new WP_Error(
                'invalid_file_size',
                sprintf(__('Invalid file size: %s bytes', 'roihin-crystal'), $file_size)
            );
        }

        // Generate a clean filename
        $filename = sanitize_file_name($description . '-' . time() . '.' . $file_type['ext']);

        // Prepare file array
        $file_array = [
            'name' => $filename,
            'tmp_name' => $temp_file,
            'type' => $file_type['type'],
        ];

        // Upload to media library
        $attachment_id = media_handle_sideload($file_array, $post_id, $description);

        // Clean up temp file
        if (file_exists($temp_file)) {
            @unlink($temp_file);
        }

        if (is_wp_error($attachment_id)) {
            error_log(sprintf(
                'Roihin Crystal: Failed to sideload image for post %d - %s',
                $post_id,
                $attachment_id->get_error_message()
            ));
            return new WP_Error(
                'sideload_failed',
                sprintf(
                    __('Failed to add image to media library: %s', 'roihin-crystal'),
                    $attachment_id->get_error_message()
                )
            );
        }

        // Log success
        error_log(sprintf(
            'Roihin Crystal: Successfully downloaded and added image %d for post %d',
            $attachment_id,
            $post_id
        ));

        return $attachment_id;
    }

    /**
     * AJAX handler for installing sample data
     */
    public static function ajax_install_sample_data() {
        // Check nonce
        check_ajax_referer('roihin_crystal_sample_data', 'nonce');

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message' => __('You do not have permission to perform this action.', 'roihin-crystal'),
            ]);
        }

        // Install sample data
        $result = self::install();

        if (is_wp_error($result)) {
            wp_send_json_error([
                'message' => $result->get_error_message(),
            ]);
        }

        wp_send_json_success($result);
    }

    /**
     * AJAX handler for uninstalling sample data
     */
    public static function ajax_uninstall_sample_data() {
        // Check nonce
        check_ajax_referer('roihin_crystal_sample_data', 'nonce');

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message' => __('You do not have permission to perform this action.', 'roihin-crystal'),
            ]);
        }

        // Uninstall sample data
        $result = self::uninstall();

        if (is_wp_error($result)) {
            wp_send_json_error([
                'message' => $result->get_error_message(),
            ]);
        }

        wp_send_json_success($result);
    }

    /**
     * AJAX handler for checking installation status
     */
    public static function ajax_get_status() {
        // Check nonce
        check_ajax_referer('roihin_crystal_sample_data', 'nonce');

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message' => __('You do not have permission to perform this action.', 'roihin-crystal'),
            ]);
        }

        wp_send_json_success([
            'installed' => self::is_installed(),
            'count' => self::get_installed_count(),
        ]);
    }

    /**
     * AJAX handler for saving Unsplash API key
     */
    public static function ajax_save_unsplash_api_key() {
        // Check nonce
        check_ajax_referer('roihin_crystal_sample_data', 'nonce');

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message' => __('You do not have permission to perform this action.', 'roihin-crystal'),
            ]);
        }

        // Get and sanitize API key
        $api_key = isset($_POST['api_key']) ? sanitize_text_field($_POST['api_key']) : '';

        if (empty($api_key)) {
            wp_send_json_error([
                'message' => __('API key cannot be empty.', 'roihin-crystal'),
            ]);
        }

        // Validate API key format (basic validation - alphanumeric and dashes/underscores)
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $api_key)) {
            wp_send_json_error([
                'message' => __('Invalid API key format. Please check your key and try again.', 'roihin-crystal'),
            ]);
        }

        // Save to WordPress options
        update_option('roihin_crystal_unsplash_api_key', $api_key);

        wp_send_json_success([
            'message' => __('Unsplash API key saved successfully!', 'roihin-crystal'),
        ]);
    }

    /**
     * AJAX handler for clearing Unsplash API key
     */
    public static function ajax_clear_unsplash_api_key() {
        // Check nonce
        check_ajax_referer('roihin_crystal_sample_data', 'nonce');

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message' => __('You do not have permission to perform this action.', 'roihin-crystal'),
            ]);
        }

        // Delete from WordPress options
        delete_option('roihin_crystal_unsplash_api_key');

        wp_send_json_success([
            'message' => __('Unsplash API key cleared successfully!', 'roihin-crystal'),
        ]);
    }
}

// Register AJAX handlers
add_action('wp_ajax_roihin_crystal_install_sample_data', [
    'Roihin_Crystal_Sample_Data_Installer',
    'ajax_install_sample_data'
]);

add_action('wp_ajax_roihin_crystal_uninstall_sample_data', [
    'Roihin_Crystal_Sample_Data_Installer',
    'ajax_uninstall_sample_data'
]);

add_action('wp_ajax_roihin_crystal_get_sample_data_status', [
    'Roihin_Crystal_Sample_Data_Installer',
    'ajax_get_status'
]);

add_action('wp_ajax_roihin_crystal_save_unsplash_api_key', [
    'Roihin_Crystal_Sample_Data_Installer',
    'ajax_save_unsplash_api_key'
]);

add_action('wp_ajax_roihin_crystal_clear_unsplash_api_key', [
    'Roihin_Crystal_Sample_Data_Installer',
    'ajax_clear_unsplash_api_key'
]);
