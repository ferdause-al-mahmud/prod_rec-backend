# 🎯 ProdRec Backend Server

> **A Comprehensive RESTful API for Community-Driven Product Recommendations**

A production-ready Node.js backend API that powers a social platform for product recommendations. Features JWT authentication, real-time recommendations, and AI-powered chatbot assistance using Google's Generative AI (Gemini).

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **License:** ISC

---

## 📋 Quick Navigation

| Section | Purpose |
|---------|---------|
| [Quick Start](#-quick-start) | Get running in 5 minutes |
| [Architecture](#-architecture) | System design & diagrams |
| [Installation](#-installation--setup) | Detailed setup guide |
| [API Reference](#-api-documentation) | Complete endpoint documentation |
| [Database](#-database-schema) | Data models & structure |
| [Security](#-security-considerations) | Security best practices |
| [Troubleshooting](#-troubleshooting) | Common issues & solutions |

---

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <repository-url> && cd prod_rec-backend && npm install

# 2. Setup environment
cp .env.example .env  # Edit with your credentials

# 3. Run server
npm start  # Starts on http://localhost:3000
```

**Environment variables needed:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key (min 32 chars)
- `GOOGLE_API_KEY` - Google Generative AI API key
- `FRONTEND_URL` - Frontend origin URL

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#✨-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Middleware](#-middleware)
- [Getting Started Guide](#-getting-started-guide)
- [Security Considerations](#-security-considerations)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**ProdRec Backend** is a RESTful API server powering a social platform where users can:

- 📝 **Post product queries** seeking community recommendations
- 💡 **Share recommendations** to help other users make informed decisions
- 📊 **Track statistics** on queries and recommendations
- 🤖 **Chat with AI** for personalized product assistance

**Key Technologies:**
- Node.js with Express.js framework
- MongoDB for data persistence
- JWT for stateless authentication
- Google Generative AI (Gemini) for intelligent chatbot

---

## ✨ Features

### 👤 User Management
- User registration & profile creation
- Email-based authentication
- JWT token generation (5-hour validity)
- User statistics tracking (queries, recommendations)

### 📝 Product Queries
- Create detailed product queries
- Advanced search by product name
- Sort by date (newest first)
- Full CRUD operations
- Recommendation counter per query

### 💬 Recommendations
- Post recommendations to queries
- View recommendations with sorting
- Track user-specific recommendations
- Delete & manage recommendations
- Recommendation statistics

### 🤖 AI Chatbot
- **Context-aware responses** using user history
- **Personalized recommendations** based on user profile
- **Platform guidance** and feature explanations
- **Conversational AI** with Gemini integration

### 🔐 Security
- JWT token-based authentication
- HTTP-only secure cookies
- CORS protection
- Email verification
- Protected routes with middleware

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    Client["🖥️ Frontend Client<br/>(React Application)"]
    
    subgraph Server["ProdRec Backend Server"]
        Router["🔀 Express Router<br/>& Middleware"]
        
        subgraph Routes["API Routes"]
            AuthRoutes["🔐 Auth Routes<br/>/jwt, /logout<br/>/save-user, /user/:email"]
            QueryRoutes["📝 Query Routes<br/>/queries, /query/:id<br/>/queries/:email"]
            RecRoutes["💬 Recommendation Routes<br/>/recommendations<br/>/recommendations/:queryId"]
            ChatRoutes["🤖 Chatbot Routes<br/>/api/chatbot/chat"]
        end
        
        Auth["🔑 JWT Authentication<br/>& Verification"]
        
        subgraph Services["External Services"]
            Google["🌐 Google Generative AI<br/>(Gemini 3 Flash)"]
            Axios["📡 HTTP Client<br/>(Axios)"]
        end
        
        Database["🗄️ MongoDB<br/>4 Collections"]
    end
    
    Client -->|HTTP/REST| Router
    Router -->|Routes| Routes
    Router -->|Middleware| Auth
    Routes -->|Query| Database
    Routes -->|API Call| Services
    Google -->|Response| Routes
    
    style Server fill:#e1f5ff
    style Routes fill:#fff3e0
    style Services fill:#f3e5f5
    style Database fill:#e8f5e9
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant User as User/Client
    participant API as ProdRec API
    participant Auth as JWT Auth
    participant DB as MongoDB
    participant AI as Google Gemini
    
    rect rgb(200, 220, 255)
    Note over User,Auth: User Authentication Flow
    User->>API: POST /jwt (email, name, photo)
    API->>Auth: Generate JWT Token
    Auth->>API: Token Created
    API->>DB: Save/Update User
    API->>User: Set HTTP-Only Cookie
    end
    
    rect rgb(220, 240, 220)
    Note over User,DB: Create Query Flow
    User->>API: POST /queries (product info)
    API->>Auth: Verify Token
    Auth->>API: ✓ Valid
    API->>DB: Create Query Document
    DB->>API: Query ID
    API->>User: Success Response
    end
    
    rect rgb(240, 220, 240)
    Note over User,DB: Post Recommendation Flow
    User->>API: POST /recommendations (product info)
    API->>Auth: Verify Token
    API->>DB: Create Recommendation
    API->>DB: Increment Query Count
    API->>User: Success Response
    end
    
    rect rgb(255, 240, 200)
    Note over User,AI: Chatbot Flow
    User->>API: POST /api/chatbot/chat (message)
    API->>Auth: Verify Token
    API->>DB: Fetch User Context
    API->>AI: Build Request (user history)
    AI->>API: AI Response
    API->>User: Return Reply
    end
```

### Component Interaction

```mermaid
graph LR
    A["Client App"] -->|Requests| B["Express Server"]
    B -->|Validates| C["JWT Middleware"]
    C -->|Authorization| D["Route Handlers"]
    D -->|Query| E["MongoDB"]
    D -->|AI Request| F["Google Gemini"]
    E -->|Data| D
    F -->|Response| D
    D -->|Response| B
    B -->|JSON| A
    
    style A fill:#bbdefb
    style B fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#ffe0b2
    style E fill:#f8bbd0
    style F fill:#e1bee7
```

---

## 💻 Tech Stack

```mermaid
graph LR
    A["🖥️ Runtime"] -->|Node.js| B["⚙️ Framework"]
    B -->|Express.js| C["🗄️ Database"]
    C -->|MongoDB| D["🔐 Auth"]
    D -->|JWT| E["🤖 AI"]
    E -->|Google GenAI| F["📦 Dependencies"]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style F fill:#eceff1
```

### Dependencies Overview

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Core** | express | 4.21.2 | Web framework |
| **Database** | mongodb | 6.12.0 | Database driver |
| **Authentication** | jsonwebtoken | 9.0.2 | JWT generation & verification |
| **AI** | @google/generative-ai | 1.38.0 | Gemini API integration |
| **HTTP** | axios | 1.13.3 | API requests |
| **Middleware** | cors | 2.8.5 | Cross-origin requests |
| | cookie-parser | 1.4.7 | Cookie parsing |
| **Config** | dotenv | 16.4.7 | Environment variables |

---

## 📦 Installation & Setup

### Prerequisites Checklist

- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB (local or cloud) - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- ✅ Google Cloud API Key - [Get API Key](https://console.cloud.google.com/)
- ✅ npm or yarn package manager

### Step-by-Step Installation

#### Step 1: Clone Repository

```bash
git clone <repository-url>
cd prod_rec-backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including express, mongodb, jsonwebtoken, and google generative ai.

#### Step 3: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

#### Step 4: Verify Configuration

```bash
# Test MongoDB connection (optional)
npm run test:db

# This will verify your setup is correct
```

#### Step 5: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Server will start on http://localhost:3000
```

**Expected output:**
```
✅ Server running on port 3000
✅ MongoDB connected
✅ Ready for API requests
```

---

## 🔐 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# 🖥️ Server Configuration
PORT=3000
NODE_ENV=development

# 🗄️ Database
MONGO_URI=mongodb://localhost:27017/ProdRec
# Cloud: mongodb+srv://username:password@cluster.mongodb.net/ProdRec?retryWrites=true&w=majority

# 🔑 JWT Secret (minimum 32 characters)
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_chars

# 🤖 Google Generative AI API Key
GOOGLE_API_KEY=AIza...your_api_key_here

# 🌐 Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Environment Reference Table

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| **PORT** | Number | `3000` | Server port |
| **NODE_ENV** | String | `development` | Environment: development, production |
| **MONGO_URI** | String | `mongodb://localhost:27017` | Connection string |
| **JWT_SECRET** | String | `abc123...` | **Min 32 chars, keep secure** ⚠️ |
| **GOOGLE_API_KEY** | String | `AIza...` | Get from Google Cloud Console |
| **FRONTEND_URL** | String | `http://localhost:5173` | CORS origin |

### Obtaining API Keys

#### Google Generative AI Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google Generative AI API"
4. Create API key under credentials
5. Copy and paste into `.env`

#### MongoDB Connection

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/ProdRec
```

**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ProdRec?retryWrites=true&w=majority
```

> **⚠️ Security Warning:** Never commit `.env` file to Git. Use `.env.example` for configuration template.

---

## 📚 API Documentation

### API Overview

This section documents all available endpoints. Each endpoint includes its HTTP method, path, authentication requirements, and expected responses.

### Quick Reference

```mermaid
graph TD
    A["🔐 Authentication"] -->|POST /jwt| B["Generate Token"]
    A -->|POST /logout| C["Clear Token"]
    
    D["👤 User Management"] -->|POST /save-user| E["Register/Update"]
    D -->|GET /user/:email| F["Get User"]
    
    G["📝 Queries"] -->|POST /queries| H["Create Query"]
    G -->|GET /queries| I["List All"]
    G -->|GET /query/:id| J["Get Details"]
    G -->|PUT /query/:id| K["Update"]
    G -->|DELETE /query/:id| L["Delete"]
    
    M["💬 Recommendations"] -->|POST /recommendations| N["Create"]
    M -->|GET /recommendations/:id| O["For Query"]
    M -->|DELETE /recommendations/:id| P["Delete"]
    
    Q["🤖 Chatbot"] -->|POST /api/chatbot/chat| R["Send Message"]
    
    style A fill:#c8e6c9
    style D fill:#bbdefb
    style G fill:#fff9c4
    style M fill:#ffe0b2
    style Q fill:#f8bbd0
```

### Authentication Endpoints

#### 🔐 Generate JWT Token

```http
POST /jwt
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "photo": "https://example.com/photo.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Notes:**
- Generates JWT token valid for 5 hours
- Token stored in HTTP-only secure cookie
- No authentication required

---

#### 🚪 Logout

```http
POST /logout
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Notes:**
- Clears JWT token cookie
- Requires valid authentication

---

### User Management Endpoints

#### 💾 Save/Register User

```http
POST /save-user
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "photo": "https://example.com/photo.jpg"
}
```

**Response (200/201):**
```json
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
```

---

#### 👤 Get User Data

```http
GET /user/:email
```

**Response (200 OK):**
```json
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
```

---

### Query Management Endpoints

#### 📝 Create Query

```http
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
```

**Response (201 Created):**
```json
{
  "acknowledged": true,
  "insertedId": "ObjectId"
}
```

---

#### 📋 Get All Queries  

```http
GET /queries
GET /queries?search=laptop
```

**Response (200 OK):**
```json
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
```

**Query Parameters:**
- `search` - Filter by product name (case-insensitive)

---

#### 📄 Get Single Query

```http
GET /query/:queryId
```

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
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
    "recommendationCount": 3
  }
}
```

---

#### ✏️ Update Query

```http
PUT /query/:queryId
Content-Type: application/json

{
  "query_title": "Updated title",
  "product_name": "Updated product",
  "category": "New category",
  "product_brand": "New brand",
  "product_photo": "https://example.com/new-image.jpg",
  "boycotting_reason": "Updated reason"
}
```

**Response (200 OK):**
```json
{
  "acknowledged": true,
  "modifiedCount": 1
}
```

---

#### 🗑️ Delete Query

```http
DELETE /query/:queryId
```

**Response (200 OK):**
```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

---

### Recommendation Endpoints

#### 💬 Create Recommendation

```http
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
```

**Response (201 Created):**
```json
{
  "acknowledged": true,
  "insertedId": "ObjectId"
}
```

---

#### 📊 Get Recommendations for Query

```http
GET /recommendations/:queryId
```

**Response (200 OK):**
```json
[
  {
    "_id": "ObjectId",
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
]
```

**Notes:**
- Sorted by date (newest first)
- Shows all recommendations for a specific query

---

#### 🗑️ Delete Recommendation

```http
DELETE /recommendations/:recommendationId
```

**Response (200 OK):**
```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

---

### Chatbot Endpoints

#### 🤖 Chat with AI Assistant

```http
POST /api/chatbot/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What laptop would you recommend for programming?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "reply": "Based on your history and preferences, I recommend Dell XPS 13..."
}
```

**Features:**
- ✅ Context-aware responses using user history
- ✅ Personalized recommendations from profile
- ✅ Platform feature explanations
- ✅ Natural conversational interactions

**Requirements:**
- Valid JWT token (HTTP-only cookie)
- Google Generative AI API enabled

---

## 🗄️ Database Schema

### Database Architecture

```mermaid
graph LR
    A["ProdRec Database"] --> B["users"]
    A --> C["queries"]
    A --> D["recommendations"]
    
    B --> B1["_id<br/>email<br/>name<br/>photo<br/>createdAt<br/>updatedAt"]
    
    C --> C1["_id<br/>product_name<br/>query_title<br/>category<br/>posted_by<br/>posted_by.email<br/>posted_by.recommendationCount"]
    
    D --> D1["_id<br/>recommendation_product_name<br/>recommendation_title<br/>queryInfo.query_id<br/>recommended_by<br/>recommended_by.email"]
    
    style A fill:#fff3e0
    style B fill:#c8e6c9
    style C fill:#bbdefb
    style D fill:#f8bbd0
```

### Collection: Users

Stores user profile information and statistics.

```javascript
{
  "_id": ObjectId,
  "email": "user@example.com",           // Primary identifier
  "name": "John Doe",
  "photo": "https://example.com/photo.jpg",
  "createdAt": ISODate("2024-02-10T10:00:00Z"),
  "updatedAt": ISODate("2024-02-10T15:30:00Z"),
  "totalQueries": 5,
  "totalRecommendations": 12
}
```

**Indexes:**
- `email` (unique)

**Queries:**
- Find user by email: `db.users.findOne({email})`
- Update user stats: `db.users.updateOne({email}, {$set: {totalQueries}})`

---

### Collection: Queries

Stores product queries posted by users.

```javascript
{
  "_id": ObjectId,
  "product_name": "Laptop",
  "query_title": "Affordable laptop for programming",
  "category": "Electronics",
  "product_brand": "Dell",
  "product_photo": "https://example.com/image.jpg",
  "boycotting_reason": "Concerned about sustainability",
  "posted_by": {
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "https://example.com/photo.jpg",
    "posted_date": ISODate("2024-02-10T10:30:00Z"),
    "recommendationCount": 3
  }
}
```

**Indexes:**
- `posted_by.email`
- `product_name` (for search)
- `posted_by.posted_date` (descending)

---

### Collection: Recommendations

Stores recommendations given by users to queries.

```javascript
{
  "_id": ObjectId,
  "recommendation_product_name": "Dell XPS 13",
  "recommendation_title": "Perfect for programming",
  "recommendation_reason": "Great performance, lightweight, excellent keyboard",
  "recommendation_photo": "https://example.com/xps13.jpg",
  "queryInfo": {
    "query_id": ObjectId,                // Reference to queries._id
    "product_name": "Laptop"
  },
  "recommended_by": {
    "email": "jane@example.com",
    "name": "Jane Smith",
    "photo": "https://example.com/jane.jpg",
    "posted_date": ISODate("2024-02-10T11:30:00Z")
  }
}
```

**Indexes:**
- `queryInfo.query_id`
- `recommended_by.email`
- `recommended_by.posted_date`

---

## 🔒 Middleware & Security

### CORS Configuration

```javascript
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],  // Configure from .env
    credentials: true,                    // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  })
);
```

**Why:** Prevents unauthorized cross-origin requests while allowing secure credential sharing.

---

### JWT Verification Middleware

```javascript
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized - No token provided" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden - Invalid or expired token" 
      });
    }
    req.user = decoded;  // Attach user info to request
    next();
  });
};
```

**Protected Routes Example:**

```javascript
// Only authenticated users can access
app.get("/queries/:email", verifyToken, async (req, res) => {
  // User info available as req.user
});

