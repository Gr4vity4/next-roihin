<?php
/**
 * ACF Field Group Definitions
 *
 * Defines all Advanced Custom Fields for the Crystal custom post type
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register ACF Field Groups
 */
if (function_exists('acf_add_local_field_group')) {

    acf_add_local_field_group([
        'key' => 'group_crystal_information',
        'title' => __('Crystal Information', 'roihin-crystal'),
        'fields' => [

            // ==========================================
            // SECTION 1: BASIC INFORMATION
            // ==========================================
            [
                'key' => 'field_crystal_tab_basic',
                'label' => __('Basic Information', 'roihin-crystal'),
                'type' => 'tab',
                'placement' => 'top',
            ],

            // Crystal Name (English)
            [
                'key' => 'field_crystal_name_en',
                'label' => __('Crystal Name (English)', 'roihin-crystal'),
                'name' => 'crystal_name_en',
                'type' => 'text',
                'instructions' => __('English name of the crystal', 'roihin-crystal'),
                'required' => 1,
                'maxlength' => 200,
                'placeholder' => 'e.g., Apatite',
            ],

            // Crystal Name (Thai)
            [
                'key' => 'field_crystal_name_th',
                'label' => __('Crystal Name (Thai)', 'roihin-crystal'),
                'name' => 'crystal_name_th',
                'type' => 'text',
                'instructions' => __('Thai name of the crystal', 'roihin-crystal'),
                'required' => 1,
                'maxlength' => 200,
                'placeholder' => 'e.g., อะพาไทต์',
            ],

            // Crystal Slug
            [
                'key' => 'field_crystal_slug',
                'label' => __('Crystal Slug', 'roihin-crystal'),
                'name' => 'crystal_slug',
                'type' => 'text',
                'instructions' => __('URL-friendly identifier (auto-generated from English name)', 'roihin-crystal'),
                'required' => 1,
                'maxlength' => 200,
                'placeholder' => 'e.g., apatite',
            ],

            // Main Image
            [
                'key' => 'field_crystal_main_image',
                'label' => __('Main Image', 'roihin-crystal'),
                'name' => 'crystal_main_image',
                'type' => 'image',
                'instructions' => __('Primary product image (square format recommended, minimum 800x800px)', 'roihin-crystal'),
                'required' => 1,
                'return_format' => 'array',
                'preview_size' => 'medium',
                'library' => 'all',
                'min_width' => 800,
                'min_height' => 800,
                'max_size' => 5,
            ],

            // Gallery Images
            [
                'key' => 'field_crystal_gallery_images',
                'label' => __('Gallery Images', 'roihin-crystal'),
                'name' => 'crystal_gallery_images',
                'type' => 'gallery',
                'instructions' => __('Additional product images (max 10 images)', 'roihin-crystal'),
                'required' => 0,
                'return_format' => 'array',
                'preview_size' => 'medium',
                'library' => 'all',
                'min' => 0,
                'max' => 10,
                'min_width' => 800,
                'min_height' => 800,
                'max_size' => 3,
            ],

            // ==========================================
            // SECTION 2: PROPERTIES
            // ==========================================
            [
                'key' => 'field_crystal_tab_properties',
                'label' => __('Properties', 'roihin-crystal'),
                'type' => 'tab',
                'placement' => 'top',
            ],

            // Energy Element
            [
                'key' => 'field_energy_element',
                'label' => __('Energy Element', 'roihin-crystal'),
                'name' => 'energy_element',
                'type' => 'text',
                'instructions' => __('Energy element of the crystal (e.g., "ดิน, น้ำ")', 'roihin-crystal'),
                'required' => 1,
                'maxlength' => 500,
                'placeholder' => 'e.g., ดิน, น้ำ',
            ],

            // Chakra
            [
                'key' => 'field_chakra',
                'label' => __('Chakra', 'roihin-crystal'),
                'name' => 'chakra',
                'type' => 'checkbox',
                'instructions' => __('Select associated chakra points (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'root' => __('Root Chakra / มูลาธาร', 'roihin-crystal'),
                    'sacral' => __('Sacral Chakra / สวาธิษฐาน', 'roihin-crystal'),
                    'solar_plexus' => __('Solar Plexus Chakra / มณีปูระ', 'roihin-crystal'),
                    'heart' => __('Heart Chakra / อนาหตะ', 'roihin-crystal'),
                    'throat' => __('Throat Chakra / วิสุทธิ', 'roihin-crystal'),
                    'third_eye' => __('Third Eye Chakra / อาชญา', 'roihin-crystal'),
                    'crown' => __('Crown Chakra / สหัสรารา', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // Zodiac Compatibility
            [
                'key' => 'field_zodiac_compatibility',
                'label' => __('Zodiac Compatibility', 'roihin-crystal'),
                'name' => 'zodiac_compatibility',
                'type' => 'checkbox',
                'instructions' => __('Select compatible zodiac signs (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'aries' => __('Aries / ราศีเมษ', 'roihin-crystal'),
                    'taurus' => __('Taurus / ราศีพฤษภ', 'roihin-crystal'),
                    'gemini' => __('Gemini / ราศีเมถุน', 'roihin-crystal'),
                    'cancer' => __('Cancer / ราศีกรกฎ', 'roihin-crystal'),
                    'leo' => __('Leo / ราศีสิงห์', 'roihin-crystal'),
                    'virgo' => __('Virgo / ราศีกันย์', 'roihin-crystal'),
                    'libra' => __('Libra / ราศีตุลย์', 'roihin-crystal'),
                    'scorpio' => __('Scorpio / ราศีพิจิก', 'roihin-crystal'),
                    'sagittarius' => __('Sagittarius / ราศีธนู', 'roihin-crystal'),
                    'capricorn' => __('Capricorn / ราศีมกร', 'roihin-crystal'),
                    'aquarius' => __('Aquarius / ราศีกุมภ์', 'roihin-crystal'),
                    'pisces' => __('Pisces / ราศีมีน', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // Ruling Planet
            [
                'key' => 'field_ruling_planet',
                'label' => __('Ruling Planet', 'roihin-crystal'),
                'name' => 'ruling_planet',
                'type' => 'select',
                'instructions' => __('Select the associated planet', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'sun' => __('Sun / ดวงอาทิตย์', 'roihin-crystal'),
                    'moon' => __('Moon / ดวงจันทร์', 'roihin-crystal'),
                    'mercury' => __('Mercury / พุธ', 'roihin-crystal'),
                    'venus' => __('Venus / ศุกร์', 'roihin-crystal'),
                    'mars' => __('Mars / อังคาร', 'roihin-crystal'),
                    'jupiter' => __('Jupiter / พฤหัสบดี', 'roihin-crystal'),
                    'saturn' => __('Saturn / เสาร์', 'roihin-crystal'),
                    'uranus' => __('Uranus / ดาวยูเรนัส', 'roihin-crystal'),
                    'neptune' => __('Neptune / ดาวเนปจูน', 'roihin-crystal'),
                    'pluto' => __('Pluto / ดาวพลูโต', 'roihin-crystal'),
                ],
                'default_value' => '',
                'allow_null' => 0,
                'ui' => 1,
                'ajax' => 0,
                'return_format' => 'value',
            ],

            // Crystal Colors
            [
                'key' => 'field_crystal_colors',
                'label' => __('Crystal Colors', 'roihin-crystal'),
                'name' => 'crystal_colors',
                'type' => 'checkbox',
                'instructions' => __('Select the colors of the crystal (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'purple' => __('Purple / สีม่วง', 'roihin-crystal'),
                    'blue' => __('Blue / สีน้ำเงิน', 'roihin-crystal'),
                    'teal' => __('Teal / สีเขียวน้ำทะเล', 'roihin-crystal'),
                    'green' => __('Green / สีเขียว', 'roihin-crystal'),
                    'yellow' => __('Yellow / สีเหลือง', 'roihin-crystal'),
                    'orange' => __('Orange / สีส้ม', 'roihin-crystal'),
                    'red' => __('Red / สีแดง', 'roihin-crystal'),
                    'light-blue' => __('Light Blue / สีฟ้า', 'roihin-crystal'),
                    'pink' => __('Pink / สีชมพู', 'roihin-crystal'),
                    'black' => __('Black / สีดำ', 'roihin-crystal'),
                    'white' => __('White / สีขาว', 'roihin-crystal'),
                    'beige' => __('Beige / สีเบจ', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // ==========================================
            // SECTION 3: DESCRIPTION & CONTENT
            // ==========================================
            [
                'key' => 'field_crystal_tab_content',
                'label' => __('Description & Content', 'roihin-crystal'),
                'type' => 'tab',
                'placement' => 'top',
            ],

            // Description Paragraphs (Repeater)
            [
                'key' => 'field_description_paragraphs',
                'label' => __('Description Paragraphs', 'roihin-crystal'),
                'name' => 'description_paragraphs',
                'type' => 'repeater',
                'instructions' => __('Add detailed description paragraphs (minimum 1 required)', 'roihin-crystal'),
                'required' => 1,
                'layout' => 'block',
                'button_label' => __('Add Paragraph', 'roihin-crystal'),
                'min' => 1,
                'max' => 20,
                'sub_fields' => [
                    [
                        'key' => 'field_paragraph_text',
                        'label' => __('Paragraph', 'roihin-crystal'),
                        'name' => 'paragraph_text',
                        'type' => 'textarea',
                        'required' => 1,
                        'rows' => 4,
                        'new_lines' => 'wpautop',
                    ],
                ],
            ],

            // Crystal Attributes
            [
                'key' => 'field_crystal_attributes',
                'label' => __('Attributes', 'roihin-crystal'),
                'name' => 'crystal_attributes',
                'type' => 'textarea',
                'instructions' => __('Summary of crystal properties and attributes (max 2000 characters)', 'roihin-crystal'),
                'required' => 1,
                'rows' => 6,
                'maxlength' => 2000,
                'new_lines' => 'wpautop',
            ],

            // ==========================================
            // SECTION 4: FILTER SETTINGS
            // ==========================================
            [
                'key' => 'field_crystal_tab_filters',
                'label' => __('Filter Settings', 'roihin-crystal'),
                'type' => 'tab',
                'placement' => 'top',
            ],

            // Energy Properties Filter
            [
                'key' => 'field_energy_properties',
                'label' => __('Energy Properties', 'roihin-crystal'),
                'name' => 'energy_properties',
                'type' => 'checkbox',
                'instructions' => __('Select energy properties for filtering (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'finance_fortune' => __('Finance, Fortune / การเงิน, โชคลาภ', 'roihin-crystal'),
                    'work_business' => __('Work, Business, Investment / งาน, ธุรกิจ, การลงทุน', 'roihin-crystal'),
                    'love_happiness' => __('Love, Happiness, Luck / ความรัก, ความสุข, โชค', 'roihin-crystal'),
                    'health_balance' => __('Health, Balance / สุขภาพ, สมดุล', 'roihin-crystal'),
                    'spirituality_stability' => __('Spirituality, Stability / จิตวิญญาณ, ความมั่นคง', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // Zodiac Signs Filter
            [
                'key' => 'field_zodiac_signs',
                'label' => __('Zodiac Signs Filter', 'roihin-crystal'),
                'name' => 'zodiac_signs',
                'type' => 'checkbox',
                'instructions' => __('Select zodiac signs for filtering (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'aries' => __('Aries / ราศีเมษ', 'roihin-crystal'),
                    'taurus' => __('Taurus / ราศีพฤษภ', 'roihin-crystal'),
                    'gemini' => __('Gemini / ราศีเมถุน', 'roihin-crystal'),
                    'cancer' => __('Cancer / ราศีกรกฎ', 'roihin-crystal'),
                    'leo' => __('Leo / ราศีสิงห์', 'roihin-crystal'),
                    'virgo' => __('Virgo / ราศีกันย์', 'roihin-crystal'),
                    'libra' => __('Libra / ราศีตุลย์', 'roihin-crystal'),
                    'scorpio' => __('Scorpio / ราศีพิจิก', 'roihin-crystal'),
                    'sagittarius' => __('Sagittarius / ราศีธนู', 'roihin-crystal'),
                    'capricorn' => __('Capricorn / ราศีมกร', 'roihin-crystal'),
                    'aquarius' => __('Aquarius / ราศีกุมภ์', 'roihin-crystal'),
                    'pisces' => __('Pisces / ราศีมีน', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // Element Type Filter
            [
                'key' => 'field_element_type',
                'label' => __('Element Type', 'roihin-crystal'),
                'name' => 'element_type',
                'type' => 'checkbox',
                'instructions' => __('Select element types for filtering (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'earth' => __('Earth Sign / ราศีดิน', 'roihin-crystal'),
                    'water' => __('Water Sign / ราศีน้ำ', 'roihin-crystal'),
                    'air' => __('Air Sign / ราศีลม', 'roihin-crystal'),
                    'fire' => __('Fire Sign / ราศีไฟ', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // Color Filter
            [
                'key' => 'field_color_filter',
                'label' => __('Color Filter', 'roihin-crystal'),
                'name' => 'color_filter',
                'type' => 'checkbox',
                'instructions' => __('Select colors for filtering (at least one required)', 'roihin-crystal'),
                'required' => 1,
                'choices' => [
                    'purple' => __('Purple / สีม่วง', 'roihin-crystal'),
                    'blue' => __('Blue / สีน้ำเงิน', 'roihin-crystal'),
                    'teal' => __('Teal / สีเขียวน้ำทะเล', 'roihin-crystal'),
                    'green' => __('Green / สีเขียว', 'roihin-crystal'),
                    'yellow' => __('Yellow / สีเหลือง', 'roihin-crystal'),
                    'orange' => __('Orange / สีส้ม', 'roihin-crystal'),
                    'red' => __('Red / สีแดง', 'roihin-crystal'),
                    'light-blue' => __('Light Blue / สีฟ้า', 'roihin-crystal'),
                    'pink' => __('Pink / สีชมพู', 'roihin-crystal'),
                    'black' => __('Black / สีดำ', 'roihin-crystal'),
                    'white' => __('White / สีขาว', 'roihin-crystal'),
                    'beige' => __('Beige / สีเบจ', 'roihin-crystal'),
                ],
                'layout' => 'vertical',
                'return_format' => 'value',
            ],

            // ==========================================
            // SECTION 5: RELATED PRODUCTS
            // ==========================================
            [
                'key' => 'field_crystal_tab_related',
                'label' => __('Related Products', 'roihin-crystal'),
                'type' => 'tab',
                'placement' => 'top',
            ],

            // Related Products
            [
                'key' => 'field_related_products',
                'label' => __('Related Products', 'roihin-crystal'),
                'name' => 'related_products',
                'type' => 'relationship',
                'instructions' => __('Select related crystal or product items (optional, max 8)', 'roihin-crystal'),
                'required' => 0,
                'post_type' => [
                    0 => 'crystal',
                    1 => 'product',
                ],
                'taxonomy' => [],
                'filters' => [
                    0 => 'search',
                    1 => 'post_type',
                ],
                'elements' => [
                    0 => 'featured_image',
                ],
                'min' => 0,
                'max' => 8,
                'return_format' => 'id',
            ],

        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'crystal',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => __('Custom fields for Crystal products', 'roihin-crystal'),
    ]);
}
