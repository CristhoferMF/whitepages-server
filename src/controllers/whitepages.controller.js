const { whitePages } = require('../services');

const suggestLocations = async (req, res, next) => {
    try {
        const { location } = req.params;
        const response = await whitePages.locationSuggestions(location);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

const searchNumbers = async (req, res, next) => {
    try {
        const { search, location, sublocation } = req.params;
        const { page } = req.query;

        const response = await whitePages.searchNumbers(search, location, sublocation, page);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    suggestLocations,
    searchNumbers,
};
