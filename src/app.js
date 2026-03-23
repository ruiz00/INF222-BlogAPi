require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const articleRoutes = require('./routes/articles');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Blog API',
      version:     '1.0.0',
      description: "API Backend pour la gestion des articles d'un blog — INF222 TAF1",
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Serveur local' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Blog API – INF222',
}));

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message:       'Blog API — INF222 TAF1',
    version:       '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      articles: `http://localhost:${PORT}/api/articles`,
    }
  });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route "${req.originalUrl}" introuvable.` });
});

// ─── Erreurs globales ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur.', error: err.message });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nBlog API démarrée sur http://localhost:${PORT}`);
  console.log(`Documentation Swagger : http://localhost:${PORT}/api-docs\n`);
});

module.exports = app;
