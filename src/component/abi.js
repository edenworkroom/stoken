import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import {Toast} from "antd-mobile";

const config = {
    name: "S Token",
    contractAddress: "NONE",
    github: "https://gitee.com/edenworkroom/stoken",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/stoken/logo.png'
}

export class Abi {

    constructor() {
        let self = this;
        self.init = new Promise(
            (resolve, reject) => {
                seropp.init(config, function (rest) {
                    if (rest === 'success') {
                        return resolve()
                    } else {
                        return reject(rest)
                    }
                })
            }
        )
    }

    initLanguage(callback) {
        seropp.getInfo(function (info) {
            callback(info.language);
        });
    }

    accountDetails(pk, callback) {
        let self = this;
        seropp.getAccountDetail(pk, function (item) {
            let tickets = new Map();
            if (item.Tickets.has("COIN1")) {
                item.Tickets.get("COIN1").forEach(item => {
                    tickets.set(item, "COIN1");
                });
            }
            if (item.Tickets.has("COIN3")) {
                item.Tickets.get("COIN3").forEach(item => {
                    tickets.set(item, "COIN3");
                });
            }
            callback({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balances: item.Balance, tickets: tickets})
        });
    }

    accountList(callback) {
        seropp.getAccountList(function (data) {
            let accounts = [];
            data.forEach(function (item, index) {
                let tickets = new Map();
                if (item.Tickets.has("COIN1")) {
                    item.Tickets.get("COIN1").forEach(item => {
                        tickets.set(item, "COIN1");
                    });
                }
                if (item.Tickets.has("COIN3")) {
                    item.Tickets.get("COIN3").forEach(item => {
                        tickets.set(item, "COIN3");
                    });
                }
                accounts.push({
                    pk: item.PK,
                    mainPKr: item.MainPKr,
                    name: item.Name,
                    balances: item.Balance,
                    tickets: tickets
                })
            });
            callback(accounts)
        });
    }


    callMethod(contract, _method, from, _args, callback) {
        let that = this;
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: from,
            to: contract.address,
            data: packData
        };

        seropp.call(callParams, function (callData) {
            if (callData !== "0x") {
                let res = contract.unPackData(_method, callData);
                if (callback) {
                    callback(res);
                }
            } else {
                callback("0x0");
            }
        });
    }

    executeMethod(contract, _method, pk, mainPKr, args, tokenName, value, category, ticket, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: pk,
            to: contract.address,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: tokenName,
            catg: category,
            tkt: ticket
        };
        let estimateParam = {
            from: mainPKr,
            to: contract.address,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: tokenName,
            catg: category,
            tkt: ticket
        };

        seropp.estimateGas(estimateParam, function (gas, error) {
            if (error) {
                Toast.fail("Failed to execute smart contract")
            } else {
                executeData["gas"] = gas;
                seropp.executeContract(executeData, function (res, error) {
                    if (callback) {
                        callback(res)
                    }
                })
            }
        });
    }
}

export default Abi;