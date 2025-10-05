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

### Authentication Requirements by Endpoint

| Endpoint | Auth Required | Method |
|----------|--------------|--------|
| `/api/auth/login` | ❌ No | POST |
| `/api/auth/register` | ❌ No | POST |
| `/api/auth/logout` | ✅ Yes | POST |
| `/api/auth/forgot-password` | ❌ No | POST |
| `/api/auth/reset-password` | ❌ No | POST |
| `/api/account/change-password` | ✅ Yes | POST |
| `/api/products` | ❌ No | GET |
| `/api/orders` | ❌ No | POST |
| `/api/orders/[id]` | ❌ No (requires order key) | GET |
| `/api/orders/[id]/upload-slip` | ❌ No (requires order key) | POST |
| `/api/orders/bank-accounts` | ❌ No | GET |
| `/api/profile` | ✅ Yes | GET, PATCH |
| `/api/addresses` | ✅ Yes | GET, POST |
| `/api/addresses/[id]` | ✅ Yes | PUT, DELETE |
| `/api/wishlist` | ✅ Yes | GET, POST |
| `/api/wishlist/[id]` | ✅ Yes | DELETE |
| `/api/wishlist/toggle` | ✅ Yes | POST |
| `/api/wishlist/check` | ✅ Yes | GET |
| `/api/wishlist/check-favorite` | ✅ Yes (optional) | GET |
| `/api/blog/posts` | ❌ No | GET |
| `/api/blog/categories` | ❌ No | GET |
| `/api/blog/posts/[title]` | ❌ No | GET |
| `/api/site-settings` | ❌ No | GET |
| `/api/page-settings` | ❌ No | GET |
| `/api/stone-settings` | ❌ No | GET |
| `/api/stones` | ❌ No | GET |
| `/api/bracelet-base-price` | ❌ No | GET |
| `/api/banks` | ❌ No | GET |
| `/api/testimonials` | ❌ No | GET |
| `/api/stripe/create-checkout-session` | ❌ No | POST |
| `/api/stripe/webhook` | ❌ No (Stripe signature) | POST |
| `/api/health` | ❌ No | GET |

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

## Account Management

### Change Password
```http
POST /api/account/change-password
Content-Type: application/json
Authorization: Required (wpToken cookie)

{
  "current_password": "current123",
  "new_password": "newPassword123",
  "confirm_password": "newPassword123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Password updated successfully. Please sign in again.",
  "force_reauth": true
}
```

**Note:** This endpoint invalidates the current session and requires re-authentication.

## Products API

### Get All Products
```http
GET /api/products?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`)

**Response:** (Array of products)
```json
[
  {
    "id": 1,
    "acf": {
      // Product custom fields
    }
  }
]
```

## Orders API

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "variation_id": 123,
      "quantity": 2,
      "color": "red",
      "price": 500,
      "total": 1000
    }
  ],
  "billing": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+66123456789",
    "address_1": "123 Main St",
    "address_2": "Apt 4",
    "city": "Bangkok",
    "state": "Bangkok",
    "postcode": "10100",
    "country": "TH"
  },
  "shipping": {
    // Same structure as billing
  },
  "payment_method": "bacs",
  "shipping_total": 50,
  "total": 1050,
  "subtotal": 1000,
  "note": "Please deliver after 5pm",
  "slip_base64": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "ok": true,
  "order": {
    "order_id": 123,
    "order_number": "#123",
    "order_key": "wc_order_abc123",
    "status": "pending",
    "status_label": "Pending Payment",
    "currency": "THB",
    "total": "1050.00",
    "subtotal": "1000.00",
    "shipping_total": "50.00",
    "payment_method": "bacs",
    "payment_title": "Direct Bank Transfer",
    "created_at": "2024-01-15T10:30:00",
    "items": [
      {
        "item_id": 1,
        "product_id": 1,
        "name": "Product Name",
        "quantity": 2,
        "total": "1000.00",
        "meta": {
          "color": "red"
        }
      }
    ],
    "billing": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+66123456789",
      "address_1": "123 Main St",
      "address_2": "Apt 4",
      "city": "Bangkok",
      "state": "Bangkok",
      "postcode": "10100",
      "country": "TH"
    },
    "shipping": { /* Same structure */ },
    "slip": "https://example.com/slip.jpg",
    "tracking": {
      "number": "TRACK123",
      "carrier": "DHL",
      "url": "https://track.dhl.com/...",
      "shipped_at": "2024-01-16T14:00:00"
    }
  },
  "next": {
    "upload_slip": "/api/orders/123/upload-slip?key=wc_order_abc123",
    "get": "/api/orders/123?key=wc_order_abc123"
  }
}
```

### Get Order by ID
```http
GET /api/orders/[id]?key={order_key}
```

**Query Parameters:**
- `key` (required): Order key received from order creation

**Response:** Same as Create Order response

### Upload Payment Slip
```http
POST /api/orders/[id]/upload-slip?key={order_key}
Content-Type: multipart/form-data

