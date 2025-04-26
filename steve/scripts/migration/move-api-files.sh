#!/bin/bash

# Script di chuyển tệp API backend từ RunOut sang steve
# Tác giả: RunOut Team
# Phiên bản: 1.0

# Xác định thư mục gốc
BASE_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"

# Đường dẫn
SOURCE_DIR="${BASE_DIR}"
TARGET_DIR="${BASE_DIR}/steve"
LOG_FILE="${TARGET_DIR}/scripts/migration/logs/api-migration-$(date +"%Y%m%d").log"
BACKUP_DIR="${SOURCE_DIR}_backup_$(date +"%Y%m%d")"

# Khởi tạo log
mkdir -p "${TARGET_DIR}/scripts/migration/logs"
echo "=== Bắt đầu di chuyển tệp API $(date) ===" > "$LOG_FILE"

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
mkdir -p "${TARGET_DIR}/apps/server/configs"
mkdir -p "${TARGET_DIR}/apps/server/controllers"
mkdir -p "${TARGET_DIR}/apps/server/middlewares/validators"
mkdir -p "${TARGET_DIR}/apps/server/models"
mkdir -p "${TARGET_DIR}/apps/server/routes"
mkdir -p "${TARGET_DIR}/apps/server/utils"
mkdir -p "${TARGET_DIR}/common/validators"

# Hàm di chuyển tệp với kiểm tra lỗi
move_files() {
  local src="$1"
  local dest="$2"
  local file_type="$3"
  
  if [ -d "$src" ]; then
    echo "Di chuyển $file_type từ $src sang $dest" | tee -a "$LOG_FILE"
    
    # Kiểm tra xem thư mục đích đã tồn tại chưa
    if [ ! -d "$dest" ]; then
      mkdir -p "$dest"
    fi
    
    # Sử dụng rsync để di chuyển tệp
    rsync -av "$src/" "$dest/" >> "$LOG_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
      echo "✓ Đã di chuyển $file_type thành công" | tee -a "$LOG_FILE"
    else
      echo "✗ Lỗi khi di chuyển $file_type" | tee -a "$LOG_FILE"
    fi
  else
    echo "⚠ Thư mục $src không tồn tại, bỏ qua" | tee -a "$LOG_FILE"
  fi
}

