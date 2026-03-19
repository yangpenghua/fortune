# 阿里云公网IP部署计划

## 项目概述
- **项目名称**: AI算命应用
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS
- **项目类型**: 全栈应用（Next.js App Router）
- **部署方式**: Docker + Nginx（公网IP直接访问，HTTP）
- **访问地址**: http://你的服务器公网IP

---

## 一、阿里云服务器准备

### 1.1 服务器配置建议
| 配置项 | 最低配置 | 推荐配置 |
|--------|----------|----------|
| CPU    | 1核      | 2核      |
| 内存   | 1GB      | 2GB+     |
| 硬盘   | 20GB     | 40GB+    |
| 带宽   | 1Mbps    | 3Mbps+   |
| 系统   | Ubuntu 20.04+ / CentOS 7+ | Ubuntu 22.04 LTS |

### 1.2 重要：阿里云安全组配置
在阿里云控制台配置安全组规则，开放以下端口：

| 端口 | 协议 | 来源 | 说明 |
|------|------|------|------|
| 22   | TCP  | 0.0.0.0/0 | SSH 远程登录 |
| 80   | TCP  | 0.0.0.0/0 | HTTP 访问 |

**配置步骤**:
1. 登录阿里云控制台 → 云服务器ECS
2. 选择你的实例 → 安全组 → 配置规则
3. 入方向 → 手动添加
4. 添加上述端口规则

### 1.3 服务器环境初始化
```bash
# 1. 更新系统软件包
sudo apt-get update && sudo apt-get upgrade -y

# 2. 设置时区为上海
sudo timedatectl set-timezone Asia/Shanghai

# 3. 创建部署用户（可选但推荐）
sudo adduser deploy
sudo usermod -aG sudo deploy

# 4. 配置防火墙（ufw）
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable
```

---

## 二、软件环境安装

### 2.1 安装 Docker 和 Docker Compose

```bash
# 1. 更新包索引
sudo apt-get update

# 2. 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. 设置 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. 将当前用户加入 docker 组
sudo usermod -aG docker $USER

# 7. 使组生效（重新登录或执行）
newgrp docker

# 8. 验证安装
docker --version
docker compose version

# 9. 设置 Docker 开机自启
sudo systemctl enable docker
sudo systemctl start docker
```

### 2.2 安装 Nginx

```bash
# 1. 安装 Nginx
sudo apt-get install -y nginx

# 2. 启动 Nginx 并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 3. 验证 Nginx 状态
sudo systemctl status nginx
```

---

## 三、项目部署配置

### 3.1 上传项目代码到服务器

在本地电脑执行：

```bash
# 方式一：使用 scp 上传（推荐）
cd /path/to/your/project
scp -r ./suanming root@你的服务器公网IP:/home/deploy/suanming

# 方式二：使用 git（如果代码在 git 仓库）
# 在服务器上执行：
cd /home/deploy
git clone <你的仓库地址> suanming
```

### 3.2 服务器上的目录结构

登录服务器后：

```bash
# 进入项目目录
cd /home/deploy/suanming

# 确认文件存在
ls -la
# 应该看到 Dockerfile, docker-compose.yml, package.json 等文件
```

### 3.3 配置环境变量

```bash
# 1. 检查是否有 .env.example
ls -la .env*

# 2. 创建 .env 文件
# 如果有 .env.example：
cp .env.example .env

# 如果没有，直接创建：
nano .env
```

填入以下内容（根据你的实际情况修改）：

```bash
# ==========================================
# 豆包 API 配置
# ==========================================
# 从火山引擎获取 API Key（如果没有可以留空，将使用模拟数据）
DOUBAO_API_KEY=你的豆包API密钥

# 豆包 API 基础 URL（可选，默认已配置）
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

# 豆包模型 ID（可选）
DOUBAO_MODEL=你的模型ID

# ==========================================
# 站点配置（重要！使用公网IP）
# ==========================================
NEXT_PUBLIC_SITE_URL=http://你的服务器公网IP
```

### 3.4 修改 Docker Compose 配置

**重要**：需要修改端口绑定，使其可以从公网访问。

```bash
# 编辑 docker-compose.yml
nano docker-compose.yml
```