(FormData with 'slip' file)
```

Or with base64:
```http
POST /api/orders/[id]/upload-slip?key={order_key}
Content-Type: application/json

{
  "slip_base64": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response:**
```json
{
  "ok": true,
  "slip_url": "https://example.com/slip.jpg",
  "order": {
    // Full order object
  }
}
```

### Get Bank Accounts
```http
GET /api/orders/bank-accounts
```

**Response:**
```json
{
  "ok": true,
  "accounts": [
    {
      "account_name": "Roihin Store",
      "account_number": "1234567890",
      "bank_name": "Bangkok Bank",
      "iban": "TH12345...",
      "sort_code": "123",
      "bic": "BKKBTHBK"
    }
  ]
}
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
GET /api/wishlist/check?product_id={productId}&color={color}
```

**Query Parameters:**
- `product_id` (optional): Single product ID to check
- `ids` (optional): Comma-separated product IDs (e.g., `ids=1,2,3`)
- `color` (optional): Product color variant

**Response:**
```json
{
  "favorite": true,
  "item_id": 123
}
```

Or for multiple IDs:
```json
{
  "1": { "favorite": true, "item_id": 123 },
  "2": { "favorite": false, "item_id": null }
}
```

### Check Favorite Status
```http
GET /api/wishlist/check-favorite?product={productId}&color={color}
```

**Query Parameters:**
- `product` (required): Product ID
- `color` (optional): Product color variant

**Response:**
```json
{
  "favorite": true,
  "item_id": 123
}
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
GET /api/blog/posts?lang=en|th&page=1&per_page=6&categories=all
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`), default: `en`
- `page` (optional): Page number, default: `1`
- `per_page` (optional): Posts per page, default: `6`
- `categories` (optional): Category ID or `all`, default: `all`

**Response:**
```json
{
  "posts": [
    {
      "id": "1",
      "slug": "post-slug",
      "title": "Post Title",
      "excerpt": "Post excerpt...",
      "image": "https://example.com/image.jpg",
      "date": "2024-01-15T10:30:00",
      "categories": [1, 2]
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### Get Blog Categories
```http
GET /api/blog/categories?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`), default: `en`

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Category Name",
      "slug": "category-slug",
      "count": 10
    }
  ]
}
```

### Get Single Blog Post
```http
GET /api/blog/posts/[title]?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`), default: `en`

**Response:**
```json
{
  "id": "1",
  "slug": "post-slug",
  "title": "Post Title",
  "content": "<p>Full post content...</p>",
  "excerpt": "Post excerpt...",
  "image": "https://example.com/image.jpg",
  "date": "2024-01-15T10:30:00",
  "categories": [1, 2]
}
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

### Get Stones
```http
GET /api/stones?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`), default: `th`

**Response:**
```json
[
  {
    "id": 1,
    "acf": {
      // Stone custom fields
    }
  }
]
```

### Get Bracelet Base Prices
```http
GET /api/bracelet-base-price
```

## Bank Information

### Get Banks
```http
GET /api/banks?lang=en|th
```

**Query Parameters:**
- `lang` (optional): Language code (`en` or `th`), default: `en`

**Response:**
```json
[
  {
    "id": 1,
    "acf": {
      // Bank custom fields
    }
  }
]
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

### Order Models
```typescript
interface OrderItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  color?: string;
  price?: number;
  total?: number;
}

interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface OrderCreateRequest {
  items: OrderItem[];
  billing: BillingAddress;
  shipping?: BillingAddress;
  payment_method: 'bacs';
  shipping_total: number;
  total?: number;
  subtotal?: number;
  note?: string;
  slip_base64?: string;
}

interface OrderItemResponse {
  item_id: number;
  product_id: number;
  name: string;
  quantity: number;
  total: string;
  meta?: {
    color?: string;
  };
}

interface OrderTracking {
  number: string;
  carrier: string;
  url: string;
  shipped_at: string;
}

interface Order {
  order_id: number;
  order_number: string;
  order_key: string;
  status: string;
  status_label: string;
  currency: string;
  total: string;
  subtotal: string;
  shipping_total: string;
  payment_method: string;
  payment_title: string;
  created_at: string;
  items: OrderItemResponse[];
  billing: BillingAddress;
  shipping: BillingAddress;
  slip: string | null;
  tracking: OrderTracking;
}

interface OrderResponse {
  ok: boolean;
  order: Order;
  next?: {
    upload_slip: string;
    get: string;
  };
}

interface SlipUploadResponse {
  ok: boolean;
  slip_url: string;
  order: Order;
}

interface BankAccount {
  account_name: string;
  account_number: string;
  bank_name: string;
  iban?: string;
  sort_code?: string;
  bic?: string;
}

interface BankAccountsResponse {
  ok: boolean;
  accounts: BankAccount[];
}
```

### Blog Models
```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  categories: number[];
  content?: string; // Only included in single post response
}

interface BlogPostsResponse {
  posts: BlogPost[];
  totalPages?: number;
  currentPage: number;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
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
