import React, {Component} from "react";
import {WingBlank, Modal, List, Flex, SearchBar, WhiteSpace} from "antd-mobile";
import Base from './base'
// import {pAbi3} from './platformabi';
import {showValue, showValueP} from "./common";

import proxyAbi from "./proxyabi";

const alert = Modal.alert;

const operation = Modal.operation;

class TokenList extends Base {

    constructor(props) {
        super(props);
        this.state = {tokens: [], tokenName: null};
    }

    _init(pk) {
        let self = this;
        if (self.state.tokenName) {
            proxyAbi.detail("23EAQCUBU9GEWajVb8YaCVxpk5sKh6qCeLoHPPjnnjDLPt4dydhCH5ezUxV3F8gJUxm8vmiCFGZLprsL8XikAQXk9euFoVpB6fnRdqEBf1oTFJiZ5ke8kdnxDjxYCCLxLuJG",
                self.state.tokenName, function (token) {
                    self.setState({tokens: [token]});
                });
        } else {
            proxyAbi.coinsList("23EAQCUBU9GEWajVb8YaCVxpk5sKh6qCeLoHPPjnnjDLPt4dydhCH5ezUxV3F8gJUxm8vmiCFGZLprsL8XikAQXk9euFoVpB6fnRdqEBf1oTFJiZ5ke8kdnxDjxYCCLxLuJG", function (tokens) {
                self.setState({tokens: tokens});
            });
        }
    }


    render() {
        let self = this;
        let tokens = this.state.tokens.map((item, index) => {
            return (
                <List.Item key={index}>
                    <Flex>
                        <Flex.Item style={{flex: 2}}>{item.token}</Flex.Item>
                        <Flex.Item style={{flex: 2}}>{showValueP(item.totalSupply, item.decimals, 6)}</Flex.Item>
                        <Flex.Item style={{flex: 1}}>{item.decimals}</Flex.Item>
                        <Flex.Item style={{flex: 1}}>{
                            item.canMint ? "是" : "否"
                        }</Flex.Item>
                        <Flex.Item style={{flex: 2}}>{showValueP(item.balance, item.decimals, 6)}</Flex.Item></Flex>
                </List.Item>
            )
        });

        return (
            <WingBlank size="md">
                <SearchBar placeholder="币名" maxLength={8} onSubmit={value => {
                    this.setState({tokenName: value.trim()}, function () {
                        // this._init();
                    });

                }} onClear={value => {
                    if(this.state.tokenName) {
                        this.setState({tokenName: null}, function () {
                            // this._init();
                        });
                    }

                }}/>
                <WhiteSpace/>
                <List renderHeader={() => {
                    return <Flex>
                        <Flex.Item style={{flex: 2}}>名字</Flex.Item>
                        <Flex.Item style={{flex: 2}}>发行量</Flex.Item>
                        <Flex.Item style={{flex: 1}}>精度</Flex.Item>
                        <Flex.Item style={{flex: 1}}>可增发</Flex.Item>
                        <Flex.Item style={{flex: 2}}>合约余额</Flex.Item>
                    </Flex>
                }}>
                    {tokens}
                </List>

            </WingBlank>
        )
    }
}

export default TokenList;