import React, {Component} from 'react';
import {Storage, LinkedListStorage} from '../../database/localstorage'
import {NavBar, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';


class LoadContractForm extends Component {
    constructor(props) {
        super(props);
        this.db = new LinkedListStorage("SC", Storage);
        this.nameDecorator = this.props.form.getFieldDecorator('name', {
            rules: [{required: true}],
        });
        this.addressDecorator = this.props.form.getFieldDecorator('address', {
            rules: [{required: true,}],
        });
        this.abiDecorator = this.props.form.getFieldDecorator('abi', {
            rules: [{required: true}],
        });
    }

    submit() {
        let that = this;
        this.props.form.validateFields((error, value) => {
            if (!value["address"]) {
                Toast.fail("Address is required!", 1)
                that.setState({
                    confirming: false
                });
                return
            } else {
                let addr = value["address"];
                if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{80,}$/i.test(addr)) {
                    Toast.fail("Address must be base58!", 1)
                    that.setState({
                        confirming: false
                    });
                    return
                }
            }
            if (!value["name"]) {
                Toast.fail("Name is required!", 1)
                that.setState({
                    confirming: false
                });
                return
            }
            if (!value["abi"]) {
                Toast.fail("Abi is required!", 1)
                that.setState({
                    confirming: false
                });
                return
            } else {
                try {
                    JSON.parse(value["abi"]);
                } catch (e) {
                    Toast.fail("Abi must be json!", 1)
                    that.setState({
                        confirming: false
                    });
                    return
                }
            }
            {
                const address = value["address"];
                const name = value["name"];
                const abi = value["abi"];
                this.db.insert(address, {"name": name, abi: abi});
                window.location.replace("#/op");
            }
        })
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>
                    <List renderHeader={() => '智能合约名称:'}>
                        {
                            this.nameDecorator(
                                <InputItem
                                    clear
                                    name={"name"}
                                    placeholder="name"
                                    ref={el => this.autoFocusInst = el}
                                />
                            )
                        }

                    </List>

                    <List renderHeader={() => '智能合约地址:'}>
                        {
                            this.addressDecorator(
                                <TextareaItem
                                    clear
                                    name={"address"}
                                    placeholder={"address"}
                                    ref={el => this.autoFocusInst = el}
                                    rows={3}
                                />
                            )
                        }

                    </List>
                    <List renderHeader={() => '智能合约abi:'}>
                        {
                            this.abiDecorator(
                                <TextareaItem
                                    clear
                                    name={"abi"}
                                    placeholder={"abi"}
                                    ref={el => this.autoFocusInst = el}
                                    rows={3}
                                />
                            )
                        }
                    </List>
                    <WhiteSpace/>
                    <Button type="primary" onClick={() => {
                        this.submit()
                    }}>加载</Button>
                    <WhiteSpace/>
                </WingBlank>
            </div>
        )
    }
}

const LoadForm = createForm()(LoadContractForm)

export default LoadForm

