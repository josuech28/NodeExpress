// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var Employee = require('./models/employee');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Request on: ' + Date());
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({
        message: 'Welcome to API!'
    });
});

// ERROR STATUS 400
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send(err.message);
});

// CONNECT DB   
connectionUrl = 'mongodb://josueachinchilla:jCHINCHILLA7@ds113775.mlab.com:13775/workers';
mongoose.connect(connectionUrl);

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// create a bear (accessed at POST http://localhost:8080/api/bears)
router.route('/employees')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {

        var employee = new Employee(); // create a new instance of the Employee model
        employee.name = req.body.name; // set the employee name (comes from the request)
        employee.email = req.body.email; // set the employee email (comes from the request)
        employee.rank = req.body.rank; // set the employee rank (comes from the request)
        employee.skill = req.body.skill; // set the employee skill (comes from the request)

        // save the employee and check for errors
        employee.save(function (err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Employee created!'
            });
        });

    })

    // get all the employee (accessed at GET http://localhost:8080/api/employees)
    .get(function (req, res) {
        Employee.find(function (err, employees) {
            if (err)
                res.send(err);

            res.json(employees);
        });
    });

// on routes that end in /employees/:employee_id
// ----------------------------------------------------
router.route('/employees/:employee_id')

    // get the employee with that id (accessed at GET http://localhost:8080/api/employees/:employee_id)
    .get(function (req, res) {
        Employee.findById(req.params.employee_id, function (err, employee) {
            if (err)
                res.send(err);
            res.json(employee);
        });
    })

    .put(function (req, res) {

        // use our employee model to find the employee we want
        Employee.findById(req.params.employee_id, function (err, employee) {

            if (err)
                res.send(err);
            // update the employees info
            employee.name = req.body.name;
            employee.email = req.body.email;
            employee.rank = req.body.rank;
            employee.skill = req.body.skill;

            // save the employee
            employee.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Employee updated!'
                });
            });

        });
    })

    // delete the employee with this id (accessed at DELETE http://localhost:8080/api/employees/:employee_id)
    .delete(function (req, res) {
        Employee.remove({
            _id: req.params.employee_id
        }, function (err, employee) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });

var http = require('http');
router.route('/translate')

    .post(function(request, response) {
        var proxyRequest = http.request({
            host: 'translation.googleapis.com',
            port: 80,
            method: 'POST',
            path: '/language/translate/v2?key=AIzaSyDCkfSRTCL9kkT8oyBIPcAk7Kr0TiJ1MigY'
        },
        function (proxyResponse) {
        proxyResponse.on('data', function (chunk) {
            console.log('chunk: ' + chunk);
            response.send(chunk);
        });
        });

        proxyRequest.write(response.body);
        proxyRequest.end();
});

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, function () {
    console.log('Server is running on port: ' + port);
});