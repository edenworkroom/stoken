import React, {Component} from 'react';
import {Storage, LinkedListStorage} from '../../database/localstorage'
import {NavBar, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';

import Abi from "../abi";

const abi = new Abi();

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

        this.state = {contracts: this.listContracts()};
    }

    listContracts() {
        let contracts = [];
        this.db.forEach(function (item, key) {
            contracts.push({name: item.name, address: key})
        });
        return contracts;
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
                let list = this.listContracts();
                const address = value["address"];
                const name = value["name"];
                const abi = value["abi"];
                this.db.insert(address, {"name": name, abi: abi});

                list.push({name: name, address: address})
                this.setState({contracts: list});
            }
        })
    }

    render() {
        let self = this;
        const {getFieldProps} = this.props.form;
        const {changeTab} = this.props;
        let list = this.state.contracts.map((item, index) => {
            return <List.Item key={index}>
                <Flex>
                    <Flex.Item style={{flex: 4}}>
                        <Flex style={{textAlign: 'center'}} onClick={() => {
                            if (changeTab) {
                                changeTab(item.address);
                            }
                        }}>
                            <Flex.Item style={{flex: 1}}>{item.name}</Flex.Item>
                            <Flex.Item
                                style={{flex: 3}}>{item.address.slice(0, 5) + ".." + item.address.slice(-5)}</Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item style={{flex: 1}}>
                        <a onClick={() => {
                            this.db.remove(item.address);
                            this.setState({contracts: this.listContracts()});
                        }}>
                            remove
                        </a>
                    </Flex.Item>
                </Flex>
            </List.Item>
        })
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>
                    <form className="ui form">
                        <div className="field">
                            <label>Name</label>
                            <div className="field">
                                {this.nameDecorator(<input type="text" name="name" placeholder="name"
                                                           ref={el => this.autoFocusInst = el}/>)}
                            </div>
                        </div>
                        <div className="field">
                            <label>Address</label>
                            {this.addressDecorator(<textarea rows="3" placeholder={"address"}
                                                             ref={el => this.autoFocusInst = el}/>)}
                        </div>
                        <div className="field">
                            <label>ABI</label>
                            {this.abiDecorator(<textarea rows="3" placeholder={"abi"}
                                                         ref={el => this.autoFocusInst = el}/>)}
                        </div>

                    </form>
                    <WhiteSpace/>
                    <Button type="primary" onClick={() => {
                        this.submit()
                    }}>加载</Button>
                    <WhiteSpace/>
                </WingBlank>
                <WingBlank>
                    <List renderHeader={"合约列表"}>
                        {list}
                    </List>
                </WingBlank>
            </div>
        )
    }
}

const LoadForm = createForm()(LoadContractForm)

export default LoadForm

