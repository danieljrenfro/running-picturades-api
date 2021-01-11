const xss = require('xss');
const bcrypt = require('bcrypt');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getUserById(db, id) {
    return db
      .from('picturades_users')
      .select('*')
      .where('id', id)
      .first();
  },
  getUserWithUserName(db, user_name) {
    return db
      .from('picturades_users')
      .where('user_name', user_name)
      .first();
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
    return null;
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name)
    };
  },
  insertUser(db, user) {
    return db
      .insert(user)
      .into('picturades_users')
      .returning('*')
      .then(([user]) => user);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

};

module.exports = UsersService;