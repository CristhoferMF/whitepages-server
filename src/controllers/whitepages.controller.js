const { whitePages } = require('../services');

const suggestLocations = async (req, res) => {
    const { location } = req.params;
    const response = await whitePages.locationSuggestions(location);
    return res.json(response);
};

module.exports = {
    suggestLocations,
};
