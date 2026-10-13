# app_coloc

Une application web simple pour savoir qui est présent dans la colocation.

## 📌 Fonctionnalités
- ✅ Tableau des colocataires avec statut Présent/Absent
- ✅ Possibilité d'ajouter des invités temporaires
- ✅ Mise à jour en temps réel (pas besoin de rafraîchir)
- ✅ Design responsive (adapté aux iPhones)
- ✅ Pas d'authentification nécessaire

## 🚀 Utilisation

### 1. Configurer Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Dans le projet, allez dans **Project settings** (⚙️) > **General**
4. Faites défiler vers le bas et copiez la configuration Firebase (remplacez dans `app.js`)

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

5. Activez Firestore Database:
   - Allez dans **Firestore Database** > **Créer une base de données**
   - Choisissez le mode **test** (pour le développement) ou **locked mode** (pour la production)
   - Sélectionnez une localisation (ex: `europe-west`)

### 2. Personnaliser les colocataires
Dans `app.js`, modifiez la liste des colocataires:

```javascript
const roommates = [
    { id: "clement", name: "Clément", avatar: "C" },
    { id: "alice", name: "Alice", avatar: "A" },
    { id: "bob", name: "Bob", avatar: "B" },
    { id: "charlie", name: "Charlie", avatar: "Ch" },
    { id: "david", name: "David", avatar: "D" }
];
```

### 3. Déployer le site

#### Option 1: GitHub Pages (gratuit)
1. Poussez le code sur GitHub
2. Allez dans **Settings** > **Pages**
3. Sélectionnez la branche `main` et le dossier `/root`
4. Votre site sera disponible à `https://votre-utilisateur.github.io/app_coloc/`

#### Option 2: Vercel (gratuit)
1. Installez Vercel CLI: `npm install -g vercel`
2. Exécutez: `vercel`
3. Suivez les instructions

#### Option 3: Netlify (gratuit)
1. Glissez-déposez le dossier sur [Netlify](https://app.netlify.com/drop)
2. Votre site sera déployé automatiquement

## 📱 Installation sur l'écran d'accueil (iPhone)
1. Ouvrez le site dans Safari
2. Appuyez sur le bouton **Partager** (carré avec flèche vers le haut)
3. Sélectionnez **Sur l'écran d'accueil**
4. Donnez un nom et validez

## 🛠 Structure du projet
```
app_coloc/
├── index.html    # Page principale
├── style.css     # Styles CSS
└── app.js        # Logique JavaScript + Firebase
```

## 🔧 Technologies utilisées
- HTML5 / CSS3
- JavaScript (Vanilla)
- Firebase Firestore (base de données en temps réel)
