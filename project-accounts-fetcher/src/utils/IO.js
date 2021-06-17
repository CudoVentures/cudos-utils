const fs = require('fs');
const path = require('path');

class IO {

    static output(buffer) {
        const outputDir = path.join(__dirname, '..', '..', 'output', 'compressed-public-keys.txt');
        fs.mkdirSync(path.dirname(outputDir), { 'recursive': true });
        fs.writeFileSync(outputDir, buffer);
    }

}

module.exports = IO;