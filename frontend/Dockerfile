# Estágio de Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio de Desenvolvimento
FROM node:20

WORKDIR /app

COPY package*.json ./
# Usamos --legacy-peer-deps para evitar conflitos de versão que podem ocorrer em alguns ambientes
RUN npm install --legacy-peer-deps

COPY . .

# Expõe a porta que o Vite usa para o desenvolvimento
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
