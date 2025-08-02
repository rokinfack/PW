FROM mcr.microsoft.com/playwright:v1.54.0-noble

# Variables d'environnement
ENV ENVIRONNEMENT=integ
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

# 1️⃣ Installer Docker CLI minimal pour accéder au socket Docker
USER root
RUN apt-get update && apt-get install -y docker.io \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2️⃣ Copier d'abord les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./

# 3️⃣ Installer les dépendances Node.js
RUN npm ci

# 4️⃣ Copier le reste du code
COPY . .

# 5️⃣ Installer les navigateurs Playwright avec toutes les dépendances
RUN npx playwright install --with-deps chromium firefox

# 6️⃣ Nettoyer
