-- Initialize database with proper character set
ALTER DATABASE artist_commission_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions
GRANT ALL PRIVILEGES ON artist_commission_db.* TO 'commission_user'@'%';
FLUSH PRIVILEGES;
