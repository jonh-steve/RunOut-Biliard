# Script tạo cấu trúc dự án TokyoLife
$projectName = "TokyoLife"

# Tạo thư mục gốc
New-Item -ItemType Directory -Path $projectName
Set-Location $projectName

# Tạo cấu trúc Server
$serverPath = "Server"
New-Item -ItemType Directory -Path $serverPath
New-Item -ItemType Directory -Path "$serverPath/routes"
New-Item -ItemType Directory -Path "$serverPath/controllers"
New-Item -ItemType Directory -Path "$serverPath/models"
New-Item -ItemType Directory -Path "$serverPath/configs"
New-Item -ItemType Directory -Path "$serverPath/utils"
New-Item -ItemType Directory -Path "$serverPath/middlewares"

# Tạo các file cơ bản cho Server
@"
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
"@ | Out-File -FilePath "$serverPath/package.json" -Encoding UTF8

# Tạo cấu trúc User
$userPath = "User"
New-Item -ItemType Directory -Path $userPath
New-Item -ItemType Directory -Path "$userPath/src"
New-Item -ItemType Directory -Path "$userPath/.vscode"

# Tạo cấu trúc Admin
$adminPath = "Admin"
New-Item -ItemType Directory -Path $adminPath
New-Item -ItemType Directory -Path "$adminPath/src"
New-Item -ItemType Directory -Path "$adminPath/.vscode"

# Tạo file docker-compose.yml
@"
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
"@ | Out-File -FilePath "docker-compose.yml" -Encoding UTF8

# Tạo file .gitignore
@"
node_modules/
.env
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "Đã tạo xong cấu trúc dự án $projectName" 