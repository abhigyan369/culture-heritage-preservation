# Heritage Preservation API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Heritage Sites Endpoints

### 1. Get All Heritage Sites
**GET** `/heritage`

Get all active heritage sites (public view).

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by category
- `city` (string, optional): Filter by city
- `state` (string, optional): Filter by state
- `showPending` (boolean, optional): Show user's own pending sites (requires auth)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 150,
  "page": 1,
  "pages": 15,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Taj Mahal",
      "description": "Monument of eternal love...",
      "category": "monument",
      "location": {
        "address": "Dharmapuri, Forest Colony, Tajganj",
        "city": "Agra",
        "state": "Uttar Pradesh",
        "country": "India",
        "coordinates": {
          "latitude": 27.1751,
          "longitude": 78.0421
        }
      },
      "images": [
        {
          "url": "https://res.cloudinary.com/...",
          "caption": "Front view",
          "isPrimary": true
        }
      ],
      "ratings": {
        "average": 4.8,
        "count": 1250
      },
      "status": "active",
      "verified": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Heritage Site
**GET** `/heritage/:id`

Get detailed information about a specific heritage site.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Taj Mahal",
    "description": "Monument of eternal love...",
    "category": "monument",
    "location": { /* ... */ },
    "history": {
      "established": "1632-1653",
      "historicalSignificance": "Built by Mughal Emperor Shah Jahan...",
      "architecture": "Mughal architecture with Persian influences",
      "culturalImportance": "Symbol of love and architectural marvel"
    },
    "visitorInfo": {
      "visitingHours": {
        "opening": "6:00 AM",
        "closing": "7:00 PM",
        "closedDays": ["Friday"]
      },
      "entryFee": {
        "adults": 50,
        "children": 0,
        "foreigners": 1100,
        "currency": "INR"
      },
      "bestTimeToVisit": "October to March",
      "estimatedDuration": "2-3 hours",
      "facilities": ["Parking", "Restrooms", "Guide Service"]
    },
    "reviews": [
      {
        "user": {
          "_id": "...",
          "name": "John Doe"
        },
        "rating": 5,
        "comment": "Absolutely breathtaking!",
        "visitDate": "2024-01-10T00:00:00.000Z",
        "createdAt": "2024-01-12T10:30:00.000Z"
      }
    ],
    "status": "active",
    "verified": true
  }
}
```

---

### 3. Create Heritage Site
**POST** `/heritage`

Create a new heritage site (requires authentication). Site will be created with `status: 'pending'`.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
name: "Red Fort"
description: "Historic fort in Delhi..."
category: "fort"
location[address]: "Netaji Subhash Marg, Lal Qila"
location[city]: "Delhi"
location[state]: "Delhi"
location[country]: "India"
location[coordinates][latitude]: 28.6562
location[coordinates][longitude]: 77.2410
history[established]: "1639-1648"
history[historicalSignificance]: "Built by Mughal Emperor Shah Jahan..."
history[architecture]: "Mughal architecture"
history[culturalImportance]: "Symbol of India's independence"
visitorInfo[visitingHours][opening]: "9:30 AM"
visitorInfo[visitingHours][closing]: "4:30 PM"
visitorInfo[entryFee][adults]: 35
visitorInfo[entryFee][foreigners]: 500
images: [File, File, File] // Up to 5 images
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Red Fort",
    "status": "pending",
    "verified": false,
    "contributedBy": "64f1a2b3c4d5e6f7g8h9i0j1",
    /* ... */
  }
}
```

---

### 4. Update Heritage Site
**PUT** `/heritage/:id`

Update a heritage site (requires authentication). Only the contributor or admin can update.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "description": "Updated description...",
  "visitorInfo": {
    "visitingHours": {
      "opening": "9:00 AM",
      "closing": "5:00 PM"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Updated site */ }
}
```

---

### 5. Verify Heritage Site (Admin Only)
**PATCH** `/heritage/:id/verify`

Verify a pending heritage site and set status to 'active'.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Red Fort",
    "status": "active",
    "verified": true,
    "verifiedBy": "64f1a2b3c4d5e6f7g8h9i0j1",
    "verifiedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 6. Reject Heritage Site (Admin Only)
**PATCH** `/heritage/:id/reject`

Reject a pending heritage site and set status to 'rejected'.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Red Fort",
    "status": "rejected",
    "verified": false
  }
}
```

---

### 7. Delete Heritage Site (Admin Only)
**DELETE** `/heritage/:id`

Delete a heritage site and its associated images from Cloudinary.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

### 8. Get Heritage Statistics
**GET** `/heritage/stats`

