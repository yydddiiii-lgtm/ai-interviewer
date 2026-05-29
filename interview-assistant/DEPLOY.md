# 部署指南（阿里云 ECS · Ubuntu · Docker）

## 前置条件

- 阿里云 ECS，系统：Ubuntu 22.04
- 本机已安装 Git

---

## 第零步：SSH 登录服务器

### 找到公网 IP
阿里云控制台 → ECS → 实例列表 → 复制**公网 IP 地址**（格式如 `47.xxx.xxx.xxx`）

### 登录（Windows PowerShell）
```powershell
ssh root@你的公网IP
```
第一次连接会问 `Are you sure you want to continue connecting?` → 输入 `yes`，然后输入密码。

### 忘记密码？
阿里云控制台 → ECS → 实例 → 更多 → 密码/密钥 → **重置实例密码** → 重启实例后生效。

### SSH 连不上？
检查安全组是否开放了 22 端口（入方向 / TCP / 22 / 0.0.0.0/0）。

---

## 第一步：服务器安装 Docker

> 阿里云 ECS 在国内，无法直接访问 Docker 官方源，需要用阿里云镜像源安装。

```bash
# 1. 更新系统包（中途可能弹出"哪些服务需要重启"的交互界面，直接回车确认即可）
sudo apt-get update && sudo apt-get upgrade -y

# 2. 添加阿里云 Docker 安装源的信任密钥
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 3. 把阿里云 Docker 源地址写入系统软件列表
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 刷新软件列表
sudo apt-get update

# 5. 安装 Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 配置镜像加速器
Docker 拉取镜像（软件包）默认走 Docker Hub（美国），国内访问会超时，需配置国内加速器：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 将当前用户加入 docker 组（免 sudo）
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 验证安装
```bash
docker run hello-world
```
看到 `Hello from Docker!` 即成功。

---

## 第二步：上传代码到服务器

### 方法一：从 GitHub clone（推荐）

```bash
cd /home
git clone https://github.com/yydddiiii-lgtm/ai-interviewer.git
cd ai-interviewer/interview-assistant
```

后续代码有更新时，进入项目目录执行：
```bash
git pull origin master
```

> 如果 git pull 超时或报 TLS 错误，通常是网络抖动，多试几次即可。

---

### 方法二：从本机用 scp 上传（GitHub 完全不可用时的备用方案）

在**本机 PowerShell**（新开一个窗口，不是服务器终端）执行：

```powershell
scp -r "e:\AI Coding\1\interview-assistant" root@你的公网IP:/home/
```

输入服务器 root 密码，等待上传完成（文件较多时会比较慢）。

上传完成后回到**服务器终端**，进入项目目录：

```bash
cd /home/interview-assistant
```

---

## 第三步：填写 .env 文件

```bash
cp .env.example .env
nano .env
```

> nano 是终端文本编辑器：方向键移动光标，Backspace 删除，编辑完按 `Ctrl+X` → `Y` → `Enter` 保存退出。

需要填写的关键字段：

| 字段 | 说明 |
|------|------|
| `POSTGRES_PASSWORD` | Docker 内部数据库密码，自己设一个，如 `MyDb@2026` |
| `JWT_SECRET` | JWT 签名密钥，用下方命令生成 |
| `CLIENT_URL` | 服务器公网 IP，格式 `http://1.2.3.4:8080` |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |

生成随机 JWT 密钥：
```bash
openssl rand -hex 32
```

### 关于端口
如果服务器 80 端口已被占用，`docker-compose.yml` 里 client 服务的端口已改为 `8080:80`，访问地址为 `http://公网IP:8080`。

---

## 第四步：数据库迁移

`001_init.sql` 已通过 docker-compose volumes 挂载到 PostgreSQL 的 `/docker-entrypoint-initdb.d/`，**容器首次启动时自动执行**，无需手动操作。

后续新增 migration 文件时：
```bash
docker compose exec db psql -U postgres -d interview_db -f /docker-entrypoint-initdb.d/新文件.sql
```

---

## 第五步：启动服务

首次启动前先单独构建前端（方便排查构建错误）：

```bash
docker compose build client --no-cache 2>&1 | tail -20
```

构建成功后启动所有服务：

```bash
docker compose up -d
```

查看状态：
```bash
docker compose ps
docker compose logs -f
```

