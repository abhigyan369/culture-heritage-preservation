# Culture & Heritage Preservation Web Application

A comprehensive web application for preserving and showcasing cultural heritage sites with digital storage, search capabilities, and donation features.

## Features

- **Home Page**: Overview of the platform and its mission
- **About Us**: Detailed information about the project
- **Care the Culture**: Browse and upload cultural heritage information
- **Donate**: Support heritage preservation through donations
- **Explore**: Search places, get recommendations, view maps and detailed information

## Technology Stack

### Frontend
- React.js
- HTML5, CSS3, JavaScript
- TailwindCSS for styling
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

### Additional Services
- Twilio for notifications
- Stripe for payment processing
- Google Maps API for location services
- Cloudinary for image storage

## Project Structure

```
culture-heritage-preservation/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/culture_heritage
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the frontend development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Heritage Sites
- `GET /api/heritage` - Get all heritage sites
- `GET /api/heritage/:id` - Get specific heritage site
- `POST /api/heritage` - Add new heritage site
- `PUT /api/heritage/:id` - Update heritage site
- `DELETE /api/heritage/:id` - Delete heritage site

### Donations
- `POST /api/donations/create-payment-intent` - Create payment intent
- `POST /api/donations` - Record donation

### Search & Explore
- `GET /api/explore/search` - Search heritage sites
- `GET /api/explore/recommendations` - Get recommended sites
- `GET /api/explore/nearby` - Get nearby sites

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Secure file uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
