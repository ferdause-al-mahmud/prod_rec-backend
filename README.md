# ProdRec Backend Server

A comprehensive Node.js backend API for a community-driven product recommendation platform. This server handles user authentication, product queries, recommendations, and AI-powered chatbot assistance using Google's Generative AI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Getting Started Guide](#getting-started-guide)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)

---

## 🎯 Overview

ProdRec Backend is a RESTful API server that powers a social platform where users can:
- Post product queries seeking recommendations
- Provide recommendations to other users' queries
- Track their recommendation history
- Interact with an AI chatbot for personalized assistance

The platform uses JWT-based authentication, MongoDB for data persistence, and Google's Generative AI (Gemini) for intelligent chatbot responses.

---

## ✨ Features

### Core Features

#### 1. **User Management**
   - User registration and profile creation
   - Email-based user identification
   - User data persistence (name, photo, statistics)
   - JWT-based authentication
   - Secure login/logout functionality

#### 2. **Product Queries**
   - Create product queries with detailed information
   - Search queries by product name (case-insensitive)
   - Retrieve queries with sorting by date
   - Update existing queries
   - Delete queries
   - Track recommendation count for each query

#### 3. **Recommendations**
   - Post recommendations for specific queries
   - View all recommendations or recommendations for a specific query
   - Retrieve user-specific recommendations
   - Delete recommendations
   - Track recommendation statistics

#### 4. **AI-Powered Chatbot**
   - Context-aware recommendations using user history
   - Personalized responses based on user's queries and recommendations
   - Platform guidance and feature explanations
   - Conversational and friendly interactions

#### 5. **Security**
   - JWT token-based authentication
   - HTTP-only cookies for token storage
   - CORS configuration for frontend integration
   - Email verification for authorization
   - Protected routes with token verification

---

## 🏗️ Architecture

### System Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend)                        │
│                   (React/Vue Application)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  PRODREC BACKEND SERVER                      │
│                    (Express.js)                              │
├─────────────────────────────────────────────────────────────┤
│                    API ROUTES                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authentication     CORS      Cookie Parser           │  │
│  │ Middleware         Config     Middleware             │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │ │ Auth Routes  │  │ Query Routes │  │ Rec Routes │ │  │
│  │ ├──────────────┤  ├──────────────┤  ├────────────┤ │  │
│  │ │ /jwt         │  │ /queries     │  │ /recom...  │ │  │
│  │ │ /logout      │  │ /query/:id   │  │ /recom/:id │ │  │
│  │ │ /save-user   │  │ /queries-    │  │ /recom/    │ │  │
│  │ │ /user/:email │  │  limit       │  │ user/:email│ │  │
│  │ └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐   │  │
│  │ │      Chatbot Routes (/api/chatbot)           │   │  │
│  │ │  - Context-aware responses                   │   │  │
│  │ │  - User history integration                  │   │  │
│  │ │  - Google Generative AI integration          │   │  │
│  │ └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    AUTHENTICATION                            │
│             (JWT - JSON Web Tokens)                          │
├─────────────────────────────────────────────────────────────┤
│                      SERVICES                                │
│  ┌──────────────────────┐   ┌──────────────────────────┐   │
│  │ Google Generative AI │   │  MongoDB Driver          │   │
│  │ (Gemini 3 Flash)     │   │  (Database Operations)   │   │
│  └──────────────────────┘   └──────────────────────────┘   │
└────────┬──────────────────────────────┬────────────────────┘
         │                              │
         ▼                              ▼
   ┌──────────────┐            ┌──────────────────┐
   │ Google Cloud │            │    MongoDB       │
   │ Generative   │            │    Database      │
   │ AI API       │            │                  │
   └──────────────┘            └──────────────────┘
