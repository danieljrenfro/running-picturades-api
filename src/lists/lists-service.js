const xss = require('xss');

const ListsService = {
  getAllLists(db) {
    return db
      .select('*')
      .from('picturades_lists');
  },
  serializeList(list) {
    return {
      id: list.id,
      title: xss(list.title),
      game_type: list.game_type,
      creator_id: list.creator_id,
      creator_name: list.creator_name
    };
  },
  getById(db, id) {
    return db
      .from('picturades_lists')
      .select('*')
      .where('id', id)
      .first();
  },
  getWordsByListId(db, list_id) {
    return db
      .from('picturades_words')
      .select('*')
      .where({ list_id });
  }
};

module.exports = ListsService;