# 🐳 Etapa 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Instala herramientas de compilación
RUN apt-get update && apt-get install -y python3 build-essential

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# 🐳 Etapa 2: Producción
FROM node:20-slim

# Crear usuario no root
RUN groupadd -r app && useradd -r -g app app
USER app

WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 4000

CMD ["node", "dist/main"]