正常输出：
```
NAME                              STATUS
interview-assistant-db-1      Up (healthy)
interview-assistant-server-1  Up
interview-assistant-client-1  Up
```

---

## 第六步：开放阿里云安全组端口

阿里云控制台 → ECS → 安全组 → 配置规则 → 添加入方向规则：

| 协议 | 端口 | 源地址 | 说明 |
|------|------|--------|------|
| TCP | 8080 | 0.0.0.0/0 | 前端访问 |
| TCP | 22 | 你的 IP | SSH |

> `db`（5432）和 `server`（3001）只在 Docker 内部通信，**不需要**开放安全组端口。

浏览器访问 `http://你的公网IP:8080` 即可。

---

## 概念说明

### "镜像"这个词出现了三次，含义完全不同

| 词 | 含义 |
|---|------|
| Ubuntu 镜像源 | Ubuntu 软件商店的国内备份地址，用来安装 Docker 本身 |
| Docker 镜像加速器 | Docker Hub（模板仓库）的国内备份地址，用来下载 Docker 镜像 |
| Docker 镜像 | 容器的模板本身（如 `postgres:15`、`node:20-alpine`），不管从哪里下载内容都一样 |

---

### Docker 和端口的关系

Docker 里的服务默认完全隔离，**只有在 `docker-compose.yml` 里写了 `ports:` 才会占用服务器的真实端口**。

- `db`（PostgreSQL）— 用 `expose:`，只在 Docker 内部可见，不占用服务器端口
- `server`（Node.js）— 用 `expose:`，只在 Docker 内部可见，不占用服务器端口
- `client`（Nginx）— 用 `ports: "8080:80"`，占用服务器 8080 端口，外网才能访问

只有 client 需要占用端口，因为它是用户用浏览器访问的入口，必须对外暴露。

---

### `8080:80` 是什么意思

格式是 `服务器端口:容器内部端口`。

- 左边 `8080` = 服务器对外暴露的端口，用户访问 `http://IP:8080`
- 右边 `80` = 容器内 Nginx 监听的端口，固定不变

Docker 负责把外部 8080 的流量转发到容器内的 80。

**换端口只需改左边的数字**，右边的 80 不用动。

---

### Nginx 和 Docker 是两层"门卫"，职责不同

```
用户浏览器 → 服务器:8080 → Docker转发 → 容器:80(Nginx) → /api路径 → Node.js后端
                                                            → 其他路径 → 前端页面
```

- **Docker**：负责把服务器端口和容器端口打通
- **Nginx**：负责容器内部的请求分发（/api 转后端，其他返回前端）

---

### 换端口需要改哪些地方

1. `docker-compose.yml` — 改 `ports: "新端口:80"`
2. 阿里云安全组 — 开放新端口

`.env` 文件里不需要配端口。

---

### Node.js 是什么

在服务器/终端上运行 JavaScript 的环境。我们的后端（Express）用它运行，前端构建工具（Vite、npm）也需要它才能执行。`FROM node:20-alpine` 就是使用一个装好了 Node.js 20 的 Linux 环境来构建前端。

---

## 常用运维命令

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（⚠️ 会清空数据库）
docker compose down -v

# 代码更新后重新构建启动
docker compose up -d --build

# 查看日志
docker compose logs server
docker compose logs client

# 进入数据库
docker compose exec db psql -U postgres -d interview_db
```

---

## 常见问题

**curl: (35) OpenSSL SSL_connect: Connection reset by peer**
→ Docker 官方源被墙，改用阿里云镜像源安装（见第一步）。

**docker: Error response from daemon: i/o timeout**
→ Docker Hub 被墙，需配置镜像加速器（见第一步）。

**git pull 卡住或 TLS 错误**
→ 网络抖动，多试几次通常能成。实在不行改用 scp 从本机直接上传（见第二步方法二）。

**80 端口已被占用**
→ `docker-compose.yml` 中 client 的 ports 改为 `"8080:80"`，安全组开放 8080 端口。

**Cannot find native binding / @tailwindcss/oxide requires node >= 20**
→ `client/Dockerfile` 第一行改为 `FROM node:20-alpine AS builder`，服务器上执行：
```bash
sed -i 's/node:18-alpine AS builder/node:20-alpine AS builder/' client/Dockerfile
```
