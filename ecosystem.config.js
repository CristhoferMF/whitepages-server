module.exports = {
    apps: [
        {
            name: 'White pages',
            script: './index.js',
            instances: 2,
            env: {
                PORT: '3001',
            },
        },
    ],
};
