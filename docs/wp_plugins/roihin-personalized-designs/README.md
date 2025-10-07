# ROIHIN Personalized Designs Manager

**Version:** 1.0.0
**Requires:** WordPress 6.0+, PHP 7.4+, ACF PRO
**Author:** ROIHIN Stone & Bracelet
**License:** GPL v2 or later

A comprehensive WordPress plugin for managing personalized bracelet designs with energy properties, stone compositions, and ratings. Built for seamless integration with Next.js headless frontends.

---

## 📋 Overview

This plugin provides a complete solution for managing personalized bracelet designs with:
- **Custom Post Type** for personalized designs
- **20+ Structured Fields** using Advanced Custom Fields
- **REST API Integration** for headless CMS usage
- **Bilingual Support** (Thai/English)
- **Advanced Validation** and data sanitization
- **Admin UI Enhancements** for better UX
- **Taxonomy System** for categorization

---

## 🚀 Quick Start

### Installation

1. **Install Prerequisites:**
   - WordPress 6.0+
   - Advanced Custom Fields PRO (required)

2. **Upload Plugin:**
   ```bash
   # Upload to WordPress plugins directory
   /wp-content/plugins/roihin-personalized-designs/
   ```

3. **Activate:**
   - Go to WordPress Admin → Plugins
   - Activate "ROIHIN Personalized Designs Manager"

4. **Verify:**
   - Check "Personalized Designs" appears in admin menu
   - Flush permalinks (Settings → Permalinks → Save)

See [INSTALLATION.md](./INSTALLATION.md) for detailed instructions.

---

## 📁 Plugin Structure

```
src/
├── roihin-personalized-designs.php  # Main plugin file
├── readme.txt                        # WordPress.org readme
├── uninstall.php                     # Cleanup script
├── includes/                         # Core functionality
│   ├── class-post-type.php          # Custom post type registration
│   ├── class-taxonomies.php         # Taxonomy registration
│   ├── class-rest-api.php           # REST API customizations
│   ├── class-admin-ui.php           # Admin UI enhancements
│   ├── class-validation.php         # Data validation
│   └── class-i18n.php               # Internationalization
├── admin/                            # Admin assets
│   ├── css/admin-styles.css         # Admin styles
│   └── js/admin-scripts.js          # Admin scripts
├── public/                           # Frontend assets (optional)
│   ├── css/public-styles.css
│   └── js/public-scripts.js
├── languages/                        # Translation files
│   ├── roihin-personalized-th_TH.po # Thai translations
│   └── roihin-personalized-en_US.po # English translations
└── acf-json/                         # ACF field groups
    └── group_personalized_design_details.json
```

---

## 🔧 Features

### Custom Post Type: `personalized_design`

Each design includes:

| Field Group | Fields | Required |
|-------------|--------|----------|
| **Design Gallery** | 1-10 images (800×800px min, 5MB max) | ✅ Yes |
| **Designer Information** | Name, Date, Attribution Label | ✅ Yes |
| **Energy Description** | Thai (100+ chars), English (optional) | ✅ Thai only |
| **Energy Properties** | 5 categories with 0-8 ratings | ✅ Yes (all 5) |
| **Stones Used** | 1-15 stones with optional DB linking | ✅ Yes (min 1) |
| **Specifications** | Stone size, Charm & Separator | ✅ Stone size |

### Energy Property Categories (Required: All 5)

1. **Finance & Fortune** (การเงิน โชคลาภ)
2. **Work, Business, Investment** (การงาน ธุรกิจ การลงทุน)
3. **Love, Happiness, Luck** (ความรัก ความสุข โชคดี)
4. **Health, Life Balance** (สุขภาพ สมดุลชีวิต)
5. **Spirituality, Stability** (จิตวิญญาณ ความมั่นคง)

### Rating Scale (0-8)

- **5-8**: Excellent (ดีเยี่ยมที่สุด)
- **4**: Very Good (ดีมาก)
- **3**: Moderate (ปานกลาง)
- **1-2**: Fair (พอใช้)
- **0**: None (ไม่มี)

### Taxonomies

**Budget Levels** (Hierarchical):
- Budget (Under 3,000 THB)
- Standard (3,000 - 5,000 THB)
- Premium (5,000 - 8,000 THB)
- Luxury (8,000+ THB)

**Stone Types** (Non-hierarchical):
- Create custom stone type tags

---

## 🌐 REST API

### Endpoints

```bash
# List all designs
GET /wp-json/wp/v2/personalized-designs

# Get single design
GET /wp-json/wp/v2/personalized-designs/{id}
GET /wp-json/wp/v2/personalized-designs?slug={slug}

# Get random designs
GET /wp-json/roihin/v1/personalized-designs/random?count=8

# Filter by budget level
GET /wp-json/wp/v2/personalized-designs?budget_level=5

# Filter by stone type
GET /wp-json/wp/v2/personalized-designs?stone_type=12

# Get with language parameter
GET /wp-json/wp/v2/personalized-designs/123?lang=en
```

### Authentication

- **GET**: No auth required (public)
- **POST/PUT/DELETE**: Requires `edit_personalized_designs` capability

### Response Example

