import React, {Component} from "react";
import {WingBlank, Modal, List, Flex} from "antd-mobile";
import Base from './base'
import {pAbi3} from './platformabi';
import {showValue, showValueP} from "./common";

const alert = Modal.alert;

const operation = Modal.operation;

class TokenList extends Base {

    constructor(props) {
        super(props);
        this.state = {"tokens": []}
    }

    _init(pk) {
        let self = this;
        pAbi3.coinsList("23EAQCUBU9GEWajVb8YaCVxpk5sKh6qCeLoHPPjnnjDLPt4dydhCH5ezUxV3F8gJUxm8vmiCFGZLprsL8XikAQXk9euFoVpB6fnRdqEBf1oTFJiZ5ke8kdnxDjxYCCLxLuJG", function (tokens) {
            console.log("tokens", tokens);
            self.setState({"tokens": tokens});
        });
    }


    render() {
        let tokens = this.state.tokens.map((item, index) => {
            return (
                <List.Item key={index}>
                    <Flex>
                        <Flex.Item style={{flex: 3}}>{item.token}</Flex.Item>
                        <Flex.Item style={{flex: 2}}>{showValueP(item.totalSupply, item.decimals, 6)}</Flex.Item>
                        <Flex.Item style={{flex: 1}}>{item.decimals}</Flex.Item>
                        <Flex.Item style={{flex: 2}}>{showValueP(item.balance, item.decimals, 6)}</Flex.Item></Flex>
                </List.Item>
            )

        });
        return (
            <WingBlank size="md">
                <List renderHeader={() => {
                    return <Flex>
                        <Flex.Item style={{flex: 3}}>名字</Flex.Item>
                        <Flex.Item style={{flex: 2}}>发行量</Flex.Item>
                        <Flex.Item style={{flex: 1}}>精度</Flex.Item>
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