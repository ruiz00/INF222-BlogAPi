# Blog API — INF222 TAF1

API RESTful pour la gestion des articles d'un blog, développée avec **Node.js**, **Express** et **SQLite**.

---

## Prérequis

- Node.js >= 18.x
- npm >= 9.x

---

## Installation et démarrage

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_NOM/blog-api.git
cd blog-api

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start

# Mode développement (rechargement automatique)
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

Documentation Swagger : **http://localhost:3000/api-docs**

---

## Structure du projet

```
blog-api/
├── src/
│   ├── app.js                     # Point d'entrée + Swagger
│   ├── routes/
│   │   └── articles.js            # Endpoints + annotations Swagger
│   ├── controllers/
│   │   └── articleController.js   # Logique métier + validation
│   └── models/
│       └── Article.js             # Requêtes SQLite (async/await)
├── config/
│   └── database.js                # Connexion et initialisation SQLite
├── .env                           # Variables d'environnement
├── .gitignore
├── package.json
└── README.md
```

---

## Endpoints

| Méthode    | Endpoint                          | Description                   | Code HTTP |
| :--------- | :-------------------------------- | :---------------------------- | :-------: |
| `GET`      | `/api/articles`                   | Lister tous les articles      |    200    |
| `GET`      | `/api/articles?categorie=Tech`    | Filtrer par catégorie         |    200    |
| `GET`      | `/api/articles?auteur=Jean`       | Filtrer par auteur            |    200    |
| `GET`      | `/api/articles?date=2026-03-20`   | Filtrer par date (YYYY-MM-DD) |    200    |
| `GET`      | `/api/articles/:id`               | Récupérer un article par ID   | 200 / 404 |
| `POST`     | `/api/articles`                   | Créer un nouvel article       | 201 / 400 |
| `PUT`      | `/api/articles/:id`               | Modifier un article existant  | 200 / 404 |
| `DELETE`   | `/api/articles/:id`               | Supprimer un article          | 200 / 404 |
| `GET`      | `/api/articles/search?query=mot`  | Recherche plein texte         | 200 / 400 |

---

## Modèle de données

| Champ       | Type      | Obligatoire | Description                        |
| :---------- | :-------: | :---------: | :--------------------------------- |
| `id`        | integer   |    Auto     | Identifiant unique auto-généré     |
| `titre`     | string    |    Oui      | Titre de l'article                 |
| `contenu`   | string    |    Oui      | Corps de l'article                 |
| `auteur`    | string    |    Oui      | Nom de l'auteur                    |
| `categorie` | string    |    Non      | Catégorie (défaut : `General`)     |
| `tags`      | array     |    Non      | Liste de mots-clés (défaut : `[]`) |
| `date`      | string    |    Auto     | Date de création (ISO 8601)        |

---

## Exemples d'utilisation

### Créer un article

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement JavaScript côté serveur...",
    "auteur": "Jean Dupont",
    "categorie": "Tech",
    "tags": ["nodejs", "javascript", "backend"]
  }'
```

Réponse `201 Created` :

```json
{
  "success": true,
  "message": "Article créé avec succès.",
  "data": {
    "id": 1,
    "titre": "Introduction à Node.js",
    "auteur": "Jean Dupont",
    "categorie": "Tech",
    "tags": ["nodejs", "javascript", "backend"],
    "date": "2026-03-20 14:30:00"
  }
}
```

### Lister tous les articles

```bash
curl http://localhost:3000/api/articles
```

### Filtrer par catégorie et date

```bash
curl "http://localhost:3000/api/articles?categorie=Tech&date=2026-03-20"
```

### Récupérer un article par ID

```bash
curl http://localhost:3000/api/articles/1
```

### Rechercher des articles

```bash
curl "http://localhost:3000/api/articles/search?query=javascript"
```

### Modifier un article

```bash
curl -X PUT http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Titre mis à jour",
    "tags": ["express", "api"]
  }'
```

### Supprimer un article

```bash
curl -X DELETE http://localhost:3000/api/articles/1
```

---

## Codes HTTP

| Code  | Statut                |  Cas d'utilisation                                    |
| :---: | :-------------------- | :---------------------------------------------------- |
| `200` | OK                    | Requête réussie — lecture, modification, suppression  |
| `201` | Created               | Article créé avec succès                              |
| `400` | Bad Request           | Données invalides ou champs obligatoires manquants    |
| `404` | Not Found             | Article introuvable (ID inexistant)                   |
| `500` | Internal Server Error | Erreur inattendue côté serveur                        |

---

## Bonnes pratiques appliquées

- Validation des entrées : `titre`, `contenu` et `auteur` sont obligatoires
- Séparation stricte des couches : Routes / Contrôleurs / Modèles
- Requêtes préparées SQLite pour prévenir les injections SQL
- Sécurisation des en-têtes HTTP avec `helmet`
- Journalisation des requêtes avec `morgan`
- Configuration via variables d'environnement (`.env`)
- Codes HTTP sémantiques sur tous les endpoints

---

## Technologies utilisées

| Technologie            | Version   | Rôle                                           |
| :--------------------- | :-------: | :--------------------------------------------- |
| Node.js + Express.js   | ^4.18.3   | Serveur HTTP et routing                        |
| sql.js                 | ^1.12.0   | Base de données SQLite (WebAssembly, Node v24) |
| swagger-jsdoc          | ^6.2.8    | Génération de la spécification OpenAPI 3.0     |
| swagger-ui-express     | ^5.0.0    | Interface Swagger UI sur `/api-docs`           |
| helmet                 | ^7.1.0    | Sécurisation des en-têtes HTTP                 |
| cors                   | ^2.8.5    | Gestion du Cross-Origin Resource Sharing       |
| morgan                 | ^1.10.0   | Journalisation des requêtes HTTP               |
| dotenv                 | ^16.4.5   | Variables d'environnement                      |

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
NODE_ENV=development
```

---

## Auteur

**VOTRE NOM COMPLET** — Matricule : **VOTRE MATRICULE**

INF222 — Développement Web | Université de [Votre Université] | 2026
