const ethers = require('ethers');
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx')
const axiox = require('axios');

async function main() {
    const axiosRes = await axiox.get('https://api.etherscan.io/api?module=account&action=txlist&address=0x817bbdbc3e8a1204f3691d14bb44992841e3db35&startblock=12000000&endblock=99999999&sort=asc&apikey=YourApiKeyToken');
    const etherscanRes = axiosRes.data;
    
    const jsonTx = etherscanRes.result.find((tx) => {
        return tx.from.toLowerCase() === "0xbc16Ab24d16b66deB9B408ee4C8b6d6CbcC4449b".toLowerCase();
    })
    
    console.log(jsonTx.hash);
    infuraProvider = new ethers.providers.InfuraProvider('mainnet');
    const ethTx = await infuraProvider.getTransaction(jsonTx.hash);
    // console.log(ethTx);

    const tx = new EthTx.Transaction(ethTx.raw, {
        // "chain": "ropsten"
    })

    // Get an address of sender
    const address = EthUtil.bufferToHex(tx.getSenderAddress())

    // get a public key of sender
    const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey())

    const prefix = new Uint8Array([4]);
    const pubK = tx.getSenderPublicKey();
    const r = new Uint8Array(65);
    r.set(prefix)
    r.set(pubK, prefix.length)

    console.log(address);
    console.log(publicKey, tx.getSenderPublicKey().length);

    // const pubK = new Uint8Array(tx.getSenderPublicKey())
    // console.log(pubK);

    const publicKeyCompressed = ethers.utils.computePublicKey(r, true);
    console.log(ethers.utils.computeAddress(publicKeyCompressed));
    console.log(address.toLowerCase() === ethers.utils.computeAddress(publicKeyCompressed).toLowerCase());
}

// async function main() {
//     // signed tx
//     // const signedTx = "0xf86b808504a817c800825208942890228d4478e2c3b0ebf5a38479e3396c1d6074872386f26fc100008029a0520e5053c1b573d747f823a0b23d52e5a619298f46cd781d677d0e5e78fbc750a075be461137c2c2a5594beff76ecb11a215384c574a7e5b620dba5cc63b0a0f13"
//     const signedTx = "0xf8aa808523284d2600830232ea94817bbdbc3e8a1204f3691d14bb44992841e3db3580b844095ea7b3000000000000000000000000a5025faba6e70b84f74e9b1113e5f7f4e7f4859f000000000000000000000000000000000000000000000026b4bd9110dce8000025a018d1e00b8f87327e54048f155bf434a7d287c0c975aaa93f6f6be11b6fedfd11a015b1b78cd0edbe374619f2db578635cde1d1e959c9fea3cee5c818a937a21e78"

//     // Create a tx object from signed tx 
//     const tx = new EthTx.Transaction(signedTx, {
//         // "chain": "ropsten"
//     })
//     console.log(new Uint8Array(tx.r));
//     console.log(new Uint8Array(tx.s));
//     console.log(new Uint8Array(tx.v));
//     console.log(tx.getChainId())

//     // Get an address of sender
//     const address = EthUtil.bufferToHex(tx.getSenderAddress())

//     // get a public key of sender
//     const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey())
    
//     console.log(address);
//     console.log(publicKey, publicKey.length);
// }

// async function main() {
//     const wallet = await ethers.Wallet.fromMnemonic('battle erosion opinion city birth modify scale hood caught menu risk rather');
//     console.log(JSON.stringify(wallet));
// }

main();