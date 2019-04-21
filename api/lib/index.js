const express = require('express');
const validator = require('validator');
const mongo = require('./mongo.js');
const sendErr = require('./sendErr.js');

const app = express();
let db;

app.use((req, res, next) => {
  console.log(req.originalUrl);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// Search for an RSO given a search term, a limit to the number of results, and results offset
// by a certain number
const search = async (term, limit, offset) => {
  const query = {
    $or: [
      { $text: { $search: term } },
      { name: { $regex: term , $options: 'i' } }
      /* Don't use this. Sanitize search query or something */
      /* Very inefficient. Look for alternatives */
    ]
  };
  return await db.collection('rsos')
    .find(query)
    .project({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(offset)
    .toArray();
};

app.get('/rsos', async (req, res) => {
  if (req.query.limit !== undefined && !validator.isInt(req.query.limit, { min: 1, max: 100 })) {
    sendErr(res, 400, "Limit is not an integer or is not between 1 and 100 inclusive.");
    return
  }
  if (req.query.offset !== undefined && !validator.isInt(req.query.offset, { min: 0 })) {
    sendErr(res, 400, "Offset is not an integer or is less than 0");
    return
  }
  let query = {};
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = parseInt(req.query.offset, 10) || 0;
  const term = req.query.query;
  let rows;
  if (term) {
    rows = await search(term, limit, offset);
  } else {
    rows = await db.collection('rsos').find(query).limit(limit).skip(offset).toArray();
  }
  res.json(rows);
});

// takes query params: category 
app.get('/rsos/category', async (req, res) => {
  const category = req.query.category;
  const rows = await db.collection('rsos').find({ category }).toArray();
  res.json(rows);
});

// gets all the valid categories and returns them
app.get('/rsos/allcategories', async (req, res) => {
  const rows = await db.collection('rsos').distinct('category').toArray();
  res.json(rows);
});

(async () => {
  db = await mongo();
  app.listen(3081);
})();
