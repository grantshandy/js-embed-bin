const fs = require("fs");
const process = require("process");

const help_msg = `usage: js-embed-bin [-h] [--literals] [--literal-width N] [--minify]

A small script for embedding binary data in a javascript file.

options:
    -h, --help         show this help message and exit
    --literals         Write bytes as hex literals in output template (takes more space but is more readable)
    --literal-width N  Width of byte literal array before a newline is inserted (default 10)
    --minify           Remove whitespace and newlines from output`;

const args = process.argv.slice(2);

const help = args.includes("-h") || args.includes("--help");
const literals = args.includes("--literals");
const minify = args.includes("--minify");

if (help) {
    console.log(help_msg);
    process.exit(0);
}

let wasm;

try {
    wasm = fs.readFileSync(0);
} catch (_) {
    console.error("You must provide an input file through stdin.");
    process.exit(1);
}

let out = "module.exports" + (minify ? "=" : " = ");

if (literals) {
    out += "new Uint8Array([";

    const hex_arr = Array.from(wasm,
        byte => "0x" + (byte & 0xFF).toString(16).slice(-2) + ",");

    if (minify) {
        out += hex_arr.join("");
    } else {
        let width = 10;
        if (args.includes("--literal-width")) {
            let i = args[args.findIndex(e => e == "--literal-width") + 1];
            if (i != null) width = i;
        }

        out += "\n\t";
        out += hex_arr
            .map((byte, idx) => (byte + " " + ((idx + 1) % width == 0 ? "\n\t" : "")).padEnd(6, " "))
            .join("");
    }

    out = out.substring(0, out.length - 1); // remove trailing comma
    if (!minify) out += "\n";

    out += '])';
} else {
    if (minify) {
        out += `Uint8Array.from(atob(\'${btoa(wasm)}\'),(m)=>m.charCodeAt(0))`;
    } else {
        out += `Uint8Array.from(\n\tatob(\'${btoa(wasm)}\'),\n\t(m) => m.charCodeAt(0)\n)`;
    }
}

out += ';'

process.stdout.write(out);