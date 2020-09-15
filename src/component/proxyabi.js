import serojs from "serojs";
import Abi from "./abi";
import {tokenToBytes} from "./common";

const abiJson = [{
    "constant": false,
    "inputs": [{"name": "tokenName", "type": "string"}, {"name": "decimals", "type": "uint8"}, {
        "name": "initialSupply",
        "type": "uint256"
    }, {"name": "canMint", "type": "bool"}],
    "name": "createToken",
    "outputs": [{"name": "ticket", "type": "bytes32"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "coinName", "type": "string"}],
    "name": "getDecimal",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "setUnableMint",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "start", "type": "uint256"}, {"name": "end", "type": "uint256"}],
    "name": "coinsList",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "ticktes", "type": "bytes32[]"}],
    "name": "tokens",
    "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "bytes32[]"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}, {
        "name": "ticket",
        "type": "bytes32"
    }],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_platform", "type": "address"}],
    "name": "setPlatform",
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
    "constant": true,
    "inputs": [{"name": "", "type": "bytes32"}],
    "name": "nameToTicketMap",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "coinName", "type": "string"}, {"name": "canMint", "type": "bool"}],
    "name": "getFee",
    "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "tokenNames", "type": "bytes32[]"}],
    "name": "canMintByNames",
    "outputs": [{"name": "", "type": "bool[]"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "tokenName", "type": "bytes32"}],
    "name": "detailByName",
    "outputs": [{"name": "totalSupply", "type": "uint256"}, {"name": "balance", "type": "uint256"}, {
        "name": "decimals",
        "type": "uint8"
    }, {"name": "canMint", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
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
    "inputs": [{"name": "decimals", "type": "uint8"}, {"name": "ticket", "type": "bytes32"}],
    "name": "setDecimals",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
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
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "mintToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "to", "type": "address"}, {"name": "ticket", "type": "bytes32"}],
    "name": "give",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}, {"name": "ticket", "type": "bytes32"}],
    "name": "burnToken",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
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
    "constant": false,
    "inputs": [{"name": "tokenName", "type": "string"}, {"name": "ticket", "type": "bytes32"}],
    "name": "addTokenName",
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

class ProxyAbi extends Abi {

    constructor(address) {
        super();
        this.address = address;
        this.contract = serojs.callContract(abiJson, address);
    }

    coinsList(from, start, size, callback) {
        let self = this;
        this.callMethod(this.contract, "coinsList", from, [start, start + size], function (rets) {
            let tokens = JSON.parse(rets);
            let names = [];
            tokens.forEach((item) => {
                names.push(tokenToBytes(item.token));
            })
            self.canMintByNames(from, names, function (canMintMap) {
                tokens.forEach((item, index) => {
                    item.canMint = canMintMap[names[index]];
                })
                callback(tokens);
            })
        });
    }

    canMintByNames(from, tokenNames, callback) {
        this.callMethod(this.contract, "canMintByNames", from, [tokenNames], function (rets) {
            let canMintMap = {};
            tokenNames.forEach((token, index) => {
                canMintMap[token] = rets[index]
            })

            callback(canMintMap);
        });
    }

    detail(from, tokenName, callback) {
        this.callMethod(this.contract, "detailByName", from, [tokenName], function (rets) {
            callback({
                token: tokenName,
                totalSupply: rets[0].toNumber(),
                balance: rets[1].toNumber(),
                decimals: rets[2].toNumber(),
                canMint: rets[3]
            });
        });
    }

    tokens(from, tickets, callback) {
        this.callMethod(this.contract, "tokens", from, [tickets], function (rets) {
            let tokens = JSON.parse(rets[0]);
            let _tickets = rets[1];
            tokens.forEach((item, index) => {
                item.ticket = _tickets[index];
                if (tickets.indexOf(_tickets[index]) != -1) {
                    item.canMint = true;
                }
            });
            let list = [];
            for (var i = 0; i < tokens.length; i++) {
                for (var j = i + 1; j < tokens.length; j++) {
                    if (tokens[i].token === tokens[j].token) {
                        ++i;
                    }
                }
                list.push(tokens[i]);
            }

            list.sort(function (a, b) {
                return a.token < b.token ? -1 : 1;
            });
            callback(list);
        });
    }

    getFee(from, tokenName, canMint, callback) {
        this.callMethod(this.contract, "getFee", from, [tokenName, canMint], function (ret) {
            callback(ret[0], ret[1]);
        });
    }

    createToken(pk, mainPKr, coinName, decimals, initialSupply, canMint, callback) {
        let self = this;
        this.getFee(mainPKr, coinName, canMint, function (_, value) {
            self.executeMethod(self.contract, 'createToken', pk, mainPKr, [coinName, decimals, initialSupply, canMint], "SERO",
                value
                , callback);
        });
    }

    mintToken(pk, mainPKr, supply, category, ticket, callback) {
        this.executeMethod(this.contract, 'mintToken', pk, mainPKr, [supply], "SERO",
            0, category, ticket
            , callback);
    }

    burnToken(pk, mainPKr, supply, category, ticket, flag, callback) {

        if (flag) {
            this.executeMethod(this.contract, 'burnToken', pk, mainPKr, [supply, ticket], "SERO",
                0, category, ticket
                , callback);
        } else {
            this.executeMethod(this.contract, 'burnToken', pk, mainPKr, [supply, ticket], "SERO",
                0, null, null
                , callback);
        }
    }

    give(pk, mainPKr, to, category, ticket, flag, callback) {
        if (flag) {
            this.executeMethod(this.contract, 'give', pk, mainPKr, [to, ticket], "SERO",
                0, category, ticket
                , callback);
        } else {
            this.executeMethod(this.contract, 'give', pk, mainPKr, [to, ticket], "SERO",
                0, null, null
                , callback);
        }
    }

    transfer(pk, mainPKr, to, amount, category, ticket, flag, callback) {
        if (flag) {
            this.executeMethod(this.contract, 'transfer', pk, mainPKr, [to, amount, ticket], "SERO",
                0, category, ticket
                , callback);
        } else {
            this.executeMethod(this.contract, 'transfer', pk, mainPKr, [to, amount, ticket], "SERO",
                0, null, null
                , callback);
        }

    }

    setDecimals(pk, mainPKr, decimal, category, ticket, flag, callback) {
        if (flag) {
            this.executeMethod(this.contract, 'setDecimals', pk, mainPKr, [decimal, ticket], "SERO",
                0, category, ticket
                , callback);
        } else {
            this.executeMethod(this.contract, 'setDecimals', pk, mainPKr, [decimal, ticket], "SERO",
                0, null, null
                , callback);
        }

    }

    setUnableMint(pk, mainPKr, coinName, canMint, category, ticket, callback) {
        let self = this;
        this.getFee(mainPKr, coinName, canMint, function (value, _) {
            self.executeMethod(self.contract, 'setUnableMint', pk, mainPKr, [], "SERO",
                value, category, ticket
                , callback);
        });

    }
}

const proxyAbi = new ProxyAbi("5671Gg4XK6wpQQif4YUgH8HT2CDrmfRKrkfJ1kwEX1RKfA4m4Px1WSge7885xA4rVt7dJc6q2XMgsGXh2VwhbzVg");
export default proxyAbi;