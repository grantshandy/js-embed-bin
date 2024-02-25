// const buf = require("fs").readFileSync("./example.wasm");
const buf = require('./example');
// const buf = require('./example-literals');

WebAssembly
    .instantiate(buf, {})
    .then(obj => obj.instance.exports.func())
    .then(console.log);