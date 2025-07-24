# MongoDB Setup Guide

## Quick Start with Docker (Recommended for Study)

### 1. Install Docker
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

### 2. Run MongoDB Container
```bash
# Pull and run MongoDB
docker run --name posts-mongodb -p 27017:27017 -d mongo:7.0

# Verify it's running
docker ps
```

### 3. Test Connection
```bash
# Connect to MongoDB shell
docker exec -it posts-mongodb mongosh

# In MongoDB shell, test basic commands:
show dbs
use posts_db
db.test.insertOne({message: "Hello MongoDB"})
db.test.find()
exit
```

### 4. Start Your Node.js Project
```bash
# In your project directory
npm install
npm run dev
```

### 5. Test API
```bash
# Test health endpoint
curl http://localhost:3000/health

# Create a test post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post content for MongoDB testing.",
    "tags": ["test", "mongodb"],
    "status": "draft"
  }'
```

## MongoDB Management Commands

### Docker Commands:
```bash
# Start MongoDB container
docker start posts-mongodb

# Stop MongoDB container
docker stop posts-mongodb

# View logs
docker logs posts-mongodb

# Remove container (when done)
docker stop posts-mongodb
docker rm posts-mongodb
```

### MongoDB Shell Commands:
```bash
# Connect to MongoDB
docker exec -it posts-mongodb mongosh

# Basic MongoDB commands:
show dbs                    # List databases
use posts_db               # Switch to posts_db
show collections           # List collections
db.posts.find()           # Find all posts
db.posts.find().pretty()  # Pretty print results
db.posts.countDocuments() # Count documents
db.posts.drop()           # Delete collection
```

## Troubleshooting

### Port 27017 Already in Use:
```bash
# Check what's using port 27017
sudo lsof -i :27017

# Kill process if needed
sudo kill -9 <PID>

# Or use different port
docker run --name posts-mongodb -p 27018:27017 -d mongo:7.0
# Update .env: DB_CONNECTION=mongodb://localhost:27018/posts_db
```

### Container Won't Start:
```bash
# Check Docker status
docker --version
docker ps -a

# Remove existing container
docker rm posts-mongodb

# Pull latest MongoDB image
docker pull mongo:7.0
```

### Connection Issues:
```bash
# Test MongoDB connection
docker exec -it posts-mongodb mongosh --eval "db.adminCommand('ping')"

# Check container logs
docker logs posts-mongodb
```

## MongoDB Compass (GUI Tool)

### Install MongoDB Compass:
1. Download from https://www.mongodb.com/products/compass
2. Install and open
3. Connect to: `mongodb://localhost:27017`
4. Browse your `posts_db` database visually

## Data Persistence

### With Docker Volumes (Optional):
```bash
# Create named volume for data persistence
docker volume create mongodb-data

# Run MongoDB with persistent storage
docker run --name posts-mongodb \
  -p 27017:27017 \
  -v mongodb-data:/data/db \
  -d mongo:7.0
```

This ensures your data survives container restarts.

## Alternative: Local MongoDB Installation

### Ubuntu/Debian:
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connect
mongosh
```

### macOS:
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Connect
mongosh
```