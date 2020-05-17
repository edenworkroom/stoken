import seropp from "sero-pp";
import BigNumber from "bignumber.js";
import {Toast} from "antd-mobile";
import serojs from "serojs";
import Abi from "./abi";


const abiJson = [{
    "constant": true,
    "inputs": [{"name": "tickets", "type": "bytes32[]"}],
    "name": "hasTockets",
    "outputs": [{"name": "rets", "type": "bool[]"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "ticket", "type": "bytes32"}],
    "name": "cancelSellToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_fee", "type": "uint256"}],
    "name": "setFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "coinName", "type": "string"}, {"name": "ticket", "type": "bytes32"}, {
        "name": "price",
        "type": "uint256"
    }],
    "name": "sellMarkToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "tokenBuy", "type": "string"}, {"name": "price", "type": "uint256"}],
    "name": "sellToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "ticket", "type": "bytes32"}],
    "name": "removeMarkToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "ticket", "type": "bytes32"}],
    "name": "buyToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "start", "type": "uint256"}, {"name": "end", "type": "uint256"}],
    "name": "sellTokens",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"name": "_platform", "type": "address"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "previousOwner", "type": "address"}, {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}];
const caddress = "2aaXq93dPBCW1GNq3UaoJ1rhkkdWXzYtfEFZHiF6J5AQV4Bxto9mz3X46SphPQGyHJ1A7fRkaQVTUnPdN9kR57YF";
const contract = serojs.callContract(abiJson, caddress);


class SellAbi extends Abi {

    hasTickets(from, tickets, callback) {
        super.callMethod(contract, "hasTockets", from, [tickets], function (rets) {
            callback(rets);
        });
    }

    sellTokens(from, start, end, callback) {
        super.callMethod(contract, "sellTokens", from, [start, end], function (json) {
            callback(JSON.parse(json));
        });
    }

    sellToken(pk, mainPKr, tokenBuy, price, category, ticket, callback) {
        super.executeMethod(contract, 'sellToken', pk, mainPKr, [tokenBuy, price], "SERO",
            0, category, ticket
            , callback);
    }

    buyToken(pk, mainPKr, ticket, tokenBuy, priceVal, callback) {
        super.executeMethod(contract, 'buyToken', pk, mainPKr, [ticket], tokenBuy,
            priceVal, null, null
            , callback);
    }

    cancelSellToken(pk, mainPKr, ticket, callback) {
        super.executeMethod(contract, 'cancelSellToken', pk, mainPKr, [ticket], "SERO",
            0, null, null
            , callback);
    }
}

const sAbi = new SellAbi();
export default sAbi;