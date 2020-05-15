import seropp from "sero-pp";
import BigNumber from "bignumber.js";
import {Toast} from "antd-mobile";
import serojs from "serojs";
import Abi from "./abi";


const abiJson = [{
    "constant": false,
    "inputs": [{"name": "ticket", "type": "bytes32"}],
    "name": "cancelSellToken",
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
    "outputs": [],
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
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "previousOwner", "type": "address"}, {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}];
const caddress = "4hCycuxTGDTScKLJAysnQci2U7q6Y1VeoBb4HXHX19Lv6YZWKnQbLyXGD6UynerCX8RqngwcAceJYkNbZo5PXq3f";
const contract = serojs.callContract(abiJson, caddress);


class SellAbi extends Abi {

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