# Utiliser Node.js 20
FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer les ports nécessaires
EXPOSE 4000 8080

# Démarrer l'application
CMD ["npm", "start"]
