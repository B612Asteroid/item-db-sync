module.exports = {
    apps: [
        {
            name: "server-dev",
            script: "dist/src/main.js",
            env: {
                NODE_ENV: "development",
            },
        },
        {
            name: "server-staging",
            script: "dist/src/main.js",
            env: {
                NODE_ENV: "staging",
            },
        },
    ],
};
