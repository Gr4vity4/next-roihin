# Static Type TODOs

This file contains TypeScript improvement tasks to be reviewed by a typescript-expert.

## WordPress Blog API Implementation - Static Typing Tasks

### 1. Enhanced Multi-language Support
**Priority: Medium**
- **Issue**: Currently using same content for both Thai and English in blog posts
- **Current Implementation**: 
  ```typescript
  title: {
    english: post.title.rendered,
    thai: post.title.rendered, // Same content for both languages
  }
  ```
- **Recommended Enhancement**: 
  - Create a translation service or mapping system
  - Add language detection/extraction from WordPress custom fields
  - Implement proper bilingual content structure

### 2. WordPress API Response Type Strictness
**Priority: Low**  
- **Issue**: Some WordPress API fields use `.passthrough()` for flexibility
- **Current Implementation**:
  ```typescript
  _links: z.object({}).passthrough().optional()
  ```
- **Recommended Enhancement**: 
  - Define specific schema for `_links` object based on WordPress API documentation
  - Add type safety for embedded media objects
  - Consider creating discriminated unions for different post types

### 3. Date Handling Type Safety
**Priority: Low**
- **Issue**: Date string parsing assumes valid ISO format from WordPress
- **Current Implementation**: Basic string to Date conversion in `formatThaiDate()`
- **Recommended Enhancement**:
  - Add date validation with Zod date schema
  - Handle invalid date formats gracefully
  - Consider using a date library like date-fns for more robust parsing

### 4. API Error Response Standardization
**Priority: Medium**
- **Issue**: Error responses are not fully typed across all endpoints
- **Current Implementation**: Basic error schema exists but not consistently applied
- **Recommended Enhancement**:
  - Create standardized error response wrapper type
  - Add error code enums for different failure scenarios
  - Implement proper error boundary types for React components

### 5. Pagination Metadata Types
**Priority: Low**
- **Issue**: Pagination information could be more strictly typed
- **Current Implementation**: 
  ```typescript
  totalPages?: number
  currentPage?: number
  ```
- **Recommended Enhancement**:
  - Create dedicated pagination response type
  - Add validation for pagination bounds
  - Consider implementing cursor-based pagination types for future scalability

### 6. Category Relationship Types
**Priority: Medium**
- **Issue**: Post categories are stored as number arrays without relationship typing
- **Current Implementation**: `categories: z.array(z.number())`
- **Recommended Enhancement**:
  - Create relationship type between posts and categories
  - Add category hierarchy typing support
  - Consider implementing category lookup utilities with proper typing

## Notes for TypeScript Expert Review

- All core functionality is implemented and working
- Zod v4 schemas provide runtime validation
- Build passes with no TypeScript errors
- These enhancements are for future maintainability and type safety improvements
- Priority levels: High (blocking), Medium (should address), Low (nice to have)

## Implementation Status
- ✅ Basic WordPress API integration with type safety
- ✅ Zod schema validation for API responses
- ✅ Error handling with proper types
- ✅ Thai date formatting utility
- ✅ React component integration with TypeScript
- ⏳ Enhanced multi-language typing (future enhancement)
- ⏳ Advanced WordPress API type mappings (future enhancement)