// Allow public access
app.get("/queries", async (req, res) => {
  // Anyone can view all queries
});
```

---

### Middleware Stack Diagram

```mermaid
graph LR
    A["Request"] --> B["CORS<br/>Middleware"]
    B --> C["Cookie<br/>Parser"]
    C --> D{Protected<br/>Route?}
    D -->|Yes| E["JWT<br/>Verification"]
    D -->|No| F["Route<br/>Handler"]
    E -->|Valid| F
    E -->|Invalid| G["403<br/>Forbidden"]
    F --> H["Response"]
    G --> H
    
    style A fill:#e3f2fd
    style H fill:#e8f5e9
    style G fill:#ffcdd2
```

---

## 🚀 Getting Started Guide

### Complete Workflow Example

#### 1. User Registration & Authentication

```javascript
// Step 1: Register/Authenticate user
const authResponse = await fetch('http://localhost:3000/jwt', {
  method: 'POST',
  credentials: 'include',  // ⚠️ Critical: Send/receive cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    photo: 'https://example.com/photo.jpg'
  })
});

if (!authResponse.ok) throw new Error('Authentication failed');

// Step 2: Verify user data is saved
const userResponse = await fetch('http://localhost:3000/user/user@example.com');
const { user } = await userResponse.json();
console.log('User Profile:', user);
```

---

#### 2. Create a Product Query

```javascript
// Create query asking for laptop recommendations
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
    posted_date: new Date().toISOString(),
    recommendationCount: 0
  }
};

