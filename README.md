# ✨ Vinted Clone

![Logo](Frip.png)

## 📖 Description
Cette application est une plateforme permettant aux utilisateurs d'acheter et de vendre des vêtements et articles vintage. Chacun peut agir comme vendeur ou acheteur, offrant ainsi une expérience communautaire et fluide. Le projet inclut une version web et une version mobile pour maximiser l'accessibilité.

## 🚀 Fonctionnalités principales

### 👗 Pour les vendeurs
- ✍️ Création de compte et gestion du profil.
- 🖼️ Ajout d'annonces avec photos, descriptions et prix.
- 📈 Suivi des ventes et gestion des articles vendus.

### 🛍️ Pour les acheteurs
- 🔍 Recherche et filtrage d'articles par catégorie, prix, ou mots-clés.
- ❤️ Fonctionnalité de mise en favoris des articles.
- 🔒 Achat sécurisé via des systèmes de paiement intégrés.

### 🎁 Fonctionnalités supplémentaires
- 💬 Messagerie instantanée entre acheteurs et vendeurs.
- ⭐ Système de notation et de commentaires pour évaluer les transactions.
- 📲 Notifications en temps réel sur les nouvelles annonces et messages.

## 💻 Technologies utilisées

### 🌐 Frontend
- **Web** : React.js
- **Mobile** : React Native

### 🔧 Backend
- Node.js avec Express
- Base de données : MongoDB
- Authentification : Passport.js (Google, Email, etc.)
- Stockage d'images : AWS S3 ou Cloudinary

### 🚢 Déploiement
- **Web** : Hébergé sur Vercel/Netlify
- **Mobile** : Distribué via App Store et Google Play
- **Backend** : Hébergé sur Heroku ou AWS

## 🛠️ Installation et exécution

### 📋 Prérequis
- Node.js
- MongoDB (local ou cloud)
- Yarn ou npm

### ⚙️ Étapes d'installation

1. 📂 Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   ```

2. 📥 Installez les dépendances pour le backend :
   ```bash
   cd backend
   npm install
   ```

3. 🛠️ Configurez les variables d'environnement dans un fichier `.env` :
   ```env
   PORT=5000
   MONGO_URI=<votre_mongo_uri>
   JWT_SECRET=<votre_secret_jwt>
   CLOUDINARY_URL=<votre_cloudinary_url>
   ```

4. 🚀 Lancez le serveur backend :
   ```bash
   npm run dev
   ```

5. 📥 Installez les dépendances pour le frontend web :
   ```bash
   cd ../web
   npm install
   ```

6. 🌐 Lancez l'application web :
   ```bash
   npm start
   ```

7. 📱 Pour le mobile, installez les dépendances et lancez le projet :
   ```bash
   cd ../mobile
   npm install
   npm run dev
   ```

## 🤝 Contribution
Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. 🍴 Forkez le dépôt.
2. 🌿 Créez une nouvelle branche : `git checkout -b feature-nouvelle-fonctionnalite`
3. 💾 Commitez vos modifications : `git commit -m "Ajout d'une nouvelle fonctionnalité"`
4. 📤 Poussez vers la branche : `git push origin feature-nouvelle-fonctionnalite`
5. 🔁 Ouvrez une Pull Request.

## 📜 Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---
** - Développeur principal
