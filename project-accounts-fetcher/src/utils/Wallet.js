const { ethers } = require('ethers');

class Wallet {

    static async restore() {
        // const wallet = await ethers.Wallet.fromMnemonic('battle erosion opinion city birth modify scale hood caught menu risk rather');
        const walletJson = {};
        const wallet = await ethers.Wallet.fromEncryptedJson(JSON.stringify(walletJson), '123123123');
        console.log(JSON.stringify(wallet));
    }

}

module.exports = Wallet