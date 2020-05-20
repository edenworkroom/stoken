import React, {Component} from 'react';
import sAbi from './sellabi';
import {Button, Card, Flex, WhiteSpace, WingBlank} from "antd-mobile";
import {showValue, showValueP} from "./common";
import Base from './base'

class Home extends Base {
    constructor(props) {
        super(props);
    }

    _init(pk) {
        let self = this;
        sAbi.accountDetails(pk, function (account) {
            self.setState({mainPKr: account.mainPKr})
            sAbi.sellTokens(account.mainPKr, 0, 100, function (tokens) {
                tokens.forEach(function (each) {
                    if (each.coinType === "COIN1") {
                        each.decimals = 0;
                    }
                });
                self.setState({tokens: tokens});
            });
        });
    }

    render() {
        let tokenList;
        if (this.state.tokens) {
            tokenList = this.state.tokens.map((item, index) => {
                return (
                    <div key={index}>
                        <Card>
                            <Card.Header
                                title={item.token}
                                extra={
                                    item.isMy == 1 ?
                                        <div style={{paddingRight: '5px'}}>
                                            <Button type="ghost" size="small" inline onClick={() => {
                                                sAbi.buyToken(this.state.pk, this.state.mainPKr, item.ticket, item.tokenBuy, item.price);
                                            }}>买入</Button>
                                        </div> :
                                        <div style={{paddingRight: '5px'}}>
                                            <Button type="ghost" size="small" inline onClick={() => {
                                                sAbi.cancelSellToken(this.state.pk, this.state.mainPKr, item.ticket);
                                            }}>取消</Button>
                                        </div>
                                }
                            />
                            <Card.Body>
                                <div>
                                    <Flex>
                                        <Flex.Item style={{flex: 2}}>发行量</Flex.Item>
                                        <Flex.Item style={{flex: 1}}>精度</Flex.Item>
                                        <Flex.Item style={{flex: 2}}>合约余额</Flex.Item>
                                    </Flex>

                                    <Flex>
                                        <Flex.Item style={{flex: 2}}><span
                                            style={{fontSize: '14px'}}>{showValueP(item.totalSupply, item.decimals, 5)} </span></Flex.Item>
                                        <Flex.Item style={{flex: 1}}><span
                                            style={{fontSize: '14px'}}>{item.decimals} </span></Flex.Item>
                                        <Flex.Item style={{flex: 2}}><span
                                            style={{fontSize: '14px'}}>{showValueP(item.balance, item.decimals, 5)} </span></Flex.Item>
                                    </Flex>
                                </div>
                            </Card.Body>
                            <Card.Footer extra={
                                <div style={{color: '#000'}}>
                                    <label>价格:&nbsp;</label>
                                    <span>{showValue(item.price, 18, 18)}{item.tokenBuy}</span>
                                </div>
                            }/>
                        </Card>
                        <WhiteSpace/>
                    </div>

                )
            });
        }

        return (
            <WingBlank size="md">
                <WhiteSpace/>
                <Button activeStyle={false}>币名市场</Button><WhiteSpace/>
                <div>
                    {tokenList}
                </div>
            </WingBlank>
        )
    }
}

export default Home;