const queryResponse = await fetch('http://localhost:3000/queries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(queryData)
});

const { insertedId } = await queryResponse.json();
console.log('Query created with ID:', insertedId);
```

---

#### 3. View & Recommend

```javascript
// Get all queries with optional search
const queriesResponse = await fetch('http://localhost:3000/queries?search=laptop');
const queries = await queriesResponse.json();

// Recommend a product to a query
const recommendationData = {
  recommendation_product_name: 'MacBook Pro',
  recommendation_title: 'Excellent for web development',
  recommendation_reason: 'Powerful, reliable, great ecosystem',
  recommendation_photo: 'https://example.com/macbook.jpg',
  queryInfo: {
    query_id: insertedId,  // From previous step
    product_name: 'Laptop'
  },
  recommended_by: {
    email: 'recommender@example.com',
    name: 'Jane Smith',
    photo: 'https://example.com/jane.jpg',
    posted_date: new Date().toISOString()
  }
};

const recResponse = await fetch('http://localhost:3000/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(recommendationData)
});

console.log('Recommendation posted!');
```

---

#### 4. Use AI Chatbot

```javascript
// Chat with AI for personalized recommendations
const chatResponse = await fetch('http://localhost:3000/api/chatbot/chat', {
  method: 'POST',
  credentials: 'include',  // ⚠️ Required: Send auth token
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What laptop would you recommend for programming?'
  })
});

