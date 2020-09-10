import React, {Component} from 'react';
import {Storage, LinkedListStorage} from '../../database/localstorage'
import {Flex, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast, NavBar} from 'antd-mobile';
import {createForm} from 'rc-form';
import {Contract} from "./contract";

import Abi from "../abi";

const operation = Modal.operation;
const abi = new Abi();

class OpContractForm extends Component {

    constructor(props) {
        super(props);
        this.db = Storage;
        this.db = new LinkedListStorage("SC", Storage);

        let contract = null;
        if (props.contract) {
            let item = this.db.get(props.contract);
            contract = {name: item.name, abis: JSON.parse(item.abi), address: props.contract}
        }

        this.state = {contract: contract, contracts: [], account: {}}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contract !== this.props.contract) {
            let item = this.db.get(nextProps.contract);
            let contract = {name: item.name, abis: JSON.parse(item.abi), address: nextProps.contract}
            console.log("componentWillReceiveProps", contract);
            this.setState({contract: contract})
        }
    }

    loadContracts() {
        let contracts = [];
        this.db.forEach(function (item, key) {
            const abis = JSON.parse(item.abi);
            contracts.push({name: item.name, abis: abis, address: key})
        });
        return contracts;
    }

    componentDidMount() {
        let self = this;
        abi.init
            .then(() => {
                abi.accountList(function (accounts) {
                    let list = self.loadContracts();
                    if (list.length > 0) {
                        self.setState({
                            contract: list[0], contracts: list, account: accounts[0]
                        })
                    } else {
                        self.setState({contracts: list, account: accounts[0]})
                    }
                });
            });
    }

    formatAccount = (mainPKr, name) => {
        if (mainPKr) {
            return name + " " + mainPKr.slice(0, 10) + "...." + mainPKr.slice(-5)
        }
    }

    showAccountList = () => {
        let self = this;
        let options = [];
        abi.accountList(function (accounts) {
            accounts.forEach(function (account) {
                let balance = account.balances["SERO"];
                if (!balance) {
                    balance = 0;
                }
                let text = self.formatAccount(account.mainPKr, balance);
                options.push({
                    text: account.name + ":" + text, onPress: () => {
                        self.setState({account: account});
                    }
                });
            });
            operation(options);
        })
    }

    showContractList = () => {
        let self = this;
        let contracts = this.loadContracts()
        let options = [];

        contracts.forEach(function (item, index) {
            options.push({
                text: item.name + ":" + item.address.slice(0, 10), onPress: () => {
                    self.setState({contract: item, contracts: contracts})
                }
            })
        });
        operation(options)
    }

    render() {
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>
                    <WhiteSpace/>
                    <Flex style={{paddingTop: '15px'}}>
                        <Flex.Item style={{flex: 80, padding: '0px 15px'}}>
                            <span>账号 : {this.formatAccount(this.state.account.mainPKr, this.state.account.name)}</span>
                        </Flex.Item>
                        <Flex.Item style={{flex: 20}}>
                            <div><a onClick={() => {
                                this.showAccountList()
                            }}>切换账号</a></div>
                        </Flex.Item>
                    </Flex>

                    <WhiteSpace size="md"/>

                    <Flex style={{paddingTop: '15px'}}>
                        <Flex.Item style={{flex: 80, padding: '0px 15px'}}>
                            <span>合约 : {this.state.contract && this.state.contract.name}</span>
                        </Flex.Item>
                        <Flex.Item style={{flex: 20}}>
                            <div><a onClick={() => {
                                this.showContractList()
                            }}>切换合约</a></div>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
                </WingBlank>

                {this.state.contract && <Contract account={this.state.account}
                                                  abis={this.state.contract.abis}
                                                  address={this.state.contract.address}/>}

                <WhiteSpace/>
            </div>
        )
    }
}

const
    OpForm = createForm()(OpContractForm)

export default OpForm

