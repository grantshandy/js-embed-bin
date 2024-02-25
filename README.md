# js-embed-bin
A small script for embedding binary data in JavaScript files. You may want to do this if you're in a constrained environment that only supports JS/HTML or potentially as a fallback if your webserver won't return the correct MIME type (*`application/wasm`, lol*).

```bash
 $ python js-embed-bin.py <example.wasm >example.js
```

Now you can access the `Uint8Array` of the input file just by importing `example.js`!
```js
const example = require('./example'); // or import example from "./example";
```

Use the import the same way you would from any other source (`readFileSync`, `fetch`):
```js
WebAssembly
    .instantiate(example, {})
    .then(obj => obj.instance.exports.func())
    .then(console.log);
```

## Samples
```js
// $ python js-embed-bin.py <example/example.wasm
module.exports = Uint8Array.from(
        atob('AGFzbQEAAAABBQFgAAF/AwIBAAcIAQRmdW5jAAAKBwEFAEEqDws='),
        (m) => m.charCodeAt(0)
);

// $ python js-embed-bin.py --literals --literal-width 5 <example/example.wasm
module.exports = new Uint8Array([
        0x0,  0x61, 0x73, 0x6d, 0x1,  
        0x0,  0x0,  0x0,  0x1,  0x5,  
        0x1,  0x60, 0x0,  0x1,  0x7f, 
        0x3,  0x2,  0x1,  0x0,  0x7,  
        0x8,  0x1,  0x4,  0x66, 0x75, 
        0x6e, 0x63, 0x0,  0x0,  0xa,  
        0x7,  0x1,  0x5,  0x0,  0x41, 
        0x2a, 0xf,  0xb
]);

// $ cat example/example.wasm | python js-embed-bin.py --minify
module.exports=Uint8Array.from(atob('AGFzbQEAAAABBQFgAAF/AwIBAAcIAQRmdW5jAAAKBwEFAEEqDws='),(m)=>m.charCodeAt(0));
```

## Help
```
usage: js-embed-bin [-h] [--literals] [--literal-width N] [--minify]

A small script for embedding binary data in a javascript file.

options:
  -h, --help         show this help message and exit
  --literals         Write bytes as hex literals in output template (takes more space but is more readable)
  --literal-width N  Width of byte literal array before a newline is inserted
  --minify           Remove whitespace and newlines from output
```
