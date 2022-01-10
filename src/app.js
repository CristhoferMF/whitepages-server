const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

// routes
app.use('/', routes);

// error handling
app.use((err, req, res, next) => {
    if (err) {
        res.status(err.status || 500);
        res.json({
            code: 500,
            message: err.message,
            stack: err.stack,
        });
    }
    next(); // (optional) invoking next middleware
});

module.exports = app;
