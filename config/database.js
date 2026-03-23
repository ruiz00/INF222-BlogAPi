const path      = require('path');
const fs        = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, '..', 'blog.db');

let db = null;

async function getDB() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  initDB();
  return db;
}

function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      titre     TEXT    NOT NULL,
      contenu   TEXT    NOT NULL,
      auteur    TEXT    NOT NULL,
      categorie TEXT    NOT NULL DEFAULT 'General',
      tags      TEXT    NOT NULL DEFAULT '[]',
      date      TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
  saveDB();
}

function saveDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  const rows = [];
  stmt.bind(params);
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDB();
  const res   = db.exec('SELECT last_insert_rowid() as id');
  const lastId = res[0] ? res[0].values[0][0] : null;
  return { lastInsertRowid: lastId };
}

module.exports = { getDB, query, run, saveDB };
