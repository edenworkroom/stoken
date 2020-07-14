import React, {Component} from 'react';
import {List, Item, Button, Flex, InputItem, WingBlank, WhiteSpace} from "antd-mobile";
import {createForm} from 'rc-form';

import serojs from 'serojs'
import Abi from '../abi';

const BigNumber = require('bignumber.js');
const one = new BigNumber("1000000000000000000")
const abi = new Abi();

class Input extends Component {
    constructor(props) {
        super(props);
        console.log("Input", props.name);
        this.valueDecorator = this.props.form.getFieldDecorator(props.name, {
            rules: [],
        });
    }

    render() {
        const {name, type} = this.props;
        return this.valueDecorator(
            <InputItem key={name} type="text" name={name} placeholder={type}>{name}:</InputItem>
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
        let contract = this.props.contract;
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
                    if(!input.name) {
                       console.log(input)
                        return ""
                    }
                    return <Input type={input.type} name={input.name} form={self.props.form}/>
                }
            );
        }

        let view = self.props.method.stateMutability == "view";
        return (

            <div className="abi">
                <WhiteSpace/>
                <List>
                    <List.Item>
                        <div style={{float: 'left'}}>
                            {methodName}
                        </div>
                        <div style={{float: 'right'}}>
                            <Button onClick={() => this.submit()} type={view ?"primary":"warning"}
                                    inline size="small"
                                    style={{marginRight: '4px'}}>
                                {view ? "call" : "transact"}
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

export class Contract extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let contract = serojs.callContract(this.props.abis, this.props.address);
        let callItems = [];
        let transactItems = [];
        let self = this;
        self.props.abis.forEach(function (item, index) {
            if (item.type != "constructor" && item.type != "event") {
                if (item.stateMutability === "view") {
                    callItems.push(<MForm key={index} contract={contract} method={item}
                                          accountForm={self.props.accountForm}/>)
                } else {
                    transactItems.push(<MForm key={index} contract={contract} method={item}
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