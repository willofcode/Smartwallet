const chrono = require('chrono-node');
const nlp = require('compromise');

function extractDateRange(text) {
  const results = chrono.parse(text);
  if (results.length >= 2) {
    return [
      results[0].start.date().toISOString().split('T')[0],
      results[1].start.date().toISOString().split('T')[0],
    ];
  } else if (results.length === 1) {
    const start = results[0].start.date().toISOString().split('T')[0];
    const end = results[0].end ? results[0].end.date().toISOString().split('T')[0] : start;
    return [start, end];
  }
  return null;
}

function extractCategory(text) {
  const doc = nlp(text);
  const nouns = doc.nouns().out('array');
  const commonCategories = ['groceries', 'restaurants', 'travel', 'rent', 'shopping', 'utilities', 'entertainment'];
  const matched = nouns.find(n => commonCategories.includes(n.toLowerCase()));
  return matched || null;
}

function isRecurringSearch(text) {
  return /recurring|monthly|every month/i.test(text);
}

module.exports = {
  extractDateRange,
  extractCategory,
  isRecurringSearch
};
