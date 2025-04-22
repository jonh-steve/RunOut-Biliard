#!/bin/bash

# Tên dự án
PROJECT_NAME="TokyoLife"

# Tạo thư mục gốc
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Tạo cấu trúc Server
mkdir -p Server/{routes,controllers,models,configs,utils,middlewares}

# Tạo package.json cho Server
cat > Server/package.json << 'EOL'
{
  "name": "tokyolife-server",
  "version": "1.0.0",
  "description": "Backend server for TokyoLife",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOL

# Tạo server.js cơ bản
cat > Server/server.js << 'EOL'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TokyoLife API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
EOL

# Tạo file .env cho Server
cat > Server/.env << 'EOL'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tokyolife
JWT_SECRET=your_jwt_secret_key
EOL

# Tạo cấu trúc User
mkdir -p User/{src,.vscode}

# Tạo file index.html cho User
cat > User/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TokyoLife - User</title>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to TokyoLife</h1>
    </div>
    <script src="src/main.js"></script>
</body>
</html>
EOL

# Tạo cấu trúc Admin
mkdir -p Admin/{src,.vscode}

# Tạo file index.html cho Admin
cat > Admin/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TokyoLife - Admin</title>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>
    <div id="app">
        <h1>TokyoLife Admin Dashboard</h1>
    </div>
    <script src="src/main.js"></script>
</body>
</html>
EOL

# Tạo docker-compose.yml
cat > docker-compose.yml << 'EOL'
version: '3'
services:
  server:
    build: ./Server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./Server:/app
      - /app/node_modules
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
EOL

# Tạo .gitignore
cat > .gitignore << 'EOL'
# Dependencies
node_modules/
**/node_modules/

# Environment variables
.env
**/.env

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
dist/
build/
**/dist/
**/build/
EOL

# Tạo README.md
cat > README.md << 'EOL'
# TokyoLife Project

## Project Structure
- `Server/`: Backend API server
- `User/`: Frontend for users
- `Admin/`: Frontend for administrators

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd Server
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in Server directory
   - Update the variables as needed

4. Start the development server:
   ```bash
   cd Server
   npm run dev
   ```

### Docker Setup
```bash
docker-compose up --build
```

## Development
- Backend API runs on http://localhost:3000
- MongoDB runs on mongodb://localhost:27017
EOL

echo "Project structure created successfully!"
echo "To get started:"
echo "1. cd $PROJECT_NAME"
echo "2. cd Server"
echo "3. npm install"
echo "4. npm run dev" 