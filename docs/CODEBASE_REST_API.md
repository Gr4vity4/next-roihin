# Next-Roihin REST API Documentation

## Overview
Next-Roihin is an e-commerce application for jewelry/bracelets built with Next.js 15, using WordPress as a headless CMS backend and Stripe for payment processing.

**Base URL:** `https://your-domain.com/api`
**Backend:** WordPress REST API (`https://wp-roihin.precisiondevlab.com`)
**Frontend:** Next.js 15 with TypeScript
**Authentication:** JWT tokens via cookies
**Payment:** Stripe integration

## Authentication
All authenticated endpoints require a `wpToken` cookie containing a valid JWT token obtained from the login endpoint.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "email": "user@example.com",
    "name": "User Display Name"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Logout
```http
POST /api/auth/logout
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "new-password"
}
```

## Products API

### Get All Products
```http
GET /api/products?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`)

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "acf": {
        // Product custom fields
      }
    }
  ]
}
```

## Orders API

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "products": [
    {
      "id": 1,
      "quantity": 2,
      "customizations": {...}
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Bangkok",
    "postalCode": "10100",
    "country": "Thailand"
  },
  "paymentMethod": "stripe|bank_transfer"
}
```

**Response:**
```json
{
  "ok": true,
  "orderId": "order_123",
  "paymentUrl": "https://stripe-payment-url"
}
```

### Get Order by ID
```http
GET /api/orders/[id]
```

### Get Order Statistics
```http
GET /api/orders/stats
```

## Profile Management

### Get Profile
```http
GET /api/profile
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone_number": "+1234567890",
  "phone": "+1234567890"
}
```

### Update Profile
```http
PATCH /api/profile
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone_number": "+1234567890"
}
```

## Wishlist API

### Get Wishlist
```http
GET /api/wishlist
```

### Add to Wishlist
```http
POST /api/wishlist
Content-Type: application/json

{
  "productId": 123
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist/[id]
```

### Toggle Wishlist Item
```http
POST /api/wishlist/toggle
Content-Type: application/json

{
  "productId": 123
}
```

### Check if Product is in Wishlist
```http
GET /api/wishlist/check/[productId]
```

### Check Favorite Status
```http
GET /api/wishlist/check-favorite/[productId]
```

## Cart API

### Get Cart (Note: Currently empty implementation)
```http
GET /api/cart
```

## Payment APIs

### Stripe Integration

#### Create Checkout Session
```http
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "orderId": "order_123",
  "successUrl": "https://your-domain.com/success",
  "cancelUrl": "https://your-domain.com/cancel"
}
```

#### Stripe Webhook
```http
POST /api/stripe/webhook
```

Handles Stripe payment events (configured in Stripe Dashboard).

## Address Management

### Get Addresses
```http
GET /api/addresses
```

### Create Address
```http
POST /api/addresses
```

### Update Address
```http
PUT /api/addresses/[id]
```

### Delete Address
```http
DELETE /api/addresses/[id]
```

## Blog API

### Get Blog Posts
```http
GET /api/blog?lang=en|th
```

## Site Settings

### Get Site Settings
```http
GET /api/site-settings
```

### Get Page Settings
```http
GET /api/page-settings
```

## Product Settings

### Get Stone Settings
```http
GET /api/stone-settings
```

### Get Bracelet Base Prices
```http
GET /api/bracelet-base-price
```

## Testimonials

### Get Testimonials
```http
GET /api/testimonials
```

## Health Check

### API Health Status
```http
GET /api/health
```

## Content Types & Data Models

### Product Model
```typescript
interface Product {
  id: number;
  acf: {
    // WordPress ACF fields for products
    product_name?: string;
    product_price?: number;
    product_description?: string;
    product_images?: string[];
    product_stones?: any[];
    // ... other custom fields
  };
}
```

### Order Model
```typescript
interface Order {
  id: string;
  products: Array<{
    id: number;
    quantity: number;
    customizations?: any;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  shippingAddress: Address;
  createdAt: string;
}
```

### Address Model
```typescript
interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}
```

## Error Handling
All API endpoints follow consistent error response format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Language Support
Most endpoints support multiple languages:
- `?lang=en` - English
- `?lang=th` - Thai

## Development Notes

### Caching Strategy
- API responses include cache headers via `getCacheHeaders()`
- Uses `getFetchConfig()` for consistent fetch configuration
- WordPress API responses are cached appropriately

### Code Organization
- API routes in `/src/app/api/`
- Business logic in `/src/lib/api/`
- Types in `/src/lib/types/`
- Configuration in `/src/config/`

### Technologies Used
- **Next.js 15** - React framework
- **WordPress REST API** - Headless CMS
- **Stripe** - Payment processing
- **JWT** - Authentication
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Schema validation

This documentation provides a quick overview of all available REST API endpoints and their usage patterns for the development team.
