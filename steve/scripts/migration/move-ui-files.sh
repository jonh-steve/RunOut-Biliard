#!/bin/bash

# Script di chuyển tệp UI (client, admin, và user) từ RunOut sang steve
# Tác giả: RunOut Team
# Phiên bản: 1.0

# Đường dẫn
SOURCE_DIR="RunOut"
TARGET_DIR="steve"
LOG_FILE="${TARGET_DIR}/scripts/migration/logs/ui-migration-$(date +"%Y%m%d").log"
BACKUP_DIR="${SOURCE_DIR}_backup_$(date +"%Y%m%d")"

# Khởi tạo log
mkdir -p "${TARGET_DIR}/scripts/migration/logs"
echo "=== Bắt đầu di chuyển tệp UI $(date) ===" > "$LOG_FILE"

# Kiểm tra thư mục nguồn tồn tại
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Lỗi: Không tìm thấy thư mục nguồn $SOURCE_DIR" | tee -a "$LOG_FILE"
  exit 1
fi

# Tạo backup trước khi di chuyển
echo "Tạo backup thư mục nguồn..." | tee -a "$LOG_FILE"
if [ ! -d "$BACKUP_DIR" ]; then
  cp -r "$SOURCE_DIR" "$BACKUP_DIR"
  echo "Đã tạo backup tại $BACKUP_DIR" | tee -a "$LOG_FILE"
else
  echo "Backup đã tồn tại tại $BACKUP_DIR" | tee -a "$LOG_FILE"
fi

# Tạo cấu trúc thư mục đích
echo "Tạo cấu trúc thư mục đích..." | tee -a "$LOG_FILE"
mkdir -p "${TARGET_DIR}/apps/admin/src/components"
mkdir -p "${TARGET_DIR}/apps/admin/src/pages"
mkdir -p "${TARGET_DIR}/apps/admin/src/services"
mkdir -p "${TARGET_DIR}/apps/admin/src/controllers"
mkdir -p "${TARGET_DIR}/apps/admin/src/assets/css"
mkdir -p "${TARGET_DIR}/apps/admin/src/assets/img"
mkdir -p "${TARGET_DIR}/apps/admin/src/assets/js"

mkdir -p "${TARGET_DIR}/apps/client/src/components/common"
mkdir -p "${TARGET_DIR}/apps/client/src/components/features"
mkdir -p "${TARGET_DIR}/apps/client/src/components/layout"
mkdir -p "${TARGET_DIR}/apps/client/src/pages"
mkdir -p "${TARGET_DIR}/apps/client/src/services/api"
mkdir -p "${TARGET_DIR}/apps/client/src/services/adapters"
mkdir -p "${TARGET_DIR}/apps/client/src/hooks"
mkdir -p "${TARGET_DIR}/apps/client/src/context"
mkdir -p "${TARGET_DIR}/apps/client/src/utils"
mkdir -p "${TARGET_DIR}/apps/client/src/assets"

mkdir -p "${TARGET_DIR}/apps/user/src/components"
mkdir -p "${TARGET_DIR}/apps/user/src/pages"
mkdir -p "${TARGET_DIR}/apps/user/src/services"
mkdir -p "${TARGET_DIR}/apps/user/src/controllers"
mkdir -p "${TARGET_DIR}/apps/user/src/assets/css"
mkdir -p "${TARGET_DIR}/apps/user/src/assets/img"
mkdir -p "${TARGET_DIR}/apps/user/src/assets/js"

mkdir -p "${TARGET_DIR}/common/components"
mkdir -p "${TARGET_DIR}/common/services"
mkdir -p "${TARGET_DIR}/common/utils"
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
    
    # Sử dụng rsync thay vì cp để có thêm tùy chọn
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

