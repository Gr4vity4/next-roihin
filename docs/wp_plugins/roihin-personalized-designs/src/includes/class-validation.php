<?php
/**
 * Data Validation
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_Validation {
    /**
     * Initialize the class
     */
    public static function init() {
        // ACF validation filters
        add_filter('acf/validate_value/name=energy_properties', [__CLASS__, 'validate_energy_properties'], 10, 4);
        add_filter('acf/validate_value/name=design_gallery', [__CLASS__, 'validate_gallery'], 10, 4);
        add_filter('acf/validate_value/name=stones_used', [__CLASS__, 'validate_stones'], 10, 4);
        add_filter('acf/validate_value/name=energy_description', [__CLASS__, 'validate_description'], 10, 4);

        // Save post validation
        add_action('acf/save_post', [__CLASS__, 'validate_on_save'], 10);

        // Image upload validation
        add_filter('acf/upload_prefilter/name=design_gallery', [__CLASS__, 'validate_image_upload'], 10, 3);

        // Data sanitization
        add_filter('acf/update_value/name=designer_info', [__CLASS__, 'sanitize_designer_info'], 10, 3);
        add_filter('acf/update_value/name=energy_description', [__CLASS__, 'sanitize_descriptions'], 10, 3);

        // Track updates
        add_action('post_updated', [__CLASS__, 'track_updates'], 10, 3);
    }

    /**
     * Validate energy properties
     */
    public static function validate_energy_properties($valid, $value, $field, $input) {
        if (!$valid) {
            return $valid;
        }

        // Check if value is array and has 5 items
        if (!is_array($value) || count($value) !== 5) {
            return __('All 5 energy property categories are required', 'roihin-personalized');
        }

        $required_categories = [
            'finance_fortune',
            'work_business',
            'love_happiness',
            'health_balance',
            'spirituality'
        ];

        $found_categories = array_column($value, 'category');
        $missing = array_diff($required_categories, $found_categories);

        if (!empty($missing)) {
            return __('All 5 energy property categories must be present', 'roihin-personalized');
        }

        // Validate ratings are within 0-8 range
        foreach ($value as $prop) {
            if (!isset($prop['rating']) || $prop['rating'] < 0 || $prop['rating'] > 8) {
                return __('All energy property ratings must be between 0 and 8', 'roihin-personalized');
            }
        }

        return $valid;
    }

    /**
     * Validate gallery images
     */
    public static function validate_gallery($valid, $value, $field, $input) {
        if (!$valid) {
            return $valid;
        }

        // Check minimum 1 image
        if (empty($value) || !is_array($value) || count($value) < 1) {
            return __('At least 1 gallery image is required', 'roihin-personalized');
        }

        // Check maximum 10 images
        if (count($value) > 10) {
            return __('Maximum 10 gallery images allowed', 'roihin-personalized');
        }

        return $valid;
    }

    /**
     * Validate stones used
     */
    public static function validate_stones($valid, $value, $field, $input) {
        if (!$valid) {
            return $valid;
        }

        // Check minimum 1 stone
        if (empty($value) || !is_array($value) || count($value) < 1) {
            return __('At least 1 stone must be added', 'roihin-personalized');
        }

        // Check maximum 15 stones
        if (count($value) > 15) {
            return __('Maximum 15 stones allowed', 'roihin-personalized');
        }

        // Validate each stone has a name
        foreach ($value as $stone) {
            if (empty($stone['stone_name'])) {
                return __('All stones must have a name', 'roihin-personalized');
            }
        }

        return $valid;
    }

    /**
     * Validate energy description
     */
    public static function validate_description($valid, $value, $field, $input) {
        if (!$valid) {
            return $valid;
        }

        // Check Thai description is required and has minimum length
        if (empty($value['description_th']) || strlen(strip_tags($value['description_th'])) < 100) {
            return __('Thai energy description must be at least 100 characters', 'roihin-personalized');
        }

        return $valid;
    }

    /**
     * Validate on save
     */
    public static function validate_on_save($post_id) {
        // Only validate personalized_design post type
        if (get_post_type($post_id) !== 'personalized_design') {
            return;
        }

        // Skip validation during autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check user permissions
        if (!current_user_can('edit_personalized_design', $post_id)) {
            return;
        }
    }

    /**
     * Validate image upload
     */
    public static function validate_image_upload($errors, $file, $field) {
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        // Check file type
        if (!in_array($file['type'], $allowed_types)) {
            $errors[] = __('Only JPG, PNG, and WebP images are allowed', 'roihin-personalized');
        }

        // Check file size (5MB max)
        if ($file['size'] > 5 * 1024 * 1024) {
            $errors[] = __('Image size must be less than 5MB', 'roihin-personalized');
        }

        // Check dimensions
        $image_info = @getimagesize($file['tmp_name']);
        if ($image_info) {
            list($width, $height) = $image_info;

            if ($width < 800 || $height < 800) {
                $errors[] = __('Image must be at least 800×800 pixels', 'roihin-personalized');
            }

            if ($width > 4000 || $height > 4000) {
                $errors[] = __('Image must not exceed 4000×4000 pixels', 'roihin-personalized');
            }
        }

        return $errors;
    }

    /**
     * Sanitize designer info
     */
    public static function sanitize_designer_info($value, $post_id, $field) {
        if (isset($value['designer_name'])) {
            $value['designer_name'] = sanitize_text_field($value['designer_name']);
        }

        if (isset($value['designer_title'])) {
            $value['designer_title'] = sanitize_text_field($value['designer_title']);
        }

        if (isset($value['design_date'])) {
            $value['design_date'] = sanitize_text_field($value['design_date']);
        }

        return $value;
    }

    /**
     * Sanitize energy descriptions
     */
    public static function sanitize_descriptions($value, $post_id, $field) {
        if (isset($value['description_th'])) {
            $value['description_th'] = wp_kses_post($value['description_th']);
        }

        if (isset($value['description_en'])) {
            $value['description_en'] = wp_kses_post($value['description_en']);
        }

        return $value;
    }

    /**
     * Track post updates
     */
    public static function track_updates($post_ID, $post_after, $post_before) {
        if (get_post_type($post_ID) !== 'personalized_design') {
            return;
        }

        // Log update for audit trail
        update_post_meta($post_ID, '_last_modified_by', get_current_user_id());

        $current_count = (int) get_post_meta($post_ID, '_modification_count', true);
        update_post_meta($post_ID, '_modification_count', $current_count + 1);
    }

    /**
     * Public validation method for energy properties (for testing)
     */
    public static function validate_energy_properties_data($properties) {
        if (!is_array($properties) || count($properties) !== 5) {
            return false;
        }

        $required_categories = [
            'finance_fortune',
            'work_business',
            'love_happiness',
            'health_balance',
            'spirituality'
        ];

        $found_categories = array_column($properties, 'category');
        $missing = array_diff($required_categories, $found_categories);

        return empty($missing);
    }

    /**
     * Public validation method for gallery (for testing)
     */
    public static function validate_gallery_data($gallery) {
        if (empty($gallery) || !is_array($gallery)) {
            return false;
        }

        return count($gallery) >= 1 && count($gallery) <= 10;
    }
}
