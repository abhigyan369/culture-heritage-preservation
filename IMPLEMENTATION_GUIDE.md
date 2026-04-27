# Implementation Guide - Royal Theme & Secure Workflow

## 🚀 Quick Start

### 1. Environment Setup

Update your `.env` files with the required API keys:

**Backend (`backend/.env`):**
```env
# Google Maps API (for external search fallback)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Existing variables...
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

Both frontend and backend dependencies are already in `package.json`. If needed:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🎨 Royal Theme Features

### Color Palette
- **Primary (Royal Crimson)**: `#991b1b` - Use `text-primary-800`, `bg-primary-600`
- **Accent (Antique Gold)**: `#b45309` - Use `text-accent-600`, `border-accent-500`
- **Secondary (Creamy Ivory)**: `#fff9f0` - Use `bg-secondary-50`

### Typography Classes
- **Headings**: `font-display` (Playfair Display)
- **Body Text**: `font-serif` (Lora)
- **UI Elements**: `font-sans` (Inter)

### Button Classes
```jsx
// Royal button with gold border
<button className="btn-royal">Submit</button>

// Primary gradient button
<button className="btn-primary">Explore</button>

// Outline button
<button className="btn-outline">Learn More</button>
```

### Card Styling
```jsx
<div className="bg-secondary-50 border border-accent-500/20 rounded-xl shadow-lg">
  {/* Card content */}
</div>
```

## 🔒 Secure Contribution Workflow

### User Flow

1. **User Submits Heritage Site**:
   - Navigate to "Care for Our Culture" page
   - Click "Contribute Heritage Site"
   - Fill out the form with site details
   - Upload up to 5 images
   - Submit → Site status: `pending`

2. **Admin Reviews Submission**:
   - Admin logs in with admin role
   - Views pending submissions
   - Verifies or rejects the site

3. **Public Viewing**:
   - Only sites with `status: 'active'` are visible to public
   - Verified badge shown on active sites

### API Endpoints

#### Public Endpoints
```javascript
GET /api/heritage              // Get all active heritage sites
GET /api/heritage/:id          // Get single heritage site
GET /api/heritage/stats        // Get statistics
GET /api/heritage/nearby       // Get nearby sites
GET /api/heritage/external-search  // Search with Google Places fallback
```

#### Protected Endpoints (Requires Authentication)
```javascript
POST /api/heritage             // Create new heritage site (status: pending)
PUT /api/heritage/:id          // Update heritage site
POST /api/heritage/:id/reviews // Add review
```

#### Admin-Only Endpoints
```javascript
PATCH /api/heritage/:id/verify  // Verify site (set status: active)
PATCH /api/heritage/:id/reject  // Reject site (set status: rejected)
DELETE /api/heritage/:id        // Delete heritage site
```

### Frontend API Usage

```javascript
import { heritage } from '../services/api';

// Create heritage site with images
const formData = new FormData();
formData.append('name', 'Taj Mahal');
formData.append('description', 'Monument of love');
// ... add other fields
formData.append('images', imageFile1);
formData.append('images', imageFile2);

await heritage.createWithImages(formData);

// Verify site (admin only)
await heritage.verify(siteId);

// Reject site (admin only)
await heritage.reject(siteId);

// Get statistics
const stats = await heritage.getStats();
```

## 📊 Dynamic Statistics

The stats endpoint returns:
```json
{
  "success": true,
  "data": {
    "totalVerified": 150,
    "totalContributors": 45,
    "categoryBreakdown": [
      { "category": "temple", "count": 50 },
      { "category": "fort", "count": 30 },
      { "category": "monument", "count": 25 }
    ]
  }
}
```

Used in:
- Home page hero stats section
- About page impact section

## 🌍 Google Places API Integration

### How It Works

1. User searches for a heritage site
2. Backend first checks local database
3. If no results found, queries Google Places API
4. Returns formatted results with:
   - Site name and address
   - Coordinates
   - Photos from Google Places
   - Ratings
   - Marked as `isExternal: true`

