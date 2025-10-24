FROM node:18

WORKDIR /app

# Si vas a instalar paquetes nativos, descomenta la línea de apt install
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python3 ca-certificates libssl-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copiar y instalar dependencias
COPY package*.json ./
RUN npm install 

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]