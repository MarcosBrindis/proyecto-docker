FROM node:18 AS build

WORKDIR /app

# Permitir pasar VITE_API_URL en tiempo de build via build-arg
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y construir
COPY . .
# Al tener ENV VITE_API_URL antes del build, Vite reemplazará import.meta.env.VITE_API_URL en la build
RUN npm run build

# Etapa de producción: servir archivos estáticos con 'serve'
FROM node:18

WORKDIR /app

RUN npm install -g serve

# Copiar build
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]