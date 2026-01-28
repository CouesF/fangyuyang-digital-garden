---
{"dg-publish":true,"permalink":"/2024/software/frp-01/","tags":["Network"],"created":"2024-08-27T00:45:19.701+08:00"}
---


## 服务端步骤 1-配置文件
`frps.toml`
```
bindPort = 34567
auth.token = "token"
webServer.addr = "0.0.0.0"
webServer.port = 12375
webServer.user = "user"
webServer.password = "password"
```

## 服务端步骤 2-frps 进程管理（systemd 服务设置）
要将 `frps` 设置为使用 `systemctl` 进行管理，你需要创建一个 Systemd 服务文件，并将 `frps` 配置为系统服务。以下是具体步骤：

1. **创建 Systemd 服务文件**：
   首先，你需要为 `frps` 创建一个 Systemd 服务文件。通常，这个文件应该放在 `/etc/systemd/system/` 目录下。

   你可以使用以下命令来创建和编辑该文件：

   ```bash
   sudo nano /etc/systemd/system/frps.service
   ```

2. **在服务文件中添加配置**：
   在 `frps.service` 文件中，添加如下内容：

```ini
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/path/to/frps -c /path/to/frps.toml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

   - `ExecStart` 的路径需要修改为你的 `frps` 可执行文件的位置，以及你的 `frps.toml` 配置文件的路径。
   - 确保 `User=root` 指定了正确的用户，如果你希望以其他用户身份运行，可以修改 `User` 的值。

3. **保存并退出**：
   在编辑完成后，按 `Ctrl+X`，然后按 `Y` 保存并退出。

4. **重新加载 Systemd 并启用服务**：
   现在，重新加载 Systemd 守护进程，以使新服务文件生效：

   ```bash
   sudo systemctl daemon-reload
   ```

5. **启动并启用 `frps` 服务**：
   启动 `frps` 服务并设置为开机自动启动：

   ```bash
   sudo systemctl start frps
   sudo systemctl enable frps
   ```

6. **检查服务状态**：
   你可以使用以下命令检查 `frps` 服务是否正常运行：

   ```bash
   sudo systemctl status frps
   ```

如果 `frps` 正常启动，系统将显示服务的运行状态及日志输出。这样，你的 `frps` 服务将作为系统服务来管理，并且可以使用 `systemctl` 命令进行启动、停止和重启。


## 客户端步骤 1-配置文件

```
# 服务器配置
serverAddr = "your server ip"
serverPort = 34567
auth.token = "token"
log.to = ""
log.level = "debug"


# 代理配置
[[proxies]]
name = "web app"
type = "tcp"
localPort = $LOCAL_APP_PORT
remotePort = $REMOTE_LISTEN_PORT
```

## 客户端步骤 2-运行管理 frpc

```
# 选项1: 下载 npm 和 pm2 进行服务管理
pm2 start ./frpc --name frpc -- -c frpc.toml

# 选项2: 直接运行
./frpc -c frpc.toml
```

---


# 域名配置
## 步骤 1: DNS 解析至服务器 IP

## 步骤 2 服务器配置 nginx 反向代理，将该域名转发到对应服务端口
在 Ubuntu 上配置将域名反向代理到本地的 51121 端口，你可以使用 Nginx 或 Apache 来实现。以下是使用 Nginx 的步骤：

### 1. 安装 Nginx
如果你还没有安装 Nginx，可以使用以下命令进行安装：
```bash
sudo apt update
sudo apt install nginx
```

### 2. 配置 Nginx 反向代理
在 Nginx 的配置文件中设置反向代理。

首先，创建一个新的配置文件或编辑现有的配置文件：

```bash
sudo nano /etc/nginx/sites-available/your_domain
```

将以下内容添加到文件中，替换 `your_domain` 为你的域名，并将 `localhost:51121` 设置为你要代理的本地端口：

```nginx
server {
    listen 80;
    server_name your_domain;

    location / {
        proxy_pass http://localhost:12345;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. 启用配置
保存并关闭文件后，创建一个符号链接将该配置文件链接到 `sites-enabled` 目录：

```bash
sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
```

### 4. 测试 Nginx 配置
在重新启动 Nginx 之前，先测试一下配置文件是否正确：

```bash
sudo nginx -t
```

如果没有错误，重新启动 Nginx 使配置生效：

```bash
sudo systemctl restart nginx
```

### 5. 配置防火墙 (如果有必要)
如果你使用了 UFW（Uncomplicated Firewall），你可能需要允许 Nginx 通过防火墙：

```bash
sudo ufw allow 'Nginx Full'
```

### 6. 测试反向代理
现在，你应该可以通过访问 `http://your_domain` 来访问本地运行在端口 12345 的应用程序。

### 7. 配置 SSL（可选）
为了使你的域名更安全，你可以使用 Let’s Encrypt 配置 SSL：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain
```

完成后，你的站点将通过 HTTPS 安全访问。

这样配置完成后，你的域名将通过 Nginx 反向代理到本地的 12345 端口。