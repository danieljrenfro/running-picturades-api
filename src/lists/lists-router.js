const express = require('express');
const path = require('path');

const UsersService = require('../users/users-service');
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
  })
  .post(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const { creator_id, creator_name, title, game_type } = req.body;
    const newList = { title, game_type, creator_id, creator_name};
    
    for (const [key, value] of Object.entries(newList)) {
      if (!value) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
    }

    if (game_type !== 'Pictionary' && game_type !== 'Charades') {
      return res.status(400).json({ error: `'game_type' must either be 'Pictionary' or 'Charades'` });
    }
    
    UsersService.getUserById(db, creator_id)
      .then(user => {
        if (!user) {
          return res.status(400).json({ error: `'creator_id' must be a real user` });
        }

        if (user.full_name !== creator_name) {
          return res.status(400).json({ error: `'creator_name' must match full_name of 'creator_id' user` });
        }

        return ListsService.insertList(db, newList)
          .then(list => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${list.id}`))
              .json(ListsService.serializeList(list));
          });
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
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.list_id;
    const { title, game_type } = req.body;
    const listToUpdate = { title, game_type };

    const numberOfValues = Object.values(listToUpdate).filter(Boolean).length;
    if (!numberOfValues) {
      return res.status(400).json({ error: `Request body must contain either 'title' or 'game_type'` });
    }

    ListsService.updateList(db, id, listToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.list_id;

    ListsService.deleteList(db, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
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