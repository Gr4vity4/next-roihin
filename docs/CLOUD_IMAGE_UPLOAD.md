# Cloud Image Upload Service Documentation

## Overview

The ROIHIN project uses a cloud-based image storage service hosted at `storage.precisiondevlab.com` for managing product images, gallery photos, and user uploads.

**Base URL**: `https://storage.precisiondevlab.com`

## Authentication

### Environment Variables

Add to your `.env.local`:

```env
X_CLOUD_AUTH_TOKEN=your_api_key_here
```

### Required Headers

All API requests must include these headers:

```typescript
{
  'x-api-key': process.env.X_CLOUD_AUTH_TOKEN,
  'x-project-name': 'roihin'
}
```

## API Endpoints

### 1. Upload Image

Upload single or multiple images to cloud storage.

**Endpoint**: `POST /api/images/upload`

**Supported Formats**: JPEG, PNG, GIF, WebP, BMP, TIFF, HEIC, HEIF

**Max File Size**: 50MB per file

#### Request

```typescript
// Using FormData
const formData = new FormData();
formData.append('file', fileBlob, 'image.jpg');

// Optional: Add metadata
formData.append('metadata', JSON.stringify({
  category: 'products',
  productId: '123',
  alt: 'Product bracelet image'
}));

const response = await fetch('https://storage.precisiondevlab.com/api/images/upload', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.X_CLOUD_AUTH_TOKEN,
    'x-project-name': 'roihin'
  },
  body: formData
});
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890abcdef",
    "url": "https://storage.precisiondevlab.com/api/images/clx1234567890abcdef",
    "filename": "image.jpg",
    "size": 245678,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2025-10-01T12:34:56.789Z",
    "metadata": {
      "category": "products",
      "productId": "123",
      "alt": "Product bracelet image"
    }
  }
}
```

### 2. Retrieve Image

Get an image with optional transformations.

**Endpoint**: `GET /api/images/{id}`

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `width` | number | Target width in pixels | `800` |
| `height` | number | Target height in pixels | `600` |
| `format` | string | Output format: `webp`, `jpeg`, `png` | `webp` |
| `quality` | number | Quality (1-100) | `85` |
| `fit` | string | Resize mode: `cover`, `contain`, `fill`, `inside`, `outside` | `cover` |

#### Examples

```typescript
// Original image
const originalUrl = `https://storage.precisiondevlab.com/api/images/${imageId}`;

// Resized to 800x600, WebP format
const resizedUrl = `https://storage.precisiondevlab.com/api/images/${imageId}?width=800&height=600&format=webp&quality=85&fit=cover`;

// Thumbnail (300x300)
const thumbnailUrl = `https://storage.precisiondevlab.com/api/images/${imageId}?width=300&height=300&format=webp&fit=cover`;
```

### 3. List Images

Retrieve a paginated list of uploaded images.

**Endpoint**: `GET /api/images`

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | `1` |
| `limit` | number | Items per page (max 100) | `20` |
| `sort` | string | Sort field: `uploadedAt`, `size`, `filename` | `uploadedAt` |
| `order` | string | Sort order: `asc`, `desc` | `desc` |

#### Request

```typescript
const response = await fetch(
  'https://storage.precisiondevlab.com/api/images?page=1&limit=20&sort=uploadedAt&order=desc',
  {
    headers: {
      'x-api-key': process.env.X_CLOUD_AUTH_TOKEN,
      'x-project-name': 'roihin'
    }
  }
);
```

#### Response

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "clx1234567890abcdef",
        "url": "https://storage.precisiondevlab.com/api/images/clx1234567890abcdef",
        "filename": "bracelet-gold.jpg",
        "size": 245678,
        "mimeType": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "uploadedAt": "2025-10-01T12:34:56.789Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

### 4. Delete Image

Remove an image from cloud storage.

**Endpoint**: `DELETE /api/images/{id}`

#### Request

```typescript
const response = await fetch(
  `https://storage.precisiondevlab.com/api/images/${imageId}`,
  {
    method: 'DELETE',
    headers: {
      'x-api-key': process.env.X_CLOUD_AUTH_TOKEN,
      'x-project-name': 'roihin'
    }
  }
);
```

#### Response

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "File type not supported. Accepted formats: JPEG, PNG, GIF, WebP, BMP, TIFF, HEIC, HEIF"
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing API key |
| `INVALID_FILE_TYPE` | Unsupported file format |
| `FILE_TOO_LARGE` | File exceeds 50MB limit |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `NOT_FOUND` | Image not found |
| `UPLOAD_FAILED` | Upload processing error |

## Usage Examples

### Example 1: Upload Product Image (Client-Side)

```typescript
'use client';

