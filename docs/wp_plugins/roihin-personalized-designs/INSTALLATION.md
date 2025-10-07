# ROIHIN Personalized Designs Manager - Installation Guide

## Prerequisites

Before installing this plugin, ensure you have:

1. **WordPress 6.0+** installed
2. **PHP 7.4+** on your server
3. **Advanced Custom Fields PRO** installed and activated (required)
4. Admin access to your WordPress installation

## Installation Steps

### Step 1: Install ACF PRO

1. Purchase and download ACF PRO from https://www.advancedcustomfields.com/pro/
2. Upload ACF PRO to your WordPress site
3. Activate ACF PRO plugin

### Step 2: Upload Plugin Files

1. Download or clone this plugin
2. Upload the entire `roihin-personalized-designs` folder to `/wp-content/plugins/`
3. The structure should look like:
```
/wp-content/plugins/roihin-personalized-designs/
├── roihin-personalized-designs.php
├── readme.txt
├── uninstall.php
├── includes/
├── admin/
├── public/
├── languages/
└── acf-json/
```

### Step 3: Activate Plugin

1. Go to WordPress Admin → Plugins
2. Find "ROIHIN Personalized Designs Manager"
3. Click "Activate"

The plugin will automatically:
- Register the `personalized_design` custom post type
- Create default budget level terms
- Register taxonomies (Budget Levels, Stone Types)
- Load ACF field groups
- Enable REST API endpoints

### Step 4: Verify Installation

1. Check that "Personalized Designs" appears in the admin menu
2. Navigate to "Personalized Designs" → "Add New"
3. Verify all ACF fields are visible:
   - Design Gallery
   - Designer Information
   - Energy Description
   - Energy Properties (5 required)
   - Stones Used
   - Bracelet Specifications

## Configuration

### ACF Field Group Sync

The plugin includes ACF JSON configuration in `/acf-json/` directory. This ensures field groups are version-controlled and automatically synced.

**To verify field groups:**
1. Go to Custom Fields → Field Groups
2. You should see "Design Details" field group
3. Status should show "Synced" or no sync message

**If fields are missing:**
1. Go to Custom Fields → Tools
2. Click "Sync available" button
3. Select "Design Details" and sync

### Permalinks

