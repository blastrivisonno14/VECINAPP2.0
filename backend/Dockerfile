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
# Generar cliente Prisma y ejecutar migraciones; si no hay migraciones, usar db push
CMD ["sh", "-c", "npx prisma generate && (npx prisma migrate deploy || npx prisma db push) && node dist/index.js"]
