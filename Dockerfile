FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

FROM node:22-slim AS runner

WORKDIR /app

COPY package*.json ./

COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]    
