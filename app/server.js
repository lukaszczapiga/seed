// modules
var mongoose       = require('mongoose');
var express        = require('express');
var app            = express();
var port = 8080; // set our port
var methodOverride = require('method-override');

var session      = require('express-session');
var passport = require('passport');
var morgan = require('morgan');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var acl = require('acl');
var helmet = require('helmet');

// configuration
require('./app/models/User');
require('./app/models/Article');
require('./app/models/Comment');

// config files
var dbConfig = require('./config/db');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(helmet());

mongoose.connect(dbConfig.url); // connect to our mongoDB database

var db = mongoose.connection;

db.on('error', function () {
    console.error('database connection error:');
});
var aclInstance= {};
var callback = function (db) {
    aclInstance = new acl(new acl.mongodbBackend(db, 'acl_'));
    aclInstance.allow([
        {
            roles: 'admin',
            allows: [
                { resources: ['/api/articles', '/api/users','/api/profile'], permissions: '*' }
            ]
        }, {
            roles: 'editor',
            allows: [
                { resources: ['/api/articles'], permissions: ['get','put','post','delete'] },
                { resources: ['/api/profile'],  permissions: ['get']}
            ]
        }, {
            roles: 'user',
            allows: [
                { resources: ['/api/articles'], permissions: 'get' }
            ]
        }, {
            roles: 'guest',
            allows: [
                { resources: ['/api/articles'], permissions: 'get' },
                { resources: ['/api/users'], permissions: 'post'}
            ]
        }
    ]);

    aclInstance.addRoleParents( 'user', 'guest' );
    aclInstance.addRoleParents( 'editor', 'user' );
    aclInstance.addRoleParents( 'admin', 'editor' );

    var mongoosePaginate = require('mongoose-paginate');

    mongoosePaginate.paginate.options = {
        limit: 5
    };

    // routes
    require('./app/routes/userRoutes')(app, passport, aclInstance); // load our routes and pass in our app and fully configured passport
    require('./app/routes/articleRoutes')(app, aclInstance); // load our routes and pass in our app and fully configured passport
    require('./app/routes/mainRoutes')(app); // load our routes and pass in our app and fully configured passport

    app.use(errorHandler);

    function errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(err.errorCode);
        res.send(err.message);
    }
};

db.on('open', function() {
    callback(db.db);
});


require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({
    secret: 'applePeople748913', // session secret
    store: new MongoStore({ mongooseConnection: db }),
    rolling: true,
    resave: false,
    saveUninitialized: false,
    name: 'nodeTutorial',
    cookie: { maxAge : 15*60*1000 } // 15 minutes
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT


// start app
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app