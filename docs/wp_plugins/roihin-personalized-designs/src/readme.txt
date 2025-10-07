=== ROIHIN Personalized Designs Manager ===
Contributors: roihin
Tags: bracelet, personalized, design, crystal, energy, custom-post-type, acf
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Manage personalized bracelet designs with energy properties, stone compositions, and ratings. Built for ROIHIN Stone & Bracelet.

== Description ==

ROIHIN Personalized Designs Manager is a comprehensive WordPress plugin designed to manage personalized bracelet designs with detailed energy properties, stone compositions, and ratings.

= Features =

* **Custom Post Type**: Dedicated post type for personalized bracelet designs
* **Rich Data Structure**: 20+ structured fields including:
  * Design gallery (1-10 images)
  * Designer information
  * Energy descriptions (Thai & English)
  * 5 energy property ratings (0-8 scale)
  * Stone compositions (1-15 stones)
  * Bracelet specifications
  * Budget level categorization
* **REST API Integration**: Full CRUD operations via WordPress REST API
* **Bilingual Support**: Thai and English translations
* **Advanced Validation**: Comprehensive data validation and sanitization
* **Admin UI Enhancements**: Custom columns, bulk actions, quick edit support
* **Taxonomy System**: Budget levels and stone types
* **ACF Integration**: Advanced Custom Fields for flexible field management

= Use Cases =

* E-commerce sites selling personalized bracelets
* Crystal and gemstone businesses
* Spiritual wellness brands
* Custom jewelry designers
* Metaphysical product catalogs

= REST API Endpoints =

* `GET /wp-json/wp/v2/personalized-designs` - List all designs
* `GET /wp-json/wp/v2/personalized-designs/{id}` - Get single design
* `POST /wp-json/wp/v2/personalized-designs` - Create new design (auth required)
* `PUT /wp-json/wp/v2/personalized-designs/{id}` - Update design (auth required)
* `DELETE /wp-json/wp/v2/personalized-designs/{id}` - Delete design (auth required)
* `GET /wp-json/roihin/v1/personalized-designs/random?count=8` - Get random designs

= Requirements =

* WordPress 6.0 or higher
* PHP 7.4 or higher
* **Advanced Custom Fields PRO** (required)

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/roihin-personalized-designs/`
2. Ensure **Advanced Custom Fields PRO** is installed and activated
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Navigate to **Personalized Designs** in the admin menu
5. Start creating your personalized bracelet designs!

= Configuration =

After activation:

1. The plugin automatically creates the `personalized_design` custom post type
2. Budget level terms are automatically created (Budget, Standard, Premium, Luxury)
3. ACF field groups are automatically registered
4. REST API endpoints are immediately available

== Frequently Asked Questions ==

= Does this plugin require Advanced Custom Fields PRO? =

Yes, ACF PRO is required for the plugin to function. The plugin will not activate without it.

= Can I use this plugin without a headless Next.js frontend? =

Yes! While designed for Next.js integration, the plugin works standalone in WordPress and provides full admin functionality.

= How many images can I upload per design? =

Each design supports 1-10 gallery images. Images must be at least 800×800 pixels and under 5MB.

= What are the 5 energy property categories? =

1. Finance & Fortune (การเงิน โชคลาภ)
2. Work, Business, Investment (การงาน ธุรกิจ การลงทุน)
3. Love, Happiness, Luck (ความรัก ความสุข โชคดี)
4. Health, Life Balance (สุขภาพ สมดุลชีวิต)
5. Spirituality, Stability (จิตวิญญาณ ความมั่นคง)

All 5 categories must be present with ratings from 0-8.

= Can I export my designs? =

Yes! Select designs from the admin list and use the "Export as JSON" bulk action.

= Is the plugin translation-ready? =

Yes! The plugin includes Thai and English translations. You can add more languages via .po/.mo files.

= Can I duplicate existing designs? =

Yes! Use the "Duplicate" bulk action in the admin list to quickly copy designs.

== Screenshots ==

1. Personalized Designs admin list with custom columns
2. Design edit screen with ACF fields
3. Gallery upload interface
4. Energy properties repeater field
5. Stone composition management
6. REST API response example

== Changelog ==

= 1.0.0 - 2025-01-07 =
* Initial release
* Custom post type: `personalized_design`
* Full CRUD operations via WordPress admin and REST API
* 20+ structured fields with validation
* Bilingual support (Thai/English)
* Image gallery with optimization
* Energy properties rating system (5 categories, 0-8 scale)
* Stone composition tracking (1-15 stones)
* Budget level categorization
* Admin UI enhancements (custom columns, bulk actions, quick edit)
* ACF JSON field groups included

== Upgrade Notice ==

= 1.0.0 =
Initial release. Requires ACF PRO.

== Developer Documentation ==

= Custom Functions =

* `rpd_get_energy_category_name($category, $lang)` - Get translated energy category name
* `rpd_get_rating_label($rating, $lang)` - Get translated rating label

= Hooks & Filters =

**Actions:**
* `rpd_before_design_save` - Fires before design is saved
* `rpd_after_design_save` - Fires after design is saved
* `rpd_before_design_delete` - Fires before design is deleted
* `rpd_after_design_delete` - Fires after design is deleted

**Filters:**
* `rpd_energy_categories` - Filter available energy categories
* `rpd_budget_levels` - Filter available budget levels
* `rpd_stone_size_options` - Filter stone size options
* `rpd_rest_api_fields` - Filter REST API response fields

= Zod Schema (Next.js) =

```typescript
import { PersonalizedDesignSchema } from '@/lib/types/personalized-design'

// Validate API response
const design = PersonalizedDesignSchema.parse(apiResponse)
```

= Integration Example =

```typescript
// Fetch all designs
const response = await fetch('https://yoursite.com/wp-json/wp/v2/personalized-designs')
const designs = await response.json()

// Fetch random designs
const random = await fetch('https://yoursite.com/wp-json/roihin/v1/personalized-designs/random?count=8')
const randomDesigns = await random.json()
```

== Support ==

For support, please contact:
* Email: support@roihin.precisiondevlab.com
* Website: https://roihin.precisiondevlab.com

== Credits ==

Developed by ROIHIN Stone & Bracelet
Built with ❤️ for the spiritual wellness community
