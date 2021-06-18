const fs = require('fs');
const path = require('path');

class IO {

    static readInfuraCache() {
        try {
            return IO.read('infura-cache.json');
        } catch (err) {
            console.log('Error reading infura cache')
            return '';
        }
    }

    static writeDataTransfer(buffer) {
        IO.write(buffer, 'data-transfer.json');
    }

    static writeInfuraCache(buffer) {
        IO.write(buffer, 'infura-cache.json');
    }

    static write(buffer, filename) {
        const absolutePath = path.join(__dirname, '..', '..', 'output', filename);
        fs.mkdirSync(path.dirname(absolutePath), { 'recursive': true });
        fs.writeFileSync(absolutePath, buffer);
    }

    static read(filename) {
        const absolutePath = path.join(__dirname, '..', '..', 'output', filename);
        return fs.readFileSync(absolutePath).toString();
    }

}

module.exports = IO;