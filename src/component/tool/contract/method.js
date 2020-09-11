import React, {Component} from 'react';
import {Modal, Item, Button, Flex, InputItem, WingBlank, WhiteSpace, Card, TextareaItem} from "antd-mobile";
import {createForm} from 'rc-form';
import 'semantic-ui-css/semantic.min.css';
import Abi from '../../abi'
import BigNumber from 'bignumber.js'

const abi = new Abi();

const alert = Modal.alert;
const one = new BigNumber("1000000000000000000");

class Input extends Component {
    constructor(props) {
        super(props);
        this.valueDecorator = this.props.form.getFieldDecorator(props.name, {
            rules: [],
        });
    }

    render() {
        const {name, type} = this.props;
        return this.valueDecorator(
            <div className="field">
                <label>{name}</label>
                <input key={name} type="text" placeholder={type} ref={el => this.valueDecorators = el}/>
            </div>
        )
    }
}

class MethodForm extends Component {
    constructor(props) {
        super(props);
    }

    submit() {
        let self = this;
        const {account, method} = this.props;
        let args = [];
        let value = 0;
        let currency = "SERO";
        self.props.form.validateFields((error, value) => {
            if (value["value"]) {
                value = new BigNumber(value["value"]).multipliedBy(one);
            }
            if (value["currency"]) {
                currency = value["currency"];
            }

            method.inputs.forEach((item) => {
                if (value[item.name]) {
                    args.push(value[item.name])
                } else if (value[item.type]) {
                    args.push(value[item.typetype])
                } else {
                    args.push(null)
                }
            })
        });

        if (method.stateMutability == "view" || method.stateMutability == "pure") {
            abi.callMethodEx(self.props.contract, method.name, account.mainPKr, args, function (ret) {
                self.refs.result.innerHTML = JSON.stringify(ret[0]);
            })
        } else {
            abi.executeMethod(self.props.contract, method.name, account.pk, account.mainPKr, args,
                currency, value, null, null, function (ret) {
                    self.refs.result.innerHTML = JSON.stringify(ret);
                });
        }
    }

    render() {
        let self = this;
        const {account, contract, method} = this.props;
        let methodName = method.name ? method.name : method.type == "function" ? "fallback" : "constructor";
        console.log("method", this.props);
        let inputItems;
        if (method.inputs) {
            inputItems = method.inputs.map(
                (method, index) => {
                    console.log("method", method);
                    if (!method.name) {
                        // return <Input key={index} type={method.type} name={method.type} form={self.props.form}/>
                    } else {
                        return <Input key={index} type={method.type} name={method.name} form={self.props.form}/>
                    }
                }
            );
        }

        let view = method.stateMutability == "view" || method.stateMutability == "pure";

        let options = []
        if (method.stateMutability == "payable") {
            account.balances.forEach((val, key) => {
                options.push(<option key={key} value={key}>{key}</option>)
            })
            if (options.length == 0) {
                options.push(<option key={"SERO"} value={"SERO"}>SERO</option>)
            }
        }

        return (
            <div className="item">
                <Card>
                    <Card.Header
                        title={
                            <Button onClick={() => this.submit()} type={view ? "primary" : "warning"}
                                    inline size="small"
                                    style={{marginRight: '4px'}}>
                                {methodName}
                            </Button>
                        }
                    />
                    {
                        (inputItems.length > 0 || method.stateMutability == "payable") && <Card.Body>
                            <div className="ui form" style={{paddingLeft: '15px'}}>
                                {inputItems.length > 0 && inputItems}
                                {
                                    method.stateMutability == "payable" &&
                                    <div className="field">
                                        <label>Value</label>
                                        <div className="two fields">
                                            <div className="field">
                                                {
                                                    this.props.form.getFieldDecorator('value', {
                                                        rules: []
                                                    })(<input type="text" name="value" placeholder="value"/>
                                                    )
                                                }

                                            </div>
                                            <div className="field">
                                                <label>Currency</label>
                                                {
                                                    this.props.form.getFieldDecorator('currecny', {
                                                        rules: [], initialValue: "SERO"
                                                    })(
                                                        <select className="ui search dropdown" name="currecny">
                                                            {options}
                                                        </select>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </Card.Body>
                    }
                    <Card.Footer content={<div ref="result" style={{
                        paddingLeft: '15px', width: '100%', wordBreak: 'break-all'
                    }}></div>}>
                    </Card.Footer>
                </Card>
            </div>
        )
    }
}

const MForm = createForm()(MethodForm)

export default MForm