const express = require('express');
const mongo = require('./mongo.js');

const app = express();
let db;

app.use((req, res, next) => {
  console.log(req.originalUrl);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.get('/rsos', async (req, res) => {
  const rows = await db.collection('rsos').find({}, {limit: 20}).toArray();
  res.json(rows);
});

app.get('/rsos/search', async (req, res) => {
  const search = req.query.query;
  const rows = await db.collection('rsos').find({
      $or: [
        { $text: { $search: search } },
        { name: { $regex: search, $options: 'i' } }
        /* Don't use this. Sanitize search query or something */
        /* Very inefficient. Look for alternatives */
      ]
  })
    .project({ score: { $meta: 'textScore' }})
    .sort({ score: { $meta: 'textScore'} }).toArray();
  res.json(rows);
});

(async () => {
  db = await mongo();
  app.listen(3081);
})();
