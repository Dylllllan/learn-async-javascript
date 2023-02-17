/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const common = require("./webpack.config.js");

module.exports = {
    ...common,
    mode: "development",
    optimization: {
        minimize: false
    }
};
