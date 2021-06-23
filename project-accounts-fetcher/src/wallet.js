const Wallet = require('./utils/Wallet');

async function main() {
    await Wallet.restore();
}

main();