# Hàm di chuyển tệp riêng lẻ
move_file() {
  local src="$1"
  local dest="$2"
  local file_name="$3"
  
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

# Kiểm tra và xử lý validators trùng lặp
handle_validator_duplicates() {
  echo "Kiểm tra validators trùng lặp..." | tee -a "$LOG_FILE"
  
  # Tìm tất cả validators trong server và client
  server_validators="${TARGET_DIR}/apps/server/middlewares/validators"
  common_validators="${TARGET_DIR}/common/validators"
  
  # Đảm bảo thư mục common validators tồn tại
  mkdir -p "$common_validators"
  
  # Tạo danh sách validators từ server
  find "$server_validators" -type f -name "*.js" | while read validator_file; do
    filename=$(basename "$validator_file")
    
    # Kiểm tra nếu validator này cũng tồn tại trong common validators
    if [ -f "${common_validators}/${filename}" ]; then
      echo "Phát hiện validator trùng lặp: $filename" | tee -a "$LOG_FILE"
      
      # Di chuyển validator từ server sang common
      mv "$validator_file" "${common_validators}/${filename}.server.bak"
      ln -sf "${common_validators}/${filename}" "$validator_file"
      echo "Tạo symlink từ ${common_validators}/${filename} đến $validator_file" | tee -a "$LOG_FILE"
    else
      # N��u không tồn tại, copy vào common
      cp "$validator_file" "${common_validators}/${filename}"
      echo "Sao chép $filename vào common validators" | tee -a "$LOG_FILE"
    fi
  done
}

# Hàm cập nhật đường dẫn trong tệp
update_paths() {
  local dir="$1"
  local old_pattern="$2"
  local new_pattern="$3"
  
  echo "Cập nhật đường dẫn từ $old_pattern sang $new_pattern trong $dir" | tee -a "$LOG_FILE"
  
  # Tìm tất cả các tệp JS và cập nhật đường dẫn
  find "$dir" -type f -name "*.js" -exec sed -i "s|$old_pattern|$new_pattern|g" {} \; 2>> "$LOG_FILE"
  
  echo "✓ Đã cập nhật đường dẫn" | tee -a "$LOG_FILE"
}

# Di chuyển tệp Server API
echo "=== Di chuyển tệp Server API ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/Server/configs" "${TARGET_DIR}/apps/server/configs" "configs"
move_files "${SOURCE_DIR}/Server/controllers" "${TARGET_DIR}/apps/server/controllers" "controllers"
move_files "${SOURCE_DIR}/Server/middlewares/validators" "${TARGET_DIR}/apps/server/middlewares/validators" "validators"
move_files "${SOURCE_DIR}/Server/models" "${TARGET_DIR}/apps/server/models" "models"
move_files "${SOURCE_DIR}/Server/routes" "${TARGET_DIR}/apps/server/routes" "routes"
move_files "${SOURCE_DIR}/Server/utils" "${TARGET_DIR}/apps/server/utils" "utils"

# Di chuyển các tệp riêng lẻ
move_file "${SOURCE_DIR}/Server/server.js" "${TARGET_DIR}/apps/server/server.js" "server.js"
move_file "${SOURCE_DIR}/Server/.env" "${TARGET_DIR}/apps/server/.env" ".env"
move_file "${SOURCE_DIR}/Server/package.json" "${TARGET_DIR}/apps/server/package.json" "package.json"
move_file "${SOURCE_DIR}/Server/middlewares/ErrorHandler.js" "${TARGET_DIR}/apps/server/middlewares/ErrorHandler.js" "ErrorHandler.js"
move_file "${SOURCE_DIR}/Server/middlewares/jwt.js" "${TARGET_DIR}/apps/server/middlewares/jwt.js" "jwt.js"
move_file "${SOURCE_DIR}/Server/middlewares/rateLimit.js" "${TARGET_DIR}/apps/server/middlewares/rateLimit.js" "rateLimit.js"
move_file "${SOURCE_DIR}/Server/middlewares/validation.js" "${TARGET_DIR}/apps/server/middlewares/validation.js" "validation.js"
move_file "${SOURCE_DIR}/Server/middlewares/verifyToken.js" "${TARGET_DIR}/apps/server/middlewares/verifyToken.js" "verifyToken.js"

# Di chuyển services API từ giai-doan-2-xay-dung-nen-tang
echo "=== Di chuyển tệp Service API từ giai-doan-2 ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/giai-doan-2-xay-dung-nen-tang/2.1-service-api" "${TARGET_DIR}/common/services/api" "API services"

# Xử lý validators trùng lặp
handle_validator_duplicates

# Cập nhật đường dẫn trong tệp
echo "=== Cập nhật đường dẫn ===" | tee -a "$LOG_FILE"
update_paths "${TARGET_DIR}/apps/server" "../models/" "../models/"
update_paths "${TARGET_DIR}/apps/server" "../middlewares/" "../middlewares/"
update_paths "${TARGET_DIR}/apps/server" "../controllers/" "../controllers/"
update_paths "${TARGET_DIR}/apps/server" "../configs/" "../configs/"
update_paths "${TARGET_DIR}/apps/server" "../routes/" "../routes/"
update_paths "${TARGET_DIR}/apps/server" "../utils/" "../utils/"

# Cập nhật đường dẫn cho validators
update_paths "${TARGET_DIR}/apps/server" "../middlewares/validators/" "@common/validators/"

# Kiểm tra xem quá trình di chuyển có thành công không
if [ $? -eq 0 ]; then
  echo "=== Di chuyển tệp API hoàn tất thành công! $(date) ===" | tee -a "$LOG_FILE"
  echo "Chi tiết quá trình di chuyển được ghi trong file: $LOG_FILE"
else
  echo "=== Di chuyển tệp API hoàn tất với lỗi! $(date) ===" | tee -a "$LOG_FILE"
  echo "Vui lòng kiểm tra log để biết thêm chi tiết: $LOG_FILE"
fi