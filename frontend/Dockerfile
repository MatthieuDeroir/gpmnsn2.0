# Étape 1 : Construire l'application React
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --force --legacy-peer-deps

# Copier le reste du code de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:stable-alpine

# Copier les fichiers construits vers le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 3000

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