const { success, reply } = await chatResponse.json();
console.log('AI Response:', reply);
```

---

## 🔐 Security Best Practices

### Security Overview

```mermaid
graph TB
    A["Client Request"] --> B["CORS<br/>Validation"]
    B --> C{Requires<br/>Auth?}
    C -->|Yes| D["JWT<br/>Verification"]
    C -->|No| E["Process<br/>Request"]
    D -->|Valid| F["Verify Email<br/>Ownership"]
    F --> G["Validate<br/>Data"]
    G --> E
    E --> H["Database<br/>Operation"]
    H --> I["Return<br/>Response"]
    
    style B fill:#c8e6c9
    style D fill:#f8bbd0
    style F fill:#ffe0b2
    style G fill:#ffffff
    style H fill:#bbdefb
```

### Security Checklist

#### ✅ JWT Token Security
- **HTTP-Only Cookies:** Tokens stored in HTTP-only cookies (safe from XSS)
- **Token Expiration:** Tokens expire after 5 hours
- **Strong Secret:** Use strong `JWT_SECRET` (minimum 32 characters)
  ```bash
  # Generate strong secret
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### ✅ Authentication
- **Email Verification:** All operations verify user ownership
- **Middleware Protection:** All protected routes use `verifyToken`
- **Error Handling:** Avoid leaking sensitive information in errors
  ```javascript
  // ❌ Bad: Leaks implementation details
  res.status(401).json({ error: 'User not found in database' });
  
  // ✅ Good: Generic error message
  res.status(401).json({ error: 'Unauthorized' });
  ```