将端口映射从 `127.0.0.1:3000:3000` 改为 `0.0.0.0:3000:3000`：

```yaml
version: '3.8'

services:
  suanming:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: suanming-app
    restart: unless-stopped
    ports:
      - "0.0.0.0:3000:3000"  # 修改这里，去掉 127.0.0.1
    environment:
      - NODE_ENV=production
      - DOUBAO_API_KEY=${DOUBAO_API_KEY}
      - DOUBAO_BASE_URL=${DOUBAO_BASE_URL:-https://ark.cn-beijing.volces.com/api/v3}
      - DOUBAO_MODEL=${DOUBAO_MODEL:-}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 四、构建并启动 Docker 容器

### 4.1 构建并启动

```bash
cd /home/deploy/suanming

# 1. 构建镜像并启动容器（首次会比较慢）
docker compose up -d --build

# 2. 查看容器状态
docker compose ps

# 3. 查看启动日志
docker compose logs -f

# 等待看到类似 "ready on http://0.0.0.0:3000" 的消息
# 按 Ctrl+C 退出日志查看
```

### 4.2 验证容器是否正常运行

```bash
# 1. 检查容器状态
docker compose ps
# 应该看到 STATUS 为 Up (healthy)

# 2. 本地测试访问
curl http://localhost:3000
# 应该返回 HTML 内容

# 3. 查看实时日志
docker compose logs --tail=50 -f
```

---

## 五、配置 Nginx 反向代理

### 5.1 创建 Nginx 配置文件

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/suanming
```

填入以下配置（注意替换 `你的服务器公网IP`）：

```nginx
# ==========================================
# AI算命应用 Nginx 配置（公网IP访问）
# ==========================================

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # 使用公网IP作为 server_name，或者留空使用默认
    server_name _;

    # 日志配置
    access_log /var/log/nginx/suanming_access.log;
    error_log /var/log/nginx/suanming_error.log;

    # 最大上传大小
    client_max_body_size 10M;

    # 反向代理到 Docker 容器
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        proxy_cache_valid 404 1m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 5.2 启用 Nginx 配置

```bash
# 1. 禁用默认的 Nginx 配置
sudo unlink /etc/nginx/sites-enabled/default

# 2. 创建软链接启用我们的配置
sudo ln -s /etc/nginx/sites-available/suanming /etc/nginx/sites-enabled/

# 3. 测试配置是否正确
sudo nginx -t
# 应该看到 "syntax is ok" 和 "test is successful"

# 4. 重载 Nginx 配置
sudo systemctl reload nginx
# 或者重启
sudo systemctl restart nginx

# 5. 确认 Nginx 状态
sudo systemctl status nginx
```

---

## 六、测试公网访问

### 6.1 本地浏览器测试

在浏览器中访问：

```
http://你的服务器公网IP
```

### 6.2 功能检查清单

- [ ] 首页正常加载
- [ ] 可以输入姓名并提交
- [ ] 算命功能正常（有API密钥时显示AI结果，无密钥时显示模拟数据）
- [ ] 历史记录功能正常
- [ ] 签到功能正常
- [ ] 图片生成功能正常

---

## 七、常用维护命令

### 7.1 Docker 相关

```bash
# 进入项目目录
cd /home/deploy/suanming

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
docker compose logs --tail=100

# 重启服务
docker compose restart

# 停止服务
docker compose stop

# 启动服务
docker compose start

# 更新代码后重新构建部署
cd /home/deploy/suanming
# （如果使用 git）git pull
docker compose up -d --build

# 查看容器资源使用
docker stats

# 清理未使用的镜像
docker image prune -a
```

### 7.2 Nginx 相关

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload

# 重启 Nginx
sudo systemctl restart nginx

# 查看访问日志
sudo tail -f /var/log/nginx/suanming_access.log

# 查看错误日志
sudo tail -f /var/log/nginx/suanming_error.log
```

### 7.3 系统监控

```bash
# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看系统负载
top
# 或安装 htop
sudo apt-get install -y htop
htop
```

---

## 八、故障排查

### 8.1 常见问题

