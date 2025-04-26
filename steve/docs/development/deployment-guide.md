```bash
   certbot renew --dry-run
   ```

## Backup và Khôi Phục

### Chiến Lược Backup

1. **Database Backup**:
   ```bash
   # Backup MongoDB (thực hiện hàng ngày)
   mongodump --uri="mongodb://username:password@localhost:27017/runout" --out=/path/to/backup/$(date +%Y-%m-%d)
   
   # Nén file backup
   tar -zcvf /path/to/backup/$(date +%Y-%m-%d).tar.gz /path/to/backup/$(date +%Y-%m-%d)
   ```

2. **File Uploads Backup**:
   ```bash
   # Backup thư mục uploads (nếu lưu trữ cục bộ)
   rsync -av /path/to/runout/uploads/ /path/to/backup/uploads/
   ```

3. **Configuration Backup**:
   ```bash
   # Backup các file cấu hình
   cp -r /path/to/runout/.env* /path/to/backup/config/
   cp -r /etc/nginx/sites-available/runout /path/to/backup/config/
   ```

4. **Tự Động Hóa Backup**:
   
   Tạo cron job để chạy backup hàng ngày:
   ```
   # /etc/cron.d/runout-backup
   0 2 * * * root /path/to/backup-script.sh >> /var/log/runout-backup.log 2>&1
   ```

### Khôi Phục Từ Backup

1. **Khôi Phục Database**:
   ```bash
   # Giải nén backup
   tar -zxvf /path/to/backup/2023-01-01.tar.gz -C /tmp/
   
   # Khôi phục MongoDB
   mongorestore --uri="mongodb://username:password@localhost:27017/runout" --drop /tmp/2023-01-01/runout/
   ```

2. **Khôi Phục File Uploads**:
   ```bash
   rsync -av /path/to/backup/uploads/ /path/to/runout/uploads/
   ```

3. **Khôi Phục Configuration**:
   ```bash
   cp -r /path/to/backup/config/.env* /path/to/runout/
   cp -r /path/to/backup/config/runout /etc/nginx/sites-available/
   ```

## Monitoring và Logging

### Monitoring với PM2

1. Cài đặt PM2:
   ```bash
   npm install -g pm2
   ```

2. Cấu hình monitoring:
   ```bash
   pm2 install pm2-server-monit
   ```

3. Xem dashboard:
   ```bash
   pm2 monit
   ```

### Logging

1. **Centralized Logging với ELK Stack**:
   - Cài đặt Elasticsearch, Logstash, và Kibana
   - Cấu hình Node.js để gửi logs đến Logstash

2. **Log Rotation**:
   
   Tạo file cấu hình logrotate:
   ```
   # /etc/logrotate.d/runout
   /path/to/runout/logs/*.log {
     daily
     missingok
     rotate 14
     compress
     delaycompress
     notifempty
     create 0640 www-data www-data
     sharedscripts
     postrotate
       [ -s /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
     endscript
   }
   ```

## Scaling

### Horizontal Scaling

1. **Load Balancing với Nginx**:
   ```nginx
   upstream runout_api {
     server api1.runout.example.com;
     server api2.runout.example.com;
     server api3.runout.example.com;
   }
   
   server {
     listen 80;
     server_name api.runout.example.com;
     
     location / {
       proxy_pass http://runout_api;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

2. **Database Scaling**:
   - Thiết lập MongoDB Replica Set
   - Sử dụng Sharding cho datasets lớn

### Vertical Scaling

1. Tăng resources cho máy chủ (CPU, RAM)
2. Tối ưu hóa cấu hình Node.js:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

## Rollback Procedure

Trong trường hợp triển khai thất bại:

1. **Rollback Code**:
   ```bash
   git checkout <previous-stable-tag>
   ```

2. **Khôi phục database từ backup**

3. **Restart services**:
   ```bash
   pm2 restart all
   ```

## Checklist Triển Khai

Sử dụng checklist này trước khi triển khai lên production:

- [ ] Tất cả tests đã pass
- [ ] Code đã được review
- [ ] Database migrations đã sẵn sàng
- [ ] Backup hiện tại đã được tạo
- [ ] Tài liệu đã được cập nhật
- [ ] Security audit đã được thực hiện
- [ ] Performance testing đã được thực hiện
- [ ] Rollback plan đã sẵn sàng

## Tài Liệu Liên Quan

- [Hướng Dẫn Thiết Lập](./setup-guide.md)
- [Hướng Dẫn Phát Triển](./development-guide.md)
- [Tổng Quan Dự Án](./project-overview-and-usage.md)

## Hỗ Trợ

Nếu bạn gặp vấn đề trong quá trình triển khai, vui lòng liên hệ:

- **DevOps Team**: devops@runout.example.com
- **Emergency Hotline**: +1-555-123-4567