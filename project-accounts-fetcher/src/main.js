const path = require('path');
const dotenv = require('dotenv');

const EtherscanApi = require('./utils/EtherscanApi');
const Extractor = require('./utils/Extractor');
const IO = require('./utils/IO');

dotenv.config({
    path: path.join(__dirname, '../config/.env'),
});

async function main() {
    const etherscanApi = new EtherscanApi(process.env.TARGET_ETH_ADDRESS);
    const extractor = new Extractor();

    const jsonTxs = await etherscanApi.fetchAllTransactions();
    const dataTransferModels = await extractor.extractCompressedPublicKeys(jsonTxs);

    console.log(`Found ${dataTransferModels.length}`);
    IO.writeDataTransfer(JSON.stringify(dataTransferModels));
}

main();