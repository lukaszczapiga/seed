// load up the user model
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app, passport, aclInstance) {

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


    // api users calls

    // process the login form
    app.post('/api/login',function (req, res, next) {
        passport.authenticate('local-login', function(err, data, info) {
            var user = data.user;
            var messageType = data.messageType;
            if (err) {
                return next(err);
            }
            if (!user) {
                var message = '';
                if(messageType === 'loginMessageEmail') {
                    message =  req.flash('loginMessageEmail');
                }

                if(messageType === 'loginMessagePassword'){
                    message = req.flash('loginMessagePassword');
                }

                return res.json({'success' : false, 'message': {'type': messageType, 'content' : message}});
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.json(
                    {
                        'success' : true,
                        'id': 1,
                        'user': {
                            'id': 1,
                            'name' : req.user.local.name,
                            'role': req.user.local.role
                        }
                    }
                );
                //return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });

    app.get('/api/logout', function(req,res) {
        req.logOut();
        req.session.destroy();
        res.json({'success' : true});
    });

    app.post('/api/users', function (req, res, next) {

        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({'success': false, 'message': req.flash('signupMessage')});
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                var userId = req.user._id;
                var role = req.user.local.role;
                aclInstance.addUserRoles(userId.toString(), role);

                return res.json(
                    {
                        'success' : true,
                        'id': req.session.id,
                        'user': {
                            'id': userId,
                            'name' : req.user.local.name,
                            'role': role
                        }
                    }
                );
            });
        })(req, res, next);

    });

    app.get('/api/users', [authenticated, aclInstance.middleware(2, getUserId)],  function (req, res, next) {
        User.find({}, function(err, users) {
            if(err){
                return next(err);
            }
            var userMap = [];

            users.forEach(function(user) {
                var u = {};
                u.id = user._id;
                u.role = user.local.role;
                u.name = user.local.name;
                u.email = user.local.email;

                userMap.push(u);
            });

            res.json(
                {
                    'success': true,
                    'users': userMap
                }
            );
        });
    });

    app.delete('/api/users/:userId', [authenticated,aclInstance.middleware(2, getUserId)], function (req,res,next) {
        User.findByIdAndRemove(req.params.userId, function(err) {
            if(err){
                return next(err);
            }
            res.json({'success' : true});
        });
    });

    // Setting a new role
    app.post('/api/users/setRole',[authenticated, aclInstance.middleware(2, getUserId)], function(req,res, next) {
        aclInstance.addUserRoles( req.params.user, req.params.role );
        res.json({'success' : true, 'message':  req.params.user + ' is a ' + req.params.role });
    });

    app.get('/api/profile', [authenticated, aclInstance.middleware(2, getUserId)] , function(req,res) {
        res.json(
            {
                'success' : true,
                'id': req.session.id,
                'user': {
                    'id': req.user._id,
                    'name' : req.user.local.name,
                    'email': req.user.local.email,
                    'role': req.user.local.role
                }
            }
        );
    });

    app.get('/api/keep-alive', [authenticated], function(req,res){
        res.json({'success' : true});
    });


    // Unsetting a role
    app.get('/disallow/:user/:role',[authenticated, aclInstance.middleware(1, getUserId)], function( req,res, next ) {
        aclInstance.removeUserRoles( req.params.user, req.params.role );
        res.json({'success' : true, 'message': req.params.user + ' is not a ' + req.params.role + ' anymore.' });
    });

};