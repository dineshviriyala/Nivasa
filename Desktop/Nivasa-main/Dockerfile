FROM node:18-alpine
WORKDIR /app

COPY . .

# 🔵 1) Build frontend
RUN cd frontend && npm ci && npm install qrcode @types/qrcode && npm run build

# 🔵 2) Backend dependencies
RUN cd backend && npm ci --omit=dev && npm run build

# 🔵 3) Run backend
CMD ["node", "backend/server.js"]
