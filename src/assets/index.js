const files = require.context("./", false, /\.svg$/);
const modules = {};

files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\.svg)/g, '')] = files(key).default
});

export default modules;