import { useState } from 'react';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        category: 'products',
        alt: 'Product image'
      }));

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### Example 2: API Route Proxy (Server-Side)

Create `/src/app/api/images/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(
      'https://storage.precisiondevlab.com/api/images/upload',
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.X_CLOUD_AUTH_TOKEN!,
          'x-project-name': 'roihin'
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload image'
        }
      },
      { status: 500 }
    );
  }
}
```

### Example 3: Next.js Image Component Integration

```tsx
import Image from 'next/image';

interface CloudImageProps {
  imageId: string;
  alt: string;
  width?: number;
  height?: number;
}

export function CloudImage({ imageId, alt, width = 800, height = 600 }: CloudImageProps) {
  const imageUrl = `https://storage.precisiondevlab.com/api/images/${imageId}?width=${width}&height=${height}&format=webp&quality=85&fit=cover`;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
```

### Example 4: Upload Multiple Images

```typescript
async function uploadMultipleImages(files: File[]) {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    });

    return response.json();
  });

  const results = await Promise.all(uploadPromises);
  return results.filter(r => r.success).map(r => r.data);
}
```

## Best Practices

### 1. Image Optimization

Always request optimized images with appropriate dimensions:

```typescript
// ❌ Bad: Loading full-size image
const badUrl = `https://storage.precisiondevlab.com/api/images/${id}`;

// ✅ Good: Optimized for display size
const goodUrl = `https://storage.precisiondevlab.com/api/images/${id}?width=800&format=webp&quality=85`;
```

### 2. Error Handling

Always handle upload errors gracefully:

```typescript
try {
  const response = await fetch('/api/images/upload', { ... });
  const data = await response.json();

  if (!data.success) {
    // Handle specific error codes
    switch (data.error.code) {
      case 'FILE_TOO_LARGE':
        alert('Image must be under 50MB');
        break;
      case 'INVALID_FILE_TYPE':
        alert('Please upload a valid image file');
        break;
      default:
        alert('Upload failed. Please try again.');
    }
  }
} catch (error) {
  alert('Network error. Please check your connection.');
}
```

### 3. Rate Limiting

Implement client-side throttling for bulk uploads:

```typescript
async function uploadWithRateLimit(files: File[], delayMs = 100) {
  const results = [];

  for (const file of files) {
    const result = await uploadImage(file);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return results;
}
```

### 4. Metadata Management

Store useful metadata with images:

```typescript
const metadata = {
  category: 'products' | 'gallery' | 'testimonials' | 'blog',
  entityId: string,  // Product ID, post ID, etc.
  alt: string,       // Accessibility text
  tags: string[],    // Searchable tags
  uploadedBy: string // User ID
};
```

## Security Considerations

1. **Never expose API key**: Always use server-side API routes for uploads
2. **Validate file types**: Check MIME types on both client and server
3. **Implement file size checks**: Validate before upload to save bandwidth
4. **Sanitize filenames**: Remove special characters and spaces
5. **Use HTTPS only**: Never use HTTP for API requests

## Rate Limits

- **Upload**: 100 requests per minute per API key
- **Retrieve**: 1000 requests per minute per API key
- **Delete**: 50 requests per minute per API key
- **List**: 200 requests per minute per API key

## Migration from WordPress Media Library

If migrating from WordPress:

```typescript
// Fetch WordPress image
const wpImageUrl = 'https://wp-roihin.precisiondevlab.com/wp-content/uploads/image.jpg';
const response = await fetch(wpImageUrl);
const blob = await response.blob();

// Upload to cloud storage
const formData = new FormData();
formData.append('file', blob, 'image.jpg');
formData.append('metadata', JSON.stringify({
  source: 'wordpress',
  originalUrl: wpImageUrl
}));

const uploadResponse = await fetch('/api/images/upload', {
  method: 'POST',
  body: formData
});
```

## Support

For API issues or questions:
- API Status: Check service health at `https://storage.precisiondevlab.com/health`
- Rate Limit Info: Response headers include `X-RateLimit-Remaining` and `X-RateLimit-Reset`
