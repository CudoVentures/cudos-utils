const { ethers } = require('ethers');

const provider = new ethers.providers.InfuraProvider("rinkeby");

async function main() {
    const wallet = new ethers.Wallet('', provider);
    // const wallet = new ethers.Wallet.createRandom();
    console.log(wallet);
    const balance = await wallet.getBalance();
    console.log(ethers.utils.formatEther(balance));
}

main();