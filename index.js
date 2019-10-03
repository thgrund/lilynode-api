const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

const port = process.argv[2] || 3002;
app.listen(port, function() {
	console.log("Server listening on port : " + port);
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
/*app.use(upload.array());
app.use(express.static('public'));
*/

/* Express configuration */
app.use(cors());

const LILYPOND_API_ROOT = '/api';
app.use(LILYPOND_API_ROOT, require('./app/router'));
