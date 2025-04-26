#!/bin/bash

# Script di chuyển tệp cấu hình từ RunOut sang steve
# Tác giả: RunOut Team
# Phiên bản: 1.0

# Xác định thư mục gốc
BASE_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"

# Đường dẫn
SOURCE_DIR="${BASE_DIR}"
TARGET_DIR="${BASE_DIR}/steve"
LOG_FILE="${TARGET_DIR}/scripts/migration/logs/config-migration-$(date +"%Y%m%d").log"
BACKUP_DIR="${SOURCE_DIR}_backup_$(date +"%Y%m%d")"

# Khởi tạo log
mkdir -p "${TARGET_DIR}/scripts/migration/logs"
echo "=== Bắt đầu di chuyển tệp cấu hình $(date) ===" > "$LOG_FILE"

# Kiểm tra thư mục nguồn tồn tại
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Lỗi: Không tìm thấy thư mục nguồn $SOURCE_DIR" | tee -a "$LOG_FILE"
  exit 1
fi

# Tạo backup nếu chưa tồn tại
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Tạo backup thư mục nguồn..." | tee -a "$LOG_FILE"
  cp -r "$SOURCE_DIR" "$BACKUP_DIR"
  echo "Đã tạo backup tại $BACKUP_DIR" | tee -a "$LOG_FILE"
else
  echo "Backup đã tồn tại tại $BACKUP_DIR" | tee -a "$LOG_FILE"
fi

# Tạo cấu trúc thư mục đích
echo "Tạo cấu trúc thư mục đích..." | tee -a "$LOG_FILE"
mkdir -p "${TARGET_DIR}/config/env"
mkdir -p "${TARGET_DIR}/config/docker"
mkdir -p "${TARGET_DIR}/config/lint"
mkdir -p "${TARGET_DIR}/config/scripts"
mkdir -p "${TARGET_DIR}/apps/admin/config"
mkdir -p "${TARGET_DIR}/apps/client/config"
mkdir -p "${TARGET_DIR}/apps/server/config"
mkdir -p "${TARGET_DIR}/apps/user/config"

# Hàm di chuyển tệp với kiểm tra lỗi
move_file() {
  local src="$1"
  local dest="$2"
  local file_name="$(basename "$src")"
  
  if [ -f "$src" ]; then
    echo "Di chuyển tệp $file_name từ $src sang $dest" | tee -a "$LOG_FILE"
    
    # Đảm bảo thư mục đích tồn tại
    mkdir -p "$(dirname "$dest")"
    
    # Sao chép tệp
    cp "$src" "$dest" 2>> "$LOG_FILE"
    
    if [ $? -eq 0 ]; then
      echo "✓ Đã di chuyển tệp $file_name thành công" | tee -a "$LOG_FILE"
    else
      echo "✗ Lỗi khi di chuyển tệp $file_name" | tee -a "$LOG_FILE"
    fi
  else
    echo "⚠ Tệp $src không tồn tại, bỏ qua" | tee -a "$LOG_FILE"
  fi
}

# Hàm di chuyển thư mục với kiểm tra lỗi
move_directory() {
  local src="$1"
  local dest="$2"
  local dir_name="$(basename "$src")"
  
  if [ -d "$src" ]; then
    echo "Di chuyển thư mục $dir_name từ $src sang $dest" | tee -a "$LOG_FILE"
    
    # Đảm bảo thư mục đích tồn tại
    mkdir -p "$dest"
    
    # Sao chép thư mục
    cp -r "$src" "$dest" 2>> "$LOG_FILE"
    
    if [ $? -eq 0 ]; then
      echo "✓ Đã di chuyển thư mục $dir_name thành công" | tee -a "$LOG_FILE"
    else
      echo "✗ Lỗi khi di chuyển thư mục $dir_name" | tee -a "$LOG_FILE"
    fi
  else
    echo "⚠ Thư mục $src không tồn tại, bỏ qua" | tee -a "$LOG_FILE"
  fi
}

