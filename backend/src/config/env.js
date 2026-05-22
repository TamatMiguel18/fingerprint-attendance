// backend/src/config/env.js

require("dotenv").config({ path: "./.env" });

module.exports = {
    PORT: process.env.PORT || 3000,

    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME
    },

    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRES: process.env.JWT_EXPIRES
    }
};