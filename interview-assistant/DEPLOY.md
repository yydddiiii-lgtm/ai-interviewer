# 部署指南（阿里云 ECS · Ubuntu · Docker）

## 前置条件

- 阿里云 ECS，系统：Ubuntu 22.04
- 本机已安装 Git，代码已推送到远程仓库（GitHub / Gitee 等）

---

## 第一步：服务器安装 Docker

SSH 登录服务器后，依次执行：

```bash
# 更新系统包
sudo apt-get update && sudo apt-get upgrade -y

# 安装 Docker（官方一键脚本）
curl -fsSL https://get.docker.com | sudo sh

# 将当前用户加入 docker 组（免 sudo 运行 docker）
sudo usermod -aG docker $USER

# 重新加载组权限（或重新登录 SSH）
newgrp docker

# 验证安装
docker --version
docker compose version
```

---

## 第二步：克隆代码到服务器

```bash
# 进入你希望存放项目的目录
cd /home/ubuntu

# 克隆仓库（替换为你的实际仓库地址）
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/interview-assistant
```

---

## 第三步：填写 .env 文件

```bash
# 以 .env.example 为模板创建 .env
cp .env.example .env

# 编辑 .env，填入真实值
nano .env
```

需要填写的关键字段：

| 字段 | 说明 |
|------|------|
| `POSTGRES_PASSWORD` | 数据库密码，随机强密码 |
| `JWT_SECRET` | JWT 签名密钥，至少 32 位随机字符串 |
| `CLIENT_URL` | 服务器公网 IP，格式 `http://1.2.3.4` |
| `ANTHROPIC_API_KEY` | Claude API 密钥 |

生成随机密钥的命令：
```bash
openssl rand -hex 32
```

---

## 第四步：数据库迁移

migration SQL 已通过 docker-compose 的 `volumes` 挂载到 PostgreSQL 的
`/docker-entrypoint-initdb.d/` 目录——**容器首次启动时会自动执行**，无需手动操作。

如果后续有新的 migration 文件，执行：
```bash
docker compose exec db psql -U postgres -d interview_db -f /docker-entrypoint-initdb.d/新文件.sql
```

---

## 第五步：启动服务

```bash
# 在 interview-assistant/ 目录下执行
docker compose up -d --build

# 查看启动日志
docker compose logs -f

# 查看各容器状态
docker compose ps
```

正常输出示例：
```
NAME                STATUS
interview-assistant-db-1      Up (healthy)
interview-assistant-server-1  Up
interview-assistant-client-1  Up
```

---

## 第六步：开放阿里云安全组端口

在阿里云控制台操作：

1. 进入 **ECS 控制台 → 实例 → 安全组 → 配置规则**
2. 点击 **添加安全组规则**，填写：

| 方向 | 协议 | 端口 | 源地址 | 说明 |
|------|------|------|--------|------|
| 入方向 | TCP | 80 | 0.0.0.0/0 | HTTP（前端）|
| 入方向 | TCP | 22 | 你的 IP | SSH（仅自己访问）|

> `server:3001` 端口只在 Docker 内部网络暴露，**无需**在安全组开放。

3. 浏览器访问 `http://你的服务器公网IP`，即可看到前端页面。

---

## 常用运维命令

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（⚠️ 会清空数据库）
docker compose down -v

# 重新构建并启动（代码更新后使用）
docker compose up -d --build

# 查看服务器日志
docker compose logs server
docker compose logs client

# 进入数据库容器
docker compose exec db psql -U postgres -d interview_db
```
