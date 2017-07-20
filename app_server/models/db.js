var mongoose = require('mongoose');
var gracefulShutdown;

var dbURL = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURL, {useMongoClient: true});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to', dbURL);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose Connection Error:', err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose Disconnected');
});

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through', msg);
        callback();
    });
};

// For App Termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
// For Heroku App Termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./locations');