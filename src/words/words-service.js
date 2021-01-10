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
  },
  updateWord(db, id, updatedWord) {
    return db
      .from('picturades_words')
      .where({ id })
      .update(updatedWord);
  },
  insertWords(db, newWords) {
    return db
      .insert(newWords.words)
      .into('picturades_words')
      .returning('*')
      .then(rows => rows);
  }
};

module.exports = WordsService;