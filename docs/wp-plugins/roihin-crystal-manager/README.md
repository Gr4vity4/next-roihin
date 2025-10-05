# Roihin Crystal Manager WordPress Plugin

A comprehensive WordPress plugin for managing crystal and mineral products with full CRUD functionality, Advanced Custom Fields integration, and REST API support for Next.js frontend integration.

## 📋 Overview

**Plugin Name:** Roihin Crystal Manager
**Version:** 1.0.0
**Requires WordPress:** 6.0+
**Requires PHP:** 8.0+
**License:** GPL v2 or later

This plugin creates a custom post type "Crystal" with extensive filtering capabilities, multi-language support (English/Thai), and seamless REST API integration for the Roihin Next.js frontend.

## ✨ Features

- ✅ **Custom Post Type**: Dedicated `crystal` post type with full REST API support
- ✅ **30+ Custom Fields**: Organized in 5 sections using ACF (Advanced Custom Fields)
- ✅ **Advanced Filtering**: 4 filter categories (Color, Energy Properties, Zodiac Signs, Elements)
- ✅ **Multi-language**: English and Thai content support
- ✅ **Image Management**: Custom image sizes (400px, 800px, 1200px) with validation
- ✅ **REST API Endpoints**: Full CRUD operations with custom query parameters
- ✅ **Related Products**: Manual and auto-suggested related products
- ✅ **Data Validation**: Comprehensive field validation and sanitization
- ✅ **Admin UI**: Custom columns, filters, quick edit, and help documentation
- ✅ **Auto-generation**: Automatic slug generation and featured image assignment

## 📦 Installation

### Prerequisites

1. **WordPress 6.0 or higher**
2. **PHP 8.0 or higher**
3. **Advanced Custom Fields (ACF) PRO** plugin installed and activated
   - Download from: https://www.advancedcustomfields.com/

### Installation Steps

1. **Upload Plugin Files**
   ```bash
   # Upload the entire roihin-crystal-manager folder to:
   /wp-content/plugins/roihin-crystal-manager/
   ```

2. **Activate the Plugin**
   - Go to WordPress Admin → Plugins
   - Find "Roihin Crystal Manager"
   - Click "Activate"

3. **Verify Installation**
   - You should see a new "Crystals" menu item in the WordPress admin sidebar
   - The menu icon is a lightbulb (💡)

4. **Flush Permalinks**
   - Go to Settings → Permalinks
   - Click "Save Changes" (no need to change anything)
   - This ensures the custom post type URLs work correctly

## 🗂️ File Structure

```
roihin-crystal-manager/
├── roihin-crystal-manager.php    # Main plugin file
├── includes/
│   ├── acf-fields.php            # ACF field definitions
│   ├── rest-api.php              # REST API customization
│   ├── admin.php                 # Admin UI customization
│   └── validation.php            # Validation & sanitization
├── languages/                     # Translation files (future)
└── README.md                      # This file
```

## 🔧 Configuration

### ACF Field Groups

The plugin automatically registers the following ACF field group:

**Field Group:** "Crystal Information"
**Location:** Post Type is equal to Crystal

#### Sections:

1. **Basic Information** (5 fields)
   - Crystal Name (English)
   - Crystal Name (Thai)
   - Crystal Slug
   - Main Image
   - Gallery Images

2. **Properties** (5 fields)
   - Energy Element
   - Chakra (7 options)
   - Zodiac Compatibility (12 options)
   - Ruling Planet (10 options)
   - Crystal Colors (12 options)

3. **Description & Content** (2 fields)
   - Description Paragraphs (repeater)
   - Attributes (textarea)

4. **Filter Settings** (4 fields)
   - Energy Properties (5 options)
   - Zodiac Signs (12 options)
   - Element Type (4 options)
   - Color Filter (12 options)

5. **Related Products** (1 field)
   - Related Products (relationship field, max 8)

### Custom Image Sizes

The plugin registers three custom image sizes:

| Size Name | Dimensions | Crop |
|-----------|------------|------|
| `crystal-thumbnail` | 400×400 | Yes (hard crop) |
| `crystal-medium` | 800×800 | Yes (hard crop) |
| `crystal-large` | 1200×1200 | Yes (hard crop) |

**JPEG Quality:** Set to 85% for optimal file size vs quality

## 🌐 REST API Endpoints

### Base URL
```
https://your-site.com/wp-json/wp/v2/crystal
```

### Available Endpoints

