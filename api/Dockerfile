# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Nur package-Dateien kopieren und Dependencies installieren 
COPY package*.json ./
RUN npm ci

# Restlichen Code kopieren
COPY . .

# Prisma Client generieren und NesJS builden
RUN npx prisma generate 
RUN npm run build

# --- Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Alles aus dem Builder übernehmen (dist, prisma, node_modules)
COPY --from=builder /usr/src/app ./

EXPOSE 4000

CMD [ "node", "dist/main.js" ]