# gpmnsn2.0

##### REDIS
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl status redis-server
```

Configure Persistence:
Enable Append-Only File (AOF) mode for durability.
Edit /etc/redis/redis.conf:
```bash
appendonly yes
```
Start Redis Server:
```bash
sudo service redis-server start
```