Get statistics about heritage sites (public).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVerified": 150,
    "totalContributors": 45,
    "categoryBreakdown": [
      { "category": "temple", "count": 50 },
      { "category": "fort", "count": 30 },
      { "category": "monument", "count": 25 },
      { "category": "palace", "count": 20 },
      { "category": "museum", "count": 15 },
      { "category": "lake", "count": 10 }
    ]
  }
}
```

---

### 9. Get Nearby Heritage Sites
**GET** `/heritage/nearby`

Get heritage sites near a specific location (public).

**Query Parameters:**
- `lat` (number, required): Latitude
- `lng` (number, required): Longitude
- `maxDistance` (number, optional): Maximum distance in meters (default: 50000)

**Example:**
```
GET /heritage/nearby?lat=28.6139&lng=77.2090&maxDistance=50000
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "...",
      "name": "Red Fort",
      "location": { /* ... */ },
      "distance": 2500 // meters
    }
  ]
}
```

---

### 10. Search by Map Bounds
**GET** `/heritage/search-bounds`

Search heritage sites within map bounds (public).

**Query Parameters:**
- `southWestLng` (number, required): Southwest longitude
- `southWestLat` (number, required): Southwest latitude
- `northEastLng` (number, required): Northeast longitude
- `northEastLat` (number, required): Northeast latitude

**Example:**
```
GET /heritage/search-bounds?southWestLng=77.0&southWestLat=28.0&northEastLng=78.0&northEastLat=29.0
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [ /* Heritage sites within bounds */ ]
}
```

---

### 11. External Search (Google Places API)
**GET** `/heritage/external-search`

Search heritage sites with Google Places API fallback (public).

**Query Parameters:**
- `q` (string, required): Search query

**Example:**
```
GET /heritage/external-search?q=Taj Mahal
```

**Response (Database Results):**
```json
{
  "success": true,
  "source": "database",
  "count": 1,
  "data": [ /* Sites from database */ ]
}
```

**Response (Google Places Results):**
```json
{
  "success": true,
  "source": "external",
  "count": 5,
  "message": "Results from Google Places API. These sites are not yet in our database.",
  "data": [
    {
      "name": "Taj Mahal",
      "description": "Dharmapuri, Forest Colony, Tajganj, Agra",
      "category": "other",
      "location": {
        "address": "Dharmapuri, Forest Colony, Tajganj, Agra",
        "coordinates": {
          "latitude": 27.1751,
          "longitude": 78.0421
        }
      },
      "images": [
        {
          "url": "https://maps.googleapis.com/maps/api/place/photo?...",
          "caption": "Taj Mahal"
        }
      ],
      "ratings": {
        "average": 4.7,
        "count": 125000
      },
      "status": "external",
      "isExternal": true,
      "tags": ["tourist_attraction", "point_of_interest"]
    }
  ]
}
```

---

### 12. Add Review
**POST** `/heritage/:id/reviews`

Add a review to a heritage site (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Absolutely breathtaking! A must-visit.",
  "visitDate": "2024-01-10",
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Updated site with new review */ }
}
```

---

## Explore Endpoints

### 1. Search Heritage Sites
**GET** `/explore/search`

Search heritage sites with filters.

**Query Parameters:**
- `q` (string, optional): Search query
- `category` (string, optional): Category filter
- `city` (string, optional): City filter
- `state` (string, optional): State filter
- `minRating` (number, optional): Minimum rating
- `lat` (number, optional): User latitude for distance calculation
- `lng` (number, optional): User longitude for distance calculation
- `maxDistance` (number, optional): Maximum distance in km

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [ /* Matching heritage sites */ ]
}
```

---

### 2. Get Recommendations
**GET** `/explore/recommendations`

Get personalized recommendations based on user preferences.

**Query Parameters:**
- `category` (string, optional): Preferred category
- `lat` (number, optional): User latitude
- `lng` (number, optional): User longitude

**Response:**
```json
{
  "success": true,
  "data": [ /* Recommended sites */ ]
}
```

---

### 3. Get Top Destinations
**GET** `/explore/top-destinations`

Get top-rated heritage sites.

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ /* Top-rated sites */ ]
}
```

---

### 4. Get Categories
**GET** `/explore/categories`

Get all available heritage site categories.

**Response:**
```json
{
  "success": true,
  "data": [
    { "value": "temple", "label": "Temples", "icon": "🛕", "count": 50 },
    { "value": "fort", "label": "Forts", "icon": "🏰", "count": 30 },
    { "value": "monument", "label": "Monuments", "icon": "🗿", "count": 25 }
  ]
}
```

---

## Authentication Endpoints

### 1. Register
**POST** `/auth/register`

Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

Login with email and password.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Get Profile
**GET** `/auth/profile`

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Donation Endpoints

### 1. Create Payment Intent
**POST** `/donations/create-payment-intent`

Create a Stripe payment intent for donation.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 5000,
  "currency": "inr",
  "heritageSite": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx"
}
```

---

### 2. Process Donation
**POST** `/donations`

Record a completed donation.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 5000,
  "currency": "INR",
  "heritageSite": "64f1a2b3c4d5e6f7g8h9i0j1",
  "paymentIntentId": "pi_xxx",
  "message": "Happy to contribute!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "amount": 5000,
    "currency": "INR",
    "status": "completed"
  }
}
```

---

### 3. Get My Donations
**GET** `/donations/my-donations`

Get current user's donation history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [ /* User's donations */ ]
}
```

---

### 4. Get Donation Statistics
**GET** `/donations/stats`

Get donation statistics (public).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 1500000,
    "totalDonors": 350,
    "averageDonation": 4285.71,
    "topHeritageSites": [
      {
        "site": { "_id": "...", "name": "Taj Mahal" },
        "totalAmount": 250000,
        "donorCount": 75
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Site name is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Heritage site not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 200 requests per 15 minutes per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345678
```

---

## Status Codes

- `200 OK`: Successful GET, PUT, PATCH request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

**Last Updated:** January 2024
