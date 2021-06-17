const path = require('path');
const dotenv = require('dotenv');

const EtherscanApi = require('./utils/EtherscanApi');
const Extractor = require('./utils/Extractor');
const IO = require('./utils/IO');

dotenv.config({
    path: path.join(__dirname, '../config/.env'),
});

async function main() {
    const etherscanApi = new EtherscanApi('0x817bbdbc3e8a1204f3691d14bb44992841e3db35');
    const extractor = new Extractor();

    const jsonTxs = await etherscanApi.fetchAllTransactions();
    const compressedPublicKeys = await extractor.extractCompressedPublicKeys(jsonTxs);

    console.log(`Found ${compressedPublicKeys.length}`);
    IO.output(compressedPublicKeys.join(','));
}

main();