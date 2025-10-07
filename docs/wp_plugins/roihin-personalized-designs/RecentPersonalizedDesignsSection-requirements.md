# Personalized Design CRUD Plugin Requirements

## Overview

This document outlines the complete requirements for a WordPress plugin to manage Personalized Bracelet Design showcases with full CRUD (Create, Read, Update, Delete) functionality. The plugin must integrate seamlessly with the existing Next.js frontend and support the personalized design gallery display and modal functionality.

**Plugin Name:** ROIHIN Personalized Designs
**WordPress Integration:** Custom Post Type + ACF Fields + REST API
**Frontend Integration:** Next.js components at `RecentPersonalizedDesignsSection.tsx` and `PersonalizedDesignModal.tsx`

---

## Table of Contents

1. [WordPress Custom Post Type Structure](#1-wordpress-custom-post-type-structure)
2. [Required ACF Field Groups](#2-required-acf-field-groups)
3. [Data Models & Type Definitions](#3-data-models--type-definitions)
4. [REST API Endpoints](#4-rest-api-endpoints)
5. [Product Creation Form](#5-product-creation-form)
6. [Validation Rules](#6-validation-rules)
7. [Image Management](#7-image-management)
8. [Multi-language Support](#8-multi-language-support)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. WordPress Custom Post Type Structure

### Custom Post Type: `personalized_design`

```php
register_post_type('personalized_design', [
    'label' => 'Personalized Designs',
    'labels' => [
        'name' => 'Personalized Designs',
        'singular_name' => 'Personalized Design',
        'add_new' => 'Add New Design',
        'add_new_item' => 'Add New Personalized Design',
        'edit_item' => 'Edit Personalized Design',
        'view_item' => 'View Personalized Design',
        'all_items' => 'All Designs',
    ],
    'public' => true,
    'show_in_rest' => true, // Required for REST API
    'rest_base' => 'personalized-design',
    'supports' => ['title', 'thumbnail', 'custom-fields'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'personalized-design'],
    'menu_icon' => 'dashicons-awards',
    'menu_position' => 6,
    'capability_type' => 'post',
]);
```

### Custom Taxonomies

#### 1. Design Categories (Optional - for organization)
```php
register_taxonomy('design_category', 'personalized_design', [
    'hierarchical' => true,
    'show_in_rest' => true,
    'labels' => [
        'name' => 'Design Categories',
        'singular_name' => 'Design Category',
    ],
]);
```

---

## 2. Required ACF Field Groups

### Field Group: "Personalized Design Information"

**Location Rule:** Post Type is equal to Personalized Design

#### Section 1: Gallery Images

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Gallery Images | `gallery_images` | Gallery | Yes | 4 images for design showcase (main + 3 thumbnails) |
| Featured Image | `featured_image` | Image | Yes | Main thumbnail for grid display |

**Notes:**
- Gallery should contain exactly 4 images for optimal display
- First image in gallery is used as main image in modal
- Images 2-4 are displayed as thumbnails

---

#### Section 2: Designer Information

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Designer Name (EN) | `designer_name_en` | Text | Yes | Default: "ROIHIN Stone & Bracelet" |
| Designer Name (TH) | `designer_name_th` | Text | Yes | Default: "ROIHIN Stone & Bracelet" |
| Design Title (TH) | `design_title_th` | Text | No | Optional custom title in Thai |
| Design Title (EN) | `design_title_en` | Text | No | Optional custom title in English |
| Creation Date | `creation_date` | Date Picker | Yes | Date the design was created |
| Display Label | `display_label` | Text | No | Label shown above designer name (default: "ออกแบบโดย") |

---

#### Section 3: Energy Description

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Energy Description Title (TH) | `energy_description_title_th` | Text | Yes | Default: "คำอธิบายพลังงาน" |
| Energy Description Title (EN) | `energy_description_title_en` | Text | Yes | Default: "Energy Description" |
| Energy Description (TH) | `energy_description_th` | WYSIWYG Editor | Yes | Detailed energy description in Thai |
| Energy Description (EN) | `energy_description_en` | WYSIWYG Editor | Yes | Detailed energy description in English |

---

#### Section 4: Energy Properties

**Field Type:** Repeater
**Field Name:** `energy_properties`
**Min Rows:** 5
**Max Rows:** 5
**Layout:** Table

Each property contains:

| Sub-field Label | Sub-field Name | Field Type | Required | Description |
|----------------|---------------|------------|----------|-------------|
| Property Name (TH) | `property_name_th` | Select | Yes | Thai property name |
| Property Name (EN) | `property_name_en` | Select | Yes | English property name |
| Rating Label | `rating_label` | Select | Yes | Static rating level |

**Property Name Options (5 fixed properties):**

**Thai Options:**
1. `finance_fortune` - "การเงิน โชคลาภ"
2. `work_business` - "การงาน ธุรกิจ การลงทุน"
3. `love_happiness` - "ความรัก ความสุข โชคดี"
4. `health_balance` - "สุขภาพ สมดุลชีวิต"
5. `spirituality_stability` - "จิตวิญญาณ ความมั่นคง"

**English Options:**
1. `finance_fortune` - "Finance, Fortune"
2. `work_business` - "Work, Business, Investment"
3. `love_happiness` - "Love, Happiness, Luck"
4. `health_balance` - "Health, Balance"
5. `spirituality_stability` - "Spirituality, Stability"

**Rating Label Options (Static Dropdown):**

**Thai:**
- `excellent` - "ดีเยี่ยมที่สุด" (Excellent) - 8/8 dots
- `very_good` - "ดีมาก" (Very Good) - 6/8 dots
- `good` - "ดี" (Good) - 4/8 dots
- `average` - "ปานกลาง" (Average) - 3/8 dots
- `fair` - "พอใช้" (Fair) - 2/8 dots

**English:**
- `excellent` - "Excellent"
- `very_good` - "Very Good"
- `good` - "Good"
- `average` - "Average"
- `fair` - "Fair"

**Rating to Dots Mapping:**
```php
$rating_map = [
    'excellent' => 8,
    'very_good' => 6,
    'good' => 4,
    'average' => 3,
    'fair' => 2,
];
```

---

#### Section 5: Stones Used

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Stones Used | `stones_used` | Repeater | Yes | List of crystal/stone names used in design |
| → Stone Name | `stone_name` | Text | Yes | Individual stone name (e.g., "Black Tourmaline") |

**Alternative Option:** Checkbox field with predefined stone list

**Common Stones List:**
- Black Tourmaline
- Red Garnet
- Red Tiger's Eye
- Labradorite
- Phantom Amethyst
- Golden Rutilated Quartz
- Clear Quartz
- Amethyst
- Rose Quartz
- Citrine
- Smoky Quartz
- Obsidian
- Hematite
- Pyrite
- Green Aventurine
- Carnelian

---

#### Section 6: Product Details

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Charm & Divider | `charm_divider` | Text | No | Charm and divider type (e.g., "None", "Silver Charm", "Gold Spacer") |
| Stone Size | `stone_size` | Text | Yes | Size of stones used (e.g., "8 mm.", "10 mm.", "6-8 mm.") |
| Production Budget | `production_budget` | Select | Yes | Budget range for production |

**Production Budget Options (Thai):**
```php
'production_budget' => [
    'type' => 'select',
    'choices' => [
        'budget_low' => 'ระดับเบื้องต้น (ต่ำกว่า 3,000 บาท)',
        'budget_medium' => 'ระดับกลาง (3,000 - 5,000 บาท)',
        'budget_medium_high' => 'ระดับกลางค่อนข้างสูง (5,000 - 8,000 บาท)',
        'budget_high' => 'ระดับสูง (8,000 ขึ้นไป)',
        'budget_premium' => 'ระดับพรีเมียม (15,000 ขึ้นไป)',
    ],
]
```

**Production Budget Options (English):**
```php
'production_budget' => [
    'type' => 'select',
    'choices' => [
        'budget_low' => 'Basic Level (Under ฿3,000)',
        'budget_medium' => 'Medium Level (฿3,000 - ฿5,000)',
        'budget_medium_high' => 'Medium-High Level (฿5,000 - ฿8,000)',
        'budget_high' => 'High Level (฿8,000+)',
        'budget_premium' => 'Premium Level (฿15,000+)',
    ],
]
```

---

#### Section 7: Additional Settings

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Published Status | `is_published` | True/False | No | Show in frontend gallery (default: true) |
| Featured Design | `is_featured` | True/False | No | Mark as featured design |
| Display Order | `display_order` | Number | No | Custom sort order (lower number = higher priority) |
| Copyright Text (TH) | `copyright_text_th` | Textarea | No | Custom copyright text in Thai |
| Copyright Text (EN) | `copyright_text_en` | Textarea | No | Custom copyright text in English |

**Default Copyright Text (Thai):**
```
รูปภาพ วิดีโอ รูปแบบการจัดวางคริสตัลและคำอธิบายพลังงาน ถือเป็นทรัพย์สินทางปัญญา
ห้ามมิให้ผู้อื่นทำซ้ำ คัดลอก ดัดแปลง โดยไม่ได้รับอนุญาต
© 2025 ROIHIN Stone & Bracelet under s 195 co., ltd. All rights reserved.
```

---

## 3. Data Models & Type Definitions

### TypeScript Interface (Frontend)

```typescript
// Energy Property Rating
export type EnergyRating = 'excellent' | 'very_good' | 'good' | 'average' | 'fair'

// Energy Property
export interface EnergyProperty {
  propertyNameTh: string
  propertyNameEn: string
  ratingLabel: EnergyRating
  ratingValue: number // Auto-calculated based on rating label
  displayLabelTh: string // Thai label (e.g., "ดีเยี่ยมที่สุด")
  displayLabelEn: string // English label (e.g., "Excellent")
}

// Personalized Design (for Grid Display)
export interface PersonalizedDesign {
  id: number
  slug: string
  featuredImage: string
  designerNameTh: string
  designerNameEn: string
  creationDate: string
  isPublished: boolean
  isFeatured: boolean
}

// Full Personalized Design (for Modal Display)
export interface PersonalizedDesignFull {
  id: number
  slug: string

  // Gallery
  galleryImages: string[] // Array of 4 image URLs
  featuredImage: string

  // Designer Info
  designerNameTh: string
  designerNameEn: string
  designTitleTh?: string
  designTitleEn?: string
  creationDate: string
  displayLabel?: string

  // Energy Description
  energyDescriptionTitleTh: string
  energyDescriptionTitleEn: string
  energyDescriptionTh: string
  energyDescriptionEn: string

  // Energy Properties (5 items)
  energyProperties: EnergyProperty[]

  // Stones
  stonesUsed: string[]

  // Product Details
  charmDivider?: string
  stoneSize: string
  productionBudget: string
  productionBudgetLabel: string

  // Additional
  isPublished: boolean
  isFeatured: boolean
  displayOrder?: number
  copyrightTextTh?: string
  copyrightTextEn?: string
}
```

### WordPress ACF Response Schema

```typescript
export interface PersonalizedDesignACF {
  // Gallery
  gallery_images: Array<{
    id: number
    url: string
    alt: string
    width: number
    height: number
  }>
  featured_image: {
    id: number
    url: string
    alt: string
    width: number
    height: number
  }

  // Designer Info
  designer_name_en: string
  designer_name_th: string
  design_title_en?: string
  design_title_th?: string
  creation_date: string // YYYY-MM-DD format
  display_label?: string

  // Energy Description
  energy_description_title_th: string
  energy_description_title_en: string
  energy_description_th: string
  energy_description_en: string

  // Energy Properties (Repeater with 5 items)
  energy_properties: Array<{
    property_name_th: string
    property_name_en: string
    rating_label: 'excellent' | 'very_good' | 'good' | 'average' | 'fair'
  }>

  // Stones
  stones_used: Array<{
    stone_name: string
  }>

  // Product Details
  charm_divider?: string
  stone_size: string
  production_budget: string

  // Additional
  is_published: boolean
  is_featured: boolean
  display_order?: number
  copyright_text_th?: string
  copyright_text_en?: string
}

export interface PersonalizedDesignPostType {
  id: number
  slug: string
  title: {
    rendered: string
  }
  date: string
  acf: PersonalizedDesignACF
}
```

### Zod Validation Schema

```typescript
import { z } from 'zod'

// Energy Rating Schema
const EnergyRatingSchema = z.enum(['excellent', 'very_good', 'good', 'average', 'fair'])

// Energy Property Schema
const EnergyPropertySchema = z.object({
  property_name_th: z.string(),
  property_name_en: z.string(),
  rating_label: EnergyRatingSchema,
})

// ACF Image Schema
const ACFImageSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

// Stone Schema
const StoneSchema = z.object({
  stone_name: z.string().min(1),
})

// ACF Schema
export const PersonalizedDesignACFSchema = z.object({
  // Gallery
  gallery_images: z.array(ACFImageSchema).min(4).max(4),
  featured_image: ACFImageSchema,

  // Designer Info
  designer_name_en: z.string().min(1),
  designer_name_th: z.string().min(1),
  design_title_en: z.string().optional(),
  design_title_th: z.string().optional(),
  creation_date: z.string(),
  display_label: z.string().optional(),

  // Energy Description
  energy_description_title_th: z.string().min(1),
  energy_description_title_en: z.string().min(1),
  energy_description_th: z.string().min(1),
  energy_description_en: z.string().min(1),

  // Energy Properties (5 items)
  energy_properties: z.array(EnergyPropertySchema).length(5),

  // Stones
  stones_used: z.array(StoneSchema).min(1),

  // Product Details
  charm_divider: z.string().optional(),
  stone_size: z.string().min(1),
  production_budget: z.string().min(1),

  // Additional
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.number().optional(),
  copyright_text_th: z.string().optional(),
  copyright_text_en: z.string().optional(),
})

// Post Type Schema
export const PersonalizedDesignPostTypeSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  date: z.string(),
  acf: PersonalizedDesignACFSchema,
})

// Response Array Schema
export const PersonalizedDesignResponseSchema = z.array(PersonalizedDesignPostTypeSchema)

// Infer Types
export type PersonalizedDesignACF = z.infer<typeof PersonalizedDesignACFSchema>
export type PersonalizedDesignPostType = z.infer<typeof PersonalizedDesignPostTypeSchema>
export type PersonalizedDesignResponse = z.infer<typeof PersonalizedDesignResponseSchema>
```

---

## 4. REST API Endpoints

### Required Endpoints

#### 4.1 Get All Personalized Designs
```
GET /wp-json/wp/v2/personalized-design
```

**Query Parameters:**
- `lang` - Language (en/th)
- `per_page` - Items per page (default: 8)
- `page` - Page number
- `is_published` - Filter by published status (true/false)
- `is_featured` - Filter by featured status (true/false)
- `orderby` - Sort by (date, display_order, title)
- `order` - Sort direction (asc, desc)

**Response:**
```json
[
  {
    "id": 1,
    "slug": "elegant-protection-bracelet",
    "title": {
      "rendered": "Elegant Protection Bracelet"
    },
    "date": "2025-08-22T00:00:00",
    "acf": {
      "gallery_images": [
        {
          "url": "https://wp-roihin.precisiondevlab.com/wp-content/uploads/design-1.jpg",
          "alt": "Main design view"
        },
        // ... 3 more images
      ],
      "designer_name_th": "ROIHIN Stone & Bracelet",
      "creation_date": "2025-08-22",
      "energy_properties": [
        {
          "property_name_th": "การเงิน โชคลาภ",
          "property_name_en": "Finance, Fortune",
          "rating_label": "excellent"
        },
        // ... 4 more properties
      ],
      "stones_used": [
        { "stone_name": "Black Tourmaline" },
        { "stone_name": "Red Garnet" }
      ],
      "stone_size": "8 mm.",
      "production_budget": "budget_high"
    }
  }
]
```

**Response Headers:**
- `X-WP-Total` - Total number of designs
- `X-WP-TotalPages` - Total number of pages

#### 4.2 Get Single Personalized Design
```
GET /wp-json/wp/v2/personalized-design/{id}
GET /wp-json/wp/v2/personalized-design?slug={slug}
```

**Response:** Full design object with all ACF fields

#### 4.3 Create Personalized Design (Admin Only)
```
POST /wp-json/wp/v2/personalized-design
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Design Title",
  "status": "publish",
  "acf": {
    "gallery_images": [...],
    "designer_name_en": "ROIHIN Stone & Bracelet",
    "designer_name_th": "ROIHIN Stone & Bracelet",
    "creation_date": "2025-08-22",
    "energy_description_th": "...",
    "energy_properties": [...],
    "stones_used": [...],
    "stone_size": "8 mm.",
    "production_budget": "budget_high"
  }
}
```

#### 4.4 Update Personalized Design (Admin Only)
```
PUT /wp-json/wp/v2/personalized-design/{id}
Authorization: Bearer {token}
```

#### 4.5 Delete Personalized Design (Admin Only)
```
DELETE /wp-json/wp/v2/personalized-design/{id}
Authorization: Bearer {token}
```

### Next.js API Route Integration

Create new API route: `/src/app/api/personalized-designs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { WORDPRESS_API_URL, WORDPRESS_API_BASE_PATH } from '@/config/api.config'
import { PersonalizedDesignResponseSchema } from '@/lib/types/personalized-design'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'th'
  const page = searchParams.get('page') || '1'
  const perPage = searchParams.get('per_page') || '8'
  const isPublished = searchParams.get('is_published') || 'true'
  const isFeatured = searchParams.get('is_featured')
  const orderby = searchParams.get('orderby') || 'display_order'
  const order = searchParams.get('order') || 'asc'

  try {
    const queryParams = new URLSearchParams({
      lang,
      page,
      per_page: perPage,
      _fields: 'id,slug,title,date,acf',
      orderby,
      order,
      ...(isPublished && { is_published: isPublished }),
      ...(isFeatured && { is_featured: isFeatured }),
    })

    const response = await fetch(
      `${WORDPRESS_API_URL}${WORDPRESS_API_BASE_PATH}/personalized-design?${queryParams}`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch personalized designs: ${response.status}`)
    }

    const data = await response.json()

    // Validate with Zod schema
    const validatedData = PersonalizedDesignResponseSchema.safeParse(data)

    if (!validatedData.success) {
      console.error('Invalid response format:', validatedData.error)
      throw new Error('Invalid response format')
    }

    const totalPages = response.headers.get('X-WP-TotalPages')
    const total = response.headers.get('X-WP-Total')

    return NextResponse.json(
      {
        designs: validatedData.data,
        totalPages: parseInt(totalPages || '1'),
        total: parseInt(total || '0'),
      },
      { headers: getCacheHeaders() }
    )
  } catch (error) {
    console.error('Error fetching personalized designs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personalized designs' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}
```

Create API route for single design: `/src/app/api/personalized-designs/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { WORDPRESS_API_URL, WORDPRESS_API_BASE_PATH } from '@/config/api.config'
import { PersonalizedDesignPostTypeSchema } from '@/lib/types/personalized-design'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'th'

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}${WORDPRESS_API_BASE_PATH}/personalized-design?slug=${params.slug}&lang=${lang}&_fields=id,slug,title,date,acf`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch design: ${response.status}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404, headers: getCacheHeaders() }
      )
    }

    // Validate with Zod schema
    const validatedData = PersonalizedDesignPostTypeSchema.safeParse(data[0])

    if (!validatedData.success) {
      console.error('Invalid response format:', validatedData.error)
      throw new Error('Invalid response format')
    }

    return NextResponse.json(validatedData.data, { headers: getCacheHeaders() })
  } catch (error) {
    console.error('Error fetching personalized design:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personalized design' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}
```

---

## 5. Product Creation Form

### Required Fields in Admin Interface

#### Section 1: Basic Information
- [x] **Post Title** - Text input, required (internal reference name)
- [x] **Featured Image** - Image uploader, required (main thumbnail for grid)
- [x] **Post Status** - Publish/Draft selector

#### Section 2: Gallery Images
- [x] **Gallery Images** - Multi-image uploader, required
  - Exactly 4 images required
  - Drag to reorder
  - First image = Main display image
  - Images 2-4 = Thumbnail strip
  - Recommended: 1200x1200px square images

#### Section 3: Designer Information
- [x] **Designer Name (Thai)** - Text input, default: "ROIHIN Stone & Bracelet"
- [x] **Designer Name (English)** - Text input, default: "ROIHIN Stone & Bracelet"
- [x] **Design Title (Thai)** - Text input, optional
- [x] **Design Title (English)** - Text input, optional
- [x] **Creation Date** - Date picker, required
- [x] **Display Label** - Text input, optional (default: "ออกแบบโดย")

#### Section 4: Energy Description
- [x] **Energy Description Title (Thai)** - Text input, default: "คำอธิบายพลังงาน"
- [x] **Energy Description Title (English)** - Text input, default: "Energy Description"
- [x] **Energy Description (Thai)** - WYSIWYG editor, required
- [x] **Energy Description (English)** - WYSIWYG editor, required

#### Section 5: Energy Properties (Repeater - Fixed 5 rows)
- [x] **Property 1: Finance & Fortune**
  - Property Name (TH): "การเงิน โชคลาภ"
  - Property Name (EN): "Finance, Fortune"
  - Rating: Dropdown (Excellent/Very Good/Good/Average/Fair)
- [x] **Property 2: Work & Business**
  - Property Name (TH): "การงาน ธุรกิจ การลงทุน"
  - Property Name (EN): "Work, Business, Investment"
  - Rating: Dropdown
- [x] **Property 3: Love & Happiness**
  - Property Name (TH): "ความรัก ความสุข โชคดี"
  - Property Name (EN): "Love, Happiness, Luck"
  - Rating: Dropdown
- [x] **Property 4: Health & Balance**
  - Property Name (TH): "สุขภาพ สมดุลชีวิต"
  - Property Name (EN): "Health, Balance"
  - Rating: Dropdown
- [x] **Property 5: Spirituality & Stability**
  - Property Name (TH): "จิตวิญญาณ ความมั่นคง"
  - Property Name (EN): "Spirituality, Stability"
  - Rating: Dropdown

**Rating Options:**
- "ดีเยี่ยมที่สุด" / "Excellent" (8/8 dots)
- "ดีมาก" / "Very Good" (6/8 dots)
- "ดี" / "Good" (4/8 dots)
- "ปานกลาง" / "Average" (3/8 dots)
- "พอใช้" / "Fair" (2/8 dots)

#### Section 6: Stones Used
- [x] **Stones Used** - Repeater field with add/remove buttons
  - Stone Name - Text input for each stone
  - Minimum 1 stone required
  - Recommended: Use common stone names for consistency

**Suggested Implementation:** Checkbox field with common stones + "Other" text field

#### Section 7: Product Details
- [x] **Charm & Divider** - Text input, optional (e.g., "None", "Silver Charm")
- [x] **Stone Size** - Text input, required (e.g., "8 mm.", "10 mm.", "6-8 mm.")
- [x] **Production Budget** - Select dropdown, required
  - ระดับเบื้องต้น (ต่ำกว่า 3,000 บาท) / Basic Level (Under ฿3,000)
  - ระดับกลาง (3,000 - 5,000 บาท) / Medium Level (฿3,000 - ฿5,000)
  - ระดับกลางค่อนข้างสูง (5,000 - 8,000 บาท) / Medium-High Level (฿5,000 - ฿8,000)
  - ระดับสูง (8,000 ขึ้นไป) / High Level (฿8,000+)
  - ระดับพรีเมียม (15,000 ขึ้นไป) / Premium Level (฿15,000+)

#### Section 8: Display Settings
- [x] **Published Status** - True/False toggle, default: true
- [x] **Featured Design** - True/False toggle, default: false
- [x] **Display Order** - Number input (lower = higher priority)
- [x] **Copyright Text (Thai)** - Textarea, optional (uses default if empty)
- [x] **Copyright Text (English)** - Textarea, optional (uses default if empty)

---

## 6. Validation Rules

### Required Field Validation

| Field | Validation Rule |
|-------|----------------|
| `gallery_images` | Required, exactly 4 images, each max 5MB |
| `featured_image` | Required, image file (jpg, png, webp), max 5MB |
| `designer_name_en` | Required, max 200 chars |
| `designer_name_th` | Required, max 200 chars |
| `creation_date` | Required, valid date format (YYYY-MM-DD) |
| `energy_description_title_th` | Required, max 100 chars |
| `energy_description_title_en` | Required, max 100 chars |
| `energy_description_th` | Required, min 50 chars, max 5000 chars |
| `energy_description_en` | Required, min 50 chars, max 5000 chars |
| `energy_properties` | Required, exactly 5 properties |
| `energy_properties[].rating_label` | Required, must be valid rating value |
| `stones_used` | Required, at least 1 stone |
| `stone_size` | Required, max 50 chars |
| `production_budget` | Required, must be valid budget option |

### Data Sanitization

```php
// Text field sanitization
$designer_name_th = sanitize_text_field($input['designer_name_th']);
$designer_name_en = sanitize_text_field($input['designer_name_en']);
$stone_size = sanitize_text_field($input['stone_size']);

// Textarea sanitization (allows some HTML)
$energy_desc_th = wp_kses_post($input['energy_description_th']);
$energy_desc_en = wp_kses_post($input['energy_description_en']);

// Date sanitization
$creation_date = sanitize_text_field($input['creation_date']);
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $creation_date)) {
    $creation_date = date('Y-m-d');
}

// Array sanitization
$stones_used = array_map(function($stone) {
    return [
        'stone_name' => sanitize_text_field($stone['stone_name'])
    ];
}, $input['stones_used']);

// Enum validation
$valid_ratings = ['excellent', 'very_good', 'good', 'average', 'fair'];
foreach ($input['energy_properties'] as &$property) {
    if (!in_array($property['rating_label'], $valid_ratings)) {
        $property['rating_label'] = 'good'; // Default
    }
}

$valid_budgets = ['budget_low', 'budget_medium', 'budget_medium_high', 'budget_high', 'budget_premium'];
if (!in_array($input['production_budget'], $valid_budgets)) {
    $input['production_budget'] = 'budget_medium'; // Default
}
```

### Custom Validation Function

```php
function validate_personalized_design_acf($value, $post_id, $field) {
    // Gallery images must be exactly 4
    if ($field['name'] === 'gallery_images') {
        if (!is_array($value) || count($value) !== 4) {
            return new WP_Error('invalid_gallery', 'Gallery must contain exactly 4 images.');
        }
    }

    // Energy properties must be exactly 5
    if ($field['name'] === 'energy_properties') {
        if (!is_array($value) || count($value) !== 5) {
            return new WP_Error('invalid_properties', 'Energy properties must contain exactly 5 items.');
        }
    }

    // At least 1 stone required
    if ($field['name'] === 'stones_used') {
        if (!is_array($value) || count($value) < 1) {
            return new WP_Error('invalid_stones', 'At least one stone must be specified.');
        }
    }

    return $value;
}

add_filter('acf/validate_value', 'validate_personalized_design_acf', 10, 3);
```

---

## 7. Image Management

### Image Requirements

#### Featured Image
- **Format:** JPG, PNG, WebP, AVIF
- **Dimensions:** Minimum 800x800px (square), recommended 1200x1200px
- **Max Size:** 5MB
- **Aspect Ratio:** 1:1 (square)

#### Gallery Images (4 images required)
- **Format:** JPG, PNG, WebP
- **Dimensions:** Minimum 1200x1200px (square)
- **Max Size:** 5MB per image
- **Count:** Exactly 4 images
- **Usage:**
  - Image 1: Main display in modal
  - Images 2-4: Thumbnail strip below main image

### Image Processing

```php
// Register custom image sizes
function roihin_personalized_design_image_sizes() {
    add_image_size('design-thumbnail', 400, 400, true);
    add_image_size('design-medium', 800, 800, true);
    add_image_size('design-large', 1200, 1200, true);
    add_image_size('design-grid', 600, 600, true); // For grid display
}
add_action('after_setup_theme', 'roihin_personalized_design_image_sizes');

// Image optimization
add_filter('jpeg_quality', function() { return 85; });
add_filter('wp_editor_set_quality', function() { return 85; });

// WebP support
function roihin_enable_webp_support($mime_types) {
    $mime_types['webp'] = 'image/webp';
    return $mime_types;
}
add_filter('upload_mimes', 'roihin_enable_webp_support');
```

### REST API Image Response

```json
{
  "gallery_images": [
    {
      "ID": 123,
      "url": "https://wp-roihin.precisiondevlab.com/wp-content/uploads/design-main.jpg",
      "alt": "Personalized Bracelet Design - Main View",
      "title": "Design Main",
      "width": 1200,
      "height": 1200,
      "sizes": {
        "thumbnail": "https://.../design-main-400x400.jpg",
        "medium": "https://.../design-main-800x800.jpg",
        "large": "https://.../design-main-1200x1200.jpg",
        "design-grid": "https://.../design-main-600x600.jpg"
      }
    },
    // ... 3 more images
  ],
  "featured_image": {
    "ID": 124,
    "url": "https://wp-roihin.precisiondevlab.com/wp-content/uploads/design-featured.jpg",
    "sizes": {
      "design-grid": "https://.../design-featured-600x600.jpg"
    }
  }
}
```

---

## 8. Multi-language Support

### Language Strategy

The system uses separate fields for Thai and English content with fallback logic.

#### Field Structure

**Translatable Fields (Separate TH/EN):**
- Designer Name
- Design Title (optional)
- Energy Description Title
- Energy Description
- Energy Property Names (via fixed select options)
- Production Budget Label (via fixed select options)
- Copyright Text

**Language-Independent Fields:**
- Gallery Images
- Featured Image
- Creation Date
- Rating Labels (mapped on frontend)
- Stone Names (English international names)
- Stone Size (numeric values)
- Display Order

#### Frontend Language Selection

```typescript
// Helper function to get localized value
function getLocalizedValue(
  valueTh: string,
  valueEn: string,
  locale: 'th' | 'en'
): string {
  if (locale === 'th' && valueTh) {
    return valueTh
  }
  return valueEn || valueTh // Fallback to Thai if English not available
}

// Usage example
const designerName = getLocalizedValue(
  design.acf.designer_name_th,
  design.acf.designer_name_en,
  locale
)
```

#### Rating Label Localization

```typescript
const ratingLabels = {
  th: {
    excellent: 'ดีเยี่ยมที่สุด',
    very_good: 'ดีมาก',
    good: 'ดี',
    average: 'ปานกลาง',
    fair: 'พอใช้',
  },
  en: {
    excellent: 'Excellent',
    very_good: 'Very Good',
    good: 'Good',
    average: 'Average',
    fair: 'Fair',
  },
}

function getRatingLabel(rating: EnergyRating, locale: 'th' | 'en'): string {
  return ratingLabels[locale][rating]
}
```

#### Production Budget Localization

```typescript
const budgetLabels = {
  th: {
    budget_low: 'ระดับเบื้องต้น (ต่ำกว่า 3,000 บาท)',
    budget_medium: 'ระดับกลาง (3,000 - 5,000 บาท)',
    budget_medium_high: 'ระดับกลางค่อนข้างสูง (5,000 - 8,000 บาท)',
    budget_high: 'ระดับสูง (8,000 ขึ้นไป)',
    budget_premium: 'ระดับพรีเมียม (15,000 ขึ้นไป)',
  },
  en: {
    budget_low: 'Basic Level (Under ฿3,000)',
    budget_medium: 'Medium Level (฿3,000 - ฿5,000)',
    budget_medium_high: 'Medium-High Level (฿5,000 - ฿8,000)',
    budget_high: 'High Level (฿8,000+)',
    budget_premium: 'Premium Level (฿15,000+)',
  },
}

function getBudgetLabel(budget: string, locale: 'th' | 'en'): string {
  return budgetLabels[locale][budget] || budget
}
```

---

## 9. Implementation Checklist

### Phase 1: WordPress Plugin Setup
- [ ] Create plugin directory: `wordpress-plugins/roihin-personalized-designs/`
- [ ] Create main plugin file with header
- [ ] Register custom post type `personalized_design`
- [ ] Configure REST API exposure
- [ ] Set up image sizes
- [ ] Test basic CPT creation

### Phase 2: ACF Field Groups
- [ ] Install ACF Pro plugin
- [ ] Create "Personalized Design Information" field group
- [ ] Add Gallery Images field (Gallery, exactly 4)
- [ ] Add Featured Image field
- [ ] Add Designer Information fields (TH/EN)
- [ ] Add Energy Description fields (TH/EN)
- [ ] Add Energy Properties repeater (fixed 5 rows)
  - [ ] Configure property name select options (TH/EN)
  - [ ] Configure rating dropdown options
- [ ] Add Stones Used repeater
- [ ] Add Product Details fields
  - [ ] Charm & Divider (text)
  - [ ] Stone Size (text)
  - [ ] Production Budget (select)
- [ ] Add Display Settings fields
- [ ] Test ACF fields in admin

### Phase 3: Admin Interface Customization
- [ ] Customize admin columns (Featured Image, Designer, Date, Featured, Published)
- [ ] Add quick edit for Published/Featured status
- [ ] Add admin notices for validation errors
- [ ] Create admin help documentation
- [ ] Add custom admin styles if needed

### Phase 4: REST API Development
- [ ] Register ACF fields in REST API
- [ ] Add custom REST API fields
- [ ] Implement query filters (is_published, is_featured, orderby)
- [ ] Add pagination support
- [ ] Configure CORS headers
- [ ] Add cache headers
- [ ] Test API endpoints with Postman/Insomnia

### Phase 5: Data Validation & Security
- [ ] Implement ACF validation hooks
- [ ] Add sanitization functions
- [ ] Add nonce verification for forms
- [ ] Validate gallery image count (exactly 4)
- [ ] Validate energy properties count (exactly 5)
- [ ] Validate rating and budget enums
- [ ] Add capability checks for CRUD operations

### Phase 6: Frontend Integration
- [ ] Create TypeScript types: `/src/lib/types/personalized-design.ts`
- [ ] Create Zod validation schemas
- [ ] Create API route: `/src/app/api/personalized-designs/route.ts`
- [ ] Create single design route: `/src/app/api/personalized-designs/[slug]/route.ts`
- [ ] Create API helper: `/src/lib/api/personalized-designs.ts`
- [ ] Update `RecentPersonalizedDesignsSection.tsx` to use real API
- [ ] Update `PersonalizedDesignModal.tsx` to use real data structure
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test with real WordPress data

### Phase 7: Localization
- [ ] Add translation strings to `/messages/th.json`
- [ ] Add translation strings to `/messages/en.json`
- [ ] Implement rating label localization
- [ ] Implement budget label localization
- [ ] Test language switching
- [ ] Verify fallback logic

### Phase 8: Testing
- [ ] Test creating new personalized design
- [ ] Test updating existing design
- [ ] Test deleting design
- [ ] Test reading designs via API
- [ ] Test published/unpublished filtering
- [ ] Test featured designs
- [ ] Test display order sorting
- [ ] Test image upload (4 images required)
- [ ] Test energy properties (5 required)
- [ ] Test multi-language fields
- [ ] Test validation errors
- [ ] Test responsive display
- [ ] Cross-browser testing

### Phase 9: Documentation & Deployment
- [ ] Write plugin README.md
- [ ] Document ACF field structure
- [ ] Create admin user guide
- [ ] Create API documentation
- [ ] Test on staging environment
- [ ] Performance testing
- [ ] Security audit
- [ ] Deploy to production
- [ ] Train content editors

### Phase 10: Data Migration (if applicable)
- [ ] Export current mockup data
- [ ] Create import script for bulk upload
- [ ] Map mockup fields to ACF fields
- [ ] Validate imported data
- [ ] Review and publish imported designs

---

## Code Examples

### WordPress Plugin Main File

```php
<?php
/**
 * Plugin Name: ROIHIN Personalized Designs
 * Plugin URI: https://roihin.precisiondevlab.com
 * Description: Manage personalized bracelet design showcases with CRUD functionality
 * Version: 1.0.0
 * Author: ROIHIN
 * Text Domain: roihin-personalized-designs
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('ROIHIN_PD_VERSION', '1.0.0');
define('ROIHIN_PD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ROIHIN_PD_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Register Custom Post Type
 */
function roihin_register_personalized_design_post_type() {
    $labels = [
        'name' => __('Personalized Designs', 'roihin-personalized-designs'),
        'singular_name' => __('Personalized Design', 'roihin-personalized-designs'),
        'add_new' => __('Add New Design', 'roihin-personalized-designs'),
        'add_new_item' => __('Add New Personalized Design', 'roihin-personalized-designs'),
        'edit_item' => __('Edit Personalized Design', 'roihin-personalized-designs'),
        'view_item' => __('View Personalized Design', 'roihin-personalized-designs'),
        'all_items' => __('All Designs', 'roihin-personalized-designs'),
        'search_items' => __('Search Designs', 'roihin-personalized-designs'),
        'not_found' => __('No designs found', 'roihin-personalized-designs'),
    ];

    $args = [
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'personalized-design',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'query_var' => true,
        'rewrite' => ['slug' => 'personalized-design'],
        'capability_type' => 'post',
        'has_archive' => false,
        'hierarchical' => false,
        'menu_position' => 6,
        'menu_icon' => 'dashicons-awards',
        'supports' => ['title', 'thumbnail', 'custom-fields'],
    ];

    register_post_type('personalized_design', $args);
}
add_action('init', 'roihin_register_personalized_design_post_type');

/**
 * Register custom image sizes
 */
function roihin_pd_image_sizes() {
    add_image_size('design-thumbnail', 400, 400, true);
    add_image_size('design-medium', 800, 800, true);
    add_image_size('design-large', 1200, 1200, true);
    add_image_size('design-grid', 600, 600, true);
}
add_action('after_setup_theme', 'roihin_pd_image_sizes');

/**
 * Register ACF Fields
 */
if (function_exists('acf_add_local_field_group')) {
    require_once ROIHIN_PD_PLUGIN_DIR . 'includes/acf-fields.php';
}

/**
 * Add ACF fields to REST API
 */
function roihin_pd_register_rest_fields() {
    register_rest_field('personalized_design', 'acf', [
        'get_callback' => function($object) {
            return get_fields($object['id']);
        },
        'update_callback' => function($value, $object) {
            foreach ($value as $field_name => $field_value) {
                update_field($field_name, $field_value, $object->ID);
            }
            return true;
        },
        'schema' => null,
    ]);
}
add_action('rest_api_init', 'roihin_pd_register_rest_fields');

/**
 * Add custom query parameters to REST API
 */
function roihin_pd_rest_query($args, $request) {
    // Filter by published status
    if ($request->get_param('is_published') !== null) {
        $is_published = filter_var($request->get_param('is_published'), FILTER_VALIDATE_BOOLEAN);
        $args['meta_query'][] = [
            'key' => 'is_published',
            'value' => $is_published ? '1' : '0',
            'compare' => '=',
        ];
    }

    // Filter by featured status
    if ($request->get_param('is_featured') !== null) {
        $is_featured = filter_var($request->get_param('is_featured'), FILTER_VALIDATE_BOOLEAN);
        $args['meta_query'][] = [
            'key' => 'is_featured',
            'value' => $is_featured ? '1' : '0',
            'compare' => '=',
        ];
    }

    // Order by display_order
    if ($request->get_param('orderby') === 'display_order') {
        $args['orderby'] = 'meta_value_num';
        $args['meta_key'] = 'display_order';
        $args['order'] = $request->get_param('order') ?: 'ASC';
    }

    return $args;
}
add_filter('rest_personalized_design_query', 'roihin_pd_rest_query', 10, 2);

/**
 * Customize admin columns
 */
function roihin_pd_admin_columns($columns) {
    $new_columns = [];
    $new_columns['cb'] = $columns['cb'];
    $new_columns['featured_image'] = __('Image', 'roihin-personalized-designs');
    $new_columns['title'] = $columns['title'];
    $new_columns['designer'] = __('Designer', 'roihin-personalized-designs');
    $new_columns['creation_date'] = __('Creation Date', 'roihin-personalized-designs');
    $new_columns['is_featured'] = __('Featured', 'roihin-personalized-designs');
    $new_columns['is_published'] = __('Published', 'roihin-personalized-designs');
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}
add_filter('manage_personalized_design_posts_columns', 'roihin_pd_admin_columns');

/**
 * Populate custom admin columns
 */
function roihin_pd_admin_column_content($column, $post_id) {
    switch ($column) {
        case 'featured_image':
            $thumb = get_the_post_thumbnail($post_id, 'design-thumbnail', ['style' => 'width:80px;height:80px;object-fit:cover;']);
            echo $thumb ?: '—';
            break;

        case 'designer':
            $designer = get_field('designer_name_th', $post_id);
            echo esc_html($designer ?: '—');
            break;

        case 'creation_date':
            $date = get_field('creation_date', $post_id);
            echo $date ? date('j M Y', strtotime($date)) : '—';
            break;

        case 'is_featured':
            $is_featured = get_field('is_featured', $post_id);
            echo $is_featured ? '⭐ Yes' : 'No';
            break;

        case 'is_published':
            $is_published = get_field('is_published', $post_id);
            echo $is_published ? '✅ Published' : '❌ Draft';
            break;
    }
}
add_action('manage_personalized_design_posts_custom_column', 'roihin_pd_admin_column_content', 10, 2);

/**
 * Make admin columns sortable
 */
function roihin_pd_sortable_columns($columns) {
    $columns['creation_date'] = 'creation_date';
    $columns['designer'] = 'designer';
    return $columns;
}
add_filter('manage_edit-personalized_design_sortable_columns', 'roihin_pd_sortable_columns');

/**
 * Enable WebP support
 */
function roihin_pd_enable_webp($mime_types) {
    $mime_types['webp'] = 'image/webp';
    return $mime_types;
}
add_filter('upload_mimes', 'roihin_pd_enable_webp');

/**
 * Image quality optimization
 */
add_filter('jpeg_quality', function() { return 85; });
add_filter('wp_editor_set_quality', function() { return 85; });
```

### ACF Fields Configuration (`includes/acf-fields.php`)

```php
<?php
/**
 * ACF Field Group: Personalized Design Information
 */

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key' => 'group_personalized_design',
        'title' => 'Personalized Design Information',
        'fields' => [
            // Gallery Images
            [
                'key' => 'field_gallery_images',
                'label' => 'Gallery Images (Exactly 4 Required)',
                'name' => 'gallery_images',
                'type' => 'gallery',
                'required' => 1,
                'min' => 4,
                'max' => 4,
                'insert' => 'append',
                'library' => 'all',
                'min_width' => 1200,
                'min_height' => 1200,
                'min_size' => '',
                'max_size' => 5,
                'mime_types' => 'jpg,jpeg,png,webp',
                'instructions' => 'Upload exactly 4 square images (1200x1200px recommended). First image is main display.',
            ],

            // Featured Image (handled by WordPress, but reminder field)
            [
                'key' => 'field_featured_note',
                'label' => 'Featured Image',
                'name' => '',
                'type' => 'message',
                'message' => 'Set the Featured Image using the panel on the right →',
            ],

            // TAB: Designer Information
            [
                'key' => 'field_tab_designer',
                'label' => 'Designer Information',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_designer_name_th',
                'label' => 'Designer Name (Thai)',
                'name' => 'designer_name_th',
                'type' => 'text',
                'required' => 1,
                'default_value' => 'ROIHIN Stone & Bracelet',
            ],

            [
                'key' => 'field_designer_name_en',
                'label' => 'Designer Name (English)',
                'name' => 'designer_name_en',
                'type' => 'text',
                'required' => 1,
                'default_value' => 'ROIHIN Stone & Bracelet',
            ],

            [
                'key' => 'field_design_title_th',
                'label' => 'Design Title (Thai) - Optional',
                'name' => 'design_title_th',
                'type' => 'text',
                'required' => 0,
            ],

            [
                'key' => 'field_design_title_en',
                'label' => 'Design Title (English) - Optional',
                'name' => 'design_title_en',
                'type' => 'text',
                'required' => 0,
            ],

            [
                'key' => 'field_creation_date',
                'label' => 'Creation Date',
                'name' => 'creation_date',
                'type' => 'date_picker',
                'required' => 1,
                'display_format' => 'd/m/Y',
                'return_format' => 'Y-m-d',
                'first_day' => 0,
            ],

            [
                'key' => 'field_display_label',
                'label' => 'Display Label (shown above designer name)',
                'name' => 'display_label',
                'type' => 'text',
                'required' => 0,
                'default_value' => 'ออกแบบโดย',
                'placeholder' => 'ออกแบบโดย',
            ],

            // TAB: Energy Description
            [
                'key' => 'field_tab_energy_desc',
                'label' => 'Energy Description',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_energy_desc_title_th',
                'label' => 'Energy Description Title (Thai)',
                'name' => 'energy_description_title_th',
                'type' => 'text',
                'required' => 1,
                'default_value' => 'คำอธิบายพลังงาน',
            ],

            [
                'key' => 'field_energy_desc_title_en',
                'label' => 'Energy Description Title (English)',
                'name' => 'energy_description_title_en',
                'type' => 'text',
                'required' => 1,
                'default_value' => 'Energy Description',
            ],

            [
                'key' => 'field_energy_desc_th',
                'label' => 'Energy Description (Thai)',
                'name' => 'energy_description_th',
                'type' => 'wysiwyg',
                'required' => 1,
                'tabs' => 'all',
                'toolbar' => 'full',
                'media_upload' => 0,
            ],

            [
                'key' => 'field_energy_desc_en',
                'label' => 'Energy Description (English)',
                'name' => 'energy_description_en',
                'type' => 'wysiwyg',
                'required' => 1,
                'tabs' => 'all',
                'toolbar' => 'full',
                'media_upload' => 0,
            ],

            // TAB: Energy Properties
            [
                'key' => 'field_tab_energy_props',
                'label' => 'Energy Properties',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_energy_properties',
                'label' => 'Energy Properties (Exactly 5 Required)',
                'name' => 'energy_properties',
                'type' => 'repeater',
                'required' => 1,
                'min' => 5,
                'max' => 5,
                'layout' => 'table',
                'button_label' => 'Add Property',
                'sub_fields' => [
                    [
                        'key' => 'field_property_name_th',
                        'label' => 'Property Name (Thai)',
                        'name' => 'property_name_th',
                        'type' => 'select',
                        'required' => 1,
                        'choices' => [
                            'finance_fortune' => 'การเงิน โชคลาภ',
                            'work_business' => 'การงาน ธุรกิจ การลงทุน',
                            'love_happiness' => 'ความรัก ความสุข โชคดี',
                            'health_balance' => 'สุขภาพ สมดุลชีวิต',
                            'spirituality_stability' => 'จิตวิญญาณ ความมั่นคง',
                        ],
                        'default_value' => 'finance_fortune',
                    ],
                    [
                        'key' => 'field_property_name_en',
                        'label' => 'Property Name (English)',
                        'name' => 'property_name_en',
                        'type' => 'select',
                        'required' => 1,
                        'choices' => [
                            'finance_fortune' => 'Finance, Fortune',
                            'work_business' => 'Work, Business, Investment',
                            'love_happiness' => 'Love, Happiness, Luck',
                            'health_balance' => 'Health, Balance',
                            'spirituality_stability' => 'Spirituality, Stability',
                        ],
                        'default_value' => 'finance_fortune',
                    ],
                    [
                        'key' => 'field_rating_label',
                        'label' => 'Rating',
                        'name' => 'rating_label',
                        'type' => 'select',
                        'required' => 1,
                        'choices' => [
                            'excellent' => '⭐⭐⭐⭐⭐ ดีเยี่ยมที่สุด (Excellent)',
                            'very_good' => '⭐⭐⭐⭐ ดีมาก (Very Good)',
                            'good' => '⭐⭐⭐ ดี (Good)',
                            'average' => '⭐⭐ ปานกลาง (Average)',
                            'fair' => '⭐ พอใช้ (Fair)',
                        ],
                        'default_value' => 'good',
                    ],
                ],
            ],

            // TAB: Stones Used
            [
                'key' => 'field_tab_stones',
                'label' => 'Stones Used',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_stones_used',
                'label' => 'Stones Used',
                'name' => 'stones_used',
                'type' => 'repeater',
                'required' => 1,
                'min' => 1,
                'max' => 20,
                'layout' => 'table',
                'button_label' => 'Add Stone',
                'sub_fields' => [
                    [
                        'key' => 'field_stone_name',
                        'label' => 'Stone Name',
                        'name' => 'stone_name',
                        'type' => 'text',
                        'required' => 1,
                        'placeholder' => 'e.g., Black Tourmaline',
                    ],
                ],
            ],

            // TAB: Product Details
            [
                'key' => 'field_tab_product',
                'label' => 'Product Details',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_charm_divider',
                'label' => 'Charm & Divider',
                'name' => 'charm_divider',
                'type' => 'text',
                'required' => 0,
                'placeholder' => 'e.g., None, Silver Charm, Gold Spacer',
                'default_value' => 'None',
            ],

            [
                'key' => 'field_stone_size',
                'label' => 'Stone Size',
                'name' => 'stone_size',
                'type' => 'text',
                'required' => 1,
                'placeholder' => 'e.g., 8 mm., 10 mm., 6-8 mm.',
            ],

            [
                'key' => 'field_production_budget',
                'label' => 'Production Budget',
                'name' => 'production_budget',
                'type' => 'select',
                'required' => 1,
                'choices' => [
                    'budget_low' => 'ระดับเบื้องต้น (ต่ำกว่า 3,000 บาท) / Basic Level (Under ฿3,000)',
                    'budget_medium' => 'ระดับกลาง (3,000 - 5,000 บาท) / Medium Level (฿3,000 - ฿5,000)',
                    'budget_medium_high' => 'ระดับกลางค่อนข้างสูง (5,000 - 8,000 บาท) / Medium-High Level (฿5,000 - ฿8,000)',
                    'budget_high' => 'ระดับสูง (8,000 ขึ้นไป) / High Level (฿8,000+)',
                    'budget_premium' => 'ระดับพรีเมียม (15,000 ขึ้นไป) / Premium Level (฿15,000+)',
                ],
            ],

            // TAB: Display Settings
            [
                'key' => 'field_tab_display',
                'label' => 'Display Settings',
                'name' => '',
                'type' => 'tab',
            ],

            [
                'key' => 'field_is_published',
                'label' => 'Published Status',
                'name' => 'is_published',
                'type' => 'true_false',
                'message' => 'Show in frontend gallery',
                'default_value' => 1,
                'ui' => 1,
            ],

            [
                'key' => 'field_is_featured',
                'label' => 'Featured Design',
                'name' => 'is_featured',
                'type' => 'true_false',
                'message' => 'Mark as featured design',
                'default_value' => 0,
                'ui' => 1,
            ],

            [
                'key' => 'field_display_order',
                'label' => 'Display Order',
                'name' => 'display_order',
                'type' => 'number',
                'required' => 0,
                'min' => 0,
                'step' => 1,
                'instructions' => 'Lower number = higher priority (0 = highest)',
            ],

            [
                'key' => 'field_copyright_th',
                'label' => 'Copyright Text (Thai) - Optional',
                'name' => 'copyright_text_th',
                'type' => 'textarea',
                'required' => 0,
                'rows' => 3,
                'instructions' => 'Leave empty to use default copyright text',
            ],

            [
                'key' => 'field_copyright_en',
                'label' => 'Copyright Text (English) - Optional',
                'name' => 'copyright_text_en',
                'type' => 'textarea',
                'required' => 0,
                'rows' => 3,
                'instructions' => 'Leave empty to use default copyright text',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'personalized_design',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
}
```

---

## Summary

This documentation provides a complete blueprint for implementing a WordPress CRUD plugin for Personalized Bracelet Designs that:

1. ✅ Fully integrates with the existing Next.js frontend components
2. ✅ Provides comprehensive ACF field groups for all design data
3. ✅ Implements static rating and budget fields (no dynamic values)
4. ✅ Supports exactly 4 gallery images per design
5. ✅ Includes 5 fixed energy properties with dropdown ratings
6. ✅ Provides comprehensive REST API endpoints for CRUD operations
7. ✅ Includes proper validation and data sanitization
8. ✅ Supports multi-language (TH/EN) content
9. ✅ Implements image management with proper sizing
10. ✅ Follows WordPress and Next.js best practices

**Key Differences from Mock Data:**
- **Static Rating System**: Uses dropdown labels instead of dynamic 1-8 ratings
- **Fixed Properties**: Exactly 5 energy properties (no add/remove)
- **Fixed Gallery Count**: Exactly 4 images required
- **Structured Budget**: Predefined budget levels instead of free text

**Next Steps:**
1. Set up WordPress plugin structure
2. Implement ACF field groups with validation
3. Configure REST API endpoints
4. Create TypeScript types and Zod schemas
5. Update Next.js frontend to consume real API
6. Test all CRUD operations
7. Deploy to production