#### 1. Get All Crystals (with filtering)
```http
GET /wp-json/wp/v2/crystal
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `lang` | string | Language (en/th) | `lang=th` |
| `per_page` | integer | Items per page (default: 10, max: 100) | `per_page=20` |
| `page` | integer | Page number | `page=2` |
| `search` | string | Search by name | `search=apatite` |
| `color_filter` | string | Filter by colors (comma-separated) | `color_filter=blue,green` |
| `energy_properties` | string | Filter by energy properties | `energy_properties=finance_fortune,health_balance` |
| `zodiac_signs` | string | Filter by zodiac signs | `zodiac_signs=aries,leo` |
| `element_type` | string | Filter by elements | `element_type=water,fire` |
| `_fields` | string | Limit response fields | `_fields=id,slug,acf` |

**Example Request:**
```bash
curl "https://your-site.com/wp-json/wp/v2/crystal?lang=th&per_page=20&color_filter=blue,green&_fields=id,slug,acf"
```

**Response Headers:**
- `X-WP-Total`: Total number of crystals
- `X-WP-TotalPages`: Total number of pages

**Response Body:**
```json
[
  {
    "id": 123,
    "slug": "apatite",
    "acf": {
      "crystal_name_en": "Apatite",
      "crystal_name_th": "อะพาไทต์",
      "crystal_slug": "apatite",
      "crystal_main_image": {
        "id": 456,
        "url": "https://your-site.com/wp-content/uploads/2024/01/apatite.jpg",
        "alt": "Apatite Crystal",
        "title": "Apatite",
        "width": 1200,
        "height": 1200,
        "sizes": {
          "thumbnail": "https://your-site.com/.../apatite-400x400.jpg",
          "medium": "https://your-site.com/.../apatite-800x800.jpg",
          "large": "https://your-site.com/.../apatite-1200x1200.jpg",
          "full": "https://your-site.com/.../apatite.jpg"
        }
      },
      "color_filter": ["blue", "green"],
      "energy_properties": ["health_balance"],
      "zodiac_signs": ["aries", "libra"],
      "element_type": ["water"],
      "description_paragraphs": [
        {"paragraph_text": "Apatite is a powerful crystal..."}
      ],
      "crystal_attributes": "Healing, Balance, Communication",
      "chakra": ["throat", "third_eye"],
      "zodiac_compatibility": ["aries", "libra"],
      "ruling_planet": "mercury",
      "crystal_colors": ["blue", "green"],
      "related_products": [...]
    }
  }
]
```

#### 2. Get Single Crystal
```http
GET /wp-json/wp/v2/crystal/{id}
GET /wp-json/wp/v2/crystal?slug={slug}
```

**Example:**
```bash
curl "https://your-site.com/wp-json/wp/v2/crystal/123"
curl "https://your-site.com/wp-json/wp/v2/crystal?slug=apatite"
```

#### 3. Create Crystal (Admin Only)
```http
POST /wp-json/wp/v2/crystal
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Apatite",
  "status": "publish",
  "acf": {
    "crystal_name_en": "Apatite",
    "crystal_name_th": "อะพาไทต์",
    "crystal_main_image": 456,
    "energy_element": "Water, Air",
    "chakra": ["throat", "third_eye"],
    "zodiac_compatibility": ["aries", "libra"],
    "ruling_planet": "mercury",
    "crystal_colors": ["blue", "green"],
    "description_paragraphs": [
      {"paragraph_text": "Apatite is a powerful crystal..."}
    ],
    "crystal_attributes": "Healing, Balance, Communication",
    "energy_properties": ["health_balance"],
    "zodiac_signs": ["aries", "libra"],
    "element_type": ["water"],
    "color_filter": ["blue", "green"]
  }
}
```

#### 4. Update Crystal (Admin Only)
```http
PUT /wp-json/wp/v2/crystal/{id}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### 5. Delete Crystal (Admin Only)
```http
DELETE /wp-json/wp/v2/crystal/{id}
Authorization: Bearer {JWT_TOKEN}
```

### Custom Endpoints

#### Auto-Suggest Related Products
```http
GET /wp-json/roihin-crystal/v1/related/{id}?limit=8
```

Returns crystals with similar properties (same colors, energy properties, or zodiac signs).

**Example:**
```bash
curl "https://your-site.com/wp-json/roihin-crystal/v1/related/123?limit=8"
```

**Response:**
```json
[
  {
    "id": 124,
    "slug": "aquamarine",
    "nameEn": "Aquamarine",
    "nameTh": "อความารีน",
    "image": "https://your-site.com/.../aquamarine-800x800.jpg"
  }
]
```

## 📝 Usage Examples

### Creating a Crystal Product

1. **Navigate to Crystals → Add New**
2. **Fill in Basic Information**
   - Enter English name (e.g., "Apatite")
   - Enter Thai name (e.g., "อะพาไทต์")
   - Slug will auto-generate (or customize it)
   - Upload main image (min 800×800px, max 5MB)
   - Optionally add gallery images

3. **Set Properties**
   - Enter energy element
   - Select associated chakras
   - Select zodiac compatibility
   - Choose ruling planet
   - Select crystal colors

4. **Add Description**
   - Add multiple description paragraphs
   - Write attributes summary

