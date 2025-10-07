<?php
/**
 * Internationalization
 *
 * @package ROIHIN_Personalized_Designs
 */

if (!defined('ABSPATH')) {
    exit;
}

class RPD_I18n {
    /**
     * Initialize the class
     */
    public static function init() {
        add_action('init', [__CLASS__, 'load_textdomain']);
        add_action('acf/init', [__CLASS__, 'setup_acf_translations']);
    }

    /**
     * Load plugin text domain
     */
    public static function load_textdomain() {
        load_plugin_textdomain(
            'roihin-personalized',
            false,
            dirname(RPD_PLUGIN_BASENAME) . '/languages/'
        );
    }

    /**
     * Setup ACF field translations
     */
    public static function setup_acf_translations() {
        // This method can be used to add translation helpers for ACF fields
        // ACF automatically uses the plugin's text domain for field labels
    }

    /**
     * Get energy category translations
     *
     * @return array
     */
    public static function get_energy_categories() {
        return [
            'finance_fortune' => [
                'th'    => __('การเงิน โชคลาภ', 'roihin-personalized'),
                'en'    => __('Finance & Fortune', 'roihin-personalized'),
                'value' => 'finance_fortune',
            ],
            'work_business' => [
                'th'    => __('การงาน ธุรกิจ การลงทุน', 'roihin-personalized'),
                'en'    => __('Work, Business, Investment', 'roihin-personalized'),
                'value' => 'work_business',
            ],
            'love_happiness' => [
                'th'    => __('ความรัก ความสุข โชคดี', 'roihin-personalized'),
                'en'    => __('Love, Happiness, Luck', 'roihin-personalized'),
                'value' => 'love_happiness',
            ],
            'health_balance' => [
                'th'    => __('สุขภาพ สมดุลชีวิต', 'roihin-personalized'),
                'en'    => __('Health, Life Balance', 'roihin-personalized'),
                'value' => 'health_balance',
            ],
            'spirituality' => [
                'th'    => __('จิตวิญญาณ ความมั่นคง', 'roihin-personalized'),
                'en'    => __('Spirituality, Stability', 'roihin-personalized'),
                'value' => 'spirituality',
            ],
        ];
    }

    /**
     * Get rating label translations
     *
     * @return array
     */
    public static function get_rating_labels() {
        return [
            'excellent' => [
                'th'    => __('ดีเยี่ยมที่สุด', 'roihin-personalized'),
                'en'    => __('Excellent', 'roihin-personalized'),
                'range' => [5, 8],
            ],
            'very_good' => [
                'th'    => __('ดีมาก', 'roihin-personalized'),
                'en'    => __('Very Good', 'roihin-personalized'),
                'range' => [4, 4],
            ],
            'moderate' => [
                'th'    => __('ปานกลาง', 'roihin-personalized'),
                'en'    => __('Moderate', 'roihin-personalized'),
                'range' => [3, 3],
            ],
            'fair' => [
                'th'    => __('พอใช้', 'roihin-personalized'),
                'en'    => __('Fair', 'roihin-personalized'),
                'range' => [1, 2],
            ],
            'none' => [
                'th'    => __('ไม่มี', 'roihin-personalized'),
                'en'    => __('None', 'roihin-personalized'),
                'range' => [0, 0],
            ],
        ];
    }

    /**
     * Get budget level translations
     *
     * @return array
     */
    public static function get_budget_levels() {
        return [
            'budget' => [
                'th'    => __('ระดับประหยัด (ต่ำกว่า 3,000)', 'roihin-personalized'),
                'en'    => __('Budget (Under 3,000 THB)', 'roihin-personalized'),
                'slug'  => 'budget',
            ],
            'standard' => [
                'th'    => __('ระดับกลาง (3,000 - 5,000)', 'roihin-personalized'),
                'en'    => __('Standard (3,000 - 5,000 THB)', 'roihin-personalized'),
                'slug'  => 'standard',
            ],
            'premium' => [
                'th'    => __('ระดับสูง (5,000 - 8,000)', 'roihin-personalized'),
                'en'    => __('Premium (5,000 - 8,000 THB)', 'roihin-personalized'),
                'slug'  => 'premium',
            ],
            'luxury' => [
                'th'    => __('ระดับสูงสุด (8,000 ขึ้นไป)', 'roihin-personalized'),
                'en'    => __('Luxury (8,000+ THB)', 'roihin-personalized'),
                'slug'  => 'luxury',
            ],
        ];
    }
}
