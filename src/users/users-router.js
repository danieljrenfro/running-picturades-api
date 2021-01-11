const express = require('express');
const path = require('path');

const { requireAuth } = require('../middleware/jwt-auth');
const UsersService = require('./users-service');


const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    res.json(UsersService.serializeUser(req.user));
  })
  .post(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const { password, user_name, full_name } = req.body;
    
    for (const field of ['user_name', 'full_name', 'password']) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing '${field}' in request body` });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    UsersService.getUserWithUserName(db, user_name)
      .then(userFound => {
        if (userFound) {
          return res.status(400).json({ error: `Username already taken` });
        }

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name
            };
    
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });

      })
      .catch(next);
    
  });


module.exports = usersRouter;