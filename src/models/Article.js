const { getDB, query, run } = require('../../config/database');

const ArticleModel = {

  async findAll({ categorie, auteur, date } = {}) {
    await getDB();
    let sql    = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (categorie) { sql += ' AND LOWER(categorie) = LOWER(?)'; params.push(categorie); }
    if (auteur)    { sql += ' AND LOWER(auteur) = LOWER(?)';    params.push(auteur); }
    if (date)      { sql += ' AND date(date) = date(?)';         params.push(date); }

    sql += ' ORDER BY date DESC';
    return query(sql, params).map(parseArticle);
  },

  async findById(id) {
    await getDB();
    const rows = query('SELECT * FROM articles WHERE id = ?', [id]);
    return rows[0] ? parseArticle(rows[0]) : null;
  },

  async search(term) {
    await getDB();
    const like = `%${term}%`;
    return query(
      'SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ? ORDER BY date DESC',
      [like, like]
    ).map(parseArticle);
  },

  async create({ titre, contenu, auteur, categorie = 'General', tags = [] }) {
    await getDB();
    const result = run(
      'INSERT INTO articles (titre, contenu, auteur, categorie, tags) VALUES (?, ?, ?, ?, ?)',
      [titre, contenu, auteur, categorie, JSON.stringify(tags)]
    );
    return this.findById(result.lastInsertRowid);
  },

  async update(id, { titre, contenu, categorie, tags }) {
    await getDB();
    const article = await this.findById(id);
    if (!article) return null;

    const newTitre   = titre     ?? article.titre;
    const newContenu = contenu   ?? article.contenu;
    const newCateg   = categorie ?? article.categorie;
    const newTags    = tags !== undefined ? JSON.stringify(tags) : JSON.stringify(article.tags);

    run(
      'UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?',
      [newTitre, newContenu, newCateg, newTags, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await getDB();
    const before = await this.findById(id);
    if (!before) return false;
    run('DELETE FROM articles WHERE id = ?', [id]);
    return true;
  }
};

function parseArticle(row) {
  return { ...row, tags: JSON.parse(row.tags || '[]') };
}

module.exports = ArticleModel;
