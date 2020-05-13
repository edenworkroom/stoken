import React, {Component} from 'react';
import {Storage, LinkedListStorage} from '../../database/localstorage'
import {Flex, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast, NavBar} from 'antd-mobile';

import {createForm} from 'rc-form';
import {Cabi} from "./cabi";
import abi from '../abi';

const operation = Modal.operation;

class OpContractForm extends Component {
    constructor(props) {
        super(props);
        this.db = Storage;
        this.db = new LinkedListStorage("SC", Storage);

        let contracts = new Map();
        let defaultContract;
        let that = this;
        this.db.forEach(function (item, key) {
            if (!defaultContract) {
                defaultContract = key;
            }
            const abi = JSON.parse(item.abi);
            contracts.set(key, {name: item.name, abi: abi, address: key});
        });

        let accounts = new Map()
        this.state = {
            contract: defaultContract,
            contracts: contracts
        }
    }

    componentDidMount() {
        let that = this;
        let accounts = new Map();
        let defaultAccount = "";


        abi.accountList(function (data) {
            data.forEach(function (item, index) {
                if (index == 0) {
                    defaultAccount = item.PK;
                }
                accounts.set(item.PK, {name: item.Name, balances: item.Balance})
            });
            that.setState({accounts: accounts, account: defaultAccount})
        });
    }

    formatAccount = (pk, amount) => {
        if (!amount) {
            amount = 0;
        }
        if (pk) {
            return pk.slice(0, 6) + "...." + pk.slice(-6) + " (" + amount + ")"
        }
    }

    showAccountList = () => {
        let self = this;
        let options = [];
        this.state.accounts.forEach(function (item, pk) {
            let balance = item.balances["SERO"];
            if (!balance) {
                balance = 0;
            }
            let text = self.formatAccount(pk, balance);
            options.push({
                text: item.name + ":" + text, onPress: () => {
                    self.props.form.setFieldsValue({"account": pk});
                    self.setState({account: pk});
                }
            });
        });
        operation(options);
    }

    showContractList = () => {
        let options = [];
        let self = this;
        this.state.contracts.forEach(function (item, address) {
            options.push({
                text: item.name + ":" + address, onPress: () => {
                    self.setState({contract: address})
                }
            })
        });
        operation(options)
    }

    render() {
        let contract = this.state.contracts.get(this.state.contract);
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>
                    <WhiteSpace/>
                    <List renderHeader={() => '选择账号'}>
                        {
                            this.props.form.getFieldDecorator('account', {
                                rules: [{required: true,}], initialValue: this.state.account
                            })(
                                <InputItem
                                    onClick={this.showAccountList}
                                    name="account"
                                ></InputItem>
                            )
                        }
                        {
                            this.props.form.getFieldDecorator('value', {
                                rules: []
                            })(
                                <InputItem
                                    type="text"
                                    name="value"
                                    placeholder="value"
                                >value</InputItem>
                            )
                        }
                        {
                            this.props.form.getFieldDecorator('gasLimit', {
                                rules: []
                            })(
                                <InputItem
                                    type="text"
                                    name="gasLimit"
                                    placeholder="gasLimit"
                                >gasLimit</InputItem>
                            )
                        }
                    </List>

                    <WhiteSpace size="md"/>
                    <List renderHeader={() => '选择合约'}>
                        <Button onClick={this.showContractList}>{this.state.contract}</Button>
                    </List>
                    <WhiteSpace/>
                </WingBlank>

                {contract && contract.abi &&
                <Cabi contract={contract} abi={contract.abi} accountForm={this.props.form}/>
                }

                <WhiteSpace/>
            </div>
        )
    }
}

const
    OpForm = createForm()(OpContractForm)

export default OpForm

