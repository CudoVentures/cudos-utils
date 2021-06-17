class Wallet {

    restore() {
        const wallet = await ethers.Wallet.fromMnemonic('battle erosion opinion city birth modify scale hood caught menu risk rather');
        console.log(JSON.stringify(wallet));
    }

}

module.exports = Wallet