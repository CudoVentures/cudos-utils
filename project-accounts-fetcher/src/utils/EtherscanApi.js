const axios = require('axios');

const END_BLOCK = 99999999;

class EtherscanApi {

    constructor(contractAddress) {
        this.startBlock = 0;
        this.url = `https://api.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock={0}&endblock={1}&sort=asc&apikey=YourApiKeyToken`
    }

    async fetchAllTransactions() {
        console.log('fetching transactions...');
        let jsonTxs = [];

        for (let startBlock = this.startBlock; startBlock != -1; ) {
            console.log(`fetching transaction from ${startBlock}`);
            const url = this.url.replace('{0}', startBlock).replace('{1}', END_BLOCK);
            const axiosRes = await axios.get(url);
            const etherscanRes = axiosRes.data;
            let res = etherscanRes.result;

            console.log(`fetched transactions count for starting block ${startBlock}`, res.length);
            if (res.length === 10000) {
                let lastFetchedBlockNumber = parseInt(res[res.length - 1].blockNumber);

                startBlock = -2;
                for (let j = res.length - 1;  j-- > 0; ) {
                    let refBlockNumber = parseInt(res[j].blockNumber);
                    if (refBlockNumber !== lastFetchedBlockNumber) {
                        startBlock = refBlockNumber + 1;
                        res = res.slice(0, j + 1);
                        break;
                    }
                }

                if (startBlock === -2) {
                    throw new Error('All 10 000 transactions are from same block')
                }

                if (parseInt(res[res.length - 1].blockNumber) >= lastFetchedBlockNumber) {
                    throw new Error(`Wrong startBlock calculation. ${res[res.length - 1].blockNumber} ${lastFetchedBlockNumber}`)
                }
            } else {
                startBlock = -1;
            }

            jsonTxs = jsonTxs.concat(res);
        }

        return jsonTxs;
    }

}

module.exports = EtherscanApi;