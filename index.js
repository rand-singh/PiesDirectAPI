// Bring in the express server and create an application
let express = require('express');
let app = express();
let pieRepo = require("./repos/pierepo");

// Use the express Router object
let router = express.Router();

// Create a GET to return a list of all Pies
router.get('/', function (req, res, next) {
    pieRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

// Create server to listen on port 5000
var server = app.listen(5000, function () {
    console.log("Node server is running on http://localhost:5000");
});
