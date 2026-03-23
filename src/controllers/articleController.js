const ArticleModel = require('../models/Article');

const getAllArticles = async (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = await ArticleModel.findAll({ categorie, auteur, date });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

const searchArticles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Le paramètre "query" est requis.' });
    }
    const articles = await ArticleModel.search(query.trim());
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID invalide.' });

    const article = await ArticleModel.findById(id);
    if (!article) return res.status(404).json({ success: false, message: `Article #${id} introuvable.` });

    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    const errors = [];

    if (!titre   || titre.trim()   === '') errors.push('Le champ "titre" est obligatoire.');
    if (!contenu || contenu.trim() === '') errors.push('Le champ "contenu" est obligatoire.');
    if (!auteur  || auteur.trim()  === '') errors.push('Le champ "auteur" est obligatoire.');
    if (tags !== undefined && !Array.isArray(tags)) errors.push('Le champ "tags" doit être un tableau.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Données invalides.', errors });
    }

    const article = await ArticleModel.create({
      titre:    titre.trim(),
      contenu:  contenu.trim(),
      auteur:   auteur.trim(),
      categorie,
      tags
    });
    res.status(201).json({ success: true, message: 'Article créé avec succès.', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID invalide.' });

    const { titre, contenu, categorie, tags } = req.body;
    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({ success: false, message: 'Le champ "tags" doit être un tableau.' });
    }

    const article = await ArticleModel.update(id, { titre, contenu, categorie, tags });
    if (!article) return res.status(404).json({ success: false, message: `Article #${id} introuvable.` });

    res.status(200).json({ success: true, message: 'Article mis à jour avec succès.', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID invalide.' });

    const deleted = await ArticleModel.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: `Article #${id} introuvable.` });

    res.status(200).json({ success: true, message: `Article #${id} supprimé avec succès.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  getAllArticles,
  searchArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
