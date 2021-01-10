const express = require('express');
const ListsService = require('./lists-service');
const WordsService = require('../words/words-service');

const listsRouter = express.Router();
const jsonBodyParser = express.json();


listsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    
    ListsService.getAllLists(db)
      .then(lists => {
        const serializedLists = lists.map(ListsService.serializeList);

        res.status(200).json(serializedLists);
      })
      .catch(next);
  });

listsRouter
  .route('/:list_id')
  .all((req, res, next) => {
    const id = req.params.list_id;
    const db = req.app.get('db');

    ListsService.getById(db, id)
      .then(list => {
        if (!list) {
          return res.status(404).json({ error: `List doesn't exist` });
        }

        req.list = list; 
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(ListsService.serializeList(req.list));
  });

listsRouter
  .route('/:list_id/words')
  .all((req, res, next) => {
    const list_id = req.params.list_id;
    const db = req.app.get('db');

    ListsService.getById(db, list_id)
      .then(list => {
        if (!list) {
          return res.status(404).json({ error: `List doesn't exist` });
        }

        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const list_id = req.params.list_id;
    const db = req.app.get('db');
    
    ListsService.getWordsByListId(db, list_id)
      .then(words => {
        const serializedWords = words.map(WordsService.serializeWord);

        res.json(serializedWords);
      })
      .catch(next);
  });

module.exports = listsRouter;
