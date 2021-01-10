const UsersService = {
  getUserById(db, id) {
    return db
      .from('picturades_users')
      .select('*')
      .where('id', id)
      .first();
  }
};

module.exports = UsersService;