const xss = require('xss');

const WordsService = {
  serializeWord(word) {
    return {
      id: word.id,
      list_id: word.list_id,
      word: xss(word.word)
    };
  }
};

module.exports = WordsService;