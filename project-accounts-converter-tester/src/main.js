const ethers = require('ethers');
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx')

async function main() {
    // signed tx
    // const signedTx = "0xf86b808504a817c800825208942890228d4478e2c3b0ebf5a38479e3396c1d6074872386f26fc100008029a0520e5053c1b573d747f823a0b23d52e5a619298f46cd781d677d0e5e78fbc750a075be461137c2c2a5594beff76ecb11a215384c574a7e5b620dba5cc63b0a0f13"
    const signedTx = "0xf9010a0d85746a5288008302b6bc94b3ccb8fb2533e51893915908ceb85763ceaea97b80b8a41bf0b08b000000000000000000000000e6aa42d4db4053a7589c794bb02a079e5e8a6a7e000000000000000000000000000000000000000000008eefd2c530b9ffe00000000000000000000000000000000000000000000000000000000000005ffd65100000000000000000000000000000000000000000000000000000000000000223000000000000000000000000000000000000000000000000000000000000000025a0e1cbceaaa2630d20536480270994b095b4281513ab1105aaeaab1ba36f36d173a009d09ef3be52d4d2191084e84444e0ff470933d8910d2fb165b3e95d366e2d1a"

    // Create a tx object from signed tx 
    const tx = new EthTx.Transaction(signedTx, {
        // "chain": "ropsten"
    })
    console.log(EthUtil.bufferToInt(tx.v))
    console.log(tx.getChainId())

    // Get an address of sender
    const address = EthUtil.bufferToHex(tx.getSenderAddress())

    // get a public key of sender
    const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey())
    
    console.log(address);
    console.log(publicKey);
}

// async function main() {
//     const wallet = await ethers.Wallet.fromMnemonic('battle erosion opinion city birth modify scale hood caught menu risk rather');
//     console.log(JSON.stringify(wallet));
// }

main();