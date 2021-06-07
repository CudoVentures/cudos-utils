"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var proto_signing_1 = require("@cosmjs/proto-signing");
var stargate_1 = require("@cosmjs/stargate");
var tx_1 = require("./tx");
var gov_1 = require("./gov"); // Replace with your own Msg import
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var myRegistry, mnemonic, signer, client, myAddress, message, fee, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myRegistry = new proto_signing_1.Registry(__spreadArray(__spreadArray([], stargate_1.defaultRegistryTypes), [
                        ["/cosmos.gov.v1beta1.MsgSubmitProposal", tx_1.MsgSubmitProposal], // Replace with your own type URL and Msg class
                    ]));
                    mnemonic = "trigger peace action sister guilt index panda oval alter hub stand movie visit liar stick tuna journey wise pattern dial once chimney bicycle before";
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cudos" })];
                case 1:
                    signer = _a.sent();
                    return [4 /*yield*/, stargate_1.SigningStargateClient.connectWithSigner("http://localhost:26657", // Replace with your own RPC endpoint
                        signer, {
                            registry: myRegistry
                        })];
                case 2:
                    client = _a.sent();
                    myAddress = "cudos1d2lwlvm7jxghw3q638nymeadatj794prudncvq";
                    message = {
                        typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
                        value: {
                            content: {
                                "typeUrl": "/cosmos.gov.v1beta1.TextProposal",
                                value: gov_1.TextProposal.encode({
                                    title: "Test Proposal",
                                    description: "My awesome proposal"
                                }).finish()
                            },
                            initialDeposit: [{ denom: "stake", amount: "100000" }],
                            proposer: "cudos1d2lwlvm7jxghw3q638nymeadatj794prudncvq"
                        }
                    };
                    fee = {
                        amount: [
                            {
                                denom: "stake",
                                amount: "10"
                            },
                        ],
                        gas: "100000"
                    };
                    return [4 /*yield*/, client.signAndBroadcast(myAddress, [message], fee)];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
test().then(function (x) { return console.log(JSON.stringify(x)); });
