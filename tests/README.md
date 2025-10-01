# Playwright Tests for ROIHIN

## Setup

The Playwright test framework has been installed and configured. To complete the setup, you need to install the browsers:

```bash
# Install all browsers
npx playwright install

# Or install specific browser (faster)
npx playwright install chromium
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for debugging)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

## Test Structure

```
tests/
├── pages/
│   └── public-pages.spec.ts    # Main test suite for all public pages
├── utils/
│   └── test-helpers.ts         # Helper functions and utilities
├── fixtures/                    # Test data and fixtures
└── screenshots/                 # Screenshots captured during tests
```

## What's Being Tested

### Public Pages (Both TH and EN locales)
- Home page (/)
- About (/about)
- Blog listing (/blog)
- Blog post (/blog/[slug])
- Bracelet order (/bracelet-order)
- Charm spacer catalog (/charmspacer)
- Charm spacer product (/charmspacer/product/[slug])
- Custom design (/custom)
- Customer service (/customer-service)
- Personalized (/personalized)
- Testimonials (/testimonial)

### Test Coverage
Each page is tested for:
- ✅ Page loads without errors (HTTP 200)
- ✅ No JavaScript console errors
- ✅ Essential elements are present
- ✅ Page title is set
- ✅ Navigation elements are visible
- ✅ Images load properly
- ✅ Multi-language support (TH/EN)
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Language switcher functionality
- ✅ Critical user journeys

### Pages NOT Tested (Require Authentication)
These pages are excluded from the current test suite as they require user authentication:
- All `/member/*` pages
- Checkout flow (`/checkout/*`)
- Password reset (`/reset-password`)

## Running Tests in CI/CD

The tests are configured to work in CI environments. The configuration automatically:
- Retries failed tests (2 times in CI)
- Uses a single worker in CI
- Generates HTML reports
- Takes screenshots on failure
- Records videos on failure
- Collects traces for debugging

## Troubleshooting

### Browsers not installed
If you see an error about browsers not being installed:
```bash
npx playwright install
```

### Development server not running
The tests automatically start the dev server if it's not running. However, if you have issues:
```bash
# In one terminal
npm run dev

# In another terminal
npm run test:e2e
```

### Tests timing out
Increase the timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 60000, // 60 seconds
}
```

## Next Steps

1. Add tests for authenticated pages (member area)
2. Add visual regression testing
3. Add API endpoint testing
4. Add performance metrics collection
5. Integrate with CI/CD pipeline