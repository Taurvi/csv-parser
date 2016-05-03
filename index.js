var _serverMsg = function(msg, depth) {
    var tab = 4;
    var spacer = '';
    for (var i = 0; i < tab * depth; i++) {
        spacer += ' ';
    }

    console.log('[SERVER] ' + spacer +  msg);

}

_serverMsg('Initializing Server')

_serverMsg('Loading dependencies.', 1)
// Loads the express package
var express = require('express');
_serverMsg('Loaded Express.', 2)

// Loads the multer package
var multer = require('multer');
_serverMsg('Loaded Multer.', 2);

// Loads the csv-parse package
var CSVParse = require('csv-parse');
_serverMsg('Loaded csv-parse.', 2);

_serverMsg('Dependencies loaded.', 1)


_serverMsg('Initializing server functionality.', 1)
// Initializes Express
var app = express();
_serverMsg('Initialized Express.', 2)

// Defines storage for Multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, 'tmp.csv')
    }
})
_serverMsg('Multer storage defined.', 2)

var upload = multer({ storage: storage })
_serverMsg('Multer upload storage initialized.', 2)

// Sets port to defined in the environment or 3000
var port = process.env.PORT || 3000;
_serverMsg('Port defined: ' + port, 2)

// Creates the router
var router = express.Router();
_serverMsg('Initialized router.', 2)

_serverMsg('Server functionality initialized.', 1)

_serverMsg('Creating routes.', 1)
// Registers API routes to the address '/api'
app.use('/api', router);
_serverMsg('Registered API route.', 2)

// Initial API route: http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({ message: 'API connection successful' });
});

router.post('/upload', upload.single('csv'), function (req, res, next) {
    console.log(req.file);
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})

// Start server
app.listen(port);
_serverMsg('Routes created.', 1)
_serverMsg('Server Initialized.', 0)