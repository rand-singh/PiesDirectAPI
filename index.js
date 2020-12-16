// Bring in the express server and create an application
let express = require('express');
let app = express();
let pieRepo = require("./repos/pierepo");

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

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

/**
 * Example searches
 *  http://localhost:5000/api/search/?name=A
 *  http://localhost:5000/api/search/?id=1&name=A
 * 
 */
router.get('/search', function (req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "Single pie retrieved",
            "data": data
        });
    }, function (err) {
        next(err);
    });
})

router.get('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Single pie retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": `The pie ${req.params.id} could not be found`,
                "error": {
                    "code": "NOT_FOUND",
                    "message": `The pie ${req.params.id} could not be found`          
                }
            });
        }
    }, function(err) {
        next(err);
    });
});

router.post('/', function (req, res, next) {
    pieRepo.insert(req.body, function(data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New Pie Added.",
            "data": data
        });
    }, function(err) {
        next(err);

    });
});

router.put('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update the data
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": `Pie ${req.params.id} updated`,
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": `Pie ${req.params.id} could not be found`,
                "error": {
                    "code": "NOT_FOUND",
                    "message": `The pie ${req.params.id} could not be found`          
                }
            });
        }
    }, function (err) {
        next(err)
    });
})

router.delete('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            //  Attempt to delete the pie data
            pieRepo.delete(req.params.id, function (data) {
                //  pass back either a JSON enevolope with a status of 200 or not object and a status of 204
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": `The ie ${req.params.id} has been deleted`,
                    "data": `Pie ${req.params.id} deleted`
                });
            })
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": `The pie ${req.params.id} could not be found`,
                "error": {
                    "code": "NOT_FOUND",
                    "message": `The pie ${req.params.id} could not be found`          
                }
            });
        }
    }, function(err) {
        next(err);
    });
});

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

// Create server to listen on port 5000
var server = app.listen(5000, function () {
    console.log("Node server is running on http://localhost:5000");
});
