FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json* tsconfig.json .eslintrc.js .prettierrc jest.config.js ./
COPY prisma ./prisma
COPY src ./src
COPY docs ./docs
COPY public ./public

RUN npm install

CMD ["npm", "run", "dev"]