| 问题 | 可能原因 | 排查方法 |
|------|----------|----------|
| 无法访问网站 | 安全组未开放80端口 | 检查阿里云安全组配置 |
| 502 Bad Gateway | Docker容器未启动 | `docker compose ps` 查看状态 |
| 容器启动失败 | 环境变量错误或端口冲突 | 检查 `.env` 配置，检查3000端口 |
| API调用失败 | API Key错误或网络问题 | 检查 `DOUBAO_API_KEY`，查看容器日志 |

### 8.2 排查步骤

```bash
# 1. 检查 Docker 容器状态
cd /home/deploy/suanming
docker compose ps

# 2. 查看容器日志
docker compose logs --tail=50

# 3. 检查 Nginx 状态
sudo systemctl status nginx

# 4. 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/suanming_error.log

# 5. 本地测试容器是否正常
curl http://localhost:3000

# 6. 检查端口监听
sudo netstat -tlnp
# 或
sudo ss -tlnp
```

---

## 九、安全建议（公网IP部署注意事项）

### 9.1 基础安全

```bash
# 1. 定期更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 2. 禁止 root SSH 登录（如果使用 deploy 用户）
sudo nano /etc/ssh/sshd_config
# 设置 PermitRootLogin no
sudo systemctl restart sshd

# 3. 配置 Fail2Ban（防止暴力破解）
sudo apt-get install -y fail2ban
sudo systemctl enable --now fail2ban
```

### 9.2 注意事项

1. **公网IP访问没有 HTTPS**：
   - 由于没有域名，无法申请免费 SSL 证书
   - 数据传输是明文的，不适合传输敏感信息
   - 本项目不涉及敏感信息，使用 HTTP 是可接受的

2. **IP 可能变化**：
   - 如果阿里云服务器重启，公网IP可能变化
   - 建议申请弹性公网IP（EIP）并绑定

3. **后续如需域名**：
   - 购买域名后可以很容易切换到 HTTPS
   - 使用 Let's Encrypt 免费证书

---

## 十、快速部署检查清单

### 部署前
- [ ] 阿里云服务器已购买并能 SSH 登录
- [ ] 安全组已开放 22 和 80 端口
- [ ] 项目代码已准备好
- [ ] 豆包 API Key 已获取（可选）

### 部署中
- [ ] Docker 和 Docker Compose 已安装
- [ ] Nginx 已安装并运行
- [ ] 代码已上传到服务器
- [ ] `.env` 文件已配置（包含公网IP的 SITE_URL）
- [ ] `docker-compose.yml` 端口已改为 `0.0.0.0:3000:3000`
- [ ] Docker 镜像构建成功
- [ ] 容器已启动且健康检查通过
- [ ] Nginx 配置已创建并启用

### 部署后
- [ ] 浏览器可通过 `http://公网IP` 访问
- [ ] 首页正常加载
- [ ] 算命功能正常
- [ ] 历史记录功能正常
- [ ] 签到功能正常
- [ ] Docker 容器设置为自动重启

---

## 附录：项目文件结构

```
/home/deploy/suanming/
├── Dockerfile              # Docker 镜像构建文件
├── docker-compose.yml      # Docker Compose 配置（需修改端口绑定）
├── .dockerignore           # Docker 构建忽略文件
├── .env                    # 环境变量（需创建，包含公网IP）
├── next.config.js          # Next.js 配置
├── package.json            # 项目依赖
├── nginx.conf.ip.example   # 本附录中的 Nginx 配置示例
├── src/                    # 源代码
└── DEPLOY_PLAN.md          # 本文档
```

---

## 快速开始（TL;DR）

```bash
# 1. 服务器上安装 Docker 和 Nginx
# （按照第二节步骤操作）

# 2. 上传代码
scp -r ./suanming root@你的IP:/home/deploy/suanming
ssh root@你的IP
cd /home/deploy/suanming

# 3. 配置环境变量
cp .env.example .env
nano .env
# 设置 NEXT_PUBLIC_SITE_URL=http://你的IP

# 4. 修改 docker-compose.yml 端口为 0.0.0.0:3000:3000
nano docker-compose.yml

# 5. 构建并启动
docker compose up -d --build

# 6. 配置 Nginx（按照第五节）

# 7. 访问 http://你的IP
```
