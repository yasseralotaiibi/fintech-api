FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm install

COPY src ./src
COPY docs ./docs
COPY public ./public
COPY tests ./tests

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
