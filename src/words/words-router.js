const express = require('express');
const path = require('path');

const WordsService = require('./words-service');

const wordsRouter = express.Router();
const jsonBodyParser = express.json();

wordsRouter
  .route('/:word_id')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.word_id;

    WordsService.getById(db, id)
      .then(word => {
        if (!word) {
          return res.status(404).json({ error: `Word doesn't exist` });
        }

        req.word = word;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(WordsService.serializeWord(req.word));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.word_id;
    const { word } = req.body;
    const updatedWord = { word };

    if (!word) {
      return res.status(400).json({ error: `Request body must contain 'word' field` });
    }

    WordsService.updateWord(db, id, updatedWord)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);


  });


module.exports = wordsRouter;