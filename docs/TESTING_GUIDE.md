# Testing Guide - Posts CRUD API

## Prerequisites

1. **MongoDB**: Ensure MongoDB is running on `localhost:27017`
2. **Node.js**: Version 14 or higher
3. **Postman**: For API testing

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm run dev
```
Server should start on `http://localhost:3000`

### 3. Verify Server is Running
Open browser or Postman and visit: `http://localhost:3000/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Testing with Postman

### Method 1: Import Collection
1. Open Postman
2. Click "Import" button
3. Select `docs/postman-collection.json`
4. Collection "Posts CRUD API" will be imported with all endpoints

### Method 2: Manual Testing

#### Step 1: Create a Post
```
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is a comprehensive guide about Node.js backend development. It covers various aspects including Express.js setup, MongoDB integration, and API design patterns.",
  "author_id": "68690248d08dcab074abdddb",
  "tags": ["nodejs", "express", "mongodb", "backend"],
  "status": "draft"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65a5f1234567890abcdef123",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is a comprehensive guide...",
    "excerpt": "This is a comprehensive guide about Node.js backend development. It covers various aspects including Express.js setup, MongoDB integration, and API design patterns...",
    "author_id": "507f1f77bcf86cd799439011",
    "tags": ["nodejs", "express", "mongodb", "backend"],
    "status": "draft",
    "meta": {
      "views": 0,
      "likes": 0
    },
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Step 2: Get All Posts
```
GET http://localhost:3000/api/posts?page=1&limit=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a5f1234567890abcdef123",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "This is a comprehensive guide...",
      "author_id": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Test User",
        "email": "test@example.com"
      },
      "status": "draft",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Step 3: Get Single Post
```
GET http://localhost:3000/api/posts/65a5f1234567890abcdef123
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a5f1234567890abcdef123",
    "title": "My First Blog Post",
    "meta": {
      "views": 1,
      "likes": 0
    }
  }
}
```
*Note: Views count increments when getting a single post*

#### Step 4: Update Post
```
PUT http://localhost:3000/api/posts/65a5f1234567890abcdef123
Content-Type: application/json

{
  "title": "Updated Blog Post Title",
  "content": "This is the updated content with more detailed information about backend development.",
  "status": "published"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "65a5f1234567890abcdef123",
    "title": "Updated Blog Post Title",
    "slug": "updated-blog-post-title",
    "status": "published",
    "published_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

#### Step 5: Publish Post (Alternative Method)
```
PATCH http://localhost:3000/api/posts/65a5f1234567890abcdef123/publish
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post published successfully",
  "data": {
    "_id": "65a5f1234567890abcdef123",
    "status": "published",
    "published_at": "2024-01-15T10:36:00.000Z"
  }
}
```

#### Step 6: Get Published Posts (Public Endpoint)
```
GET http://localhost:3000/api/posts/published?page=1&limit=5
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a5f1234567890abcdef123",
      "title": "Updated Blog Post Title",
      "status": "published",
      "published_at": "2024-01-15T10:36:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
  }
}
```

#### Step 7: Delete Post
```
DELETE http://localhost:3000/api/posts/65a5f1234567890abcdef123
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

## Error Testing

### Test Invalid Post ID
```
GET http://localhost:3000/api/posts/invalid-id
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid post ID format"
}
```

### Test Post Not Found
```
GET http://localhost:3000/api/posts/507f1f77bcf86cd799439999
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

### Test Validation Error
```
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "content": "Content without title"
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"title\" is required",
    "\"author_id\" is required"
  ]
}
```

## Query Parameters Testing

### Pagination
```
GET http://localhost:3000/api/posts?page=2&limit=5
```

### Filter by Status
```
GET http://localhost:3000/api/posts?status=published
```

### Filter by Author
```
GET http://localhost:3000/api/posts?author_id=507f1f77bcf86cd799439011
```

### Combined Filters
```
GET http://localhost:3000/api/posts?status=published&page=1&limit=10
```

## Testing Checklist

- [ ] Server starts successfully
- [ ] Health check endpoint works
- [ ] Create post with valid data
- [ ] Create post with invalid data (validation error)
- [ ] Get all posts with pagination
- [ ] Get single post by ID
- [ ] Get post with invalid ID format
- [ ] Get non-existent post
- [ ] Update existing post
- [ ] Update non-existent post
- [ ] Publish post
- [ ] Get published posts
- [ ] Delete existing post
- [ ] Delete non-existent post
- [ ] Test query parameters (pagination, filters)

## Common Issues & Solutions

### MongoDB Connection Error
**Error**: `MongooseError: Operation failed`
**Solution**: Ensure MongoDB is running on `localhost:27017`

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`
**Solution**: Change PORT in `.env` file or kill process using port 3000

### Validation Errors
**Error**: `ValidationError: Path 'title' is required`
**Solution**: Ensure all required fields are included in request body

## Performance Testing

Use tools like Apache Bench or Artillery for load testing:

```bash
# Install artillery
npm install -g artillery

# Create artillery config
echo "config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Get posts'
    requests:
      - get:
          url: '/api/posts/published'" > load-test.yml

# Run load test
artillery run load-test.yml
```