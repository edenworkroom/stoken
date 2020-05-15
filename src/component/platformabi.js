import serojs from "serojs";
import Abi from "./abi";

const abiJson = [{
    "constant": true,
    "inputs": [{"name": "coinName", "type": "string"}],
    "name": "getDecimal",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "coinName", "type": "string"}, {"name": "ticket", "type": "bytes32"}],
    "name": "addMarkToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "coinName", "type": "string"}, {"name": "ticket", "type": "bytes32"}],
    "name": "buyToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "coinName", "type": "string"}, {"name": "decimals", "type": "uint8"}, {
        "name": "initialSupply",
        "type": "uint256"
    }],
    "name": "createToken",
    "outputs": [{"name": "ticket", "type": "bytes32"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "ticktes", "type": "bytes32[]"}],
    "name": "tokens",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
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
    "inputs": [{"name": "decimals", "type": "uint8"}],
    "name": "setDecimals",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "burnToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
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
    "constant": true,
    "inputs": [{"name": "ticket", "type": "bytes32"}],
    "name": "details",
    "outputs": [{"name": "name", "type": "string"}, {"name": "totalSupply", "type": "uint256"}, {
        "name": "balance",
        "type": "uint256"
    }, {"name": "decimals", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "to", "type": "address"}],
    "name": "give",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "mintToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "coinName", "type": "string"}],
    "name": "getFee",
    "outputs": [{"name": "", "type": "uint256"}],
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
    "inputs": [{"name": "_blackHoleAddr", "type": "address"}, {"name": "_markAddr", "type": "address"}],
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
const caddress = "2w4M3Xc4wUobDk42jrREP3vKgUbeZ4R27pjjafRPGTZ237qrKUg3M1dyqSQWFK4okCoFFfi9CKihFFgcXTGB82xy";
const contract = serojs.callContract(abiJson, caddress);

class PlatformAbi extends Abi {

    tokens(from, tickets, callback) {
        this.callMethod(contract, "tokens", from, [tickets], function (json) {
            let tokens = JSON.parse(json);
            tokens.sort(function (a, b) {
                return a.token < b.token ? -1 : 1;
            });
            tokens.forEach((item, index) => {
                item.ticket = tickets[index];
            });
            callback(tokens);
        });
    }

    getFee(from, tokenName, callback) {
        this.callMethod(contract, "getFee", from, [tokenName], function (fee) {
            callback(fee);
        });
    }

    createToken(pk, mainPKr, coinName, decimals, initialSupply, callback) {
        let self = this;
        this.getFee(mainPKr, coinName, function (value) {
            self.executeMethod(contract, 'createToken', pk, mainPKr, [coinName, decimals, initialSupply], "SERO",
                value
                , callback);
        });
    }

    mintToken(pk, mainPKr, supply, category, ticket, callback) {
        this.executeMethod(contract, 'mintToken', pk, mainPKr, [supply], "SERO",
            0, category, ticket
            , callback);
    }

    burnToken(pk, mainPKr, supply, category, ticket, callback) {
        this.executeMethod(contract, 'burnToken', pk, mainPKr, [supply], "SERO",
            0, category, ticket
            , callback);
    }

    give(pk, mainPKr, to, category, ticket, callback) {
        this.executeMethod(contract, 'give', pk, mainPKr, [to], "SERO",
            0, category, ticket
            , callback);
    }

    transfer(pk, mainPKr, to, amount, category, ticket, callback) {
        this.executeMethod(contract, 'transfer', pk, mainPKr, [to, amount], "SERO",
            0, category, ticket
            , callback);
    }

    setDecimals(pk, mainPKr, decimal, category, ticket, callback) {
        this.executeMethod(contract, 'setDecimals', pk, mainPKr, [decimal], "SERO",
            0, category, ticket
            , callback);
    }
}


const pAbi = new PlatformAbi();
export default pAbi;