#### ✅ Authorization
- **Data Ownership:** Users only access their own data
- **Server-Side Validation:** Never trust client email parameter
  ```javascript
  // ✅ Correct: Use verified token email
  const email = req.user.email;  // From JWT token
  
  // ❌ Wrong: Trust URL parameter
  const email = req.params.email;  // Can be spoofed
  ```

#### ✅ CORS Configuration
- **Whitelist Origins:** Only allow trusted domains
  ```env
  FRONTEND_URL=https://yourdomain.com  # Production
  FRONTEND_URL=http://localhost:5173   # Development
  ```
- **Credentials:** Enable only when necessary
  ```javascript
  credentials: true  // Required for cookie-based auth
  ```

#### ✅ Environment Variables
- **Never Commit:** Use `.env.example` as template
- **Secure Secrets:** Rotate keys regularly
- **Access Control:** Limit environment exposure
  ```bash
  # .gitignore
  .env
  .env.local
  ```

#### ✅ Input Validation
```javascript
// Always validate user input
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Invalid email' });
}

// Sanitize for database queries
const sanitizedEmail = email.trim().toLowerCase();
```

#### ✅ MongoDB Security
- **Connection Auth:** Always use authenticated connections
  ```env
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net
  ```
- **IP Whitelist:** Restrict connection sources
- **Database Backups:** Regular automated backups

