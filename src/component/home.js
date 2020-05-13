import React, {Component} from 'react';
import sAbi from './sellabi';
import language from "./language";
import {Button, Card, Flex, WhiteSpace, WingBlank} from "antd-mobile";
import BigNumber from "bignumber.js";
import {showValue} from "./common";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pk: localStorage.getItem("PK"),
            tokens: [],
        }
    }

    init() {
        let self = this;
        sAbi.sellTokens(this.state.mainPKr, 0, 100, function (tokens) {
            self.setState({tokens: tokens});
        });
    }


    componentDidMount() {
        let self = this;
        let pk = localStorage.getItem("PK");
        sAbi.init.then(() => {
            sAbi.accountDetails(pk, function (account) {
                self.setState({mainPKr: account.mainPKr});
                self.init();
                self.timer = setInterval(function () {
                    self.init();
                }, 20 * 1000)
                sAbi.initLanguage(function (_lang) {
                    language.set(_lang);
                });
            });
        })
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }


    render() {
        const tokenList = this.state.tokens.map((item, index) => {
            return (
                <Card key={index}>
                    <Card.Header
                        title={item.token}
                        extra={
                            item.isMy == 1 ?
                                <div style={{paddingRight: '5px'}}>
                                    <Button type="ghost" size="small" inline onClick={() => {
                                        sAbi.buyToken(this.state.pk, this.state.mainPKr, item.ticket, item.tokenBuy, item.price);
                                    }}>buy</Button>
                                </div> :
                                <div style={{paddingRight: '5px'}}>
                                    <Button type="ghost" size="small" inline onClick={() => {
                                        sAbi.cancelSellToken(this.state.pk, this.state.mainPKr, item.ticket);
                                    }}>cancel</Button>
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
                                <Flex.Item style={{flex: 2}}><span style={{fontSize: '14px'}}>{item.totalSupply} </span></Flex.Item>
                                <Flex.Item style={{flex: 1}}><span
                                    style={{fontSize: '14px'}}>{item.decimals} </span></Flex.Item>
                                <Flex.Item style={{flex: 2}}><span
                                    style={{fontSize: '14px'}}>{item.balance} </span></Flex.Item>
                            </Flex>
                        </div>
                    </Card.Body>
                    <Card.Footer extra={
                        <div style={{color: '#000'}}>
                            <label>价格:&nbsp;s</label>
                            <span>{showValue(item.price, 18, 18)}{item.tokenBuy}</span>
                        </div>
                    }/>
                </Card>
            )
        });
        return (
            <WingBlank size="md">
                <WhiteSpace/>
                <Button activeStyle={false}>币名市场</Button><WhiteSpace />
                <div>
                    {tokenList}
                </div>
            </WingBlank>
        )
    }
}

export default Home;