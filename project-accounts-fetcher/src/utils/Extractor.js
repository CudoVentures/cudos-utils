const ethers = require('ethers');
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx');

const IO = require('./IO');
const DataTransferModel = require('../models/DataTransferModel');
const InfuraCacheModel = require('../models/InfuraCacheModel');

class Extractor {
    
    constructor() {
        this.usedEthAddrsMap = new Set();
        this.infuraProvider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_PROJECT_ID);
        this.loadCache();
    }

    loadCache() {
        try {
            const cacheAsString = IO.readInfuraCache();
            this.infuraCache = cacheAsString === '' ? {} : JSON.parse(cacheAsString);
        } catch (err) {
            this.infuraCache = {};
        }
    }

    storeCache() {
        const buffer = JSON.stringify(this.infuraCache);
        IO.writeInfuraCache(buffer);
    }

    async extractCompressedPublicKeys(jsonTxs) {
        console.log('extracting compressed public keys...');
        const dataTransferModels = [];
        
        for (let i = 0;  i < Math.min(100, jsonTxs.length);  ++i) {
            console.log(`extracting for hash ${jsonTxs[i].hash} (${i + 1}/${jsonTxs.length})`);
            const jsonTx = jsonTxs[i];
            const jsonTxFrom = jsonTx.from.toLowerCase();
            
            if (this.usedEthAddrsMap.has(jsonTxFrom) === true) {
                continue;
            }
            
            let infuraCacheModel = this.infuraCache[jsonTx.hash];
            if (infuraCacheModel === undefined) {
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

                const publicKey33BytesHexed = ethers.utils.computePublicKey(publicKey65Bytes, true);
                const addressByCompressed = ethers.utils.computeAddress(publicKey33BytesHexed).toLowerCase();

                if (addressByUncompressed !== addressByCompressed || addressByUncompressed !== jsonTxFrom) {
                    throw new Error(`Wallet address mismatch in transaction: Uncompressed(${addressByUncompressed}) Compressed(${addressByCompressed}) ${jsonTx.hash}`)
                }

                this.infuraCache[jsonTx.hash] = new InfuraCacheModel(publicKey33BytesHexed, addressByUncompressed);
                this.usedEthAddrsMap.add(addressByUncompressed);
                dataTransferModels.push(DataTransferModel.newInstanceFromInfuraRequest(publicKey33BytesHexed, addressByUncompressed));
            } else {
                this.usedEthAddrsMap.add(infuraCacheModel.ethAddr);
                dataTransferModels.push(DataTransferModel.newInstanceFromInfuraCache(infuraCacheModel));
            }
        }

        this.storeCache();

        return dataTransferModels;
    }

}

module.exports = Extractor;