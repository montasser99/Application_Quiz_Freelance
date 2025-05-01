# Application de Quiz – Plateforme pour Entretiens Techniques

Cette application de quiz a été développée dans le cadre d’un projet freelance pour permettre aux entreprises d’organiser des entretiens techniques. Elle offre une plateforme intuitive pour gérer des quiz techniques, affecter des quiz aux utilisateurs, et analyser les performances via des statistiques et historiques.

## 🎯 Fonctionnalités principales

### Rôle : Administrateur
L’administrateur dispose des privilèges suivants :
- **Gestion des quiz** : Création, modification et suppression de quiz.
- **Gestion des questions** : Ajout, modification et suppression de questions.
- **Gestion des langages** : Ajout et gestion des langages techniques associés aux quiz.
- **Affectation des questions** : Associer des questions à des quiz spécifiques.
- **Affectation des quiz** : Attribuer des quiz à des utilisateurs ayant le rôle *User*.
- **Consultation de l’historique** : Visualisation de l’historique des quiz passés par les utilisateurs.
- **Consultation des statistiques** : Analyse des performances globales de l’application (e.g., taux de réussite, nombre de quiz complétés).

### Rôle : Utilisateur
L’utilisateur (candidat passant les quiz) peut :
- **Voir les quiz assignés** : Accéder à la liste des quiz qui lui sont attribués.
- **Passer un quiz** : Répondre aux questions avec une gestion organisée du temps (chronomètre, interface claire).
- **Consulter son historique** : Visualiser les quiz passés avec les résultats.
- **Voir ses statistiques** : Analyser ses performances personnelles (e.g., score moyen, progression).

### Fonctionnalités globales
- **Gestion de profil** : Modification des informations personnelles (nom, email, etc.).
- **Authentification** : Connexion sécurisée pour administrateurs et utilisateurs.
- **Inscription** : Création de comptes pour nouveaux utilisateurs.

## 🛠️ Stack Technique

### Backend
- **Framework** : Symfony
- **Version de Symfony** : 6.4.*
- **Langage** : PHP
- **Version de PHP** : >=8.1
- **Gestion des dépendances** : Composer
- **Version de Composer** : 2.7.7 (2024-06-10)

### Frontend
- **Framework** : React
- **Version de React** : ^19.0.0
- **Langage** : JavaScript (JSX)
- **Styling** : Tailwind CSS (recommandé pour un design moderne et responsive)

### Base de Données
- **Système** : MySQL
- **Serveur** : WampServer
- **Gestion** : phpMyAdmin (inclus dans WampServer)

## 📊 Statistiques et Visualisation

L’application propose des tableaux de bord pour :
- **Administrateurs** : Statistiques globales sur l’utilisation des quiz (e.g., taux de complétion, performance par langage).
- **Utilisateurs** : Statistiques personnelles (e.g., scores, temps moyen par question).

## 📝 Prérequis

Pour exécuter l’application localement, assurez-vous d’avoir les outils suivants installés :
- **WampServer** : Pour MySQL et PHP.
- **PHP** : Version >=8.1.
- **Composer** : Version 2.7.7.
- **Node.js** : Pour le frontend React (version recommandée : >=18).
- **MySQL** : Configuré via WampServer.

## 🚀 Installation

1. **Cloner le dépôt** :
   ```bash
   git clone <URL-du-dépôt>
   cd quiz-application
   ```

2. **Configurer le backend** :
   - Accédez au dossier du backend :
     ```bash
     cd backend/backend fin
     ```
   - Installez les dépendances :
     ```bash
     composer install
     ```
   - Configurez les variables d’environnement dans le fichier `.env` :
     ```env
     DATABASE_URL="mysql://user:password@127.0.0.1:3306/quiz_db?serverVersion=8.0"
     ```
   - Créez la base de données et exécutez les migrations :
     ```bash
     php bin/console doctrine:database:create
     php bin/console doctrine:migrations:migrate
     ```
   - Lancez le serveur Symfony :
     ```bash
     symfony server:start
     ```

3. **Configurer le frontend** :
   - Accédez au dossier du frontend :
     ```bash
     cd frontend/QuizFront
     ```
   - Installez les dépendances :
     ```bash
     npm install
     ```
   - Lancez le serveur de développement React :
     ```bash
     npm start ou npm run dev
     ```

4. **Configurer la base de données** :
   - Assurez-vous que WampServer est en cours d’exécution.
   - Accédez à phpMyAdmin pour vérifier la connexion à la base de données `quiz_db`.

## 📚 Documentation

Pour plus de détails sur les endpoints de l’API ou l’utilisation de l’application, consultez le dossier `/docs` dans le dépôt ou contactez l’équipe de développement.

## 🙌 Contributions

Les contributions sont les bienvenues ! Veuillez ouvrir une *issue* ou soumettre une *pull request* pour toute suggestion ou amélioration.

## 📧 Contact

Pour toute question ou support, contactez :
- **Email** : [montasser.benouirane@esprit.tn]

## ⚠️ Remarques

- Assurez-vous que WampServer est configuré correctement pour éviter les problèmes de connexion à MySQL.
- Testez l’application dans un environnement local avant de la déployer en production.