### Example Usage

```javascript
// Frontend
const results = await heritage.externalSearch({ q: 'Red Fort Delhi' });

if (results.data.source === 'external') {
  // Show message: "Results from Google Places API"
  // Display results with option to add to database
}
```

## 🖼️ Image Upload with Cloudinary

### Frontend Implementation

```jsx
const [imageFiles, setImageFiles] = useState([]);
const [imagePreviews, setImagePreviews] = useState([]);

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length + imageFiles.length > 5) {
    toast.error('Maximum 5 images allowed');
    return;
  }
  const newPreviews = files.map(file => URL.createObjectURL(file));
  setImagePreviews(prev => [...prev, ...newPreviews]);
  setImageFiles(prev => [...prev, ...files]);
};

// In form submission
const formData = new FormData();
imageFiles.forEach((file) => {
  formData.append('images', file);
});
```

### Backend Configuration

Already configured in `backend/src/config/cloudinary.js`:
```javascript
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'heritage-sites',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });
```

## 🎯 Status Badges

### Implementation

```jsx
{site.status === 'active' && (
  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
    <ShieldCheckIcon className="w-3 h-3 mr-1" />
    Verified
  </span>
)}

{site.status === 'pending' && (
  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
    Pending Review
  </span>
)}

{site.status === 'rejected' && (
  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
    Rejected
  </span>
)}
```

## 🔐 Admin Setup

### Creating an Admin User

You'll need to manually set a user's role to 'admin' in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { role: 'admin' } }
)
```

Or update the User model to allow admin registration during development.

## 🧪 Testing the Implementation

### 1. Test Royal Theme
- ✅ Check all pages use Playfair Display for headings
- ✅ Verify Lora font for body text
- ✅ Confirm Royal Crimson (#991b1b) and Antique Gold (#b45309) colors
- ✅ Test `.btn-royal` button styling

### 2. Test Contribution Workflow
- ✅ Submit a new heritage site (should be pending)
- ✅ Verify it doesn't appear in public listings
- ✅ Admin verifies the site
- ✅ Confirm it now appears in public listings with "Verified" badge

### 3. Test Dynamic Stats
- ✅ Check Home page displays correct statistics
- ✅ Verify stats update when new sites are verified

### 4. Test Google Places Integration
- ✅ Search for a site not in database
- ✅ Verify Google Places results appear
- ✅ Check results show "external" source indicator

### 5. Test Image Upload
- ✅ Upload multiple images (up to 5)
- ✅ Verify preview thumbnails appear
- ✅ Test remove image functionality
- ✅ Confirm images are stored in Cloudinary

## 📱 Responsive Design

All components are responsive with Tailwind breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Responsive grid */}
</div>
```

## 🐛 Troubleshooting

### Images Not Uploading
- Check Cloudinary credentials in `.env`
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Google Places Not Working
- Ensure `GOOGLE_MAPS_API_KEY` is set in backend `.env`
- Enable Places API in Google Cloud Console
- Check API key restrictions

### Stats Not Showing
- Verify MongoDB connection
- Check that some sites have `status: 'active'`
- Inspect browser console for API errors

### Admin Routes Returning 403
- Confirm user has `role: 'admin'` in database
- Check JWT token is being sent in Authorization header
- Verify `protect` and `authorize` middleware are applied

## 🎉 Success Checklist

- ✅ Royal theme applied (Playfair Display, Lora, Royal Crimson, Antique Gold)
- ✅ All new heritage sites default to `pending` status
- ✅ Admin can verify/reject sites
- ✅ Public only sees `active` sites
- ✅ Dynamic stats endpoint working
- ✅ Google Places API fallback implemented
- ✅ Cloudinary image upload functional
- ✅ Status badges display correctly
- ✅ Responsive design on all devices

---

**Need Help?** Check the `REFACTORING_SUMMARY.md` for detailed implementation notes.
