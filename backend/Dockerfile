FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Instalar TODAS las dependencias (incluye Prisma CLI para migraciones)
RUN npm install
COPY . .
# Generar build TypeScript
RUN npm run build

# Imagen final
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
EXPOSE 4000
# Ejecutar migraciones antes de iniciar el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
