# Copyright Grant Handy 2024 (MIT)

import argparse
import sys
import base64

parser = argparse.ArgumentParser(prog='js-embed-bin', description='A small script for embedding binary data in a javascript file.')
parser.add_argument('--literals', action='store_true', help='Write bytes as hex literals in output template (takes more space but is more readable)')
parser.add_argument('--literal-width', type=int, default=10, metavar='N', help='Width of byte literal array before a newline is inserted')
parser.add_argument('--minify', action='store_true', help='Remove whitespace and newlines from output')
args = parser.parse_args()

wasm_bytes = sys.stdin.buffer.read()

bytestr = ''

if args.minify:
    bytestr += 'module.exports='
else:
    bytestr += 'module.exports = '

if args.literals:
    bytestr += 'new Uint8Array(['

    if not args.minify:
        bytestr += '\n\t'

    hex_arr = [hex(c) for c in wasm_bytes]

    if args.minify:
        for byte in hex_arr:
            bytestr += f'{byte},'
    else:
        for i,byte in enumerate(hex_arr):
            bytestr += f'{byte}, '.ljust(6)
            if (i + 1) % args.literal_width == 0: bytestr += '\n\t'
        bytestr = bytestr.rstrip()

    bytestr = bytestr.removesuffix(',')

    if not args.minify:
        bytestr += '\n'

    bytestr += '])'
else:
    b64str = base64.b64encode(wasm_bytes).decode('ascii')

    if args.minify:
        bytestr += f'Uint8Array.from(atob(\'{b64str}\'),(m)=>m.charCodeAt(0))'
    else:
        bytestr += f'Uint8Array.from(\n\tatob(\'{b64str}\'),\n\t(m) => m.charCodeAt(0)\n)'

bytestr += ';'

if not args.minify:
    bytestr += '\n'

sys.stdout.write(bytestr)