// grab the mongoose module
var mongoose = require('mongoose');
var createdDate = require('../util/createdDate');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: String,
    author: { type: String, ref: 'User' },
    body: String
});

// create a query for comments with a blogpost _id matching `id`
articleSchema.statics.findComments = function (id, callback) {
    return this.model('Comment').find({ article: id }, callback);
};

articleSchema.statics.edit = function (req, callback) {
    var id = req.param('articleId');
    var author =  req.user._id.toString();

    // validate current user authored this article
    var query = { _id: id, author: author };

    var update = {};
    update.title = req.param('title');
    update.body = req.param('body');

    this.update(query, update, function (err, numAffected) {
        if (err) return callback(err);

        if (0 === numAffected) {
            return callback(new Error('No article to modify'));
        }

        callback();
    })
};

// add created date property
articleSchema.plugin(createdDate);

var lifecycle = require('mongoose-lifecycle');
articleSchema.plugin(lifecycle);

var mongoosePaginate = require('mongoose-paginate');
articleSchema.plugin(mongoosePaginate);

// compile the model
var Article = mongoose.model('Article', articleSchema);

Article.on('afterRemove', function (post) {
    this.model('Comment').remove({ post: post._id }).exec(function (err) {
        if (err) {
            console.error('had trouble cleaning up old comments', err.stack);
        }
    })
});

module.exports = Article;
