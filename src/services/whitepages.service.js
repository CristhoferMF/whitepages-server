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
    if (!query) {
        throw new Error('Missing query');
    }
    const response = await axiosWhitePages.get(`suggest?location=${query}`);
    return response.data;
};

const verifyNumber = (number) => {
    // conexion a la base de datos

    return {
        isInvalid: true,
        isOutService: false,
        saysNoCall: false,
        hasOtherProblem: false,
    };
};

const searchNumbers = async (query, location, sublocation = '', page = '') => {
    // eslint-disable-next-line no-unused-vars
    const url = `http://www.paginasblancas.com.pe/persona/s/${query}/${location}${
        sublocation ? `/${sublocation}` : ''
    }${page ? `/p-${page}` : ''}`;
    // const { data } = await axiosWhitePages.get(url);
    const { data } = await axios.get('http://127.0.0.1:5500');
    const $ = cherrio.load(data);
    const results = $('.m-header--count')
        .text()
        .replace(/[^0-9.]+/g, '');
    const numbers = $('.m-results--container ul.m-results-businesses')
        .children('li')
        .map((i, el) => {
            const rawNumber = JSON.parse(
                `${$(el).find('script').html().split('=')[1].split('];')[0].replace(/'/g, '"')}]`
            );
            const number = {
                name: rawNumber[0],
                address: rawNumber[2],
                city: rawNumber[4],
                phone: rawNumber[5],
                phoneId: rawNumber[8],
                status: verifyNumber(rawNumber[8]),
            };
            return number;
        })
        .toArray();
    const pagination = $('ul.m-results-pagination')
        .children('li')
        .map((i, el) =>
            $(el)
                .text()
                .trim()
                .replace(/[^0-9.]+/g, '')
        )
        .toArray()
        .filter((_page) => _page !== '');

    return {
        pagination,
        results,
        numbers,
    };
};

module.exports = {
    locationSuggestions,
    searchNumbers,
};
