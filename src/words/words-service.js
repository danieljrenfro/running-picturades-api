const xss = require('xss');

const WordsService = {
  serializeWord(word) {
    return {
      id: word.id,
      list_id: word.list_id,
      word: xss(word.word)
    };
  },
  getById(db, id) {
    return db
      .from('picturades_words')
      .select('*')
      .where({ id })
      .first();
  }
};

module.exports = WordsService;