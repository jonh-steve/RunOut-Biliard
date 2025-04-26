#!/bin/bash

# Script di chuyển tổng hợp tất cả các tệp từ cấu trúc cũ sang cấu trúc mới trong thư mục steve
# Sử dụng: bash move-all-files.sh
# Tác giả: AI Assistant
# Ngày tạo: $(date +"%Y-%m-%d")

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Đường dẫn
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
TARGET_DIR="${ROOT_DIR}/steve"
BACKUP_DIR="${TARGET_DIR}/scripts/migration/backup/$(date +%Y%m%d%H%M%S)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Tạo thư mục backup
mkdir -p "${BACKUP_DIR}"
echo -e "${GREEN}Đã tạo thư mục backup tại: ${BACKUP_DIR}${NC}"

# Kiểm tra các script con tồn tại
check_script() {
    if [ ! -f "$SCRIPT_DIR/$1" ]; then
        echo -e "${RED}Lỗi: Script $1 không tồn tại${NC}"
        exit 1
    fi
}

check_script "move-ui-files.sh"
check_script "move-api-files.sh"
check_script "move-config-files.sh"

# Kiểm tra thư mục đích
check_directory() {
    if [ ! -d "$1" ]; then
        echo -e "${YELLOW}Thư mục $1 không tồn tại. Đang tạo...${NC}"
        mkdir -p "$1"
    fi
}

# Function để di chuyển file với backup
move_with_backup() {
    local SOURCE="$1"
    local DEST="$2"
    local BACKUP="${BACKUP_DIR}/${SOURCE#${ROOT_DIR}/}"
    
    # Kiểm tra file nguồn tồn tại
    if [ ! -f "$SOURCE" ] && [ ! -d "$SOURCE" ]; then
        echo -e "${YELLOW}Bỏ qua: $SOURCE không tồn tại${NC}"
        return
    fi
    
    # Tạo thư mục backup
    mkdir -p "$(dirname "$BACKUP")"
    
    # Backup file gốc
    if [ -f "$SOURCE" ] || [ -d "$SOURCE" ]; then
        cp -r "$SOURCE" "$BACKUP"
        echo -e "${GREEN}Đã backup: $SOURCE${NC}"
    fi
    
    # Tạo thư mục đích
    mkdir -p "$(dirname "$DEST")"
    
    # Di chuyển file
    if [ -f "$SOURCE" ] || [ -d "$SOURCE" ]; then
        cp -r "$SOURCE" "$DEST"
        echo -e "${GREEN}Đã di chuyển: $SOURCE -> $DEST${NC}"
    fi
}

