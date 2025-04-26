#!/bin/bash

# Script di chuyển tài nguyên tĩnh từ RunOut sang steve
# Tác giả: AI Assistant
# Ngày tạo: 2023-11-01

# Tạo thư mục đích nếu chưa tồn tại
mkdir -p steve/static/{css,js,img,fonts}
mkdir -p steve/static/img/{icons,products,logos}

# Tạo thư mục backup
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Bắt đầu di chuyển tài nguyên tĩnh..."

# Sao lưu trước khi di chuyển
echo "Tạo bản sao lưu tài nguyên tĩnh..."
cp -r RunOut/Admin/src/assets "$BACKUP_DIR/admin_assets"
cp -r RunOut/User/src/assets "$BACKUP_DIR/user_assets"
cp -r RunOut/src/assets "$BACKUP_DIR/react_assets"

# Di chuyển CSS
echo "Di chuyển và hợp nhất CSS..."
find RunOut -name "*.css" -not -path "*/node_modules/*" | while read -r file; do
  # Lấy tên tệp
  filename=$(basename "$file")
  # Kiểm tra xem tệp đã tồn tại trong thư mục đích chưa
  if [ ! -f "steve/static/css/$filename" ]; then
    cp "$file" "steve/static/css/$filename"
    echo "  Đã sao chép: $file -> steve/static/css/$filename"
  else
    # Nếu tệp đã tồn tại, kiểm tra xem nội dung có khác nhau không
    if ! cmp -s "$file" "steve/static/css/$filename"; then
      # Nếu khác nhau, tạo tên tệp mới với tiền tố từ thư mục gốc
      prefix=$(echo "$file" | grep -o 'Admin\|User\|src' | tr '[:upper:]' '[:lower:]')
      cp "$file" "steve/static/css/${prefix}_${filename}"
      echo "  Đã sao chép với tên mới: $file -> steve/static/css/${prefix}_${filename}"
    else
      echo "  Bỏ qua (trùng lặp): $file"
    fi
  fi
done

# Di chuyển JavaScript
echo "Di chuyển và hợp nhất JavaScript..."
find RunOut -name "*.js" -not -path "*/node_modules/*" -not -path "*/controllers/*" -not -path "*/services/*" | while read -r file; do
  # Chỉ di chuyển các tệp JS trong thư mục assets
  if [[ "$file" == *"/assets/"* ]]; then
    filename=$(basename "$file")
    if [ ! -f "steve/static/js/$filename" ]; then
      cp "$file" "steve/static/js/$filename"
      echo "  Đã sao chép: $file -> steve/static/js/$filename"
    else
      if ! cmp -s "$file" "steve/static/js/$filename"; then
        prefix=$(echo "$file" | grep -o 'Admin\|User\|src' | tr '[:upper:]' '[:lower:]')
        cp "$file" "steve/static/js/${prefix}_${filename}"
        echo "  Đã sao chép với tên mới: $file -> steve/static/js/${prefix}_${filename}"
      else
        echo "  Bỏ qua (trùng lặp): $file"
      fi
    fi
  fi
done

# Di chuyển hình ảnh
echo "Di chuyển và tổ chức hình ảnh..."
# Tìm tất cả các hình ảnh
find RunOut -regex ".*\.\(jpg\|jpeg\|png\|gif\|svg\|webp\)" -not -path "*/node_modules/*" | while read -r file; do
  filename=$(basename "$file")
  
  # Phân loại hình ảnh dựa trên tên hoặc đường dẫn
  if [[ "$filename" == *"icon"* || "$file" == *"/icon/"* ]]; then
    # Icon
    cp "$file" "steve/static/img/icons/$filename"
    echo "  Đã sao chép icon: $file -> steve/static/img/icons/$filename"
  elif [[ "$filename" == *"product"* || "$file" == *"/product/"* || "$filename" == "sp"* || "$filename" == *".webp" ]]; then
    # Sản phẩm
    cp "$file" "steve/static/img/products/$filename"
    echo "  Đã sao chép hình sản phẩm: $file -> steve/static/img/products/$filename"
  elif [[ "$filename" == *"logo"* ]]; then
    # Logo
    cp "$file" "steve/static/img/logos/$filename"
    echo "  Đã sao chép logo: $file -> steve/static/img/logos/$filename"
  else
    # Hình ảnh khác
    cp "$file" "steve/static/img/$filename"
    echo "  Đã sao chép hình ảnh: $file -> steve/static/img/$filename"
  fi
done

# Tối ưu hóa hình ��nh (nếu có cài đặt imagemagick)
if command -v convert &> /dev/null; then
  echo "Tối ưu hóa hình ảnh..."
  find steve/static/img -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read -r img; do
    # Tạo phiên bản WebP
    webp_file="${img%.*}.webp"
    if [ ! -f "$webp_file" ]; then
      convert "$img" -quality 85 "$webp_file"
      echo "  Đã chuyển đổi sang WebP: $img -> $webp_file"
    fi
    
    # Tối ưu hóa hình ảnh gốc
    convert "$img" -strip -quality 85 "$img.tmp"
    mv "$img.tmp" "$img"
    echo "  Đã tối ưu hóa: $img"
  done
else
  echo "Bỏ qua tối ưu hóa hình ảnh (imagemagick không được cài đặt)"
fi

echo "Hoàn thành di chuyển tài nguyên tĩnh!"
echo "Bản sao lưu được lưu trong thư mục: $BACKUP_DIR"