```json
{
  "id": 123,
  "slug": "black-tourmaline-focus",
  "title": {
    "rendered": "Black Tourmaline Focus - Aug 2025"
  },
  "featured_image_url": {
    "full": "https://example.com/image.jpg",
    "large": "...",
    "medium": "...",
    "thumbnail": "..."
  },
  "acf": {
    "design_gallery": [...],
    "designer_info": {...},
    "energy_description": {...},
    "energy_properties": [...],
    "stones_used": [...],
    "specifications": {...}
  },
  "budget_level_details": {
    "id": 5,
    "slug": "luxury",
    "name_th": "ระดับสูงสุด (8,000 ขึ้นไป)",
    "name_en": "Luxury (8,000+ THB)"
  }
}
```

---

## 💻 Next.js Integration

### API Helper (TypeScript)

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
  title: z.object({ rendered: z.string() }),
  acf: z.object({
    design_gallery: z.array(z.object({
      id: z.number(),
      url: z.string().url(),
      alt: z.string(),
    })).min(1).max(10),
    energy_properties: z.array(z.object({
      category: z.enum(['finance_fortune', 'work_business', 'love_happiness', 'health_balance', 'spirituality']),
      rating: z.number().min(0).max(8),
    })).length(5),
    // ... more fields
  }),
})

export type PersonalizedDesign = z.infer<typeof PersonalizedDesignSchema>
```

---

## 🎨 Admin Features

### Custom Admin Columns

- **Thumbnail**: First gallery image
- **Designer**: Designer name
- **Design Date**: Creation date
- **Stones**: Stone count
- **Avg Rating**: Average energy rating

### Bulk Actions

- **Duplicate**: Create copies of designs
- **Export as JSON**: Export design data

### Validation

- Real-time field validation
- Required field checks
- Image dimension/size validation
- Energy property completeness check
- Stone count validation

---

## 🌍 Internationalization

### Supported Languages

- **Thai** (th_TH) - Primary
- **English** (en_US) - Secondary

### Translation Files

- `languages/roihin-personalized-th_TH.po`
- `languages/roihin-personalized-en_US.po`

### Adding New Languages

1. Copy `.po` template
2. Translate strings
3. Generate `.mo` file using Poedit or similar tool
4. Upload to `languages/` directory

---

## 🔒 Security

### Data Sanitization

- `sanitize_text_field()` for text inputs
- `wp_kses_post()` for HTML content
- Image upload validation
- ACF field sanitization

### Authentication

- WordPress nonces for forms
- Capability checks (`edit_personalized_designs`)
- REST API authentication for write operations

### Validation

- Server-side validation via ACF filters
- Client-side validation via JavaScript
- Image upload restrictions
- Required field enforcement

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create new design with all fields
- [ ] Validate required field enforcement
- [ ] Test image upload (size/dimension limits)
- [ ] Verify all 5 energy categories required
- [ ] Test duplicate functionality
- [ ] Test export to JSON
- [ ] Verify REST API endpoints
- [ ] Test bilingual translations
- [ ] Check admin columns display
- [ ] Verify taxonomy filtering

### API Testing

```bash
# Test GET endpoint
curl https://yoursite.com/wp-json/wp/v2/personalized-designs

# Test random endpoint
curl https://yoursite.com/wp-json/roihin/v1/personalized-designs/random?count=8

# Test single design
curl https://yoursite.com/wp-json/wp/v2/personalized-designs/123
```

---

## 📚 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Detailed installation and configuration
- **[Requirements Document](./PersonalizedDesignModal-requirements.md)** - Complete specifications
- **[readme.txt](./src/readme.txt)** - WordPress.org standard readme

---

## 🛠️ Development

### Requirements

- WordPress 6.0+
- PHP 7.4+
- Advanced Custom Fields PRO
- Node.js 18+ (for Next.js integration)
- TypeScript (for type safety)

### Local Development

1. Clone repository
2. Install ACF PRO
3. Activate plugin
4. Test in local WordPress environment

### Code Style

- WordPress Coding Standards
- PSR-4 autoloading
- Namespaced classes
- Documented functions

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| ACF fields not showing | Sync field groups in ACF Tools |
| 404 on REST endpoints | Flush permalinks |
| Images not uploading | Check size/dimension limits |
| Cannot publish design | Verify all 5 energy categories present |

See [INSTALLATION.md](./INSTALLATION.md) for more troubleshooting tips.

---

## 📝 Changelog

### Version 1.0.0 (2025-01-07)

**Initial Release**
- Custom post type `personalized_design`
- Full CRUD via WordPress admin and REST API
- 20+ structured fields with validation
- Bilingual support (Thai/English)
- Image gallery with optimization
- Energy properties rating system
- Stone composition tracking
- Budget level categorization
- Admin UI enhancements
- ACF JSON field groups

---

## 📄 License

GPL v2 or later - https://www.gnu.org/licenses/gpl-2.0.html

---

## 👥 Credits

**Developed by:** ROIHIN Stone & Bracelet
**Website:** https://roihin.precisiondevlab.com
**Support:** support@roihin.precisiondevlab.com

Built with ❤️ for the spiritual wellness community.

---

## 🔗 Related Files

- **Source Code:** `/src/`
- **Requirements:** `PersonalizedDesignModal-requirements.md`
- **Installation:** `INSTALLATION.md`
- **WordPress Readme:** `src/readme.txt`

---

## 🎯 Next Steps

1. **Install Plugin** - Follow [INSTALLATION.md](./INSTALLATION.md)
2. **Create Designs** - Add your first personalized bracelet designs
3. **Test API** - Verify REST endpoints work correctly
4. **Integrate Frontend** - Connect to Next.js application
5. **Customize** - Adjust fields and taxonomies as needed

---

**Ready to get started?** See [INSTALLATION.md](./INSTALLATION.md) for step-by-step instructions.