\`\`\`

### Data Flow Diagram

\`\`\`
User Login
   │
   ├─► Verify Email
   │
   ├─► Generate JWT Token
   │
   └─► Set HTTP-Only Cookie

Post Query
   │
   ├─► Verify JWT Token
   │
   ├─► Create Query Document
   │
   └─► Store in MongoDB

Post Recommendation
   │
   ├─► Verify JWT Token
   │
   ├─► Create Recommendation Document
   │
   ├─► Link to Query ID
   │
   ├─► Increment Query Recommendation Count
   │
   └─► Store in MongoDB

Chatbot Request
   │
   ├─► Verify JWT Token
   │
   ├─► Fetch User Context (Queries & Recommendations)
   │
   ├─► Build System Prompt with User History
   │
   ├─► Send to Google Generative AI
   │
   └─► Return AI Response to Client
\`\`\`

---

## 💻 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | - |
| **Framework** | Express.js | 4.21.2 |
| **Database** | MongoDB | 6.12.0 |
| **Authentication** | JWT | 9.0.2 |
| **AI** | Google GenAI | 1.38.0 |
| **HTTP Client** | Axios | 1.13.3 |
| **Environment** | dotenv | 16.4.7 |
| **CORS** | cors | 2.8.5 |
| **Cookie Handling** | cookie-parser | 1.4.7 |

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Cloud API Key for Generative AI
- npm or yarn package manager

### Step-by-Step Installation

\`\`\`bash
# 1. Clone the repository
git clone <repository-url>
cd prod_rec-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure environment variables (see next section)

# 5. Start the server
npm start

# For development with hot reload
npm run dev
\`\`\`

---

## 🔐 Environment Configuration

Create a \`.env\` file in the root directory with the following variables:

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ProdRec?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_keep_it_very_secure

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
\`\`\`

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| \`PORT\` | Server port | \`3000\` |
| \`NODE_ENV\` | Environment (development/production) | \`development\` |
| \`MONGO_URI\` | MongoDB connection string | \`mongodb://localhost:27017\` |
| \`JWT_SECRET\` | Secret key for JWT signing | \`your-secret-key\` |
| \`GOOGLE_API_KEY\` | API key for Google Generative AI | \`AIza...\` |
| \`FRONTEND_URL\` | Frontend origin for CORS | \`http://localhost:5173\` |

---

## 📚 API Documentation

### Authentication Endpoints

#### 1. **Generate JWT Token**
\`\`\`http
POST /jwt
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "photo": "https://example.com/photo.jpg"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

**Description:** Generates a JWT token and sets it as an HTTP-only cookie valid for 5 hours.

---

#### 2. **Logout**
\`\`\`http
POST /logout
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

**Description:** Clears the JWT token cookie. Requires valid authentication.

---

### User Management Endpoints

#### 3. **Save/Register User**
\`\`\`http
POST /save-user
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "photo": "https://example.com/photo.jpg"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "User saved successfully",
  "isNewUser": true,
  "user": {
    "_id": "ObjectId",
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "https://example.com/photo.jpg",
    "createdAt": "2024-02-10T00:00:00Z",
    "updatedAt": "2024-02-10T00:00:00Z",
    "totalQueries": 0,
    "totalRecommendations": 0
  }
}
\`\`\`

**Description:** Creates a new user or returns existing user data.

---

#### 4. **Get User Data**
\`\`\`http
GET /user/user@example.com
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "_id": "ObjectId",
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "https://example.com/photo.jpg",
    "createdAt": "2024-02-10T00:00:00Z",
    "updatedAt": "2024-02-10T00:00:00Z",
    "totalQueries": 5,
    "totalRecommendations": 12
  }
}
\`\`\`

**Description:** Retrieves user information by email.

---

### Query Management Endpoints

#### 5. **Create Query**
\`\`\`http
POST /queries
Content-Type: application/json

{
  "product_name": "Laptop",
  "query_title": "Affordable laptop for programming",
  "category": "Electronics",
  "product_brand": "Dell",
  "product_photo": "https://example.com/image.jpg",
  "boycotting_reason": "Product quality concern",
  "posted_by": {
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "https://example.com/photo.jpg",
    "posted_date": "2024-02-10T10:30:00Z",
    "recommendationCount": 0
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "acknowledged": true,
  "insertedId": "ObjectId"
}
\`\`\`

---

#### 6. **Get All Queries**
\`\`\`http
GET /queries
GET /queries?search=laptop
\`\`\`

**Response:**
\`\`\`json
[
  {
    "_id": "ObjectId",
    "product_name": "Laptop",
    "query_title": "Affordable laptop for programming",
    "category": "Electronics",
    "product_brand": "Dell",
    "product_photo": "https://example.com/image.jpg",
    "posted_by": {
      "email": "user@example.com",
      "name": "John Doe",
      "recommendationCount": 3
    }
  }
]
\`\`\`

**Description:** Retrieves all queries. Supports optional case-insensitive search by product name.

---

#### 7. **Get Limited Queries**
\`\`\`http
GET /queries-limit?limit=6
\`\`\`

**Response:** Same as Get All Queries but limited to specified count.

---

#### 8. **Get Sorted Queries**
\`\`\`http
GET /queries/sort
\`\`\`

**Response:** All queries sorted by posted_date in descending order.

---

#### 9. **Get Query by ID**
\`\`\`http
GET /query/{queryId}
\`\`\`

**Response:** Single query document with all details.

---

#### 10. **Get User's Queries**
\`\`\`http
GET /queries/{email}
Authorization: Bearer {token}
\`\`\`

**Response:** All queries posted by the authenticated user.

**Note:** Requires JWT authentication. User can only view their own queries.

---

#### 11. **Update Query**
\`\`\`http
PUT /query/{queryId}
Content-Type: application/json

{
  "query_title": "Updated title",
  "product_name": "Updated product",
  "category": "New category",
  "product_brand": "New brand",
  "product_photo": "https://example.com/new-image.jpg",
  "boycotting_reason": "Updated reason"
}
\`\`\`

**Response:**
\`\`\`json
{
  "acknowledged": true,
  "modifiedCount": 1
}
\`\`\`

---

#### 12. **Delete Query**
\`\`\`http
DELETE /queries/{queryId}
\`\`\`

**Response:**
\`\`\`json
{
  "acknowledged": true,
  "deletedCount": 1
}
\`\`\`

---

### Recommendation Endpoints

#### 13. **Create Recommendation**
\`\`\`http
POST /recommendations
Content-Type: application/json

{
  "recommendation_product_name": "Dell XPS 13",
  "recommendation_title": "Great laptop for programming",
  "recommendation_reason": "Excellent performance and portability",
  "recommendation_photo": "https://example.com/dell-xps.jpg",
  "queryInfo": {
    "query_id": "ObjectId",
    "product_name": "Laptop"
  },
  "recommended_by": {
    "email": "recommender@example.com",
    "name": "Jane Smith",
    "photo": "https://example.com/jane.jpg",
    "posted_date": "2024-02-10T11:30:00Z"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "acknowledged": true,
  "insertedId": "ObjectId"
}
\`\`\`

---

#### 14. **Get All Recommendations**
\`\`\`http
GET /recommendations
\`\`\`

**Response:** Array of all recommendations.

---

#### 15. **Get Recommendations for Query**
\`\`\`http
GET /recommendations/{queryId}
\`\`\`

**Response:** All recommendations for a specific query, sorted by date (newest first).

---

#### 16. **Get User's Recommendations**
\`\`\`http
GET /recommendations/user/{email}
Authorization: Bearer {token}
\`\`\`

**Response:** All recommendations given by the authenticated user.

**Note:** Token and email must match.

---

#### 17. **Delete Recommendation**
\`\`\`http
DELETE /recommendations/{recommendationId}
\`\`\`

**Response:**
\`\`\`json
{
  "acknowledged": true,
  "deletedCount": 1
}
\`\`\`

---

#### 18. **Update Recommendation Count**
\`\`\`http
PUT /update-recommendation-count/{queryId}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Recommendation count updated successfully"
}
\`\`\`

**Description:** Increments recommendation count for a query by 1.

---

#### 19. **Decrease Recommendation Count**
\`\`\`http
PUT /decrease-recommendationCount/{queryId}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Recommendation count updated successfully"
}
\`\`\`

**Description:** Decrements recommendation count for a query by 1.

---

#### 20. **Get Recommendations For User's Queries**
\`\`\`http
GET /recommendations-for-me/{email}
Authorization: Bearer {token}
\`\`\`

**Response:** All recommendations received on user's own queries from other users.

**Note:** Excludes recommendations from the user themselves.

---

### Chatbot Endpoints

#### 21. **Chat with AI Assistant**
\`\`\`http
POST /api/chatbot/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What laptop would you recommend for programming?"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "reply": "Based on your history and preferences, I recommend..."
}
\`\`\`

**Description:** AI-powered chatbot providing personalized recommendations.

**Features:**
- Context-aware responses based on user's query history
- Personalized recommendations from user's profile
- Platform guidance and feature explanations
- Conversational and friendly interactions

---

## 🗄️ Database Schema

### Collections Overview

\`\`\`
ProdRec Database
├── users
│   ├── _id (ObjectId)
│   ├── email (String) - Primary identifier
│   ├── name (String)
│   ├── photo (String) - URL
│   ├── createdAt (Date)
│   ├── updatedAt (Date)
│   ├── totalQueries (Number)
│   └── totalRecommendations (Number)
│
├── queries
│   ├── _id (ObjectId)
│   ├── product_name (String)
│   ├── query_title (String)
│   ├── category (String)
│   ├── product_brand (String)
│   ├── product_photo (String) - URL
│   ├── boycotting_reason (String)
│   └── posted_by
│       ├── email (String)
│       ├── name (String)
│       ├── photo (String)
│       ├── posted_date (Date)
│       └── recommendationCount (Number)
│
└── recommendations
    ├── _id (ObjectId)
    ├── recommendation_product_name (String)
    ├── recommendation_title (String)
    ├── recommendation_reason (String)
    ├── recommendation_photo (String) - URL
    ├── queryInfo
    │   ├── query_id (String) - Reference to queries._id
    │   └── product_name (String)
    └── recommended_by
        ├── email (String)
        ├── name (String)
        ├── photo (String)
        └── posted_date (Date)
\`\`\`

### Document Examples

**User Document:**
\`\`\`javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john@example.com",
  "name": "John Doe",
  "photo": "https://example.com/john.jpg",
  "createdAt": ISODate("2024-02-01T10:00:00Z"),
  "updatedAt": ISODate("2024-02-10T10:00:00Z"),
  "totalQueries": 5,
  "totalRecommendations": 12
}
\`\`\`

**Query Document:**
\`\`\`javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "product_name": "Laptop",
  "query_title": "Affordable laptop for programming",
  "category": "Electronics",
  "product_brand": "Dell",
  "product_photo": "https://example.com/dell.jpg",
  "boycotting_reason": "Concerned about sustainability",
  "posted_by": {
    "email": "john@example.com",
    "name": "John Doe",
    "photo": "https://example.com/john.jpg",
    "posted_date": ISODate("2024-02-10T10:30:00Z"),
    "recommendationCount": 3
  }
}
\`\`\`

**Recommendation Document:**
\`\`\`javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "recommendation_product_name": "Dell XPS 13",
  "recommendation_title": "Perfect for programming",
  "recommendation_reason": "Great performance, lightweight, excellent keyboard",
  "recommendation_photo": "https://example.com/xps13.jpg",
  "queryInfo": {
    "query_id": "507f1f77bcf86cd799439012",
    "product_name": "Laptop"
  },
  "recommended_by": {
    "email": "jane@example.com",
    "name": "Jane Smith",
    "photo": "https://example.com/jane.jpg",
    "posted_date": ISODate("2024-02-10T11:30:00Z")
  }
}
\`\`\`

---

## 🔒 Middleware

### CORS Configuration

\`\`\`javascript
app.use(
  cors({
    origin: ["http://localhost:5173"], // Configure frontend URL
    credentials: true, // Allow cookies
  })
);
\`\`\`

### JWT Verification Middleware

\`\`\`javascript
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.user = user; // Add user to request object
    next();
  });
};
\`\`\`

**Usage:** Apply to protected routes like:
\`\`\`javascript
app.get("/queries/:email", verifyToken, (req, res) => {
  // Only authenticated users can access this
});
\`\`\`

---

## 🚀 Getting Started Guide

### Step 1: Setup Backend Server

\`\`\`bash
# Install dependencies
npm install

# Configure .env file with your credentials
# Start server
npm start
\`\`\`

### Step 2: Authenticate User

\`\`\`javascript
// Client-side example
const response = await fetch('http://localhost:3000/jwt', {
  method: 'POST',
  credentials: 'include', // Important: send cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    photo: 'https://example.com/photo.jpg'
  })
});
\`\`\`

### Step 3: Create a Query

\`\`\`javascript
const queryData = {
  product_name: 'Laptop',
  query_title: 'Best laptop for web development',
  category: 'Electronics',
  product_brand: 'Any',
  product_photo: 'https://example.com/laptop.jpg',
  boycotting_reason: 'Looking for sustainable options',
  posted_by: {
    email: 'user@example.com',
    name: 'John Doe',
    photo: 'https://example.com/photo.jpg',
    posted_date: new Date(),
    recommendationCount: 0
  }
};

const response = await fetch('http://localhost:3000/queries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(queryData)
});
\`\`\`

### Step 4: Post a Recommendation

\`\`\`javascript
const recommendationData = {
  recommendation_product_name: 'MacBook Pro',
  recommendation_title: 'Excellent for development',
  recommendation_reason: 'Powerful, reliable, great build quality',
  recommendation_photo: 'https://example.com/macbook.jpg',
  queryInfo: {
    query_id: 'query_object_id_here',
    product_name: 'Laptop'
  },
  recommended_by: {
    email: 'recommender@example.com',
    name: 'Jane Smith',
    photo: 'https://example.com/jane.jpg',
    posted_date: new Date()
  }
};

const response = await fetch('http://localhost:3000/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(recommendationData)
});
\`\`\`

### Step 5: Chat with AI Assistant

\`\`\`javascript
const response = await fetch('http://localhost:3000/api/chatbot/chat', {
  method: 'POST',
  credentials: 'include', // Required for authentication
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What phone would you recommend?'
  })
});

const data = await response.json();
console.log(data.reply); // AI response
\`\`\`

---

## 🔐 Security Considerations

### 1. **JWT Token Security**
- Tokens are stored in HTTP-only cookies (cannot be accessed by JavaScript)
- Tokens expire after 5 hours
- Use strong \`JWT_SECRET\` (minimum 32 characters)

### 2. **Authentication**
- Verify email ownership before operations
- Use token verification middleware on protected routes
- Implement proper error messages without leaking information

### 3. **Authorization**
- Users can only access their own queries and recommendations
- Email verification ensures data ownership
- Server-side validation on all protected endpoints

### 4. **CORS**
- Configure allowed origins in \`.env\`
- Enable credentials for cookie sharing
- Restrict in production to specific domains

### 5. **MongoDB**
- Use connection string with authentication
- Consider IP whitelist for production
- Implement proper indexing for performance

### 6. **Environment Variables**
- Never commit \`.env\` file to Git
- Use \`.env.example\` for configuration template
- Rotate secrets regularly

### Best Practices Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Keep MongoDB credentials secure
- [ ] Enable HTTPS in production
- [ ] Validate all input data
- [ ] Implement rate limiting for APIs
- [ ] Add logging for security events
- [ ] Regularly update dependencies

---

## 📝 Development Guide

### Project Structure

\`\`\`
prod_rec-backend/
├── index.js                 # Main server file with API routes
├── chatbot-routes.js        # Chatbot-related routes
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment file
└── README.md                # This file
\`\`\`

### Key Functions

#### \`connectDB()\` (index.js)
Establishes MongoDB connection and initializes all API routes.

#### \`verifyToken()\` (index.js)
Middleware to verify JWT tokens from cookies.

#### \`getUserContext()\` (chatbot-routes.js)
Fetches user's query and recommendation history for chatbot context.

### Adding New Routes

1. Create route handler
2. Apply authentication middleware if needed
3. Perform database operations
4. Return appropriate response

Example:
\`\`\`javascript
app.post("/new-endpoint", verifyToken, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
\`\`\`

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | Check MONGO_URI in .env, ensure MongoDB is running |
| **JWT Token Invalid** | Clear cookies and re-authenticate |
| **CORS Error** | Verify frontend URL in CORS config |
| **Google API Error** | Check GOOGLE_API_KEY is valid and API is enabled |
| **401 Unauthorized** | Ensure token cookie is being sent with credentials: true |
| **Email Not Found** | Register user first with /save-user endpoint |

---

## 📞 Support & Contact

For issues, feature requests, or contributions, please reach out to the development team.

---

## 📄 License

This project is licensed under the ISC License.

---

**Last Updated:** February 10, 2026
**Version:** 1.0.0
EOF