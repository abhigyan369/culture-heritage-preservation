# Testing Checklist - Royal Theme & Secure Workflow

## 🎨 Visual Design Testing

### Royal Theme Colors
- [ ] **Primary Color (Royal Crimson #991b1b)** is used for:
  - [ ] Main headings
  - [ ] Primary buttons
  - [ ] Important UI elements
  - [ ] Hero section overlays

- [ ] **Accent Color (Antique Gold #b45309)** is used for:
  - [ ] Borders on cards
  - [ ] Decorative elements
  - [ ] Button borders on `.btn-royal`
  - [ ] Highlights and accents

- [ ] **Secondary Color (Creamy Ivory #fff9f0)** is used for:
  - [ ] Page backgrounds
  - [ ] Card backgrounds
  - [ ] Parchment-style containers

### Typography
- [ ] **Playfair Display** font loads correctly
- [ ] All headings (h1-h6) use Playfair Display
- [ ] Hero titles use `font-display` class
- [ ] **Lora** font loads correctly
- [ ] Body text uses Lora font
- [ ] Descriptions and paragraphs use `font-serif` class
- [ ] UI elements use Inter font (`font-sans`)

### Button Styles
- [ ] `.btn-royal` has Royal Crimson background
- [ ] `.btn-royal` has Antique Gold border
- [ ] `.btn-royal` uses Playfair Display font
- [ ] `.btn-primary` has gradient orange/red background
- [ ] `.btn-outline` has transparent background with accent border
- [ ] All buttons have hover effects

### Card Styling
- [ ] Cards use `bg-secondary-50` background
- [ ] Cards have `border-accent-500/20` border
- [ ] Cards have rounded corners and shadows
- [ ] Cards have hover effects (scale, shadow)

---

## 🏠 Home Page Testing

### Hero Section
- [ ] Hero title uses `font-display` class
- [ ] Hero title has text-shadow effect
- [ ] Hero overlay is deep maroon (rgba(153, 27, 27, 0.5))
- [ ] Hero overlay has 50% opacity
- [ ] Hero slider auto-rotates every 5 seconds
- [ ] Slider indicators work correctly

### Stats Section
- [ ] Stats are fetched from `/api/heritage/stats` endpoint
- [ ] Total verified sites count displays correctly
- [ ] Total contributors count displays correctly
- [ ] Category breakdown displays correctly
- [ ] Stats update when new sites are verified

### Featured Sites
- [ ] Only sites with `status: 'active'` are displayed
- [ ] "Verified" badge shows on active sites
- [ ] Badge uses ShieldCheckIcon
- [ ] Badge has green background
- [ ] Site cards use royal theme colors
- [ ] Cards have proper spacing and layout

---

## 🔍 Explore Page Testing

### Search Functionality
- [ ] Search bar works correctly
- [ ] Category filter works
- [ ] Advanced filters (city, state, rating) work
- [ ] Search results update in real-time

### View Modes
- [ ] Grid view displays correctly
- [ ] List view displays correctly
- [ ] Map view displays correctly
- [ ] View mode toggle buttons work
- [ ] Map markers show correct locations

### Site Cards
- [ ] Cards use `bg-secondary-50` background
- [ ] Cards have `border-accent-500/20` border
- [ ] "Verified" badge shows for `status: 'active'` sites
- [ ] "Pending Review" badge shows for `status: 'pending'` sites
- [ ] "Rejected" badge shows for `status: 'rejected'` sites
- [ ] Badges use correct colors (green, yellow, red)

### Map Features
- [ ] Map centers on search results
- [ ] "Search this area" button works
- [ ] Markers show site information in popup
- [ ] Map bounds search works correctly

---

## 🎭 Care The Culture Page Testing

### Contribution Form
- [ ] "Contribute Heritage Site" button opens modal
- [ ] Form has all required fields
- [ ] Form validation works correctly
- [ ] Required fields show error messages

### Image Upload
- [ ] File input opens on click
- [ ] Multiple images can be selected
- [ ] Maximum 5 images enforced
- [ ] Image previews display correctly
- [ ] Remove image button works
- [ ] Images upload to Cloudinary

### Form Submission
- [ ] Form submits successfully
- [ ] New site has `status: 'pending'`
- [ ] Success message displays
- [ ] Form resets after submission
- [ ] User must be logged in to submit

### Site Display
- [ ] All contributed sites display
- [ ] Status badges show correctly:
  - [ ] "Verified" (green) for active sites
  - [ ] "Pending Review" (yellow) for pending sites
  - [ ] "Rejected" (red) for rejected sites
- [ ] Cards use royal theme styling

---

## 📖 About Page Testing

### Mission Section
- [ ] Mission section uses parchment-style container
- [ ] Container has gold accents (border-accent-500)
- [ ] Container has proper padding and spacing
- [ ] Text is readable and well-formatted

### Team Section
- [ ] Team members display correctly
- [ ] No dummy data present
- [ ] Team member images load
- [ ] Team member bios are visible

### Stats Section
- [ ] Dynamic stats display correctly
- [ ] Stats match data from API
- [ ] Icons display correctly

---

## 🔒 Security & Authentication Testing

### User Registration
- [ ] User can register successfully
- [ ] JWT token is returned
- [ ] Token is stored in localStorage
- [ ] User is redirected after registration

### User Login
- [ ] User can login successfully
- [ ] JWT token is returned
- [ ] Token is stored in localStorage
- [ ] User is redirected after login

### Protected Routes
- [ ] Unauthenticated users cannot access protected routes
- [ ] Authenticated users can access protected routes
- [ ] Token is sent in Authorization header

### Admin Routes
- [ ] Only admin users can access admin routes
- [ ] Non-admin users get 403 Forbidden error
- [ ] Admin can verify sites
- [ ] Admin can reject sites
- [ ] Admin can delete sites

---

## 🛡️ Gatekeeper Workflow Testing

### Site Creation
- [ ] New site is created with `status: 'pending'`
- [ ] `verified` field is set to `false`
- [ ] `contributedBy` field is set to current user
- [ ] Site does NOT appear in public listings

### Site Verification (Admin)
- [ ] Admin can access verify endpoint
- [ ] Site status changes to 'active'
- [ ] `verified` field changes to `true`
- [ ] `verifiedBy` field is set to admin user
- [ ] `verifiedAt` timestamp is set
- [ ] Site now appears in public listings

### Site Rejection (Admin)
- [ ] Admin can access reject endpoint
- [ ] Site status changes to 'rejected'
- [ ] `verified` field changes to `false`
- [ ] Site does NOT appear in public listings

### Public Viewing
- [ ] Public users only see sites with `status: 'active'`
- [ ] Pending sites are hidden from public
- [ ] Rejected sites are hidden from public
- [ ] Users can see their own pending sites with `showPending=true`

---

## 🌍 Google Places API Testing

### External Search
- [ ] Search for site not in database
- [ ] Google Places API is queried
- [ ] Results are returned with `source: 'external'`
- [ ] Results include site name and address
- [ ] Results include coordinates
- [ ] Results include photos from Google Places
- [ ] Results include ratings
- [ ] Results are marked with `isExternal: true`

### Fallback Behavior
- [ ] If site exists in database, return database results
- [ ] If no results found, query Google Places API
- [ ] If Google API key not configured, return empty results with message
- [ ] Error handling works correctly

---

## 📊 Statistics Testing

### Heritage Stats Endpoint
- [ ] `/api/heritage/stats` returns correct data
- [ ] `totalVerified` count is accurate
- [ ] `totalContributors` count is accurate
- [ ] `categoryBreakdown` is correct
- [ ] Stats update when sites are verified

### Stats Display
- [ ] Home page displays stats correctly
- [ ] About page displays stats correctly
- [ ] Stats are formatted properly
- [ ] Icons display next to stats

---

## 🖼️ Image Upload Testing

### Cloudinary Integration
- [ ] Images upload to Cloudinary successfully
- [ ] Images are stored in 'heritage-sites' folder
- [ ] Image URLs are returned correctly
- [ ] Images display on site cards
- [ ] Images display on detail pages

### Image Preview
- [ ] Preview thumbnails display correctly
- [ ] Multiple images can be previewed
- [ ] Remove button works on each preview
- [ ] Preview updates when images are removed

### Image Validation
- [ ] Only allowed formats accepted (JPG, PNG, WebP)
- [ ] Maximum 5 images enforced
- [ ] Error message shows if limit exceeded
- [ ] File size limits are enforced

---

## 📱 Responsive Design Testing

### Mobile (< 640px)
- [ ] Navigation menu works on mobile
- [ ] Hero section displays correctly
- [ ] Cards stack vertically
- [ ] Forms are usable on mobile
- [ ] Buttons are tappable
- [ ] Text is readable

### Tablet (640px - 1024px)
- [ ] Grid layouts adjust correctly
- [ ] 2-column layouts work
- [ ] Navigation is accessible
- [ ] Images scale properly

### Desktop (> 1024px)
- [ ] Full grid layouts display
- [ ] 3-4 column layouts work
- [ ] Sidebar layouts work
- [ ] All features are accessible

---

## 🔧 API Testing

### Heritage Endpoints
- [ ] `GET /api/heritage` returns active sites
- [ ] `GET /api/heritage/:id` returns site details
- [ ] `POST /api/heritage` creates pending site
- [ ] `PUT /api/heritage/:id` updates site
- [ ] `PATCH /api/heritage/:id/verify` verifies site (admin)
- [ ] `PATCH /api/heritage/:id/reject` rejects site (admin)
- [ ] `DELETE /api/heritage/:id` deletes site (admin)
- [ ] `GET /api/heritage/stats` returns statistics
- [ ] `GET /api/heritage/nearby` returns nearby sites
- [ ] `GET /api/heritage/search-bounds` returns sites in bounds
- [ ] `GET /api/heritage/external-search` searches Google Places

### Error Handling
- [ ] 400 errors return validation messages
- [ ] 401 errors return authentication errors
- [ ] 403 errors return authorization errors
- [ ] 404 errors return not found messages
- [ ] 500 errors are handled gracefully

---

## 🚀 Performance Testing

### Page Load Times
- [ ] Home page loads in < 3 seconds
- [ ] Explore page loads in < 3 seconds
- [ ] Site detail page loads in < 2 seconds
- [ ] Images load progressively

### API Response Times
- [ ] Heritage list endpoint responds in < 500ms
- [ ] Stats endpoint responds in < 300ms
- [ ] Search endpoint responds in < 1 second
- [ ] Image upload completes in < 5 seconds

### Optimization
- [ ] Images are optimized (Cloudinary)
- [ ] Lazy loading works for images
- [ ] API responses are cached (React Query)
- [ ] Unnecessary re-renders are prevented

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key closes modals

### Screen Reader
- [ ] Images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form fields have labels
- [ ] Error messages are announced

### Color Contrast
- [ ] Text has sufficient contrast
- [ ] Links are distinguishable
- [ ] Buttons are clearly visible
- [ ] Status badges are readable

---

## 🐛 Error Handling Testing

### Network Errors
- [ ] API errors display user-friendly messages
- [ ] Loading states show during requests
- [ ] Retry mechanisms work
- [ ] Offline state is handled

### Form Errors
- [ ] Validation errors display correctly
- [ ] Required fields are marked
- [ ] Error messages are clear
- [ ] Form submission errors are handled

### Authentication Errors
- [ ] Expired tokens redirect to login
- [ ] Invalid credentials show error
- [ ] Registration errors are displayed
- [ ] Password reset works

---

## ✅ Final Checklist

### Before Deployment
- [ ] All environment variables are set
- [ ] Google Maps API key is configured
- [ ] Cloudinary credentials are configured
- [ ] MongoDB connection is working
- [ ] JWT secret is secure
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Build completes successfully

### Post-Deployment
- [ ] Production API is accessible
- [ ] Frontend connects to production API
- [ ] Images upload to production Cloudinary
- [ ] Google Places API works in production
- [ ] Admin functions work
- [ ] User registration works
- [ ] User login works
- [ ] Site contribution works
- [ ] Site verification works

---

## 📝 Test Results

### Date: _______________
### Tester: _______________

**Overall Status:** [ ] Pass [ ] Fail

**Notes:**
_______________________________________
_______________________________________
_______________________________________

**Issues Found:**
1. _______________________________________
2. _______________________________________
3. _______________________________________

**Recommendations:**
1. _______________________________________
2. _______________________________________
3. _______________________________________

---

**Testing Complete!** 🎉
