FROM node:22-alpine AS builder

RUN npm install -g npm@latest

WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

FROM node:22-alpine AS production

RUN npm install -g npm@latest

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "index.js"]
