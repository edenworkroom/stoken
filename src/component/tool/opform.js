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
        this.state = {contract: null, contracts: []}
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
        let list = this.loadContracts();
        if (list.length > 0) {
            this.setState({contract: list[0], contracts: list})
        } else {
            this.setState({contracts: list})
        }
    }

    formatAccount = (mainPKr, amount) => {
        if (!amount) {
            amount = 0;
        }
        if (mainPKr) {
            return mainPKr.slice(0, 10) + "...." + mainPKr.slice(-10) + " (" + amount + ")"
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
                        self.props.form.setFieldsValue({"account": account.pk});
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
                    <List renderHeader={() => '选择账号'}>
                        {
                            this.props.form.getFieldDecorator('account', {
                                rules: [{required: true,}], initialValue: this.state.account
                            })(
                                <InputItem placeholder="pkr"
                                           onClick={this.showAccountList}
                                           name="account"
                                >account</InputItem>
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
                        <Button
                            onClick={this.showContractList.bind(this)}>{this.state.contract && this.state.contract.address}</Button>
                    </List>
                    <WhiteSpace/>
                </WingBlank>

                {this.state.contract && <Contract abis={this.state.contract.abis} addresss={this.state.contract.address}
                                                  accountForm={this.props.form}/>}

                <WhiteSpace/>
            </div>
        )
    }
}

const
    OpForm = createForm()(OpContractForm)

export default OpForm

