const express = require('express');
const router  = express.Router();
const {
  getAllArticles,
  searchArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titre:
 *           type: string
 *           example: "Mon premier article"
 *         contenu:
 *           type: string
 *           example: "Contenu de l'article..."
 *         auteur:
 *           type: string
 *           example: "Jean Dupont"
 *         categorie:
 *           type: string
 *           example: "Tech"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["node", "api"]
 *         date:
 *           type: string
 *           example: "2026-03-20 14:30:00"
 *     ArticleInput:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *       properties:
 *         titre:
 *           type: string
 *           example: "Mon premier article"
 *         contenu:
 *           type: string
 *           example: "Contenu de l'article..."
 *         auteur:
 *           type: string
 *           example: "Jean Dupont"
 *         categorie:
 *           type: string
 *           example: "Tech"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["node", "api"]
 */

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par mot-clé
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *         example: javascript
 *     responses:
 *       200:
 *         description: Liste des articles correspondants
 *       400:
 *         description: Paramètre query manquant
 */
router.get('/search', searchArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (filtrables)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *         example: Tech
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *         example: Jean Dupont
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date (YYYY-MM-DD)
 *         example: "2026-03-20"
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get('/', getAllArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: L'article demandé
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Mettre à jour un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id', updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', deleteArticle);

module.exports = router;
