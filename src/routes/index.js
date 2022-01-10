const express = require('express');
const whitePagesRoute = require('./whitepages.route');

const router = express.Router();

const routes = [
    {
        path: '/whitepages',
        route: whitePagesRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
