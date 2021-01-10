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
  },
  insertList(db, newList) {
    return db
      .insert(newList)
      .into('picturades_lists')
      .returning('*')
      .then(([row]) => row);
  },
  updateList(db, id, updatedList) {
    return db
      .from('picturades_lists')
      .where({ id })
      .update(updatedList);
  }
};

module.exports = ListsService;