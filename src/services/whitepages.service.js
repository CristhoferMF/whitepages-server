const cherrio = require('cheerio');
const axios = require('axios');

const axiosWhitePages = axios.create({
    baseURL: 'http://paginasblancas.com.pe',
    headers: {
        Accept: '*/*',
    },
    /* other custom settings */
});

const locationSuggestions = async (query) => {
    const response = await axiosWhitePages.get(`suggest?location=${query}`);
    return response.data;
};

module.exports = {
    locationSuggestions,
};
