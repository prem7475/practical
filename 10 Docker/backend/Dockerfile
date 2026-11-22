FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace backend --omit=dev
COPY backend ./backend

ENV PORT=5004
EXPOSE 5004
CMD ["node", "backend/server.js"]
