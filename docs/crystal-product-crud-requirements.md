# Crystal Product CRUD Plugin Requirements

## Overview

This document outlines the complete requirements for a WordPress plugin to manage Crystal/Mineral products with full CRUD (Create, Read, Update, Delete) functionality. The plugin must integrate seamlessly with the existing Next.js frontend and support all filter functionalities in the Crystal Catalog page.

**Plugin Name:** Roihin Crystal Manager
**WordPress Integration:** Custom Post Type + ACF Fields + REST API
**Frontend Integration:** Next.js App at `/[locale]/crystal`

---

## Table of Contents

1. [WordPress Custom Post Type Structure](#1-wordpress-custom-post-type-structure)
2. [Required ACF Field Groups](#2-required-acf-field-groups)
3. [Filter System Integration](#3-filter-system-integration)
4. [Data Models & Type Definitions](#4-data-models--type-definitions)
5. [REST API Endpoints](#5-rest-api-endpoints)
6. [Product Creation Form](#6-product-creation-form)
7. [Validation Rules](#7-validation-rules)
8. [Related Products System](#8-related-products-system)
9. [Image Management](#9-image-management)
10. [Multi-language Support](#10-multi-language-support)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. WordPress Custom Post Type Structure

### Custom Post Type: `crystal`

```php
register_post_type('crystal', [
    'label' => 'Crystals',
    'labels' => [
        'name' => 'Crystals',
        'singular_name' => 'Crystal',
        'add_new' => 'Add New Crystal',
        'add_new_item' => 'Add New Crystal',
        'edit_item' => 'Edit Crystal',
        'view_item' => 'View Crystal',
        'all_items' => 'All Crystals',
    ],
    'public' => true,
    'show_in_rest' => true, // Required for REST API
    'rest_base' => 'crystal',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'crystal'],
    'menu_icon' => 'dashicons-lightbulb',
    'menu_position' => 5,
    'capability_type' => 'post',
]);
```

### Custom Taxonomies

#### 1. Crystal Categories (for organization)
```php
register_taxonomy('crystal_category', 'crystal', [
    'hierarchical' => true,
    'show_in_rest' => true,
    'labels' => [
        'name' => 'Crystal Categories',
        'singular_name' => 'Crystal Category',
    ],
]);
```

---

## 2. Required ACF Field Groups

### Field Group: "Crystal Information"

**Location Rule:** Post Type is equal to Crystal

#### Basic Information Fields

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Crystal Name (English) | `crystal_name_en` | Text | Yes | English name of the crystal |
| Crystal Name (Thai) | `crystal_name_th` | Text | Yes | Thai name of the crystal |
| Crystal Slug | `crystal_slug` | Text | Yes | URL-friendly identifier (auto-generated from EN name) |
| Main Image | `crystal_main_image` | Image | Yes | Primary product image (square format recommended) |
| Gallery Images | `crystal_gallery_images` | Gallery | No | Additional product images |

#### Properties Fields

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Energy Element | `energy_element` | Text | Yes | Thai: "ราคาเสร็จงาน" (e.g., "au, น้ำ") |
| Chakra | `chakra` | Checkbox | Yes | Multiple selection - connects to chakra points |
| Zodiac Compatibility | `zodiac_compatibility` | Checkbox | Yes | Multiple selection - compatible zodiac signs |
| Ruling Planet | `ruling_planet` | Select | Yes | Associated planet |
| Color | `crystal_colors` | Checkbox | Yes | Multiple selection - crystal colors |

#### Content Fields

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Description Paragraphs | `description_paragraphs` | Repeater | Yes | Multiple paragraphs for detailed description |
| → Paragraph | `paragraph_text` | Textarea | Yes | Individual paragraph content |
| Attributes | `crystal_attributes` | Textarea | Yes | Summary of crystal properties |

#### Filter Integration Fields

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Energy Properties | `energy_properties` | Checkbox | Yes | Filter: Finance, Work, Love, Health, Spirituality |
| Zodiac Signs | `zodiac_signs` | Checkbox | Yes | Filter: All 12 zodiac signs |
| Element Type | `element_type` | Checkbox | Yes | Filter: Earth, Water, Air, Fire |
| Color Filter | `color_filter` | Checkbox | Yes | Filter: 12 color options |

---

## 3. Filter System Integration

### Filter Categories & Options

#### 3.1 Color Filter (12 Options)
Must map to frontend color system:

| Display Color | Filter Value | CSS Class |
|--------------|--------------|-----------|
| Purple | `purple` | `bg-purple-600` |
| Blue | `blue` | `bg-blue-600` |
| Teal | `teal` | `bg-teal-500` |
| Green | `green` | `bg-green-600` |
| Yellow | `yellow` | `bg-yellow-400` |
| Orange | `orange` | `bg-orange-500` |
| Red | `red` | `bg-red-600` |
| Light Blue | `light-blue` | `bg-sky-400` |
| Pink | `pink` | `bg-pink-400` |
| Black | `black` | `bg-black` |
| White | `white` | `bg-white` |
| Beige | `beige` | `bg-amber-200` |

**ACF Field:**
```php
'color_filter' => [
    'type' => 'checkbox',
    'choices' => [
        'purple' => 'Purple',
        'blue' => 'Blue',
        'teal' => 'Teal',
        'green' => 'Green',
        'yellow' => 'Yellow',
        'orange' => 'Orange',
        'red' => 'Red',
        'light-blue' => 'Light Blue',
        'pink' => 'Pink',
        'black' => 'Black',
        'white' => 'White',
        'beige' => 'Beige',
    ],
]
```

#### 3.2 Energy Properties Filter (5 Options)

**English:**
- Finance, Fortune
- Work, Business, Investment
- Love, Happiness, Luck
- Health, Balance
- Spirituality, Stability

**Thai:**
- การเงิน, โชคลาภ
- งาน, ธุรกิจ, การลงทุน
- ความรัก, ความสุข, โชค
- สุขภาพ, สมดุล
- จิตวิญญาณ, ความมั่นคง

**ACF Field:**
```php
'energy_properties' => [
    'type' => 'checkbox',
    'choices' => [
        'finance_fortune' => 'Finance, Fortune',
        'work_business' => 'Work, Business, Investment',
        'love_happiness' => 'Love, Happiness, Luck',
        'health_balance' => 'Health, Balance',
        'spirituality_stability' => 'Spirituality, Stability',
    ],
]
```

#### 3.3 Zodiac Signs Filter (12 Options)

**English:** Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

**Thai:** ราศีเมษ, ราศีพฤษภ, ราศีเมถุน, ราศีกรกฎ, ราศีสิงห์, ราศีกันย์, ราศีตุลย์, ราศีพิจิก, ราศีธนู, ราศีมกร, ราศีกุมภ์, ราศีมีน

**ACF Field:**
```php
'zodiac_signs' => [
    'type' => 'checkbox',
    'choices' => [
        'aries' => 'Aries / ราศีเมษ',
        'taurus' => 'Taurus / ราศีพฤษภ',
        'gemini' => 'Gemini / ราศีเมถุน',
        'cancer' => 'Cancer / ราศีกรกฎ',
        'leo' => 'Leo / ราศีสิงห์',
        'virgo' => 'Virgo / ราศีกันย์',
        'libra' => 'Libra / ราศีตุลย์',
        'scorpio' => 'Scorpio / ราศีพิจิก',
        'sagittarius' => 'Sagittarius / ราศีธนู',
        'capricorn' => 'Capricorn / ราศีมกร',
        'aquarius' => 'Aquarius / ราศีกุมภ์',
        'pisces' => 'Pisces / ราศีมีน',
    ],
]
```

#### 3.4 Element Type Filter (4 Options)

**English:** Earth Sign, Water Sign, Air Sign, Fire Sign

**Thai:** ราศีดิน, ราศีน้ำ, ราศีลม, ราศีไฟ

**ACF Field:**
```php
'element_type' => [
    'type' => 'checkbox',
    'choices' => [
        'earth' => 'Earth Sign / ราศีดิน',
        'water' => 'Water Sign / ราศีน้ำ',
        'air' => 'Air Sign / ราศีลม',
        'fire' => 'Fire Sign / ราศีไฟ',
    ],
]
```

---

## 4. Data Models & Type Definitions

### TypeScript Interface (Frontend)

```typescript
// Basic Crystal for Grid Display
export interface Crystal {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
}

// Full Crystal Product for Detail Page
export interface CrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  properties: {
    priceComplete: string          // energy_element
    chakra: string[]              // chakra field
    zodiacCompatibility: string[] // zodiac_compatibility
    rulingPlanet: string          // ruling_planet
    color: string[]               // crystal_colors
  }
  description: string[]           // description_paragraphs
  attributes: string              // crystal_attributes

  // Filter fields
  filters: {
    energyProperties: string[]    // energy_properties
    zodiacSigns: string[]        // zodiac_signs
    elements: string[]           // element_type
    colors: string[]             // color_filter
  }
}

// Related Product
export interface RelatedCrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  price: number
  originalPrice: number
}
```

### WordPress ACF Response Schema

```typescript
export interface CrystalACF {
  crystal_name_en: string
  crystal_name_th: string
  crystal_slug: string
  crystal_main_image: {
    id: number
    url: string
    alt: string
    width: number
    height: number
  }
  crystal_gallery_images?: Array<{
    id: number
    url: string
    alt: string
  }>

  // Properties
  energy_element: string
  chakra: string[]
  zodiac_compatibility: string[]
  ruling_planet: string
  crystal_colors: string[]

  // Content
  description_paragraphs: Array<{
    paragraph_text: string
  }>
  crystal_attributes: string

  // Filters
  energy_properties: string[]
  zodiac_signs: string[]
  element_type: string[]
  color_filter: string[]
}

export interface CrystalPostType {
  id: number
  slug: string
  title: {
    rendered: string
  }
  acf: CrystalACF
}
```

---

## 5. REST API Endpoints

### Required Endpoints

#### 5.1 Get All Crystals (with filters)
```
GET /wp-json/wp/v2/crystal
```

**Query Parameters:**
- `lang` - Language (en/th)
- `per_page` - Items per page (default: 20)
- `page` - Page number
- `search` - Search by name
- `color_filter` - Filter by color (comma-separated)
- `energy_properties` - Filter by energy (comma-separated)
- `zodiac_signs` - Filter by zodiac (comma-separated)
- `element_type` - Filter by element (comma-separated)

**Response:**
```json
[
  {
    "id": 1,
    "slug": "apatite",
    "acf": {
      "crystal_name_en": "Apatite",
      "crystal_name_th": "อะพาไทต์",
      "crystal_main_image": {
        "url": "https://...",
        "alt": "Apatite"
      },
      "color_filter": ["blue", "green"],
      "energy_properties": ["health_balance"],
      "zodiac_signs": ["aries", "libra"],
      "element_type": ["water"]
    }
  }
]
```

#### 5.2 Get Single Crystal
```
GET /wp-json/wp/v2/crystal/{id}
GET /wp-json/wp/v2/crystal?slug={slug}
```

**Response:** Full crystal object with all ACF fields

#### 5.3 Create Crystal (Admin Only)
```
POST /wp-json/wp/v2/crystal
Authorization: Bearer {token}
```

**Request Body:** All ACF fields as defined above

#### 5.4 Update Crystal (Admin Only)
```
PUT /wp-json/wp/v2/crystal/{id}
Authorization: Bearer {token}
```

#### 5.5 Delete Crystal (Admin Only)
```
DELETE /wp-json/wp/v2/crystal/{id}
Authorization: Bearer {token}
```

### Next.js API Route Integration

Create new API route: `/src/app/api/crystals/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { WORDPRESS_API_URL } from '@/config/api.config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'th'
  const page = searchParams.get('page') || '1'
  const perPage = searchParams.get('per_page') || '20'
  const search = searchParams.get('search') || ''
  const colorFilter = searchParams.get('color_filter') || ''
  const energyProps = searchParams.get('energy_properties') || ''
  const zodiacSigns = searchParams.get('zodiac_signs') || ''
  const elements = searchParams.get('element_type') || ''

  try {
    const queryParams = new URLSearchParams({
      lang,
      page,
      per_page: perPage,
      _fields: 'id,slug,acf',
      ...(search && { search }),
      ...(colorFilter && { color_filter: colorFilter }),
      ...(energyProps && { energy_properties: energyProps }),
      ...(zodiacSigns && { zodiac_signs: zodiacSigns }),
      ...(elements && { element_type: elements }),
    })

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/crystal?${queryParams}`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch crystals: ${response.status}`)
    }

    const crystals = await response.json()
    const totalPages = response.headers.get('X-WP-TotalPages')

    return NextResponse.json(
      { crystals, totalPages: parseInt(totalPages || '1') },
      { headers: getCacheHeaders() }
    )
  } catch (error) {
    console.error('Error fetching crystals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crystals' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}
```

---

## 6. Product Creation Form

### Required Fields in Admin Interface

#### Section 1: Basic Information
- [x] Crystal Name (English) - Text input, required
- [x] Crystal Name (Thai) - Text input, required
- [x] Slug - Auto-generated from English name, editable
- [x] Main Image - Image uploader, required (recommended: 800x800px minimum)
- [x] Gallery Images - Multi-image uploader, optional

#### Section 2: Properties
- [x] Energy Element - Text input, required
- [x] Chakra - Multi-select checkboxes, required
- [x] Zodiac Compatibility - Multi-select checkboxes, required
- [x] Ruling Planet - Dropdown select, required
- [x] Crystal Colors - Multi-select checkboxes, required

#### Section 3: Description
- [x] Description Paragraphs - Repeater field with rich text editor
  - Add/Remove paragraph buttons
  - Drag to reorder paragraphs
  - Minimum 1 paragraph required
- [x] Attributes - Textarea, required (summary of properties)

#### Section 4: Filter Settings
- [x] Energy Properties - Multi-select checkboxes (5 options)
- [x] Zodiac Signs - Multi-select checkboxes (12 options)
- [x] Element Type - Multi-select checkboxes (4 options)
- [x] Color Filter - Multi-select checkboxes (12 options)

#### Section 5: Related Products (Optional)
- [x] Related Products - Post Object field (select multiple products)
- [x] Product Category - Taxonomy selector

---

## 7. Validation Rules

### Required Field Validation

| Field | Validation Rule |
|-------|----------------|
| `crystal_name_en` | Required, max 200 chars, alphanumeric + spaces |
| `crystal_name_th` | Required, max 200 chars |
| `crystal_slug` | Required, unique, lowercase, alphanumeric + hyphens |
| `crystal_main_image` | Required, image file (jpg, png, webp), max 5MB |
| `energy_element` | Required, max 500 chars |
| `chakra` | At least 1 selection required |
| `zodiac_compatibility` | At least 1 selection required |
| `ruling_planet` | Required |
| `crystal_colors` | At least 1 selection required |
| `description_paragraphs` | At least 1 paragraph required |
| `crystal_attributes` | Required, max 2000 chars |
| `energy_properties` | At least 1 selection required |
| `zodiac_signs` | At least 1 selection required |
| `element_type` | At least 1 selection required |
| `color_filter` | At least 1 selection required |

### Data Sanitization

```php
// Slug sanitization
$slug = sanitize_title($crystal_name_en);

// Text field sanitization
$name_en = sanitize_text_field($input['crystal_name_en']);
$name_th = sanitize_text_field($input['crystal_name_th']);

// Textarea sanitization
$attributes = wp_kses_post($input['crystal_attributes']);

// Array sanitization
$chakra = array_map('sanitize_text_field', $input['chakra']);
```

---

## 8. Related Products System

### Implementation Options

#### Option 1: Manual Selection (Recommended)
ACF Post Object field to manually select related products:

```php
'related_products' => [
    'type' => 'relationship',
    'post_type' => ['product', 'crystal'],
    'filters' => ['search', 'post_type'],
    'min' => 0,
    'max' => 8,
    'return_format' => 'id',
]
```

#### Option 2: Auto-Suggest Based on Properties
Automatically suggest products with:
- Same color filter
- Same energy properties
- Same zodiac compatibility

Query example:
```php
$args = [
    'post_type' => 'crystal',
    'posts_per_page' => 8,
    'post__not_in' => [$current_crystal_id],
    'meta_query' => [
        'relation' => 'OR',
        [
            'key' => 'color_filter',
            'value' => $current_colors,
            'compare' => 'IN',
        ],
        [
            'key' => 'energy_properties',
            'value' => $current_energy,
            'compare' => 'IN',
        ],
    ],
];
```

---

## 9. Image Management

### Image Requirements

#### Main Product Image
- **Format:** JPG, PNG, WebP, AVIF
- **Dimensions:** Minimum 800x800px (square), recommended 1200x1200px
- **Max Size:** 5MB
- **Aspect Ratio:** 1:1 (square)

#### Gallery Images
- **Format:** JPG, PNG, WebP
- **Dimensions:** Minimum 800x800px
- **Max Size:** 3MB per image
- **Max Count:** 10 images

### Image Processing

```php
// Register custom image size
add_image_size('crystal-thumbnail', 400, 400, true);
add_image_size('crystal-medium', 800, 800, true);
add_image_size('crystal-large', 1200, 1200, true);

// Image optimization
add_filter('jpeg_quality', function() { return 85; });
add_filter('wp_editor_set_quality', function() { return 85; });
```

### REST API Image Response

```json
{
  "crystal_main_image": {
    "ID": 123,
    "url": "https://.../crystal-image.jpg",
    "alt": "Apatite Crystal",
    "title": "Apatite",
    "width": 1200,
    "height": 1200,
    "sizes": {
      "thumbnail": "https://.../crystal-image-400x400.jpg",
      "medium": "https://.../crystal-image-800x800.jpg",
      "large": "https://.../crystal-image-1200x1200.jpg"
    }
  }
}
```

---

## 10. Multi-language Support

### Language Strategy

The system uses **WPML** (WordPress Multilingual Plugin) or **Polylang** for language management.

#### Field Structure

All translatable fields should have language variants:

```php
// Example with WPML
if (function_exists('icl_object_id')) {
    $lang = ICL_LANGUAGE_CODE; // 'en' or 'th'
}

// Fallback logic
$name = ($lang === 'th' && !empty($acf['crystal_name_th']))
    ? $acf['crystal_name_th']
    : $acf['crystal_name_en'];
```

#### Translation Requirements

**Must be translated:**
- Crystal Name (EN/TH)
- Description Paragraphs
- Attributes
- All filter labels (already handled in Next.js i18n)

**Language-independent:**
- Slug (use English)
- Image URLs
- Filter values (use keys, not labels)

---

## 11. Implementation Checklist

### Phase 1: WordPress Plugin Setup
- [ ] Create custom post type `crystal`
- [ ] Register ACF field groups with all required fields
- [ ] Add custom taxonomies if needed
- [ ] Configure REST API exposure
- [ ] Implement validation rules
- [ ] Set up image sizes

### Phase 2: Admin Interface
- [ ] Customize admin columns to show: Name (EN/TH), Colors, Energy Properties, Zodiac
- [ ] Add quick edit functionality for common fields
- [ ] Implement bulk actions (delete, update category)
- [ ] Add admin notices for validation errors
- [ ] Create admin help/documentation

### Phase 3: REST API Development
- [ ] Extend REST API with custom endpoints
- [ ] Add filter query parameters
- [ ] Implement pagination
- [ ] Add search functionality
- [ ] Configure CORS headers
- [ ] Add caching headers

### Phase 4: Frontend Integration
- [ ] Create Next.js API route `/api/crystals/route.ts`
- [ ] Update crystal page to fetch real data
- [ ] Implement filter functionality with API
- [ ] Add loading states and error handling
- [ ] Implement pagination
- [ ] Add SEO metadata

### Phase 5: Testing & Optimization
- [ ] Test CRUD operations
- [ ] Test filter combinations
- [ ] Test multi-language support
- [ ] Performance testing (page load, API response time)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### Phase 6: Data Migration (if applicable)
- [ ] Export existing mockup data structure
- [ ] Create import script for bulk upload
- [ ] Validate imported data
- [ ] Set up related products

---

## Code Examples

### WordPress Plugin Main File

```php
<?php
/**
 * Plugin Name: Roihin Crystal Manager
 * Description: Manage crystal/mineral products with CRUD functionality
 * Version: 1.0.0
 * Author: Roihin
 */

// Register Custom Post Type
function roihin_register_crystal_post_type() {
    $labels = [
        'name' => 'Crystals',
        'singular_name' => 'Crystal',
        'add_new' => 'Add New Crystal',
        'add_new_item' => 'Add New Crystal',
        'edit_item' => 'Edit Crystal',
        'view_item' => 'View Crystal',
        'all_items' => 'All Crystals',
    ];

    $args = [
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'crystal',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'crystal'],
        'menu_icon' => 'dashicons-lightbulb',
        'menu_position' => 5,
    ];

    register_post_type('crystal', $args);
}
add_action('init', 'roihin_register_crystal_post_type');

// Register ACF Fields
if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key' => 'group_crystal_info',
        'title' => 'Crystal Information',
        'fields' => [
            // Basic Info
            [
                'key' => 'field_crystal_name_en',
                'label' => 'Crystal Name (English)',
                'name' => 'crystal_name_en',
                'type' => 'text',
                'required' => 1,
            ],
            [
                'key' => 'field_crystal_name_th',
                'label' => 'Crystal Name (Thai)',
                'name' => 'crystal_name_th',
                'type' => 'text',
                'required' => 1,
            ],
            // ... (add all other fields)
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
    ]);
}

// Add custom REST API fields
function roihin_register_crystal_rest_fields() {
    register_rest_field('crystal', 'acf', [
        'get_callback' => function($object) {
            return get_fields($object['id']);
        },
        'schema' => null,
    ]);
}
add_action('rest_api_init', 'roihin_register_crystal_rest_fields');

// Add filter support to REST API
function roihin_crystal_rest_query($args, $request) {
    // Color filter
    if ($request->get_param('color_filter')) {
        $colors = explode(',', $request->get_param('color_filter'));
        $args['meta_query'][] = [
            'key' => 'color_filter',
            'value' => $colors,
            'compare' => 'IN',
        ];
    }

    // Energy properties filter
    if ($request->get_param('energy_properties')) {
        $energy = explode(',', $request->get_param('energy_properties'));
        $args['meta_query'][] = [
            'key' => 'energy_properties',
            'value' => $energy,
            'compare' => 'IN',
        ];
    }

    // Zodiac signs filter
    if ($request->get_param('zodiac_signs')) {
        $zodiac = explode(',', $request->get_param('zodiac_signs'));
        $args['meta_query'][] = [
            'key' => 'zodiac_signs',
            'value' => $zodiac,
            'compare' => 'IN',
        ];
    }

    // Element type filter
    if ($request->get_param('element_type')) {
        $elements = explode(',', $request->get_param('element_type'));
        $args['meta_query'][] = [
            'key' => 'element_type',
            'value' => $elements,
            'compare' => 'IN',
        ];
    }

    return $args;
}
add_filter('rest_crystal_query', 'roihin_crystal_rest_query', 10, 2);
```

---

## Summary

This documentation provides a complete blueprint for implementing a WordPress CRUD plugin for Crystal products that:

1. ✅ Fully integrates with the existing Next.js frontend at `/[locale]/crystal`
2. ✅ Supports all 4 filter categories (Color, Energy Properties, Zodiac Signs, Elements)
3. ✅ Provides comprehensive REST API endpoints for CRUD operations
4. ✅ Includes proper validation and data sanitization
5. ✅ Supports multi-language (EN/TH) content
6. ✅ Implements image management with proper sizing
7. ✅ Enables related products functionality
8. ✅ Follows WordPress and Next.js best practices

**Next Steps:**
1. Set up WordPress plugin structure
2. Implement ACF field groups
3. Configure REST API endpoints
4. Update Next.js frontend to consume real API
5. Test all CRUD operations
6. Deploy to production
