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
  }
};

module.exports = UsersService;