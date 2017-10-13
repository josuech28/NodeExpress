// app/models/employee.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmployeeSchema   = new Schema({
    name: String,
    email: String,
    rank: String,
    skill: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);