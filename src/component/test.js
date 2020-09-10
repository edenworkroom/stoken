
function tokenToBytes(token) {
    let bytes = Buffer.alloc(32);
    bytes.fill(token, 0, token.length);
    return "0x" + bytes.toString('hex');
}

console.log(tokenToBytes("AAAA"))
console.log(tokenToBytes("FFFA"))
console.log(tokenToBytes("BBBC"))
