import React, {Component} from 'react';
import {NavBar, Modal, Button, WhiteSpace, List, InputItem, TextareaItem, WingBlank, Toast, Flex} from 'antd-mobile';

import {createForm} from 'rc-form';
import Abi from "../abi";
import BigNumber from "bignumber.js";

const abi = new Abi();

class Deploy extends Component {
    constructor(props) {
        super(props);
        this.state = {pk: props.pk, inputs: []}
    }

    componentDidMount() {
        let self = this;
        abi.init.then(() => {
            abi.accountDetails(this.state.pk, function (account) {
                self.setState({account: account});
            })
        })
    }

    submit() {
        let _abi = this.abi.value;
        let code = this.code.value;
        let args = "41cx7DsTN7kGwdNHdTLg9AxgXH2LTkbS8kpohrS5QDygaU9z6wmh9vetBeVKrSWw2kwFuuFajVRWsz7oaQVrsQWE";
        // this.props.form.validateFields((error, values) => {
        //     console.log(values)
        //     this.state.inputs.forEach((item) => {
        //         args.push(values[item.name]);
        //     })
        // })

        console.log(_abi, code, args, this.state.account);

        abi.deploy(this.state.account.pk, this.state.account.mainPKr, JSON.parse(_abi), code, args, 0, "", function (ret) {
            console.log(ret);
        })
    }

    render() {
        let self = this;
        const {getFieldDecorator, getFieldProps} = this.props.form;
        return (
            <div style={{padding: '15px 0'}}>
                <WingBlank>

                    <List renderHeader={() => '智能合约Abi:'}>
                        <TextareaItem placeholder={"abi"}
                                      rows={5}
                                      ref={el => this.abi = el}
                                      onChange={(value) => {
                                          this.abi.value = value;
                                          let abis = JSON.parse(value);
                                          let constructor;
                                          abis.forEach(each => {
                                              if (each.type == "constructor" && each.inputs.length > 0) {
                                                  constructor = each;
                                              }
                                          });

                                          if (constructor) {
                                              let inputs = []
                                              constructor.inputs.forEach(item => {

                                                  // inputs.push(self.props.form.getFieldDecorator(item.name, {
                                                  //     rules: []
                                                  // })(<InputItem>{item.name}</InputItem>));
                                                  inputs.push(<InputItem value={"123"} {...getFieldProps(item.name)}>{item.name}</InputItem>)
                                              })
                                              this.setState({inputs: inputs});
                                          } else {
                                              this.setState({inputs: []});
                                          }

                                          // setFieldProps
                                      }}
                        />

                    </List>
                    {
                        this.state.inputs.length > 0 && <List renderHeader={() => '参数:'}>
                            {this.state.inputs}
                        </List>
                    }

                    <List renderHeader={() => '智能合约Data:'}>
                        <TextareaItem clear name={"code"} placeholder={"code"}
                                      rows={5} ref={el => this.code = el} onChange={(value)=>{
                                          this.code.value = value;
                        }}/>
                    </List>
                    <WhiteSpace/>
                    <Button type="primary" onClick={() => {
                        this.submit()
                    }}>发布</Button>
                    <WhiteSpace/>
                </WingBlank>
            </div>
        )
    }
}

const DeployForm = createForm()(Deploy)
export default DeployForm

