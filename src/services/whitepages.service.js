const cherrio = require('cheerio');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

const verifyNumbers = async (numbers) => {
    const newNumbers = [];
    for (let i = 0; i < numbers.length; i += 1) {
        const number = numbers[i];
        // eslint-disable-next-line no-await-in-loop
        const phone = await prisma.phone.findUnique({
            select: {
                id: false,
                isInvalid: true,
                isOutService: true,
                isBlacklisted: true,
                hasOtherProblems: true,
                createdAt: true,
                updatedAt: true,
            },
            where: { number: number.phoneId },
        });
        if (phone) {
            newNumbers.push({ ...number, status: phone });
        } else {
            newNumbers.push({ ...number, status: null });
        }
    }
    return newNumbers;
};

const searchNumbers = async (query, location, sublocation = '', page = '') => {
    const url = `http://www.paginasblancas.com.pe/persona/s/${query}/${location}${
        sublocation ? `/${sublocation}` : ''
    }${page ? `/p-${page}` : ''}`;
    const { data } = await axiosWhitePages.get(url);
    // const { data } = await axios.get('http://127.0.0.1:5500');
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
            };
            return number;
        })
        .toArray();

    const numbersVerified = await verifyNumbers(numbers);

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
        numbers: numbersVerified,
    };
};

module.exports = {
    locationSuggestions,
    searchNumbers,
};
