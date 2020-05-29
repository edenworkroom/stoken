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
        "inputs": [{"name": "start", "type": "uint256"}, {"name": "end", "type": "uint256"}],
        "name": "coinsList",
        "outputs": [{"name": "json", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
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
    }]
;


class PlatformAbi extends Abi {

    constructor(address) {
        super();
        this.address = address;
        this.contract = serojs.callContract(abiJson, address);
    }

    coinsList(from, callback) {
        this.callMethod(this.contract, "coinsList", from, [0, 100], function (json) {
            callback(JSON.parse(json));
        });
    }

    tokens(from, tickets, callback) {
        this.callMethod(this.contract, "tokens", from, [tickets], function (json) {
            let tokens = JSON.parse(json);
            tokens.forEach((item, index) => {
                item.ticket = tickets[index];
            });

            tokens.sort(function (a, b) {
                return a.token < b.token ? -1 : 1;
            });
            callback(tokens);
        });
    }

    getFee(from, tokenName, callback) {
        this.callMethod(this.contract, "getFee", from, [tokenName], function (fee) {
            callback(fee);
        });
    }

    createToken(pk, mainPKr, coinName, decimals, initialSupply, callback) {
        let self = this;
        this.getFee(mainPKr, coinName, function (value) {
            self.executeMethod(self.contract, 'createToken', pk, mainPKr, [coinName, decimals, initialSupply], "SERO",
                value
                , callback);
        });
    }

    mintToken(pk, mainPKr, supply, category, ticket, callback) {
        this.executeMethod(this.contract, 'mintToken', pk, mainPKr, [supply], "SERO",
            0, category, ticket
            , callback);
    }

    burnToken(pk, mainPKr, supply, category, ticket, callback) {
        this.executeMethod(this.contract, 'burnToken', pk, mainPKr, [supply], "SERO",
            0, category, ticket
            , callback);
    }

    give(pk, mainPKr, to, category, ticket, callback) {
        this.executeMethod(this.contract, 'give', pk, mainPKr, [to], "SERO",
            0, category, ticket
            , callback);
    }

    transfer(pk, mainPKr, to, amount, category, ticket, callback) {
        this.executeMethod(this.contract, 'transfer', pk, mainPKr, [to, amount], "SERO",
            0, category, ticket
            , callback);
    }

    setDecimals(pk, mainPKr, decimal, category, ticket, callback) {
        this.executeMethod(this.contract, 'setDecimals', pk, mainPKr, [decimal], "SERO",
            0, category, ticket
            , callback);
    }

    into(pk, mainPKr, token, value, callback) {
        this.executeMethod(this.contract, '', pk, mainPKr, [], token,
            value, null, null
            , callback);
    }
}

const pAbi1 = new PlatformAbi("5PFrZeF7aFTYJWnB5tseBcU5BVgUAUywhxFyuz6aK6iqgsZCk2T2nP8vA9f6QqxvUiYh7UywpRsP62LM1sz5sBMc");

const pAbi3 = new PlatformAbi("5jeMJbzVT8tM8iTD7PM8gYerUPwpYXQeBD1Eh2HQ15cYud3XtnaCVWJ5yn9L9zJCUjtYYc9sW9LJxFd8Ph4eYhRw");


export {
    pAbi3, pAbi1
};