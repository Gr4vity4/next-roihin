# WordPress Plugin Requirements: Personalized Design CRUD

> **Source Analysis**: `src/components/ui/PersonalizedDesignModal.tsx`
> **Plugin Name**: ROIHIN Personalized Designs Manager
> **Version**: 1.0.0
> **Last Updated**: 2025-10-07

---

## Executive Summary

The PersonalizedDesignModal component currently displays rich bracelet design data (energy properties, stone compositions, ratings, descriptions) but relies on **hardcoded mock data**. This document outlines requirements for a WordPress plugin that provides full CRUD functionality to manage personalized bracelet designs through the WordPress admin panel with REST API integration.

**Current State**: Only image galleries stored via simple ACF photo post type
**Target State**: Complete custom post type with 20+ structured fields, bilingual support, and REST API

---

## Table of Contents

1. [Required Fields Analysis](#1-required-fields-analysis)
2. [WordPress Plugin Requirements](#2-wordpress-plugin-requirements)
3. [CRUD Operations Support](#3-crud-operations-support)
4. [Additional Features](#4-additional-features)
5. [Implementation Checklist](#5-implementation-checklist)
6. [Code Examples](#6-code-examples)

---

## 1. Required Fields Analysis

### 1.1 Data Structure Overview

Based on analysis of `PersonalizedDesignModal.tsx` (lines 14-280), the following fields are required:

| Field Name | Type | Required | Default | Source Line | Description |
|------------|------|----------|---------|-------------|-------------|
| `images` | `string[]` | Yes | `[]` | 10, 23-31 | Gallery images (main + thumbnails) |
| `title` | `string` | No | `'ออกแบบโดย'` | 11, 18 | Designer attribution label |
| `designer_name` | `string` | Yes | `'ROIHIN Stone & Bracelet'` | 139 | Designer/studio name |
| `design_date` | `date` | Yes | Current date | 140 | Design creation date |
| `energy_description` | `text` | Yes | - | 199-213 | Long-form energy property description (Thai) |
| `energy_description_en` | `text` | No | - | - | English translation of energy description |
| `energy_properties` | `object[]` | Yes | See below | 58-64 | Energy rating categories |
| `stones_used` | `string[]` | Yes | `[]` | 66-73 | Array of crystal/stone names |
| `charm_separator` | `string` | No | `'None'` | 256 | Charm and separator specification |
| `stone_size` | `string` | Yes | - | 262 | Stone bead size (e.g., "8 mm.") |
| `budget_level` | `string` | Yes | - | 271 | Production budget category |

### 1.2 Energy Properties Structure

Each design includes 5 energy property ratings (lines 58-64):

```typescript
interface EnergyProperty {
  name: string        // Thai name, e.g., "การเงิน โชคลาภ"
  name_en: string     // English name, e.g., "Finance & Fortune"
  rating: number      // 0-8 scale
  label: string       // Thai label: "ดีเยี่ยมที่สุด", "ดีมาก", "ปานกลาง", "ดี"
  label_en: string    // English label: "Excellent", "Very Good", "Moderate", "Good"
}
```

**Standard 5 Categories**:

1. **การเงิน โชคลาภ** (Finance & Fortune)
2. **การงาน ธุรกิจ การลงทุน** (Work, Business, Investment)
3. **ความรัก ความสุข โชคดี** (Love, Happiness, Luck)
4. **สุขภาพ สมดุลชีวิต** (Health, Life Balance)
5. **จิตวิญญาณ ความมั่นคง** (Spirituality, Stability)

**Rating Labels Mapping**:

| Rating | Thai Label | English Label |
|--------|-----------|---------------|
| 5-8 | ดีเยี่ยมที่สุด | Excellent |
| 4 | ดีมาก | Very Good |
| 3 | ปานกลาง | Moderate |
| 1-2 | พอใช้ | Fair |
| 0 | ไม่มี | None |

### 1.3 Field Validation Rules

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| `images` | Minimum 1 image, maximum 10 | "At least 1 image required, maximum 10 allowed" |
| `energy_description` | Minimum 100 characters | "Description must be at least 100 characters" |
| `energy_properties` | All 5 categories required, rating 0-8 | "All energy properties must have rating 0-8" |
| `stones_used` | Minimum 1 stone, maximum 15 | "At least 1 stone required, maximum 15 allowed" |
| `stone_size` | Format: number + "mm." | "Invalid format. Use: 8 mm., 10 mm., etc." |
| `budget_level` | Predefined options only | "Must select valid budget level" |
| `design_date` | Valid date, not future | "Date cannot be in the future" |

### 1.4 Budget Level Options

Based on line 271, budget levels are categorized (Thai/English):

```php
$budget_levels = [
    'budget'    => ['th' => 'ระดับประหยัด (ต่ำกว่า 3,000)', 'en' => 'Budget (Under 3,000 THB)'],
    'standard'  => ['th' => 'ระดับกลาง (3,000 - 5,000)', 'en' => 'Standard (3,000 - 5,000 THB)'],
    'premium'   => ['th' => 'ระดับสูง (5,000 - 8,000)', 'en' => 'Premium (5,000 - 8,000 THB)'],
    'luxury'    => ['th' => 'ระดับสูง (8,000 ขึ้นไป)', 'en' => 'Luxury (8,000+ THB)'],
];
```

### 1.5 Optional vs Required Fields

**Required Fields** (Cannot create design without):
- ✅ At least 1 image
- ✅ Designer name
- ✅ Design date
- ✅ Energy description (Thai)
- ✅ All 5 energy property ratings
- ✅ At least 1 stone
- ✅ Stone size
- ✅ Budget level

**Optional Fields** (Can be empty):
- ⚪ Designer title override (defaults to "ออกแบบโดย")
- ⚪ Energy description (English)
- ⚪ Charm and separator specification
- ⚪ Gallery images beyond the first (min 1, max 10)

---

## 2. WordPress Plugin Requirements

### 2.1 Custom Post Type Structure

**Post Type Registration**:

```php
function rpd_register_post_type() {
    register_post_type('personalized_design', [
        'labels' => [
            'name'          => __('Personalized Designs', 'roihin-personalized'),
            'singular_name' => __('Personalized Design', 'roihin-personalized'),
            'add_new'       => __('Add New Design', 'roihin-personalized'),
            'add_new_item'  => __('Add New Personalized Design', 'roihin-personalized'),
            'edit_item'     => __('Edit Design', 'roihin-personalized'),
            'view_item'     => __('View Design', 'roihin-personalized'),
        ],
        'public'              => true,
        'show_in_rest'        => true, // Enable REST API
        'rest_base'           => 'personalized-designs',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'            => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'personalized-designs'],
        'menu_icon'           => 'dashicons-art',
        'capability_type'     => 'post',
        'menu_position'       => 26,
    ]);
}
add_action('init', 'rpd_register_post_type');
```

### 2.2 Custom Taxonomies

**1. Stone Types Taxonomy**:

```php
register_taxonomy('stone_type', 'personalized_design', [
    'labels' => [
        'name'          => __('Stone Types', 'roihin-personalized'),
        'singular_name' => __('Stone Type', 'roihin-personalized'),
    ],
    'hierarchical'      => false, // Like tags
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => ['slug' => 'stone'],
]);
```

**2. Budget Level Taxonomy**:

```php
register_taxonomy('budget_level', 'personalized_design', [
    'labels' => [
        'name'          => __('Budget Levels', 'roihin-personalized'),
        'singular_name' => __('Budget Level', 'roihin-personalized'),
    ],
    'hierarchical'      => true, // Like categories
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => ['slug' => 'budget'],
]);
```

### 2.3 ACF Field Groups Configuration

**Field Group**: `group_personalized_design_details`

**Location Rule**: Post Type = `personalized_design`

**Fields Structure** (ACF JSON):

```json
{
  "key": "group_personalized_design_details",
  "title": "Design Details",
  "fields": [
    {
      "key": "field_pd_gallery",
      "label": "Design Gallery",
      "name": "design_gallery",
      "type": "gallery",
      "required": 1,
      "min": 1,
      "max": 10,
      "insert": "append",
      "library": "all",
      "min_width": 800,
      "min_height": 800,
      "return_format": "array"
    },
    {
      "key": "field_pd_designer_info",
      "label": "Designer Information",
      "name": "designer_info",
      "type": "group",
      "layout": "block",
      "sub_fields": [
        {
          "key": "field_pd_designer_name",
          "label": "Designer Name",
          "name": "designer_name",
          "type": "text",
          "default_value": "ROIHIN Stone & Bracelet",
          "required": 1
        },
        {
          "key": "field_pd_design_date",
          "label": "Design Date",
          "name": "design_date",
          "type": "date_picker",
          "display_format": "d F Y",
          "return_format": "Y-m-d",
          "required": 1
        },
        {
          "key": "field_pd_designer_title",
          "label": "Designer Attribution Label",
          "name": "designer_title",
          "type": "text",
          "default_value": "ออกแบบโดย",
          "instructions": "Label shown above designer name (e.g., 'Designed by')"
        }
      ]
    },
    {
      "key": "field_pd_energy_desc",
      "label": "Energy Description",
      "name": "energy_description",
      "type": "group",
      "sub_fields": [
        {
          "key": "field_pd_energy_desc_th",
          "label": "Description (Thai)",
          "name": "description_th",
          "type": "wysiwyg",
          "tabs": "visual,text",
          "toolbar": "basic",
          "media_upload": 0,
          "required": 1
        },
        {
          "key": "field_pd_energy_desc_en",
          "label": "Description (English)",
          "name": "description_en",
          "type": "wysiwyg",
          "tabs": "visual,text",
          "toolbar": "basic",
          "media_upload": 0,
          "required": 0
        }
      ]
    },
    {
      "key": "field_pd_energy_properties",
      "label": "Energy Properties",
      "name": "energy_properties",
      "type": "repeater",
      "required": 1,
      "min": 5,
      "max": 5,
      "layout": "table",
      "button_label": "Add Property",
      "sub_fields": [
        {
          "key": "field_pd_ep_category",
          "label": "Category",
          "name": "category",
          "type": "select",
          "required": 1,
          "choices": {
            "finance_fortune": "การเงิน โชคลาภ (Finance & Fortune)",
            "work_business": "การงาน ธุรกิจ การลงทุน (Work, Business, Investment)",
            "love_happiness": "ความรัก ความสุข โชคดี (Love, Happiness, Luck)",
            "health_balance": "สุขภาพ สมดุลชีวิต (Health, Life Balance)",
            "spirituality": "จิตวิญญาณ ความมั่นคง (Spirituality, Stability)"
          },
          "default_value": "",
          "allow_null": 0
        },
        {
          "key": "field_pd_ep_rating",
          "label": "Rating",
          "name": "rating",
          "type": "range",
          "required": 1,
          "min": 0,
          "max": 8,
          "step": 1,
          "default_value": 3
        }
      ]
    },
    {
      "key": "field_pd_stones",
      "label": "Stones Used in Design",
      "name": "stones_used",
      "type": "repeater",
      "required": 1,
      "min": 1,
      "max": 15,
      "layout": "table",
      "button_label": "Add Stone",
      "sub_fields": [
        {
          "key": "field_pd_stone_name",
          "label": "Stone Name",
          "name": "stone_name",
          "type": "text",
          "required": 1,
          "placeholder": "e.g., Black Tourmaline"
        },
        {
          "key": "field_pd_stone_reference",
          "label": "Link to Crystal Database",
          "name": "stone_reference",
          "type": "post_object",
          "post_type": ["crystal"],
          "allow_null": 1,
          "return_format": "id"
        }
      ]
    },
    {
      "key": "field_pd_specifications",
      "label": "Bracelet Specifications",
      "name": "specifications",
      "type": "group",
      "sub_fields": [
        {
          "key": "field_pd_stone_size",
          "label": "Stone Size",
          "name": "stone_size",
          "type": "select",
          "required": 1,
          "choices": {
            "6mm": "6 mm.",
            "8mm": "8 mm.",
            "10mm": "10 mm.",
            "12mm": "12 mm.",
            "custom": "Custom Size"
          }
        },
        {
          "key": "field_pd_stone_size_custom",
          "label": "Custom Stone Size",
          "name": "stone_size_custom",
          "type": "text",
          "conditional_logic": [
            [
              {
                "field": "field_pd_stone_size",
                "operator": "==",
                "value": "custom"
              }
            ]
          ],
          "placeholder": "e.g., 7 mm."
        },
        {
          "key": "field_pd_charm_separator",
          "label": "Charm & Separator",
          "name": "charm_separator",
          "type": "text",
          "default_value": "None",
          "placeholder": "e.g., Silver charm, Gold spacer"
        }
      ]
    }
  ],
  "location": [
    [
      {
        "param": "post_type",
        "operator": "==",
        "value": "personalized_design"
      }
    ]
  ],
  "menu_order": 0,
  "position": "normal",
  "style": "default",
  "active": true
}
```

### 2.4 REST API Custom Fields Registration

**Register ACF fields in REST API**:

```php
function rpd_register_rest_fields() {
    register_rest_field('personalized_design', 'acf', [
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ]);

    // Add featured image URL
    register_rest_field('personalized_design', 'featured_image_url', [
        'get_callback' => function($post) {
            $image_id = get_post_thumbnail_id($post['id']);
            return $image_id ? wp_get_attachment_image_url($image_id, 'large') : null;
        },
        'schema' => null,
    ]);
}
add_action('rest_api_init', 'rpd_register_rest_fields');
```

### 2.5 WordPress Hooks & Filters

**Required Hooks**:

1. **`save_post_personalized_design`** - Validate data before saving
2. **`rest_prepare_personalized_design`** - Modify REST response
3. **`acf/validate_value/name=energy_properties`** - Ensure all 5 categories present
4. **`acf/validate_value/name=design_gallery`** - Validate image dimensions

**Filter Example**:

```php
// Validate energy properties have all 5 required categories
add_filter('acf/validate_value/name=energy_properties', 'rpd_validate_energy_properties', 10, 4);
function rpd_validate_energy_properties($valid, $value, $field, $input) {
    if (!$valid) return $valid;

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
        $valid = 'All 5 energy property categories are required';
    }

    return $valid;
}
```

### 2.6 Capabilities & Permissions

**Custom Capabilities**:

```php
function rpd_add_capabilities() {
    $role = get_role('administrator');
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

    foreach ($caps as $cap) {
        $role->add_cap($cap);
    }

    // Editor role - can edit but not delete
    $editor = get_role('editor');
    $editor_caps = [
        'edit_personalized_design',
        'edit_personalized_designs',
        'publish_personalized_designs',
        'read_personalized_design',
    ];

    foreach ($editor_caps as $cap) {
        $editor->add_cap($cap);
    }
}
register_activation_hook(__FILE__, 'rpd_add_capabilities');
```

---

## 3. CRUD Operations Support

### 3.1 Create Operation

**Admin UI Flow**:
1. Navigate to **Personalized Designs > Add New**
2. Fill post title (auto-generated from date + stones if empty)
3. Upload minimum 1 gallery image (max 10)
4. Enter designer information
5. Write energy description (Thai required, English optional)
6. Set all 5 energy property ratings (0-8 scale)
7. Add stones used (minimum 1, with optional crystal DB linking)
8. Select stone size and budget level
9. Optionally add charm/separator details
10. Publish or save as draft

**REST API Endpoint**:

```
POST /wp-json/wp/v2/personalized-designs
```

**Request Body Example**:

```json
{
  "title": "Personalized Design - Black Tourmaline Focus - Aug 2025",
  "status": "publish",
  "acf": {
    "design_gallery": [123, 124, 125, 126],
    "designer_info": {
      "designer_name": "ROIHIN Stone & Bracelet",
      "design_date": "2025-08-22",
      "designer_title": "ออกแบบโดย"
    },
    "energy_description": {
      "description_th": "<p>กำไลเส้นนี้เปล่งประกายพลังแห่งความมั่นใจ...</p>",
      "description_en": "<p>This bracelet radiates confidence energy...</p>"
    },
    "energy_properties": [
      {"category": "finance_fortune", "rating": 5},
      {"category": "work_business", "rating": 5},
      {"category": "love_happiness", "rating": 3},
      {"category": "health_balance", "rating": 3},
      {"category": "spirituality", "rating": 4}
    ],
    "stones_used": [
      {"stone_name": "Black Tourmaline", "stone_reference": 42},
      {"stone_name": "Red Garnet", "stone_reference": 58},
      {"stone_name": "Red Tiger's Eye", "stone_reference": null}
    ],
    "specifications": {
      "stone_size": "8mm",
      "charm_separator": "None"
    }
  },
  "budget_level": [5],
  "stone_type": [12, 15, 18]
}
```

**Validation on Create**:

```php
add_action('acf/save_post', 'rpd_validate_on_create', 10);
function rpd_validate_on_create($post_id) {
    if (get_post_type($post_id) !== 'personalized_design') return;

    $gallery = get_field('design_gallery', $post_id);
    $energy_props = get_field('energy_properties', $post_id);
    $stones = get_field('stones_used', $post_id);

    // Validate gallery
    if (empty($gallery)) {
        acf_add_validation_error('', 'At least 1 gallery image is required');
        return;
    }

    // Validate energy properties count
    if (count($energy_props) !== 5) {
        acf_add_validation_error('', 'All 5 energy property categories must be filled');
        return;
    }

    // Validate stones
    if (empty($stones)) {
        acf_add_validation_error('', 'At least 1 stone must be added');
        return;
    }
}
```

### 3.2 Read Operation

**Single Design Endpoint**:

```
GET /wp-json/wp/v2/personalized-designs/{id}
GET /wp-json/wp/v2/personalized-designs?slug={slug}
```

**Response Example**:

```json
{
  "id": 123,
  "slug": "personalized-design-black-tourmaline-aug-2025",
  "title": {
    "rendered": "Personalized Design - Black Tourmaline Focus - Aug 2025"
  },
  "featured_image_url": "https://wp.example.com/wp-content/uploads/2025/08/design-main.jpg",
  "acf": {
    "design_gallery": [
      {
        "id": 123,
        "url": "https://wp.example.com/wp-content/uploads/2025/08/img1.jpg",
        "alt": "Bracelet design angle 1"
      },
      {
        "id": 124,
        "url": "https://wp.example.com/wp-content/uploads/2025/08/img2.jpg",
        "alt": "Bracelet design angle 2"
      }
    ],
    "designer_info": {
      "designer_name": "ROIHIN Stone & Bracelet",
      "design_date": "2025-08-22",
      "designer_title": "ออกแบบโดย"
    },
    "energy_description": {
      "description_th": "<p>กำไลเส้นนี้เปล่งประกายพลังแห่งความมั่นใจ...</p>",
      "description_en": "<p>This bracelet radiates confidence energy...</p>"
    },
    "energy_properties": [
      {"category": "finance_fortune", "rating": 5},
      {"category": "work_business", "rating": 5},
      {"category": "love_happiness", "rating": 3},
      {"category": "health_balance", "rating": 3},
      {"category": "spirituality", "rating": 4}
    ],
    "stones_used": [
      {"stone_name": "Black Tourmaline", "stone_reference": 42},
      {"stone_name": "Red Garnet", "stone_reference": 58}
    ],
    "specifications": {
      "stone_size": "8mm",
      "charm_separator": "None"
    }
  },
  "budget_level": [5],
  "stone_type": [12, 15, 18]
}
```

**List Designs Endpoint**:

```
GET /wp-json/wp/v2/personalized-designs
GET /wp-json/wp/v2/personalized-designs?per_page=8&orderby=date&order=desc
GET /wp-json/wp/v2/personalized-designs?budget_level=5
GET /wp-json/wp/v2/personalized-designs?stone_type=12
```

**Custom Endpoint for Random Designs**:

```php
add_action('rest_api_init', function() {
    register_rest_route('roihin/v1', '/personalized-designs/random', [
        'methods' => 'GET',
        'callback' => 'rpd_get_random_designs',
        'permission_callback' => '__return_true',
        'args' => [
            'count' => [
                'default' => 8,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0 && $param <= 20;
                }
            ]
        ]
    ]);
});

function rpd_get_random_designs($request) {
    $count = $request->get_param('count');

    $args = [
        'post_type' => 'personalized_design',
        'posts_per_page' => $count,
        'orderby' => 'rand',
        'post_status' => 'publish',
    ];

    $query = new WP_Query($args);
    $designs = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $gallery = get_field('design_gallery', $post_id);

            $designs[] = [
                'id' => $post_id,
                'title' => get_the_title(),
                'slug' => get_post_field('post_name', $post_id),
                'images' => array_map(function($img) {
                    return $img['url'];
                }, $gallery ?: []),
                'designer' => get_field('designer_info', $post_id)['designer_name'],
                'date' => get_field('designer_info', $post_id)['design_date'],
            ];
        }
    }

    wp_reset_postdata();
    return rest_ensure_response($designs);
}
```

### 3.3 Update Operation

**Admin UI Flow**:
1. Navigate to **Personalized Designs > All Designs**
2. Click design title or **Edit** action
3. Modify any fields (same validation as Create)
4. Click **Update** button

**REST API Endpoint**:

```
PUT /wp-json/wp/v2/personalized-designs/{id}
PATCH /wp-json/wp/v2/personalized-designs/{id}
```

**Request Body** (same structure as Create, only include fields to update):

```json
{
  "acf": {
    "energy_properties": [
      {"category": "finance_fortune", "rating": 7},
      {"category": "work_business", "rating": 6},
      {"category": "love_happiness", "rating": 4},
      {"category": "health_balance", "rating": 5},
      {"category": "spirituality", "rating": 5}
    ]
  }
}
```

**Update Hooks**:

```php
// Track changes and notify
add_action('post_updated', 'rpd_track_updates', 10, 3);
function rpd_track_updates($post_ID, $post_after, $post_before) {
    if (get_post_type($post_ID) !== 'personalized_design') return;

    // Log update for audit trail
    update_post_meta($post_ID, '_last_modified_by', get_current_user_id());
    update_post_meta($post_ID, '_modification_count',
        (int) get_post_meta($post_ID, '_modification_count', true) + 1
    );
}
```

### 3.4 Delete Operation

**Soft Delete (Trash)**:
1. Navigate to **Personalized Designs > All Designs**
2. Hover over design and click **Trash**
3. Design moved to Trash (status = 'trash')
4. Can restore within 30 days via **Trash** view

**Permanent Delete**:
1. Navigate to **Personalized Designs > Trash**
2. Click **Delete Permanently**
3. Post and all associated meta deleted from database

**REST API Endpoint**:

```
DELETE /wp-json/wp/v2/personalized-designs/{id}       # Move to trash
DELETE /wp-json/wp/v2/personalized-designs/{id}?force=true  # Permanent delete
```

**Delete Hooks for Cleanup**:

```php
// Clean up associated data on permanent delete
add_action('before_delete_post', 'rpd_cleanup_on_delete', 10, 2);
function rpd_cleanup_on_delete($post_id, $post) {
    if ($post->post_type !== 'personalized_design') return;

    // Optional: Delete associated media files
    $gallery = get_field('design_gallery', $post_id);
    if ($gallery) {
        foreach ($gallery as $image) {
            // Only delete if not used elsewhere
            $usage_count = count(get_posts([
                'post_type' => 'any',
                'meta_query' => [
                    [
                        'key' => 'design_gallery',
                        'value' => serialize($image['id']),
                        'compare' => 'LIKE'
                    ]
                ]
            ]));

            if ($usage_count === 1) {
                wp_delete_attachment($image['id'], true);
            }
        }
    }

    // Log deletion
    error_log("Personalized Design {$post_id} permanently deleted by user " . get_current_user_id());
}
```

---

## 4. Additional Features

### 4.1 Media Upload & Attachment Handling

**Image Requirements**:
- Minimum dimensions: 800×800px
- Maximum dimensions: 4000×4000px (for performance)
- Allowed formats: JPG, PNG, WebP
- Maximum file size: 5MB per image
- Aspect ratio: 1:1 (square) recommended

**Upload Validation**:

```php
add_filter('acf/upload_prefilter/name=design_gallery', 'rpd_validate_image_upload');
function rpd_validate_image_upload($errors, $file, $field) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($file['type'], $allowed_types)) {
        $errors[] = 'Only JPG, PNG, and WebP images are allowed';
    }

    if ($file['size'] > 5 * 1024 * 1024) { // 5MB
        $errors[] = 'Image size must be less than 5MB';
    }

    // Check dimensions
    $image_info = getimagesize($file['tmp_name']);
    if ($image_info) {
        [$width, $height] = $image_info;

        if ($width < 800 || $height < 800) {
            $errors[] = 'Image must be at least 800×800 pixels';
        }

        if ($width > 4000 || $height > 4000) {
            $errors[] = 'Image must not exceed 4000×4000 pixels';
        }
    }

    return $errors;
}
```

**Automatic Image Optimization**:

```php
add_filter('wp_handle_upload', 'rpd_optimize_uploaded_images');
function rpd_optimize_uploaded_images($upload) {
    $image_path = $upload['file'];
    $image_type = $upload['type'];

    // Only process images for personalized_design post type
    if (!isset($_POST['post_id']) || get_post_type($_POST['post_id']) !== 'personalized_design') {
        return $upload;
    }

    // Convert to WebP for better performance (requires GD or Imagick)
    if (function_exists('imagewebp')) {
        $image = null;

        switch ($image_type) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($image_path);
                break;
            case 'image/png':
                $image = imagecreatefrompng($image_path);
                break;
        }

        if ($image) {
            $webp_path = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image_path);
            imagewebp($image, $webp_path, 85); // 85% quality
            imagedestroy($image);

            $upload['file'] = $webp_path;
            $upload['type'] = 'image/webp';
            $upload['url'] = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $upload['url']);
        }
    }

    return $upload;
}
```

### 4.2 Internationalization (i18n)

**Translation Files Structure**:

```
/wp-content/plugins/roihin-personalized-designs/
├── languages/
│   ├── roihin-personalized-th_TH.po
│   ├── roihin-personalized-th_TH.mo
│   ├── roihin-personalized-en_US.po
│   └── roihin-personalized-en_US.mo
```

**Load Text Domain**:

```php
add_action('plugins_loaded', 'rpd_load_textdomain');
function rpd_load_textdomain() {
    load_plugin_textdomain(
        'roihin-personalized',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages/'
    );
}
```

**Translatable Strings**:

```php
// Energy property categories
$categories = [
    'finance_fortune' => [
        'th' => __('การเงิน โชคลาภ', 'roihin-personalized'),
        'en' => __('Finance & Fortune', 'roihin-personalized'),
    ],
    'work_business' => [
        'th' => __('การงาน ธุรกิจ การลงทุน', 'roihin-personalized'),
        'en' => __('Work, Business, Investment', 'roihin-personalized'),
    ],
    // ... etc
];

// Rating labels
$rating_labels = [
    'excellent' => [
        'th' => __('ดีเยี่ยมที่สุด', 'roihin-personalized'),
        'en' => __('Excellent', 'roihin-personalized'),
    ],
    'very_good' => [
        'th' => __('ดีมาก', 'roihin-personalized'),
        'en' => __('Very Good', 'roihin-personalized'),
    ],
    // ... etc
];
```

**REST API Language Support**:

```php
add_filter('rest_prepare_personalized_design', 'rpd_add_translations_to_rest', 10, 3);
function rpd_add_translations_to_rest($response, $post, $request) {
    $lang = $request->get_param('lang') ?: 'th';

    // Add translated energy property names
    $energy_props = $response->data['acf']['energy_properties'];
    foreach ($energy_props as &$prop) {
        $prop['name'] = rpd_get_energy_category_name($prop['category'], $lang);
        $prop['label'] = rpd_get_rating_label($prop['rating'], $lang);
    }
    $response->data['acf']['energy_properties'] = $energy_props;

    // Use appropriate description based on language
    $description = $lang === 'en'
        ? $response->data['acf']['energy_description']['description_en']
        : $response->data['acf']['energy_description']['description_th'];

    $response->data['acf']['energy_description_text'] = $description;

    return $response;
}
```

### 4.3 Zod Schema for Frontend Validation

**TypeScript Type Definitions** (for Next.js integration):

```typescript
// src/lib/types/personalized-design.ts
import { z } from 'zod'

export const ACFImageSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  alt: z.string(),
  title: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const DesignerInfoSchema = z.object({
  designer_name: z.string().min(1),
  design_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  designer_title: z.string().default('ออกแบบโดย'),
})

export const EnergyDescriptionSchema = z.object({
  description_th: z.string().min(100),
  description_en: z.string().optional(),
})

export const EnergyPropertySchema = z.object({
  category: z.enum([
    'finance_fortune',
    'work_business',
    'love_happiness',
    'health_balance',
    'spirituality',
  ]),
  rating: z.number().min(0).max(8),
})

export const StoneUsedSchema = z.object({
  stone_name: z.string().min(1),
  stone_reference: z.number().nullable(),
})

export const SpecificationsSchema = z.object({
  stone_size: z.enum(['6mm', '8mm', '10mm', '12mm', 'custom']),
  stone_size_custom: z.string().optional(),
  charm_separator: z.string().default('None'),
})

export const PersonalizedDesignACFSchema = z.object({
  design_gallery: z.array(ACFImageSchema).min(1).max(10),
  designer_info: DesignerInfoSchema,
  energy_description: EnergyDescriptionSchema,
  energy_properties: z.array(EnergyPropertySchema).length(5),
  stones_used: z.array(StoneUsedSchema).min(1).max(15),
  specifications: SpecificationsSchema,
})

export const PersonalizedDesignSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  featured_image_url: z.string().url().nullable(),
  acf: PersonalizedDesignACFSchema,
  budget_level: z.array(z.number()),
  stone_type: z.array(z.number()),
})

// Infer TypeScript types
export type PersonalizedDesign = z.infer<typeof PersonalizedDesignSchema>
export type PersonalizedDesignACF = z.infer<typeof PersonalizedDesignACFSchema>
export type EnergyProperty = z.infer<typeof EnergyPropertySchema>
export type StoneUsed = z.infer<typeof StoneUsedSchema>
```

**API Helper with Validation** (Next.js):

```typescript
// src/lib/api/personalized-designs.ts
import { getFetchConfig } from '@/config/cache.config'
import { WORDPRESS_API_URL } from '@/config/api.config'
import { PersonalizedDesignSchema } from '@/lib/types/personalized-design'
import { z } from 'zod'

export async function getPersonalizedDesign(slug: string) {
  try {
    const url = `${WORDPRESS_API_URL}/wp-json/wp/v2/personalized-designs?slug=${slug}&_fields=id,slug,title,acf,featured_image_url,budget_level,stone_type`

    const response = await fetch(url, {
      ...getFetchConfig('designs'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch design: ${response.status}`)
      return null
    }

    const data = await response.json()

    // Validate with Zod
    const validatedData = z.array(PersonalizedDesignSchema).safeParse(data)

    if (!validatedData.success) {
      console.error('Invalid design response:', validatedData.error)
      return null
    }

    return validatedData.data[0] || null
  } catch (error) {
    console.error('Error fetching personalized design:', error)
    return null
  }
}

export async function getRandomPersonalizedDesigns(count: number = 8) {
  try {
    const url = `${WORDPRESS_API_URL}/wp-json/roihin/v1/personalized-designs/random?count=${count}`

    const response = await fetch(url, {
      ...getFetchConfig('designs'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch random designs: ${response.status}`)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching random designs:', error)
    return []
  }
}
```

### 4.4 Admin UI Enhancements

**Custom Admin Columns**:

```php
add_filter('manage_personalized_design_posts_columns', 'rpd_custom_columns');
function rpd_custom_columns($columns) {
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

add_action('manage_personalized_design_posts_custom_column', 'rpd_custom_column_content', 10, 2);
function rpd_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'design_thumbnail':
            $gallery = get_field('design_gallery', $post_id);
            if ($gallery && !empty($gallery)) {
                echo '<img src="' . esc_url($gallery[0]['sizes']['thumbnail']) . '" width="50" height="50" style="object-fit:cover;border-radius:4px;" />';
            }
            break;

        case 'designer':
            $designer_info = get_field('designer_info', $post_id);
            echo esc_html($designer_info['designer_name'] ?? '—');
            break;

        case 'design_date':
            $designer_info = get_field('designer_info', $post_id);
            if ($designer_info && $designer_info['design_date']) {
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
            if ($energy_props) {
                $total = array_sum(array_column($energy_props, 'rating'));
                $avg = $total / count($energy_props);
                echo number_format($avg, 1) . '/8';
            } else {
                echo '—';
            }
            break;
    }
}
```

**Bulk Actions**:

```php
add_filter('bulk_actions-edit-personalized_design', 'rpd_register_bulk_actions');
function rpd_register_bulk_actions($bulk_actions) {
    $bulk_actions['rpd_duplicate'] = __('Duplicate', 'roihin-personalized');
    $bulk_actions['rpd_export_json'] = __('Export as JSON', 'roihin-personalized');
    return $bulk_actions;
}

add_filter('handle_bulk_actions-edit-personalized_design', 'rpd_handle_bulk_actions', 10, 3);
function rpd_handle_bulk_actions($redirect_to, $action, $post_ids) {
    if ($action === 'rpd_duplicate') {
        foreach ($post_ids as $post_id) {
            rpd_duplicate_design($post_id);
        }
        $redirect_to = add_query_arg('rpd_duplicated', count($post_ids), $redirect_to);
    }

    if ($action === 'rpd_export_json') {
        rpd_export_designs_json($post_ids);
        exit;
    }

    return $redirect_to;
}

function rpd_duplicate_design($post_id) {
    $post = get_post($post_id);
    $new_post = [
        'post_title' => $post->post_title . ' (Copy)',
        'post_content' => $post->post_content,
        'post_status' => 'draft',
        'post_type' => 'personalized_design',
    ];

    $new_post_id = wp_insert_post($new_post);

    // Copy ACF fields
    $fields = get_fields($post_id);
    foreach ($fields as $key => $value) {
        update_field($key, $value, $new_post_id);
    }

    return $new_post_id;
}
```

**Quick Edit Support**:

```php
add_action('quick_edit_custom_box', 'rpd_quick_edit_fields', 10, 2);
function rpd_quick_edit_fields($column_name, $post_type) {
    if ($post_type !== 'personalized_design') return;

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
```

---

## 5. Implementation Checklist

### 5.1 Plugin Structure

```
roihin-personalized-designs/
├── roihin-personalized-designs.php    # Main plugin file
├── readme.txt                         # WordPress.org readme
├── includes/
│   ├── class-post-type.php           # Custom post type registration
│   ├── class-taxonomies.php          # Taxonomy registration
│   ├── class-rest-api.php            # REST API customizations
│   ├── class-admin-ui.php            # Admin UI enhancements
│   ├── class-validation.php          # Data validation
│   └── class-i18n.php                # Internationalization
├── admin/
│   ├── css/
│   │   └── admin-styles.css          # Admin UI styles
│   └── js/
│       └── admin-scripts.js          # Admin UI scripts
├── public/
│   ├── css/
│   │   └── public-styles.css         # Frontend styles (if needed)
│   └── js/
│       └── public-scripts.js         # Frontend scripts (if needed)
├── languages/
│   ├── roihin-personalized-th_TH.po
│   ├── roihin-personalized-th_TH.mo
│   ├── roihin-personalized-en_US.po
│   └── roihin-personalized-en_US.mo
├── acf-json/
│   └── group_personalized_design_details.json
└── uninstall.php                      # Cleanup on uninstall
```

### 5.2 Required PHP Functions & Classes

**Main Plugin File** (`roihin-personalized-designs.php`):

```php
<?php
/**
 * Plugin Name: ROIHIN Personalized Designs Manager
 * Plugin URI: https://roihin.precisiondevlab.com
 * Description: Manage personalized bracelet designs with energy properties, stone compositions, and ratings
 * Version: 1.0.0
 * Author: ROIHIN Stone & Bracelet
 * Author URI: https://roihin.precisiondevlab.com
 * Text Domain: roihin-personalized
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

// Define plugin constants
define('RPD_VERSION', '1.0.0');
define('RPD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RPD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('RPD_PLUGIN_FILE', __FILE__);

// Require dependencies
require_once RPD_PLUGIN_DIR . 'includes/class-post-type.php';
require_once RPD_PLUGIN_DIR . 'includes/class-taxonomies.php';
require_once RPD_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once RPD_PLUGIN_DIR . 'includes/class-admin-ui.php';
require_once RPD_PLUGIN_DIR . 'includes/class-validation.php';
require_once RPD_PLUGIN_DIR . 'includes/class-i18n.php';

// Initialize plugin
function rpd_init() {
    // Load text domain
    RPD_I18n::init();

    // Register post type and taxonomies
    RPD_Post_Type::init();
    RPD_Taxonomies::init();

    // Setup REST API
    RPD_REST_API::init();

    // Setup admin UI
    if (is_admin()) {
        RPD_Admin_UI::init();
    }

    // Setup validation
    RPD_Validation::init();
}
add_action('plugins_loaded', 'rpd_init');

// Activation hook
register_activation_hook(__FILE__, 'rpd_activate');
function rpd_activate() {
    // Register post type and flush rewrite rules
    RPD_Post_Type::init();
    RPD_Taxonomies::init();
    flush_rewrite_rules();

    // Add capabilities
    rpd_add_capabilities();

    // Create default budget level terms
    rpd_create_default_budget_levels();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'rpd_deactivate');
function rpd_deactivate() {
    flush_rewrite_rules();
}

// Helper functions
function rpd_add_capabilities() {
    $role = get_role('administrator');
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

    foreach ($caps as $cap) {
        $role->add_cap($cap);
    }
}

function rpd_create_default_budget_levels() {
    $levels = [
        ['slug' => 'budget', 'name' => 'ระดับประหยัด (ต่ำกว่า 3,000)'],
        ['slug' => 'standard', 'name' => 'ระดับกลาง (3,000 - 5,000)'],
        ['slug' => 'premium', 'name' => 'ระดับสูง (5,000 - 8,000)'],
        ['slug' => 'luxury', 'name' => 'ระดับสูง (8,000 ขึ้นไป)'],
    ];

    foreach ($levels as $level) {
        if (!term_exists($level['slug'], 'budget_level')) {
            wp_insert_term($level['name'], 'budget_level', ['slug' => $level['slug']]);
        }
    }
}
```

### 5.3 Database Schema Requirements

**WordPress Standard Tables** (no custom tables needed):
- `wp_posts` - Store personalized_design posts
- `wp_postmeta` - Store ACF field data
- `wp_terms` - Store taxonomy terms (budget levels, stone types)
- `wp_term_relationships` - Link posts to taxonomy terms

**Custom Meta Keys** (stored in `wp_postmeta`):

| Meta Key | Meta Value Type | Description |
|----------|----------------|-------------|
| `design_gallery` | Serialized array | Gallery image IDs |
| `designer_info` | Serialized array | Designer name, date, title |
| `energy_description` | Serialized array | Thai & English descriptions |
| `energy_properties` | Serialized array | 5 energy ratings |
| `stones_used` | Serialized array | Stone names & references |
| `specifications` | Serialized array | Size, charm/separator |
| `_last_modified_by` | User ID | Last editor tracking |
| `_modification_count` | Integer | Edit count for auditing |

**ACF JSON Storage**:
- ACF field configurations stored in `/acf-json/` directory
- Enables version control and deployment of field structures
- Automatically synced across environments

### 5.4 Security Considerations

**1. Nonce Verification**:

```php
// Verify nonce on form submissions
add_action('acf/save_post', 'rpd_verify_nonce', 1);
function rpd_verify_nonce($post_id) {
    if (get_post_type($post_id) !== 'personalized_design') return;

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    if (!current_user_can('edit_personalized_design', $post_id)) {
        wp_die(__('You do not have permission to edit this design', 'roihin-personalized'));
    }
}
```

**2. Data Sanitization**:

```php
add_filter('acf/update_value/name=designer_info', 'rpd_sanitize_designer_info', 10, 3);
function rpd_sanitize_designer_info($value, $post_id, $field) {
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

add_filter('acf/update_value/name=energy_description', 'rpd_sanitize_descriptions', 10, 3);
function rpd_sanitize_descriptions($value, $post_id, $field) {
    if (isset($value['description_th'])) {
        $value['description_th'] = wp_kses_post($value['description_th']);
    }

    if (isset($value['description_en'])) {
        $value['description_en'] = wp_kses_post($value['description_en']);
    }

    return $value;
}
```

**3. REST API Authentication**:

```php
add_filter('rest_authentication_errors', 'rpd_rest_authentication');
function rpd_rest_authentication($result) {
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
```

**4. SQL Injection Prevention**:
- Use WordPress `$wpdb->prepare()` for all custom queries
- ACF handles prepared statements automatically
- Never concatenate user input into SQL queries

**5. XSS Prevention**:
- Use `esc_html()`, `esc_attr()`, `esc_url()` for output
- Use `wp_kses_post()` for HTML content
- Sanitize all user input with `sanitize_text_field()`, `sanitize_email()`, etc.

**6. CSRF Protection**:
- WordPress nonces automatically included in admin forms
- REST API uses cookie-based authentication with nonces
- Custom forms must include `wp_nonce_field()`

### 5.5 Testing Requirements

**Unit Tests** (PHPUnit):

```php
// tests/test-personalized-design-validation.php
class Test_Personalized_Design_Validation extends WP_UnitTestCase {
    public function test_energy_properties_validation() {
        $valid_props = [
            ['category' => 'finance_fortune', 'rating' => 5],
            ['category' => 'work_business', 'rating' => 5],
            ['category' => 'love_happiness', 'rating' => 3],
            ['category' => 'health_balance', 'rating' => 3],
            ['category' => 'spirituality', 'rating' => 4],
        ];

        $this->assertTrue(RPD_Validation::validate_energy_properties($valid_props));
    }

    public function test_missing_energy_category() {
        $invalid_props = [
            ['category' => 'finance_fortune', 'rating' => 5],
            ['category' => 'work_business', 'rating' => 5],
        ];

        $this->assertFalse(RPD_Validation::validate_energy_properties($invalid_props));
    }

    public function test_image_gallery_minimum() {
        $empty_gallery = [];
        $this->assertFalse(RPD_Validation::validate_gallery($empty_gallery));

        $valid_gallery = [123];
        $this->assertTrue(RPD_Validation::validate_gallery($valid_gallery));
    }
}
```

**Integration Tests**:

```php
// tests/test-rest-api.php
class Test_REST_API extends WP_UnitTestCase {
    public function test_get_personalized_designs() {
        $request = new WP_REST_Request('GET', '/wp/v2/personalized-designs');
        $response = rest_do_request($request);

        $this->assertEquals(200, $response->get_status());
        $this->assertIsArray($response->get_data());
    }

    public function test_create_design_requires_auth() {
        $request = new WP_REST_Request('POST', '/wp/v2/personalized-designs');
        $request->set_param('title', 'Test Design');

        $response = rest_do_request($request);
        $this->assertEquals(401, $response->get_status());
    }
}
```

---

## 6. Code Examples

### 6.1 Frontend Integration Example

**Update PersonalizedDesignModal Component**:

```tsx
// src/components/ui/PersonalizedDesignModal.tsx
'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { PersonalizedDesign } from '@/lib/types/personalized-design'

interface PersonalizedDesignModalProps {
  isOpen: boolean
  onClose: () => void
  designData: PersonalizedDesign | null // Changed from hardcoded props
}

export function PersonalizedDesignModal({
  isOpen,
  onClose,
  designData,
}: PersonalizedDesignModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !designData) return null

  const { acf } = designData
  const images = acf.design_gallery.map((img) => img.url)

  // Helper to get rating label
  const getRatingLabel = (rating: number): string => {
    if (rating >= 5) return 'ดีเยี่ยมที่สุด'
    if (rating === 4) return 'ดีมาก'
    if (rating === 3) return 'ปานกลาง'
    return 'พอใช้'
  }

  // Helper to get energy property name
  const getEnergyPropertyName = (category: string): string => {
    const names: Record<string, string> = {
      finance_fortune: 'การเงิน โชคลาภ',
      work_business: 'การงาน ธุรกิจ การลงทุน',
      love_happiness: 'ความรัก ความสุข โชคดี',
      health_balance: 'สุขภาพ สมดุลชีวิต',
      spirituality: 'จิตวิญญาณ ความมั่นคง',
    }
    return names[category] || category
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:w-[90vw] md:max-w-6xl bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0 md:gap-8 p-6 md:p-8">
            {/* Left Section - Image Gallery */}
            <div className="space-y-6 mb-8 md:mb-0">
              {/* Main Image */}
              <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${designData.title.rendered} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-700 ring-2 ring-green-700 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </button>
                ))}
              </div>

              {/* Designer Info and Actions */}
              <div className="pt-6 flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    {acf.designer_info.designer_title}
                  </p>
                  <p className="font-medium text-gray-800">
                    {acf.designer_info.designer_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(acf.designer_info.design_date).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {/* Action buttons (wishlist, share) remain the same */}
              </div>

              {/* Footer Copyright Text */}
              <div className="pt-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  รูปภาพ วิดีโอ รูปแบบการจัดวางคริสตัลและคำอธิบายพลังงาน ถือเป็นทรัพย์สินทางปัญญา
                  ห้ามมิให้ผู้อื่นทำซ้ำ คัดลอก ดัดแปลง โดยไม่ได้รับอนุญาต
                  <br />
                  &copy; 2025 ROIHIN Stone & Bracelet under s 195 co., ltd. All rights reserved.
                </p>
              </div>
            </div>

            {/* Right Section - Details */}
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-light text-gray-800">
                คำอธิบายพลังงาน
              </h2>

              {/* Description - Now from WordPress */}
              <div
                className="text-gray-700 leading-relaxed text-sm md:text-base space-y-2"
                dangerouslySetInnerHTML={{
                  __html: acf.energy_description.description_th,
                }}
              />

              {/* Properties Table - Now from WordPress */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">คะแนนพลังงาน</h3>
                {acf.energy_properties.map((prop, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-gray-700 flex-1">
                      {getEnergyPropertyName(prop.category)}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < prop.rating ? 'bg-green-700' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs w-20 text-right">
                      {getRatingLabel(prop.rating)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stones Used - Now from WordPress */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">หินที่ใช้ในการออกแบบ</h3>
                <div className="flex flex-wrap gap-2">
                  {acf.stones_used.map((stone, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      {stone.stone_name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Charm and Size Selection - Now from WordPress */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 text-sm">ชาร์มและตัวคั่น</h3>
                  <div className="px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 text-center">
                    {acf.specifications.charm_separator}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 text-sm">ขนาดหิน</h3>
                  <div className="px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 text-center">
                    {acf.specifications.stone_size === 'custom'
                      ? acf.specifications.stone_size_custom
                      : acf.specifications.stone_size.replace('mm', ' mm.')}
                  </div>
                </div>
              </div>

              {/* Budget Level - From taxonomy */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800 text-sm">งบประมาณการจัดทำ</h3>
                <div className="px-6 py-3 border border-gray-300 rounded-full text-center text-gray-700">
                  {/* You'll need to fetch budget level name from taxonomy */}
                  ระดับสูง (8,000 ขึ้นไป)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 6.2 Usage in Section Component

```tsx
// src/components/sections/RecentPersonalizedDesignsSection.tsx
'use client'

import { Link } from '@/i18n/navigation'
import { getRandomPersonalizedDesigns, getPersonalizedDesign } from '@/lib/api/personalized-designs'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FontProvider } from '../providers/FontProvider'
import { Container } from '../ui'
import { PersonalizedDesignModal } from '../ui/PersonalizedDesignModal'
import type { PersonalizedDesign } from '@/lib/types/personalized-design'

export default function RecentPersonalizedDesignsSection() {
  const t = useTranslations('personalizedPage.recentDesigns')
  const [designs, setDesigns] = useState<any[]>([])
  const [selectedDesign, setSelectedDesign] = useState<PersonalizedDesign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch random 8 designs from WordPress API
  useEffect(() => {
    async function fetchDesigns() {
      try {
        const randomDesigns = await getRandomPersonalizedDesigns(8)
        setDesigns(randomDesigns)
      } catch (error) {
        console.error('Failed to fetch designs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDesigns()
  }, [])

  const handleImageClick = async (slug: string) => {
    // Fetch full design data
    const design = await getPersonalizedDesign(slug)
    if (design) {
      setSelectedDesign(design)
      setIsModalOpen(true)
    }
  }

  if (isLoading || designs.length === 0) {
    return null
  }

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-playfair' }}>
      <section className="py-16 sm:py-20 md:py-24">
        <Container padding="lg">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2">
                {t('title')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">{t('subtitle')}</p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {designs.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => handleImageClick(design.slug)}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <Image
                    src={design.images[0]}
                    alt={design.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={index < 4}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/bracelet-order"
                className="w-full sm:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-md transition-colors text-center"
              >
                {t('orderButton')}
              </Link>
              <button className="w-full sm:w-auto px-8 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-white rounded-md transition-colors">
                {t('viewMoreButton')}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Personalized Design Modal */}
      <PersonalizedDesignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        designData={selectedDesign}
      />
    </FontProvider>
  )
}
```

---

## 7. Migration Path

### 7.1 From Current Implementation to WordPress Plugin

**Phase 1: Plugin Development** (Week 1-2)
1. ✅ Create plugin structure
2. ✅ Register custom post type
3. ✅ Register taxonomies
4. ✅ Configure ACF fields
5. ✅ Setup REST API endpoints
6. ✅ Implement validation
7. ✅ Add admin UI enhancements

**Phase 2: Data Migration** (Week 3)
1. ✅ Create migration script for existing gallery images
2. ✅ Manually create 5-10 sample personalized designs with full data
3. ✅ Test REST API responses
4. ✅ Validate data integrity

**Phase 3: Frontend Integration** (Week 4)
1. ✅ Update TypeScript types
2. ✅ Create Zod schemas
3. ✅ Update API helper functions
4. ✅ Refactor PersonalizedDesignModal component
5. ✅ Update RecentPersonalizedDesignsSection
6. ✅ Test end-to-end flow

**Phase 4: Testing & Deployment** (Week 5)
1. ✅ Unit tests for validation
2. ✅ Integration tests for REST API
3. ✅ E2E tests with Playwright
4. ✅ Performance testing
5. ✅ Deploy to staging
6. ✅ UAT with client
7. ✅ Deploy to production

### 7.2 Backward Compatibility

During migration, maintain backward compatibility:

```php
// Support legacy photo API during transition
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/photo', [
        'methods' => 'GET',
        'callback' => function($request) {
            $uid = $request->get_param('uid');

            // Legacy gallery endpoint
            if ($uid === 'recently-personailzed-bracelet-design') {
                $designs = get_posts([
                    'post_type' => 'personalized_design',
                    'posts_per_page' => 20,
                    'orderby' => 'date',
                    'order' => 'DESC',
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

                return [
                    [
                        'acf' => [
                            'uid' => $uid,
                            'gallery' => $gallery_urls,
                        ]
                    ]
                ];
            }

            return new WP_Error('invalid_uid', 'Invalid UID', ['status' => 400]);
        },
        'permission_callback' => '__return_true',
    ]);
});
```

---

## 8. Future Enhancements

**Planned Features** (Post-v1.0):

1. **Design Versioning**: Track design iterations and changes over time
2. **Client Portal**: Allow clients to view and approve designs
3. **3D Preview**: Integrate 3D bracelet visualization
4. **AI Recommendations**: Suggest stone combinations based on energy goals
5. **Export to PDF**: Generate printable design specification sheets
6. **Inventory Integration**: Link designs to available stone inventory
7. **Pricing Calculator**: Auto-calculate production cost based on stones
8. **Social Sharing**: Enhanced social media integration with Open Graph
9. **Analytics Dashboard**: Track popular designs, stone combinations, budget levels
10. **Mobile App API**: Dedicated endpoints for native mobile app

---

## Appendix

### A. Reference Links

- **WordPress REST API Handbook**: https://developer.wordpress.org/rest-api/
- **ACF Documentation**: https://www.advancedcustomfields.com/resources/
- **Zod Schema Validation**: https://zod.dev/
- **Next.js Image Optimization**: https://nextjs.org/docs/pages/building-your-application/optimizing/images

### B. Support & Maintenance

**Plugin Updates**:
- Check for ACF compatibility with WordPress updates
- Monitor REST API changes in WordPress core
- Update Zod schemas if API structure changes
- Maintain translation files for new strings

**Troubleshooting Common Issues**:

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on REST endpoints | Permalinks not flushed | Deactivate/reactivate plugin or visit Settings > Permalinks |
| ACF fields not showing | Field group location rule misconfigured | Check location rules in ACF settings |
| Images not loading | CORS or permissions issue | Check WordPress media upload permissions |
| Validation errors | Missing required fields | Ensure all 5 energy categories present |
| REST API returns null | Post not published | Check post status is 'publish' |

### C. Changelog

**Version 1.0.0** (2025-10-07)
- Initial release
- Custom post type: `personalized_design`
- Full CRUD operations via WordPress admin and REST API
- 20+ structured fields with validation
- Bilingual support (Thai/English)
- Image gallery with optimization
- Energy properties rating system
- Stone composition tracking
- Budget level categorization

---

**Document prepared by**: Claude Code Analysis
**Source file**: `src/components/ui/PersonalizedDesignModal.tsx`
**Date**: 2025-10-07
**WordPress Required**: 6.0+
**PHP Required**: 7.4+
**ACF Pro Required**: 6.0+
