// app/models/translate.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TranslateSchema   = new Schema({
    q: String,
    target: String
});

module.exports = mongoose.model('Translate', TranslateSchema);