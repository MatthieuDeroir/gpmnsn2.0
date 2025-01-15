FROM node:22-alpine

WORKDIR /usr/src/app

# Copier les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste
COPY . .

# Exposer le port de l'application
EXPOSE 4000

# Activez le mode de débogage
ENV NODE_ENV=production
ENV DEBUG=*

# Démarrez l'application avec des options de traçage
CMD ["npm", "start", "--", "--trace-warnings", "--inspect=0.0.0.0:9229"]
