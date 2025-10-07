---
description: Review codebase file to plan WordPress plugin CRUD product functionality
---

Review the codebase in `{{arg1}}` to analyze what a WordPress plugin create product page must have for full CRUD functionality.

Your analysis should include:

1. **Required Fields Analysis**
   - Extract all form fields, inputs, and data structures from the reviewed file
   - Identify required vs optional fields
   - Note data types, validation rules, and constraints

2. **WordPress Plugin Requirements**
   - Map existing fields to WordPress custom post type structure
   - Identify necessary WordPress hooks and filters
   - List required WordPress capabilities and permissions
   - Specify custom taxonomies or meta fields needed

3. **CRUD Operations Support**
   - Create: Form fields and submission handling
   - Read: Query structure and data retrieval
   - Update: Edit functionality and data modification
   - Delete: Deletion handling and cleanup

4. **Additional Features**
   - Media upload/attachment handling
   - Internationalization requirements
   - REST API endpoints needed
   - Admin UI components

5. **Implementation Checklist**
   - Required PHP functions and classes
   - JavaScript/React components needed
   - Database schema requirements
   - Security considerations (nonces, sanitization, validation)

After completing the analysis, write a detailed markdown document to:
`docs/wp_plugins/{plugin_name}/{review_filename}.md`

Where:
- `{plugin_name}` is derived from the context or file structure
- `{review_filename}` is the base name of the reviewed file

The output document should be well-structured, actionable, and ready for implementation.
