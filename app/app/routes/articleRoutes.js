var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');

module.exports = function(app, aclInstance) {

    var path = require('path');

    // Authentication middleware for passport
    var authenticated = function ( req, res, next ) {
        if (req.isAuthenticated()) {
            return next();
        }
        //res.status( 401).send('User not authenticated');
        res.json({'success' : false});

    };

    function getUserId( req, res ) {
        return req.user._id.toString();
    }


    app.post('/api/articles', [authenticated], function(req,res,next){
        var body = req.body.content;
        var title = req.body.title;
        var tags = req.body.tags;
        var author = getUserId(req,res);

        Article.create({
            body: body,
            title: title,
            author: author
        }, function (err, post) {
            if(err){
                return next(err);
            }
            //res.redirect('/post/' + post.id);
            res.json({
                'success': true,
                'article': {
                    'post': post, 'comments': ''
                }
            });
        });
    });

    app.get('/api/articles/page/:page/:limit', function(req,res,next){
        var page = req.params.page;
        var limit = req.params.limit;
        Article.paginate({}, { sort: { created: -1 }, page: page, limit: limit } ).then(function(result) {
            // result.docs
            // result.total
            // result.limit - 10
            // result.page - 3
            // result.pages
            res.json({
                'success': true,
                'articles': result.docs,
                'limit' : result.limit,
                'page' : result.page,
                'pages': result.pages,
                'total': result.total
            });
        });
    });

    app.get('/api/articles', function(req,res,next){

        Article.find().sort('created').exec(function (err, articles) {
            if (err) return next(err);
            res.json({
                'success': true,
                'articles': articles
            });
        });

    });

    app.get('/api/articles/:id', function(req,res,next){
        var id = req.params.id;

        Article.findComments(id)
            .sort('created')
            .select('-_id') // exclude the _id
            .populate('author')
            .exec()
            .then(function (comments){
                Article.findById(id).populate('author')
                    .exec(function (err, article) {
                    if(err){
                        return next(err);
                    }

                    if (!article){
                        return res.json({'success': false, 'message': '404 not found'});
                    }

                    res.json({
                        'success': true,
                        'article': article,
                        'comments': comments
                    });
                })
            });
    });

    app.put('/api/articles/:articleId', [authenticated], function(req,res,next){
        Article.edit(req, function (err) {
            if(err){
                return next(err);
            }
            res.json({'success': true});
            //res.redirect("/post/" + req.param('id'));
        })
    });

    app.delete('/api/articles/:articleId', [authenticated], function(req,res,next){
        var id = req.params.articleId;

        Article.findOne({ _id: id }, function (err, article) {
            if(err){
                return next(err);
            }

            // validate logged in user authored this post
            if (article.author != getUserId(req, res)) {
                return res.status(403).send('User not authorised. Not an author.');
            }

            article.remove(function (err) {
                if(err){
                    return next(err);
                }

                res.json({'success': true});
            })
        })
    });

    // comments
    app.post("/api/articles/comment", [authenticated], function (req, res, next) {
        var id = req.body.id;
        var body = req.body.commentBody;
        var author = getUserId(req,res);

        Comment.create({
            article: id,
            body: body,
            author: author
        }, function (err, comment) {
            if(err){
                return next(err);
            }

            res.json({
                'success': true,
                'comment': comment
            });
        });
    });

};