After activation, flush permalinks:
1. Go to Settings → Permalinks
2. Click "Save Changes" (don't change anything)
3. This ensures the custom post type URLs work correctly

### Budget Levels Setup

Default budget levels are automatically created:
- Budget (Under 3,000 THB)
- Standard (3,000 - 5,000 THB)
- Premium (5,000 - 8,000 THB)
- Luxury (8,000+ THB)

**To customize:**
1. Go to Personalized Designs → Budget Levels
2. Edit existing terms or add new ones

### Stone Types Setup

Stone types taxonomy is empty by default. Add stone types as needed:
1. Go to Personalized Designs → Stone Types
2. Add stone types used in your designs (e.g., "Tourmaline", "Garnet", "Tiger's Eye")

## Usage

### Creating a Personalized Design

1. Go to Personalized Designs → Add New
2. Enter design title (e.g., "Black Tourmaline Focus - Aug 2025")
3. Fill in all required fields:

**Design Gallery** (Required):
- Upload 1-10 images
- Minimum size: 800×800px
- Maximum size: 5MB per image
- Formats: JPG, PNG, WebP

**Designer Information** (Required):
- Designer Name: Default is "ROIHIN Stone & Bracelet"
- Design Date: Select date design was created
- Designer Title: Label shown above designer name (default: "ออกแบบโดย")

**Energy Description** (Required):
- Thai Description: Minimum 100 characters
- English Description: Optional

**Energy Properties** (Required - ALL 5):
You must add exactly 5 energy properties with these categories:
1. Finance & Fortune (การเงิน โชคลาภ)
2. Work, Business, Investment (การงาน ธุรกิจ การลงทุน)
3. Love, Happiness, Luck (ความรัก ความสุข โชคดี)
4. Health, Life Balance (สุขภาพ สมดุลชีวิต)
5. Spirituality, Stability (จิตวิญญาณ ความมั่นคง)

For each property, set rating from 0-8:
- 0 = None
- 1-2 = Fair
- 3 = Moderate
- 4 = Very Good
- 5-8 = Excellent

**Stones Used** (Required):
- Add 1-15 stones
- Each stone must have a name
- Optionally link to crystal database post

**Bracelet Specifications** (Required):
- Stone Size: Select from dropdown or enter custom size
- Charm & Separator: Optional (default: "None")

**Budget Level** (Taxonomy):
- Select appropriate budget level from sidebar

**Stone Types** (Taxonomy):
- Select applicable stone types from sidebar

4. Click "Publish"

### Editing an Existing Design

1. Go to Personalized Designs → All Designs
2. Click design title or "Edit" link
3. Make changes
4. Click "Update"

### Duplicating Designs

1. Go to Personalized Designs → All Designs
2. Select designs to duplicate (checkboxes)
3. Choose "Duplicate" from Bulk Actions dropdown
4. Click "Apply"
5. Duplicates will be created as drafts

### Exporting Designs

1. Go to Personalized Designs → All Designs
2. Select designs to export (checkboxes)
3. Choose "Export as JSON" from Bulk Actions dropdown
4. Click "Apply"
5. JSON file will download automatically

## REST API Usage

### Authentication

- **GET requests**: No authentication required (public)
- **POST/PUT/DELETE**: Requires WordPress authentication and `edit_personalized_designs` capability

### Endpoints

**List all designs:**
```
GET https://yoursite.com/wp-json/wp/v2/personalized-designs
GET https://yoursite.com/wp-json/wp/v2/personalized-designs?per_page=10&page=1
```

**Get single design:**
```
GET https://yoursite.com/wp-json/wp/v2/personalized-designs/{id}
GET https://yoursite.com/wp-json/wp/v2/personalized-designs?slug=design-slug
```

**Get random designs:**
```
GET https://yoursite.com/wp-json/roihin/v1/personalized-designs/random?count=8
```

**Filter by budget level:**
```
GET https://yoursite.com/wp-json/wp/v2/personalized-designs?budget_level=5
```

**Filter by stone type:**
```
GET https://yoursite.com/wp-json/wp/v2/personalized-designs?stone_type=12
```

**Get with language parameter:**
```
GET https://yoursite.com/wp-json/wp/v2/personalized-designs/123?lang=en
```

### Response Example

```json
{
  "id": 123,
  "slug": "black-tourmaline-focus-aug-2025",
  "title": {
    "rendered": "Black Tourmaline Focus - Aug 2025"
  },
  "featured_image_url": {
    "full": "https://example.com/wp-content/uploads/2025/08/design.jpg",
    "large": "...",
    "medium": "...",
    "thumbnail": "..."
  },
  "acf": {
    "design_gallery": [
      {
        "id": 123,
        "url": "https://example.com/image1.jpg",
        "alt": "Design angle 1",
        "sizes": {...}
      }
    ],
    "designer_info": {
      "designer_name": "ROIHIN Stone & Bracelet",
      "design_date": "2025-08-22",
      "designer_title": "ออกแบบโดย"
    },
    "energy_description": {
      "description_th": "<p>คำอธิบายภาษาไทย...</p>",
      "description_en": "<p>English description...</p>"
    },
    "energy_properties": [
      {
        "category": "finance_fortune",
        "rating": 5,
        "name": "Finance & Fortune",
        "label": "Excellent"
      }
    ],
    "stones_used": [
      {
        "stone_name": "Black Tourmaline",
        "stone_reference": 42
      }
    ],
    "specifications": {
      "stone_size": "8mm",
      "charm_separator": "None"
    }
  },
  "budget_level_details": {
    "id": 5,
    "slug": "luxury",
    "name_th": "ระดับสูงสุด (8,000 ขึ้นไป)",
    "name_en": "Luxury (8,000+ THB)"
  },
  "stone_types_details": [...]
}
```

## Next.js Integration

### API Helper Functions

```typescript
// src/lib/api/personalized-designs.ts
import { WORDPRESS_API_URL } from '@/config/api.config'
import { PersonalizedDesignSchema } from '@/lib/types/personalized-design'

export async function getPersonalizedDesign(slug: string) {
  const url = `${WORDPRESS_API_URL}/wp-json/wp/v2/personalized-designs?slug=${slug}`
  const response = await fetch(url)
  const data = await response.json()
  return PersonalizedDesignSchema.parse(data[0])
}

export async function getRandomDesigns(count: number = 8) {
  const url = `${WORDPRESS_API_URL}/wp-json/roihin/v1/personalized-designs/random?count=${count}`
  const response = await fetch(url)
  return await response.json()
}
```

### Zod Schema Validation

```typescript
// src/lib/types/personalized-design.ts
import { z } from 'zod'

export const PersonalizedDesignSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  acf: z.object({
    design_gallery: z.array(z.object({
      id: z.number(),
      url: z.string().url(),
      alt: z.string(),
    })).min(1).max(10),
    designer_info: z.object({
      designer_name: z.string(),
      design_date: z.string(),
      designer_title: z.string(),
    }),
    energy_description: z.object({
      description_th: z.string(),
      description_en: z.string().optional(),
    }),
    energy_properties: z.array(z.object({
      category: z.enum(['finance_fortune', 'work_business', 'love_happiness', 'health_balance', 'spirituality']),
      rating: z.number().min(0).max(8),
    })).length(5),
    stones_used: z.array(z.object({
      stone_name: z.string(),
      stone_reference: z.number().nullable(),
    })).min(1).max(15),
    specifications: z.object({
      stone_size: z.string(),
      stone_size_custom: z.string().optional(),
      charm_separator: z.string(),
    }),
  }),
})

export type PersonalizedDesign = z.infer<typeof PersonalizedDesignSchema>
```

## Troubleshooting

### ACF Fields Not Showing

**Solution:**
1. Verify ACF PRO is activated
2. Go to Custom Fields → Tools → Sync Available
3. Sync "Design Details" field group

### 404 on REST API Endpoints

**Solution:**
1. Go to Settings → Permalinks
2. Click "Save Changes"
3. Clear any caching plugins

### Images Not Uploading

**Solution:**
1. Check file size (max 5MB)
2. Check dimensions (min 800×800px)
3. Verify file type (JPG, PNG, WebP only)
4. Check WordPress upload permissions

### Validation Errors

**Solution:**
- Ensure all 5 energy property categories are present
- Check minimum 1 gallery image
- Verify Thai description is at least 100 characters
- Ensure at least 1 stone is added

### Cannot Publish Design

**Solution:**
1. Check all required fields are filled
2. Verify you have `edit_personalized_designs` capability
3. Check browser console for JavaScript errors

## Uninstallation

**WARNING:** Uninstalling will permanently delete all designs and data.

### Safe Uninstall (Preserve Data)

1. Export all designs as JSON first
2. Deactivate plugin (data preserved)
3. Designs remain in database

### Complete Uninstall (Delete All Data)

1. Go to Plugins
2. Deactivate plugin
3. Click "Delete"
4. Confirm deletion

The uninstall script will:
- Delete all personalized_design posts
- Delete all taxonomy terms
- Remove custom capabilities
- Clean up database
- (Optional) Delete uploaded images

## Support

For issues or questions:
- Email: support@roihin.precisiondevlab.com
- Documentation: https://roihin.precisiondevlab.com/docs
- GitHub: [Your GitHub URL]

## Version History

**1.0.0** (2025-01-07)
- Initial release
- Full CRUD functionality
- REST API integration
- Bilingual support (Thai/English)
- ACF field groups
- Admin UI enhancements
