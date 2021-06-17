const ethers = require('ethers');
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx')


class Extractor {
    
    constructor() {
        console.log(process.env.INFURA_PROJECT_ID);
        this.infuraProvider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_PROJECT_ID);
    }

    async extractCompressedPublicKeys(jsonTxs) {
        console.log('extracting compressed public keys...');
        const compressedPublicKeys = [];
        
        for (let i = 0;  i < Math.min(100, jsonTxs.length);  ++i) {
            console.log(`extracting for hash ${jsonTxs[i].hash} (${i + 1}/${jsonTxs.length})`);
            const jsonTx = jsonTxs[i];
            const ethTx = await this.infuraProvider.getTransaction(jsonTx.hash);

            const tx = new EthTx.Transaction(ethTx.raw, {
                // "chain": "ropsten"
            });

            const addressByUncompressed = EthUtil.bufferToHex(tx.getSenderAddress()).toLowerCase();
            const publicKey64Bytes = tx.getSenderPublicKey();
            const publicKeyPrefix = new Uint8Array([4]);

            const publicKey65Bytes = new Uint8Array(65);
            publicKey65Bytes.set(publicKeyPrefix);
            publicKey65Bytes.set(publicKey64Bytes, publicKeyPrefix.length);

            const publicKey33Bytes = ethers.utils.computePublicKey(publicKey65Bytes, true);
            const addressByCompressed = ethers.utils.computeAddress(publicKey33Bytes).toLowerCase();

            if (addressByUncompressed !== addressByCompressed) {
                throw new Error(`Wallet address mismatch in transaction: Uncompressed(${addressByUncompressed}) Compressed(${addressByCompressed}) ${jsonTx.hash}`)
            }

            compressedPublicKeys.push(publicKey33Bytes);
        }

        return compressedPublicKeys;
    }

}

module.exports = Extractor;