# Hiển thị tiêu đề
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  SCRIPT DI CHUYỂN TỔNG HỢP - DỰ ÁN RUNOUT     ${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Script này sẽ di chuyển tất cả các tệp từ cấu trúc cũ sang cấu trúc mới trong thư mục steve.${NC}"
echo -e "${YELLOW}Các tệp gốc sẽ được giữ nguyên, chỉ sao chép sang thư mục mới.${NC}"
echo -e "${YELLOW}Backup được lưu tại: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}=================================================${NC}"

# Xác nhận từ người dùng
read -p "Bạn có muốn tiếp tục? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${RED}Đã hủy thao tác.${NC}"
    exit 0
fi

echo -e "${BLUE}===== Bắt đầu quá trình di chuyển =====${NC}"

# 1. Di chuyển UI files
echo -e "${BLUE}===== Di chuyển UI files =====${NC}"
bash "$SCRIPT_DIR/move-ui-files.sh"
echo -e "${GREEN}===== Hoàn thành di chuyển UI files =====${NC}"

# 2. Di chuyển API files
echo -e "${BLUE}===== Di chuyển API files =====${NC}"
bash "$SCRIPT_DIR/move-api-files.sh"
echo -e "${GREEN}===== Hoàn thành di chuyển API files =====${NC}"

# 3. Di chuyển Config files
echo -e "${BLUE}===== Di chuyển Config files =====${NC}"
bash "$SCRIPT_DIR/move-config-files.sh"
echo -e "${GREEN}===== Hoàn thành di chuyển Config files =====${NC}"

# 4. Di chuyển docs
echo -e "${BLUE}===== Di chuyển docs =====${NC}"
check_directory "${TARGET_DIR}/docs"
check_directory "${TARGET_DIR}/docs/api"
check_directory "${TARGET_DIR}/docs/architecture"
check_directory "${TARGET_DIR}/docs/development"
check_directory "${TARGET_DIR}/docs/migration"

# 4.1 Di chuyển các file markdown trong thư mục docs
if [ -d "${ROOT_DIR}/docs" ]; then
    for DOC_FILE in "${ROOT_DIR}"/docs/*.md; do
        if [ -f "$DOC_FILE" ]; then
            DOC_NAME=$(basename "$DOC_FILE")
            move_with_backup "$DOC_FILE" "${TARGET_DIR}/docs/${DOC_NAME}"
        fi
    done
    
    # 4.2 Di chuyển các thư mục con trong docs
    if [ -d "${ROOT_DIR}/docs/sync-plan-supplement" ]; then
        check_directory "${TARGET_DIR}/docs/sync-plan"
        for SUPPLEMENT in "${ROOT_DIR}"/docs/sync-plan-supplement/*.md; do
            if [ -f "$SUPPLEMENT" ]; then
                SUPPLEMENT_NAME=$(basename "$SUPPLEMENT")
                move_with_backup "$SUPPLEMENT" "${TARGET_DIR}/docs/sync-plan/${SUPPLEMENT_NAME}"
            fi
        done
    fi
fi

# 5. Di chuyển tools
echo -e "${BLUE}===== Di chuyển tools =====${NC}"
check_directory "${TARGET_DIR}/tools"
check_directory "${TARGET_DIR}/tools/analyzers"
check_directory "${TARGET_DIR}/tools/converters"
check_directory "${TARGET_DIR}/tools/generators"

# 5.1 Di chuyển các công cụ phân tích
if [ -f "${ROOT_DIR}/tools/api-analyzer.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/api-analyzer.js" "${TARGET_DIR}/tools/analyzers/api-analyzer.js"
fi

if [ -f "${ROOT_DIR}/tools/component-consistency-checker.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/component-consistency-checker.js" "${TARGET_DIR}/tools/analyzers/component-consistency-checker.js"
fi

if [ -f "${ROOT_DIR}/tools/folder-structure-analyzer.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/folder-structure-analyzer.js" "${TARGET_DIR}/tools/analyzers/folder-structure-analyzer.js"
fi

if [ -f "${ROOT_DIR}/tools/state-management-analyzer.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/state-management-analyzer.js" "${TARGET_DIR}/tools/analyzers/state-management-analyzer.js"
fi

# 5.2 Di chuyển các công cụ chuyển đổi
if [ -f "${ROOT_DIR}/tools/mui-to-tailwind.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/mui-to-tailwind.js" "${TARGET_DIR}/tools/converters/mui-to-tailwind.js"
fi

if [ -f "${ROOT_DIR}/tools/component-conversion-cli.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/component-conversion-cli.js" "${TARGET_DIR}/tools/converters/component-conversion-cli.js"
fi

# 5.3 Di chuyển các công cụ khác
if [ -f "${ROOT_DIR}/tools/utility-adapter.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/utility-adapter.js" "${TARGET_DIR}/tools/utility-adapter.js"
fi

if [ -f "${ROOT_DIR}/tools/api-mapping-tool.js" ]; then
    move_with_backup "${ROOT_DIR}/tools/api-mapping-tool.js" "${TARGET_DIR}/tools/api-mapping-tool.js"
fi

if [ -f "${ROOT_DIR}/tools/user-folder-analysis.json" ]; then
    move_with_backup "${ROOT_DIR}/tools/user-folder-analysis.json" "${TARGET_DIR}/tools/user-folder-analysis.json"
fi

# 6. Di chuyển README và các tệp còn lại
echo -e "${BLUE}===== Di chuyển README và các tệp còn lại =====${NC}"
if [ -f "${ROOT_DIR}/README.md" ]; then
    move_with_backup "${ROOT_DIR}/README.md" "${TARGET_DIR}/README.md"
fi

if [ -f "${ROOT_DIR}/readme.md" ]; then
    move_with_backup "${ROOT_DIR}/readme.md" "${TARGET_DIR}/readme.md"
fi

if [ -f "${ROOT_DIR}/package.json" ]; then
    move_with_backup "${ROOT_DIR}/package.json" "${TARGET_DIR}/package.json"
fi

# 7. Tạo .gitignore mới
echo -e "${BLUE}===== Tạo .gitignore mới =====${NC}"
GITIGNORE="${TARGET_DIR}/.gitignore"
echo "# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
/coverage
.nyc_output

# Production build
/build
/dist
/out

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# Editors
.idea/
.vscode/
*.swp
*.swo
.DS_Store

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/

# Backup files
/scripts/migration/backup/
" > "$GITIGNORE"
echo -e "${GREEN}Đã tạo file: ${GITIGNORE}${NC}"

# 8. Kiểm tra sau di chuyển
echo -e "${BLUE}===== Kiểm tra sau di chuyển =====${NC}"

# 8.1 Đếm số lượng files đã di chuyển
UI_FILES=$(find "${TARGET_DIR}/apps" "${TARGET_DIR}/common" -type f | wc -l)
API_FILES=$(find "${TARGET_DIR}/api" -type f | wc -l)
CONFIG_FILES=$(find "${TARGET_DIR}/config" -type f | wc -l)
DOCS_FILES=$(find "${TARGET_DIR}/docs" -type f | wc -l)
TOOLS_FILES=$(find "${TARGET_DIR}/tools" -type f | wc -l)
TOTAL_FILES=$((UI_FILES + API_FILES + CONFIG_FILES + DOCS_FILES + TOOLS_FILES))

echo -e "${GREEN}Tổng số files đã di chuyển: ${TOTAL_FILES}${NC}"
echo -e "${GREEN}  - UI files: ${UI_FILES}${NC}"
echo -e "${GREEN}  - API files: ${API_FILES}${NC}"
echo -e "${GREEN}  - Config files: ${CONFIG_FILES}${NC}"
echo -e "${GREEN}  - Docs files: ${DOCS_FILES}${NC}"
echo -e "${GREEN}  - Tools files: ${TOOLS_FILES}${NC}"

# 8.2 Kiểm tra cấu trúc thư mục
echo -e "${BLUE}Cấu trúc thư mục đã tạo:${NC}"
find "${TARGET_DIR}" -type d -not -path "*/node_modules/*" -not -path "*/\.*" -not -path "*/scripts/migration/backup/*" | sort | sed 's|'${TARGET_DIR}'|steve|g' | sed 's/^/  /'

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}Quá trình di chuyển tổng hợp đã hoàn thành!${NC}"
echo -e "${YELLOW}Lưu ý: Các file đã được sao chép (không xóa file gốc). Bạn có thể kiểm tra và xóa file gốc sau khi xác nhận mọi thứ hoạt động tốt.${NC}"
echo -e "${GREEN}Backup được lưu tại: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}=================================================${NC}"

# 9. Hiển thị các bước tiếp theo
echo -e "${BLUE}Các bước tiếp theo:${NC}"
echo -e "${YELLOW}1. Kiểm tra cấu trúc thư mục mới trong 'steve/'${NC}"
echo -e "${YELLOW}2. Cập nhật đường dẫn imports trong các file nếu cần${NC}"
echo -e "${YELLOW}3. Cài đặt dependencies trong thư mục mới: cd steve && npm install${NC}"
echo -e "${YELLOW}4. Chạy ứng dụng từ cấu trúc mới để kiểm tra: cd steve && npm start${NC}"
echo -e "${YELLOW}5. Nếu mọi thứ hoạt động tốt, bạn có thể xóa các file/thư mục gốc${NC}"
echo -e "${BLUE}=================================================${NC}"