# Di chuyển tệp cấu hình môi trường
echo "=== Di chuyển tệp cấu hình môi trường ===" | tee -a "$LOG_FILE"
move_file "${SOURCE_DIR}/.env.development" "${TARGET_DIR}/config/env/.env.development"
move_file "${SOURCE_DIR}/.env.production" "${TARGET_DIR}/config/env/.env.production"
move_file "${SOURCE_DIR}/Server/.env" "${TARGET_DIR}/config/env/.env.server"
move_file "${SOURCE_DIR}/giai-doan-1-chuan-bi/1.1-thiet-lap-du-an/.env.example" "${TARGET_DIR}/config/env/.env.example"

# Di chuyển tệp Docker
echo "=== Di chuyển tệp Docker ===" | tee -a "$LOG_FILE"
move_file "${SOURCE_DIR}/docker-compose.yml" "${TARGET_DIR}/config/docker/docker-compose.yml"

# Tạo tệp docker-compose.production.yml nếu không tồn tại
if [ ! -f "${SOURCE_DIR}/docker-compose.production.yml" ]; then
  echo "Tạo tệp docker-compose.production.yml mới" | tee -a "$LOG_FILE"
  cat > "${TARGET_DIR}/config/docker/docker-compose.production.yml" << 'EOF'
version: '3'

services:
  mongodb:
    image: mongo:4.4
    volumes:
      - mongodb_data:/data/db
    env_file:
      - ../env/.env.production
    restart: always
    
  server:
    build:
      context: ../../apps/server
      dockerfile: Dockerfile.prod
    depends_on:
      - mongodb
    env_file:
      - ../env/.env.production
    restart: always
    
  client:
    build:
      context: ../../apps/client
      dockerfile: Dockerfile.prod
    depends_on:
      - server
    
  admin:
    build:
      context: ../../apps/admin
      dockerfile: Dockerfile.prod
    depends_on:
      - server
      
  user:
    build:
      context: ../../apps/user
      dockerfile: Dockerfile.prod
    depends_on:
      - server
      
  nginx:
    image: nginx:stable-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - client
      - admin
      - user
      - server
    restart: always

volumes:
  mongodb_data:
EOF
  echo "✓ Đã tạo tệp docker-compose.production.yml" | tee -a "$LOG_FILE"
fi

# Di chuyển tệp cấu hình lint
echo "=== Di chuyển tệp cấu hình lint ===" | tee -a "$LOG_FILE"
move_file "${SOURCE_DIR}/.eslintrc.js" "${TARGET_DIR}/config/lint/.eslintrc.js"
move_file "${SOURCE_DIR}/.prettierrc" "${TARGET_DIR}/config/lint/.prettierrc"

# Di chuyển tệp script
echo "=== Di chuyển tệp script ===" | tee -a "$LOG_FILE"
move_file "${SOURCE_DIR}/create-project.sh" "${TARGET_DIR}/config/scripts/create-project.sh"
move_file "${SOURCE_DIR}/create-project.ps1" "${TARGET_DIR}/config/scripts/create-project.ps1"

# Di chuyển tệp package.json
echo "=== Di chuyển tệp package.json ===" | tee -a "$LOG_FILE"
move_file "${SOURCE_DIR}/package.json" "${TARGET_DIR}/package.json"
move_file "${SOURCE_DIR}/giai-doan-1-chuan-bi/1.1-thiet-lap-du-an/package.json" "${TARGET_DIR}/config/package.json.example"

# Tạo symlink cho tệp cấu hình trong các thư mục app
echo "=== Tạo symlink cho tệp cấu hình ===" | tee -a "$LOG_FILE"

# Symlink cho eslint và prettier
ln -sf "../../../config/lint/.eslintrc.js" "${TARGET_DIR}/apps/client/.eslintrc.js"
ln -sf "../../../config/lint/.prettierrc" "${TARGET_DIR}/apps/client/.prettierrc"
ln -sf "../../../config/lint/.eslintrc.js" "${TARGET_DIR}/apps/server/.eslintrc.js"
ln -sf "../../../config/lint/.prettierrc" "${TARGET_DIR}/apps/server/.prettierrc"
ln -sf "../../../config/lint/.eslintrc.js" "${TARGET_DIR}/apps/admin/.eslintrc.js"
ln -sf "../../../config/lint/.prettierrc" "${TARGET_DIR}/apps/admin/.prettierrc"
ln -sf "../../../config/lint/.eslintrc.js" "${TARGET_DIR}/apps/user/.eslintrc.js"
ln -sf "../../../config/lint/.prettierrc" "${TARGET_DIR}/apps/user/.prettierrc"