---

## 🐛 Troubleshooting

### Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **`ERR_CONNECTION_REFUSED:3000`** | Server not running | Run `npm start` in terminal |
| **`MongoNetworkError`** | Cannot connect to MongoDB | Check `MONGO_URI` in `.env`, ensure MongoDB is running |
| **`JsonWebTokenError`** | Invalid JWT token | Clear cookies, re-authenticate via `/jwt` |
| **`CORSError`** | Frontend domain not allowed | Update `FRONTEND_URL` in `.env` |
| **`401 Unauthorized`** | Token not sent with request | Use `credentials: 'include'` in fetch |
| **`403 Forbidden`** | Token expired or invalid | Re-authenticate user |
| **`Email not found`** | User not registered | Call `/save-user` endpoint first |
| **`Google API Error`** | API key issue | Verify `GOOGLE_API_KEY`, check API enabled |

### Debug Mode

```bash
# Run with detailed logging
DEBUG=* npm start

# Check MongoDB connection
npm run test:db

# Validate environment setup
npm run validate:env
```

### Getting Help

1. **Check Logs:** Look for error messages in terminal
2. **Verify Config:** Ensure all `.env` variables are set
3. **Test Endpoints:** Use Postman/Insomnia to test API
4. **Database:** Check MongoDB collections for data
5. **Network:** Verify frontend can reach backend

---

## 📞 Support & Contact

- **Issues:** Report bugs via GitHub Issues
- **Features:** Submit feature requests
- **Questions:** Check documentation or contact team

---


---
EOF
