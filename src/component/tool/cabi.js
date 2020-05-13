import React, {Component} from 'react';
import {List, Item, Button, Flex, InputItem, WingBlank, WhiteSpace} from "antd-mobile";
import {createForm} from 'rc-form';

import serojs from 'serojs'
import abi from '../abi';

const BigNumber = require('bignumber.js');
const one = new BigNumber("1000000000000000000")

class Input extends Component {
    constructor(props) {
        super(props);
        this.valueDecorator = this.props.form.getFieldDecorator(props.input.name, {
            rules: [],
        });
    }

    render() {
        return this.valueDecorator(
            <InputItem key={this.props.input.name} type="text" name={this.props.input.name}
                       placeholder={this.props.input.type}>{this.props.input.name}</InputItem>
        )
    }
}

class MethodForm extends Component {
    constructor(props) {
        super(props);
    }

    execute(executeData, contract) {
        let self = this;
        if (self.props.method.constant) {
            abi.call(executeData, function (callData) {
                if (callData !== "0x") {
                    let res = contract.unPackData(self.props.method.name, callData);
                    self.refs.result.innerHTML = res
                }
            });

        } else {
            abi.executeContract(executeData, function (res) {
                self.refs.result.innerHTML = res
            })
        }
    }

    submit() {
        let self = this;
        let from = "";
        let amount = "0";
        let gasLimit = "0";
        self.props.accountForm.validateFields((error, value) => {
            from = value["account"];
            if (value["value"]) {
                amount = value["value"];
            }
            if (value["gasLimit"]) {
                gasLimit = value["gasLimit"];
            }

        });
        let args = [];
        self.props.form.validateFields((error, value) => {
            this.props.method.inputs.forEach((item) => {
                args.push(value[item.name])
            })
        });

        let contract = serojs.callContract(this.props.contract.abi, this.props.contract.address);

        try {
            let packData = "";
            if (this.props.method.name) {
                packData = contract.packData(this.props.method.name, args);
            }
            let executeData = {
                from: from,
                to: this.props.contract.address,
                value: "0x" + new BigNumber(amount).multipliedBy(one).toString(16),
                data: packData,
            };

            if (gasLimit === "0" && !self.props.method.constant) {
                serojs.estimateGas(executeData, function (gasLimit) {
                    executeData["gas"] = "0x" + new BigNumber(gasLimit).toString(16);
                    self.execute(executeData, contract);
                });
            } else {
                executeData["gas"] = "0x" + new BigNumber(gasLimit).toString(16);
                self.execute(executeData, contract);
            }
        } catch (e) {
            alert(e.message);
        }
    }

    render() {

        let self = this;
        let methodName = this.props.method.name ? this.props.method.name : "fallback";
        let inputItems;
        if (this.props.method.inputs) {
            inputItems = this.props.method.inputs.map(
                (input) => {
                    return <Input key={input.name} input={input} form={self.props.form}/>
                }
            );
        }

        return (
            <div className="abi">
                <WhiteSpace/>
                <List>
                    <List.Item>
                        <div style={{float: 'left'}}>
                            {methodName}
                        </div>
                        <div style={{float: 'right'}}>
                            <Button onClick={() => this.submit()} type="primary"
                                    inline size="small"
                                    style={{marginRight: '4px'}}>
                                {self.props.method.constant ? "call" : "transact"}
                            </Button>
                        </div>
                    </List.Item>
                    <List.Item>
                        {inputItems}
                        <div ref="result" style={{paddingLeft: '15px'}}></div>
                    </List.Item>
                </List>
                <WhiteSpace/>
            </div>
        )
    }
}

const MForm = createForm()(MethodForm)

export class Cabi extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let callItems = [];
        let transactItems = [];
        let self = this;
        self.props.abi.forEach(function (item, index) {
            if (item.type != "constructor" && item.type != "event") {
                if (item.constant) {
                    callItems.push(<MForm key={index} contract={self.props.contract} method={item}
                                          accountForm={self.props.accountForm}/>)
                } else {
                    transactItems.push(<MForm key={index} contract={self.props.contract} method={item}
                                              accountForm={self.props.accountForm}/>)
                }
            }
        });
        return (
            <WingBlank>
                {callItems}
                {transactItems}
            </WingBlank>
        )
    }
}