# Symlink cho .env files
ln -sf "../../config/env/.env.development" "${TARGET_DIR}/apps/client/.env.development"
ln -sf "../../config/env/.env.production" "${TARGET_DIR}/apps/client/.env.production"
ln -sf "../../config/env/.env.server" "${TARGET_DIR}/apps/server/.env"

# Tạo tệp nginx.conf cho production
echo "Tạo tệp cấu hình nginx" | tee -a "$LOG_FILE"
mkdir -p "${TARGET_DIR}/config/docker/nginx"
cat > "${TARGET_DIR}/config/docker/nginx/default.conf" << 'EOF'
# Client application
server {
    listen 80;
    server_name runout.com www.runout.com;
    
    location / {
        proxy_pass http://client:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin application
server {
    listen 80;
    server_name admin.runout.com;
    
    location / {
        proxy_pass http://admin:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# User application
server {
    listen 80;
    server_name user.runout.com;
    
    location / {
        proxy_pass http://user:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API server
server {
    listen 80;
    server_name api.runout.com;
    
    location / {
        proxy_pass http://server:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
echo "✓ Đã tạo tệp cấu hình nginx" | tee -a "$LOG_FILE"

# Tạo Dockerfile cho mỗi ứng dụng
echo "=== Tạo Dockerfile cho các ứng dụng ===" | tee -a "$LOG_FILE"

# Dockerfile cho server
cat > "${TARGET_DIR}/apps/server/Dockerfile.prod" << 'EOF'
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
EOF
echo "✓ Đã tạo Dockerfile cho server" | tee -a "$LOG_FILE"

# Dockerfile cho client
cat > "${TARGET_DIR}/apps/client/Dockerfile.prod" << 'EOF'
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
echo "✓ Đã tạo Dockerfile cho client" | tee -a "$LOG_FILE"

# Dockerfile cho admin
cat > "${TARGET_DIR}/apps/admin/Dockerfile.prod" << 'EOF'
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4200

CMD ["node", "server.js"]
EOF
echo "✓ Đã tạo Dockerfile cho admin" | tee -a "$LOG_FILE"

# Dockerfile cho user
cat > "${TARGET_DIR}/apps/user/Dockerfile.prod" << 'EOF'
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
EOF
echo "✓ Đã tạo Dockerfile cho user" | tee -a "$LOG_FILE"

# Tạo .gitignore toàn cục
echo "Tạo .gitignore toàn cục" | tee -a "$LOG_FILE"
cat > "${TARGET_DIR}/.gitignore" << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Dependency directories
node_modules/
jspm_packages/

# Distribution directories
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Temp files
*.swp
*.swo
.temp/
.cache/

# Testing
coverage/
.nyc_output/

# Build artifacts
.next/
out/
.nuxt/
.cache/
.parcel-cache/

# Miscellaneous
.lock-wscript
.node_repl_history
*.tgz
.yarn-integrity
EOF
echo "✓ Đã tạo .gitignore toàn cục" | tee -a "$LOG_FILE"

# Kiểm tra xem quá trình di chuyển có thành công không
if [ $? -eq 0 ]; then
  echo "=== Di chuyển tệp cấu hình hoàn tất thành công! $(date) ===" | tee -a "$LOG_FILE"
  echo "Chi tiết quá trình di chuyển được ghi trong file: $LOG_FILE"
else
  echo "=== Di chuyển tệp cấu hình hoàn tất với lỗi! $(date) ===" | tee -a "$LOG_FILE"
  echo "Vui lòng kiểm tra log để biết thêm chi tiết: $LOG_FILE"
fi