# Hàm kiểm tra và xử lý tệp trùng lặp
handle_duplicates() {
  local file_pattern="$1"
  local common_dir="$2"
  local file_type="$3"
  
  echo "Kiểm tra tệp $file_type trùng lặp..." | tee -a "$LOG_FILE"
  
  # Tìm tất cả các tệp phù hợp với mẫu
  find "${TARGET_DIR}" -name "$file_pattern" -type f | sort > /tmp/found_files.txt
  
  # Kiểm tra và xử lý từng tệp trùng lặp
  if [ -s /tmp/found_files.txt ]; then
    file_count=$(wc -l < /tmp/found_files.txt)
    
    if [ "$file_count" -gt 1 ]; then
      echo "Phát hiện $file_count tệp $file_type trùng lặp" | tee -a "$LOG_FILE"
      
      # Lấy tệp đầu tiên làm tham chiếu
      reference_file=$(head -n 1 /tmp/found_files.txt)
      filename=$(basename "$reference_file")
      
      # Tạo thư mục common nếu chưa tồn tại
      mkdir -p "$common_dir"
      
      # Di chuyển tệp tham chiếu vào thư mục common
      cp "$reference_file" "${common_dir}/${filename}"
      echo "Đã di chuyển tệp tham chiếu $filename vào $common_dir" | tee -a "$LOG_FILE"
      
      # Tạo symlink cho các tệp còn lại
      tail -n +2 /tmp/found_files.txt | while read duplicate_file; do
        rm "$duplicate_file"
        ln -sf "${common_dir}/${filename}" "$duplicate_file"
        echo "Tạo symlink từ ${common_dir}/${filename} đến $duplicate_file" | tee -a "$LOG_FILE"
      done
    else
      echo "Không phát hiện tệp $file_type trùng lặp" | tee -a "$LOG_FILE"
    fi
  else
    echo "Không tìm thấy tệp $file_type" | tee -a "$LOG_FILE"
  fi
  
  rm -f /tmp/found_files.txt
}

# Hàm cập nhật đường dẫn trong tệp
update_paths() {
  local dir="$1"
  local old_pattern="$2"
  local new_pattern="$3"
  
  echo "Cập nhật đường dẫn từ $old_pattern sang $new_pattern trong $dir" | tee -a "$LOG_FILE"
  
  # Tìm tất cả các tệp JS, JSX, HTML, CSS và cập nhật đường dẫn
  find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.html" -o -name "*.css" \) -exec sed -i "s|$old_pattern|$new_pattern|g" {} \; 2>> "$LOG_FILE"
  
  echo "✓ Đã cập nhật đường dẫn" | tee -a "$LOG_FILE"
}

# Di chuyển tệp Admin UI
echo "=== Di chuyển tệp Admin UI ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/Admin/src/components" "${TARGET_DIR}/apps/admin/src/components" "components"
move_files "${SOURCE_DIR}/Admin/src/pages" "${TARGET_DIR}/apps/admin/src/pages" "pages"
move_files "${SOURCE_DIR}/Admin/src/services" "${TARGET_DIR}/apps/admin/src/services" "services"
move_files "${SOURCE_DIR}/Admin/src/controllers" "${TARGET_DIR}/apps/admin/src/controllers" "controllers"
move_files "${SOURCE_DIR}/Admin/src/assets/css" "${TARGET_DIR}/apps/admin/src/assets/css" "css"
move_files "${SOURCE_DIR}/Admin/src/assets/img" "${TARGET_DIR}/apps/admin/src/assets/img" "images"
move_files "${SOURCE_DIR}/Admin/src/assets/js" "${TARGET_DIR}/apps/admin/src/assets/js" "javascript"
cp "${SOURCE_DIR}/Admin/index.html" "${TARGET_DIR}/apps/admin/" 2>> "$LOG_FILE"
cp "${SOURCE_DIR}/Admin/login.html" "${TARGET_DIR}/apps/admin/" 2>> "$LOG_FILE"
cp "${SOURCE_DIR}/Admin/src/app.js" "${TARGET_DIR}/apps/admin/src/" 2>> "$LOG_FILE"

# Di chuyển tệp Client UI
echo "=== Di chuyển tệp Client UI ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/client/src/components/common" "${TARGET_DIR}/apps/client/src/components/common" "common components"
move_files "${SOURCE_DIR}/client/src/components/features" "${TARGET_DIR}/apps/client/src/components/features" "feature components"
move_files "${SOURCE_DIR}/client/src/components/layout" "${TARGET_DIR}/apps/client/src/components/layout" "layout components"
move_files "${SOURCE_DIR}/client/src/pages" "${TARGET_DIR}/apps/client/src/pages" "pages"
move_files "${SOURCE_DIR}/client/src/services/api" "${TARGET_DIR}/apps/client/src/services/api" "API services"
move_files "${SOURCE_DIR}/client/src/services/adapters" "${TARGET_DIR}/apps/client/src/services/adapters" "adapters"
move_files "${SOURCE_DIR}/client/src/hooks" "${TARGET_DIR}/apps/client/src/hooks" "hooks"
move_files "${SOURCE_DIR}/client/src/context" "${TARGET_DIR}/apps/client/src/context" "context"
move_files "${SOURCE_DIR}/client/src/utils" "${TARGET_DIR}/apps/client/src/utils" "utilities"
move_files "${SOURCE_DIR}/client/src/assets" "${TARGET_DIR}/apps/client/src/assets" "assets"
move_files "${SOURCE_DIR}/client/src/validators" "${TARGET_DIR}/common/validators" "validators"
cp "${SOURCE_DIR}/client/package.json" "${TARGET_DIR}/apps/client/" 2>> "$LOG_FILE"