5. **Configure Filters**
   - Select energy properties
   - Select zodiac signs for filtering
   - Select element types
   - Select colors for filtering

6. **Add Related Products** (optional)
   - Select up to 8 related products

7. **Click Publish**

### Querying Crystals from Next.js

```typescript
// Example Next.js API route: /app/api/crystals/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'th'
  const colorFilter = searchParams.get('color_filter') || ''

  const queryParams = new URLSearchParams({
    lang,
    per_page: '20',
    _fields: 'id,slug,acf',
    ...(colorFilter && { color_filter: colorFilter }),
  })

  const response = await fetch(
    `https://your-site.com/wp-json/wp/v2/crystal?${queryParams}`,
    { next: { revalidate: 300 } } // Cache for 5 minutes
  )

  const crystals = await response.json()
  const totalPages = response.headers.get('X-WP-TotalPages')

  return NextResponse.json({ crystals, totalPages })
}
```

## 🎨 Filter Options Reference

### Color Filter (12 Options)
```php
'purple', 'blue', 'teal', 'green', 'yellow', 'orange',
'red', 'light-blue', 'pink', 'black', 'white', 'beige'
```

### Energy Properties (5 Options)
```php
'finance_fortune'           // Finance, Fortune / การเงิน, โชคลาภ
'work_business'             // Work, Business, Investment / งาน, ธุรกิจ, การลงทุน
'love_happiness'            // Love, Happiness, Luck / ความรัก, ความสุข, โชค
'health_balance'            // Health, Balance / สุขภาพ, สมดุล
'spirituality_stability'    // Spirituality, Stability / จิตวิญญาณ, ความมั่นคง
```

### Zodiac Signs (12 Options)
```php
'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
```

### Element Types (4 Options)
```php
'earth', 'water', 'air', 'fire'
```

## 🔐 Security & Permissions

### CORS Configuration
The plugin adds CORS headers to allow API access from your Next.js frontend:

```php
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With
```

### Authentication
- **GET requests**: Public access
- **POST/PUT/DELETE**: Requires authentication (JWT or WordPress auth)

### Validation
All data is validated and sanitized:
- Required fields are enforced
- Array fields validated against allowed values
- Images validated for size, dimensions, and format
- Slug uniqueness checked
- Related products existence verified

## 🐛 Troubleshooting

### Issue: ACF fields not showing
**Solution:** Ensure ACF PRO plugin is installed and activated.

### Issue: REST API returns 404
**Solution:** Flush permalinks (Settings → Permalinks → Save Changes).

### Issue: Images not displaying in API
**Solution:** Check that images are uploaded correctly and image sizes are registered.

### Issue: Filters not working
**Solution:** Ensure filter values match exactly with the allowed values in the documentation.

### Issue: Slug conflicts
**Solution:** Plugin will show an error if slug already exists. Choose a unique slug.

## 🚀 Performance Optimization

### Caching
The plugin adds cache headers to API responses:
- **Production**: 5 minutes cache (`max-age=300`)
- **Development**: No cache

### Field Limiting
Use the `_fields` parameter to reduce response size:
```
/wp-json/wp/v2/crystal?_fields=id,slug,acf.crystal_name_en,acf.crystal_main_image
```

### Pagination
Always use pagination for large datasets:
```
/wp-json/wp/v2/crystal?per_page=20&page=1
```

## 📚 Integration with Next.js Frontend

This plugin is designed to work seamlessly with the Roihin Next.js application at `/[locale]/crystal`.

### TypeScript Interface
```typescript
export interface CrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  properties: {
    priceComplete: string
    chakra: string[]
    zodiacCompatibility: string[]
    rulingPlanet: string
    color: string[]
  }
  description: string[]
  attributes: string
  filters: {
    energyProperties: string[]
    zodiacSigns: string[]
    elements: string[]
    colors: string[]
  }
}
```

## 📄 License

GPL v2 or later
https://www.gnu.org/licenses/gpl-2.0.html

## 👨‍💻 Support

For issues, feature requests, or questions:
- **Documentation:** See `/docs/crystal-product-crud-requirements.md`
- **WordPress Admin:** Check the Help tab when editing a Crystal

## 🔄 Changelog

### Version 1.0.0 (2024-01-XX)
- Initial release
- Custom post type registration
- 30+ ACF fields in 5 sections
- REST API with advanced filtering
- Multi-language support (EN/TH)
- Image management with custom sizes
- Related products system
- Admin UI customization
- Data validation and sanitization

## 🎯 Roadmap

- [ ] Bulk import/export functionality
- [ ] WPML/Polylang integration
- [ ] Additional filter combinations
- [ ] Product analytics dashboard
- [ ] SEO metadata fields
- [ ] Product reviews system

---

**Developed for Roihin Stone & Bracelet**
https://roihin.precisiondevlab.com
