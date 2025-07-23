KPR Traditional Concept Section 2 - Implementation Requirements
Project Context

Shopify theme development với Horizon base theme
Building homepage với hero banner + 3 concept sections (Traditional, Hybrid, Modern)
Currently working on Traditional concept's Section 2 (Vertical Product Showcase)
Using custom namespace kpr with standard visibility controls template

Current Codebase Structure
sections/kpr-traditional-concept.liquid (main section file)
assets/kpr-traditional.css
assets/kpr-traditional.js  
assets/kpr-concept-navigation.js (handles concept switching)
Section 2 Requirements
Layout Structure

Container: 200vh min-height (accommodate tall pool cue images)
Grid: 5 columns with ratios 2.6fr 1.2fr 2fr 1.2fr 3fr
Columns: Reviews | Navigation | Product | Thumbnails | Features

Content Requirements
1. Product Column (Center - 2fr)

Display vertical pool cue images/videos from metafield kpr.vertical_image
Support both images and videos (file_reference type)
Aspect ratio approximately 1:10 to 1:13 (pool cue proportions)
Product title and price below image

2. Reviews Column (Left - 2.6fr)

Display customer reviews from metafield kpr.reviews_json
JSON structure: [{rating, text, author, verified}, ...]
Fallback to demo review if no metafield data
Styling: star ratings, quoted text, author attribution

3. Features Column (Right - 3fr)

Display product features from metafield kpr.features_json
JSON structure: [{category, items: [...]}, ...]
Fallback to demo features if no metafield
Styling: categorized lists with checkmarks

4. Thumbnails Column (1.2fr)

Display product thumbnails for navigation
Click thumbnail → switch to that product's slide
Active state highlighting
Product titles (truncated)

5. Navigation Column (1.2fr)

Additional navigation controls (TBD)
Placeholder for now

Technical Implementation
Approach: Swiper.js Slider

Each slide contains complete product data (all 5 columns)
Swiper handles transitions and state management
Custom thumbnail navigation overrides default controls
Collection: Use section.settings.section2_collection

Data Sources
Metafields (namespace: kpr):
- vertical_image (file_reference) - Product vertical image/video
- reviews_json (json) - Customer reviews array
- features_json (json) - Product features array
Fallback Strategy

No metafield → Use demo/placeholder content
No vertical_image → Use product.featured_image
Missing JSON → Display default content

Development Steps
Step 1: HTML Structure

Update Section 2 in kpr-traditional-concept.liquid
Create Swiper container with slides
Loop through collection products (limit: 6)
Build 5-column grid per slide
Add collection picker in schema

Step 2: CSS Styling

Update kpr-traditional.css
Grid layout: 2.6fr 1.2fr 2fr 1.2fr 3fr
Vertical image/video styling
Reviews and features content styling
Thumbnail navigation styling
Active states and hover effects

Step 3: JavaScript Functionality

Update kpr-traditional.js
Initialize Swiper with custom settings
Bind thumbnail click events
Parse metafield JSON data
Handle image/video detection
Sync thumbnail active states

Step 4: Schema Settings

Add Section 2 settings group
Collection picker for featured products
Optional: customization settings

Expected File Changes
sections/kpr-traditional-concept.liquid (major update)
assets/kpr-traditional.css (add Section 2 styles)
assets/kpr-traditional.js (add Swiper initialization)
Testing Requirements

Test with products that have metafields
Test with products without metafields (fallbacks)
Test thumbnail navigation functionality
Test responsive behavior
Verify Swiper transitions work smoothly

Performance Considerations

Lazy load product images
Limit collection products to reasonable number
Optimize video file sizes
Smooth transitions without janky animations

Integration Notes

Must work with existing navigation system
Maintain visibility controls pattern
Follow existing CSS naming conventions
Ensure mobile responsiveness

This implementation should create a sophisticated product showcase that allows users to browse through featured pool cues with synchronized reviews, features, and smooth navigation.