# Di chuyển tệp User UI
echo "=== Di chuyển tệp User UI ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/User/src/components" "${TARGET_DIR}/apps/user/src/components" "components"
move_files "${SOURCE_DIR}/User/src/pages" "${TARGET_DIR}/apps/user/src/pages" "pages"
move_files "${SOURCE_DIR}/User/src/services" "${TARGET_DIR}/apps/user/src/services" "services"
move_files "${SOURCE_DIR}/User/src/controllers" "${TARGET_DIR}/apps/user/src/controllers" "controllers"
move_files "${SOURCE_DIR}/User/src/assets/css" "${TARGET_DIR}/apps/user/src/assets/css" "css"
move_files "${SOURCE_DIR}/User/src/assets/img" "${TARGET_DIR}/apps/user/src/assets/img" "images"
move_files "${SOURCE_DIR}/User/src/assets/js" "${TARGET_DIR}/apps/user/src/assets/js" "javascript"
cp "${SOURCE_DIR}/User/index.html" "${TARGET_DIR}/apps/user/" 2>> "$LOG_FILE"
cp "${SOURCE_DIR}/User/src/app.js" "${TARGET_DIR}/apps/user/src/" 2>> "$LOG_FILE"

# Di chuyển components cơ bản vào common
echo "=== Di chuyển components cơ bản vào common ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/giai-doan-1-chuan-bi/1.3-component-co-ban" "${TARGET_DIR}/common/components" "basic components"
move_files "${SOURCE_DIR}/src/components/common" "${TARGET_DIR}/common/components" "src common components"

# Di chuyển thư mục src
echo "=== Di chuyển tệp từ thư mục src ===" | tee -a "$LOG_FILE"
move_files "${SOURCE_DIR}/src/components" "${TARGET_DIR}/common/components" "src components"
move_files "${SOURCE_DIR}/src/context" "${TARGET_DIR}/common/context" "src context"
move_files "${SOURCE_DIR}/src/hooks" "${TARGET_DIR}/common/hooks" "src hooks"
move_files "${SOURCE_DIR}/src/utils" "${TARGET_DIR}/common/utils" "src utils"
move_files "${SOURCE_DIR}/src/pages" "${TARGET_DIR}/common/pages" "src pages"
move_files "${SOURCE_DIR}/src/services" "${TARGET_DIR}/common/services" "src services"

# Xử lý tệp trùng lặp
echo "=== Xử lý tệp trùng lặp ===" | tee -a "$LOG_FILE"
handle_duplicates "*Validator.js" "${TARGET_DIR}/common/validators" "validator"
handle_duplicates "Button.*" "${TARGET_DIR}/common/components/Button" "Button component"
handle_duplicates "Card.*" "${TARGET_DIR}/common/components/Card" "Card component"
handle_duplicates "Input.*" "${TARGET_DIR}/common/components/Input" "Input component"

# Cập nhật đường dẫn
echo "=== Cập nhật đường dẫn ===" | tee -a "$LOG_FILE"
update_paths "${TARGET_DIR}/apps/admin" "../../../components" "@common/components"
update_paths "${TARGET_DIR}/apps/client" "../../../components" "@common/components"
update_paths "${TARGET_DIR}/apps/user" "../../../components" "@common/components"

# Kiểm tra xem quá trình di chuyển có thành công không
if [ $? -eq 0 ]; then
  echo "=== Di chuyển tệp UI hoàn tất thành công! $(date) ===" | tee -a "$LOG_FILE"
  echo "Chi tiết quá trình di chuyển được ghi trong file: $LOG_FILE"
else
  echo "=== Di chuyển tệp UI hoàn tất với lỗi! $(date) ===" | tee -a "$LOG_FILE"
  echo "Vui lòng kiểm tra log để biết thêm chi tiết: $LOG_FILE"
fi