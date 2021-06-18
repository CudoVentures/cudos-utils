class DataTransferModel {

    constructor() {
        this.publicKey33BytesHexed = '';
        this.ethAddr = '';
    }

    static newInstanceFromInfuraRequest(publicKey33BytesHexed, ethAddr) {
        const model = new DataTransferModel();

        model.publicKey33BytesHexed = publicKey33BytesHexed;
        model.ethAddr = ethAddr;

        return model;
    }

    static newInstanceFromInfuraCache(infuraCacheModel) {
        const model = new DataTransferModel();

        model.publicKey33BytesHexed = infuraCacheModel.publicKey33BytesHexed;
        model.ethAddr = infuraCacheModel.ethAddr;

        return model;
    }

}

module.exports = DataTransferModel;