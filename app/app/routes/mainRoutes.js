module.exports = function(app) {

    var path = require('path');

	// frontend routes
	// route to handle all angular requests
	app.get('/*', function(req, res) {
        res.sendFile('index.html', { root: path.join(__dirname, '../../public') });
        //res.sendFile('../app/public/index.html');
	});

};