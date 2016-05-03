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

// Loads the cors package
var cors = require('cors')
_serverMsg('Loaded cors.', 2)

// Loads the fs package
var fs = require('fs')
_serverMsg('Loaded fs.', 2)

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

// Initializes cors
app.use(cors());
_serverMsg('Initialized cors.', 2)

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

/**
 * Checks if the file is valid format.
 * @param req - Request object
 * @param file - File object
 * @param cb - Callback
 * @private
 */
var _filter = function (req, file, cb) {
    _serverMsg('Validating file.', 1);
    if (file && file.mimetype == 'text/csv') {
        _serverMsg('File is valid.', 2);
        cb(null, true)
        return;
    } else {
        _serverMsg('File is invalid.', 2)
        cb(null, false)
        cb(new Error('Incorrect file type'))
        return;
    }

}

var upload = multer({ storage: storage, fileFilter: _filter})
_serverMsg('Multer upload storage and filter initialized.', 2)

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

/**
 * Converts a CSV array into JSON
 * @param csvArray - An array generated from CSVParse
 * @returns {Array} - JSON formatted array
 * @private
 */
var _convertToJSON = function(csvArray) {
    _serverMsg('Converting CSV to JSON.', 1);
    var splicedKey = csvArray.splice(0, 1);
    var keys = splicedKey[0];
    var convertedCsv = [];
    csvArray.map(function(line) {
        var tempObj = {};
        for (var i = 0; i < line.length; i++)
            if (keys[i] == 'number')
                tempObj[keys[i]] = convertNumber(line[i]);
            else
                tempObj[keys[i]] = line[i];
        convertedCsv.push(tempObj);
    });
    _serverMsg('CSV succesfully converted to JSON.', 2);
    return convertedCsv;
};

// Specifies the field being uploaded
var uploadFile = upload.single('csv')

// The API route for uploading
router.post('/upload', function (req, res, next) {
    _serverMsg('******** API CALLED ********', 0)
    uploadFile(req, res, function error(err) {
        if (err) {
            // Checks if there was an error on uploading the file.
            res.status(422).send('The file uploaded was not a CSV.');
        } else {
            _serverMsg('Reading the CSV.', 1);
            var converted = [];
            fs.readFile('tmp/tmp.csv', function(err, data) {
                if (err) {
                    // Checks if there was an error reading the file.
                    _serverMsg('There was an error reading the CSV.', 2);
                    res.status(422).send('There was an error with reading the CSV.')
                } else {
                    _serverMsg('CSV succesfully read.', 2);
                    // Stores the raw data to a string
                    var csvRaw = data.toString();
                    var csvArray = [];
                    // Uses CSV parse to parse the data into an array
                    _serverMsg('Parsing the CSV.', 1);
                    CSVParse(csvRaw, function(err, output) {
                        if (err) {
                            // Checks if there was an error with CSV Parse
                            _serverMsg('There was an error parsing the CSV.', 2);
                            res.status(422).send('There was an error with reading the CSV.');
                        } else {
                            _serverMsg('CSV succesfully parsed.', 2);
                            // Stores the CSV Array into output
                            csvArray = output;
                            // Converts the CSV Array to JSON
                            converted = _convertToJSON(csvArray);
                        }
                        // Returns the JSON
                        _serverMsg('Returning converted CSV.', 1);
                        res.status(200).send(converted);
                        _serverMsg('******** ENDING API CALL ********', 0)
                    })
                }
            });
        }
    });
});

// Start server
app.listen(port);
_serverMsg('Routes created.', 1)
_serverMsg('Server Initialized.', 0)