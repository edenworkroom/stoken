import React, {Component} from 'react';
import {Storage, LinkedListStorage} from '../../database/localstorage'
import {NavBar, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';

import Abi from "../abi";

const abi = new Abi();

class Deploy extends Component {
    constructor(props) {
        super(props);
        this.db = new LinkedListStorage("SC", Storage);
        this.nameDecorator = this.props.form.getFieldDecorator('name', {
            rules: [{required: true}],
        });
        this.codeDecorator = this.props.form.getFieldDecorator('code', {
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
            const abis = JSON.parse(item.abi);
            contracts.push({name: item.name, abis: abis, address: key})
        });
        return contracts;
    }

    componentDidMount() {
    }

    submit() {
        let self = this;

    }

    render() {
        const {getFieldProps} = this.props.form;
        let list = this.state.contracts.map((item, index) => {
            return <List.Item key={index}>
                <Flex>
                    <Flex.Item style={{flex: 1}}>{item.name}</Flex.Item>
                    <Flex.Item style={{flex: 4}}>{item.address.slice(0, 10) + ".." + item.address.slice(-5)}</Flex.Item>
                    <Flex.Item style={{flex: 1}}><Button inline size="small" onClick={() => {
                        this.db.remove(item.address);
                        this.setState({contracts: this.listContracts()});
                    }}>
                        删除
                    </Button></Flex.Item>
                </Flex>
            </List.Item>
        })
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>
                    <List renderHeader={() => '智能合约名称:'}>
                        {this.nameDecorator(<InputItem clear name={"name"} placeholder="name" ref={el => this.autoFocusInst = el}/>)}
                    </List>

                    <List renderHeader={() => '智能合约abi:'}>
                        {this.abiDecorator(<TextareaItem clear name={"abi"} placeholder={"abi"} ref={el => this.autoFocusInst = el} rows={3}/>)}
                    </List>
                    <List renderHeader={() => '智能合约Data:'}>
                        {this.codeDecorator(<TextareaItem clear name={"code"} placeholder={"code"} ref={el => this.autoFocusInst = el} rows={3}/>)}
                    </List>
                    <WhiteSpace/>
                    <Button type="primary" onClick={() => {
                        this.submit()
                        this.setState({contracts: this.listContracts()});
                    }}>发布</Button>
                    <WhiteSpace/>
                </WingBlank>
            </div>
        )
    }
}

const DeployForm = createForm()(Deploy)

export default DeployForm

