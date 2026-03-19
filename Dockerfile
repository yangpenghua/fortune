# 多阶段构建：依赖安装阶段
FROM node:20-alpine AS deps
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 多阶段构建：构建阶段
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖和源代码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 确保 public 目录存在
RUN mkdir -p public

# 构建 Next.js 应用
RUN npm run build

# 多阶段构建：生产阶段
FROM node:20-alpine AS runner
WORKDIR /app

# 设置生产环境
ENV NODE_ENV production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public

# 复制构建产物并设置权限
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 环境变量
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
