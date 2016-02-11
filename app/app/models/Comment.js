var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var createdDate = require('../util/createdDate');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: { type: String, trim: true, validate: validateText },
    article: { type: ObjectId, index: true },
    author:  { type: String, ref: 'User' }
});

function validateText (str) {
    return str.length < 500;
}

// add created date property
commentSchema.plugin(createdDate);

module.exports = mongoose.model('Comment', commentSchema);