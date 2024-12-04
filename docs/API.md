# Mastery Path API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
All API routes require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

## Learning Paths

### Get All Paths
```
GET /paths
```

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "paths": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "milestones": [
        {
          "title": "string",
          "description": "string",
          "completed": "boolean",
          "dueDate": "date"
        }
      ],
      "progress": "number",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "total": "number",
    "pages": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Create Path
```
POST /paths
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "dueDate": "date"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Path created successfully",
  "path": {
    // Path object
  }
}
```

### Update Path
```
PUT /paths/:id
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "milestones": "array (optional)",
  "status": "string (optional)",
  "targetDate": "date (optional)",
  "tags": "array (optional)"
}
```

**Response (200):**
```json
{
  // Updated path object
}
```

### Delete Path
```
DELETE /paths/:id
```

**Response (200):**
```json
{
  "message": "Path deleted successfully"
}
```

## Resources

### Get Resources
```
GET /resources
```

**Query Parameters:**
- `category` (optional): Filter by category
- `q` (optional): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "resources": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "type": "string",
      "url": "string",
      "author": "string",
      "tags": ["string"],
      "difficulty": "string",
      "averageRating": "number",
      "totalRatings": "number"
    }
  ],
  "pagination": {
    "total": "number",
    "pages": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Create Resource
```
POST /resources
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "type": "string",
  "url": "string",
  "thumbnail": "string (optional)",
  "author": "string (optional)",
  "tags": ["string"],
  "difficulty": "string"
}
```

### Rate Resource
```
POST /resources/:id/ratings
```

**Request Body:**
```json
{
  "rating": "number (1-5)",
  "review": "string (optional)"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limits
- 100 requests per minute per IP
- 1000 requests per hour per user

## Models

### Path Categories
- Technical
- Creative
- Physical
- Language
- Business
- Other

### Resource Types
- Free
- Premium
- Subscription

### Resource Categories
- Book
- Video
- Article
- Course
- Tool
- Other

### Difficulty Levels
- Beginner
- Intermediate
- Advanced

## Best Practices
1. Always include the Authorization header
2. Use pagination for large result sets
3. Include error handling for all requests
4. Cache responses when appropriate
5. Use appropriate HTTP methods for operations