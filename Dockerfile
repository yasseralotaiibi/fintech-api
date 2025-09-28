# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm install --include=dev

COPY . .

RUN npm run build && npm prune --production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/docs ./docs
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]
