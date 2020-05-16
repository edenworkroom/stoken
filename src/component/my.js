import React, {Component} from "react";
import {Button, WhiteSpace, WingBlank, Modal, InputItem, List, Popover, Icon, Flex, TextareaItem} from "antd-mobile";

import pAbi from './platformabi';
import sAbi from './sellabi';
import language from './language'
import auction from "../icon/auction.png";
import transfer from "../icon/transfer.png";
import burning from "../icon/burning.png";
import sell from "../icon/sell.png";
import give from "../icon/give.png";
import BigNumber from 'bignumber.js'
import {showPK, showValueP} from "./common";
import Base from './base'

const alert = Modal.alert;

const operation = Modal.operation;

class My extends Base {

    constructor(props) {
        super(props);
    }

    _init(pk) {
        let self = this;
        pAbi.accountDetails(pk, function (account) {
            let tickets = [];
            account.tickets.forEach(function (value, key) {
                tickets.push(key);
            });

            sAbi.hasTickets(account.mainPKr, tickets, function (flags) {
                console.log("hasTickets", flags);
                tickets = tickets.filter(function (currentValue, index) {
                    return !flags[index];
                });

                if (tickets.length > 0) {
                    pAbi.tokens(account.mainPKr, tickets, function (tokens) {
                        console.log("tokens", tokens)
                        let update = false;
                        if (!self.state.tokens) {
                            update = true;
                        } else {
                            if (tokens.length == self.state.tokens.length) {
                                for (var i = 0; i < tokens.length; i++) {
                                    let a = tokens[i];
                                    let b = self.state.tokens[i];
                                    if (a.token != b.token || a.totalSupply != b.totalSupply || a.balance != b.balance || a.decimals != b.decimals) {
                                        update = true;
                                        break;
                                    }
                                }
                            } else {
                                update = true;
                            }
                        }

                        if (update) {
                            self.setState({tokens: tokens, tickets: account.tickets});
                        }
                    });
                } else if (self.state.tokens) {
                    self.setState({tokens: []});
                }
            });
        });
    }

    createToken() {
        let self = this;
        alert('一键发币', <div>
            <InputItem ref={el => this.tokenValue = el} placeholder="token name">币名</InputItem>
            <InputItem type="number" ref={el => this.decimalsValue = el} placeholder="decimals">精度</InputItem>
            <InputItem type="number" ref={el => this.supplyValue = el} placeholder="initialSupply">数量</InputItem>
        </div>, [
            {text: '取消', style: 'default'},
            {
                text: '确定', onPress: () => {
                    let token = this.tokenValue.state.value;
                    let decimals = parseInt(this.decimalsValue.state.value);
                    let initialSupply = parseInt(this.supplyValue.state.value);
                    pAbi.createToken(self.state.pk, self.state.mainPKr, token, decimals, initialSupply);
                }
            },
        ]);
    }

    onSelectPopover = (opt) => {
        this.setState({
            popoverVisible: false,
        });
        let catg = this.state.tickets.get(opt.props.ticket);
        console.log("opt", opt);
        switch (opt.props.value) {

            case "auction":
                break;
            case "sell":
                alert('出售', <div>
                    <InputItem type="number" ref={el => this.sellValue = el} placeholder="value">Price</InputItem>
                    <InputItem ref={el => this.tokenBuyValue = el} defaultValue="SERO" disabled={true}
                               placeholder="initialSupply">Token</InputItem>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let value = new BigNumber(this.sellValue.state.value).multipliedBy(new BigNumber(10).pow(18));
                            let tokenBuy = this.tokenBuyValue.state.value;
                            console.log("sell", value.toNumber(), tokenBuy);
                            sAbi.sellToken(this.state.pk, this.state.mainPKr, tokenBuy, value.toNumber(), catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "give":
                alert('转让', <div>
                    <TextareaItem
                        ref={el => this.toValue = el}
                        placeholder="MainPKr"
                        autoHeight
                        labelNumber={5}
                    />
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let to = this.toValue.state.value;
                            pAbi.give(this.state.pk, this.state.mainPKr, to, catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "transfer":
                alert('转账', <div>
                    <InputItem type="number" ref={el => this.sendValue = el} placeholder="amount"/>
                    <TextareaItem
                        ref={el => this.toValue = el}
                        placeholder="to address"
                        autoHeight
                        labelNumber={5}
                    />
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let value = new BigNumber(this.sendValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            let to = this.toValue.state.value;
                            pAbi.transfer(this.state.pk, this.state.mainPKr, to, value.toNumber(), catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "issues":
                alert('增发', <div>
                    <InputItem type="number" ref={el => this.issuesValue = el} placeholder="amount"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let issues = new BigNumber(this.issuesValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            pAbi.mintToken(this.state.pk, this.state.mainPKr, issues.toNumber(), catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "burning":
                alert('销毁', <div>
                    <InputItem type="number" ref={el => this.supplyValue = el} placeholder="amount"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let supply = new BigNumber(this.supplyValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            console.log("burning", supply, opt.props.token, catg, opt.props.ticket)
                            pAbi.burnToken(this.state.pk, this.state.mainPKr, supply.toNumber(), catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "reset":
                alert('设置精度', <div>
                    <InputItem type="number" ref={el => this.decimalValue = el} placeholder="decimal"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            pAbi.setDecimals(this.state.pk, this.state.mainPKr, this.decimalValue.state.value, catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            default:
        }
    };


    render() {
        let tokenList;
        if (this.state.tokens) {
            tokenList = this.state.tokens.map((item, index) => {
                return (
                    <List.Item key={index}
                               extra={
                                   <Popover mask
                                            overlayClassName="fortest"
                                            overlayStyle={{color: 'currentColor'}}
                                            visible={this.state.popoverVisible}
                                            overlay={[
                                                (<Popover.Item key="4" value="auction" ticket={item.ticket}
                                                               disabled={true}
                                                               token={item.token}
                                                               icon={<img src={auction}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               data-seed="logId">拍卖</Popover.Item>),
                                                (<Popover.Item key="5" value="sell" ticket={item.ticket}
                                                               token={item.token}
                                                               icon={<img src={sell} className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>出售</Popover.Item>),
                                                (<Popover.Item key="6" value="give" ticket={item.ticket}
                                                               token={item.token}
                                                               icon={<img src={give} className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>转让</Popover.Item>),
                                                (<Popover.Item key="7" value="transfer" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               icon={<img src={transfer}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>转账</Popover.Item>),
                                                (<Popover.Item key="8" value="issues" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               icon={<img src={require('../icon/issues.png')}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>增发</span>
                                                </Popover.Item>),
                                                (<Popover.Item key="1" value="burning" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               icon={<img src={burning}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>销毁</span>
                                                </Popover.Item>),
                                                (<Popover.Item key="2" value="reset" ticket={item.ticket}
                                                               icon={<img src={require('../icon/reset.png')}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>设置</span>
                                                </Popover.Item>)
                                            ]}
                                            align={{
                                                overflow: {adjustY: 0, adjustX: 0},
                                                offset: [-10, 0],
                                            }}
                                            onSelect={this.onSelectPopover.bind(this)}
                                   >
                                       <div style={{
                                           height: '100%',
                                           padding: '0 15px',
                                           marginRight: '-15px',
                                           display: 'flex',
                                           alignItems: 'center',
                                       }}
                                       >
                                           <Icon type="ellipsis"/>
                                       </div>
                                   </Popover>
                               }>

                        <Flex>
                            <Flex.Item style={{flex: 1}}><span
                                style={{fontSize: '14px'}}>{item.token} </span></Flex.Item>
                            <Flex.Item style={{flex: 1}}><span
                                style={{fontSize: '14px'}}>{showValueP(item.totalSupply, item.decimals, 9)} </span></Flex.Item>
                            <Flex.Item style={{flex: 1}}><span
                                style={{fontSize: '14px'}}>{item.decimals} </span></Flex.Item>
                            <Flex.Item style={{flex: 1}}><span
                                style={{fontSize: '14px'}}>{showValueP(item.balance, item.decimals, 9)} </span></Flex.Item>
                        </Flex>
                    </List.Item>
                )
            });
        }


        return (
            <div>
                <WingBlank size="md">
                    <WhiteSpace/>
                    <Button onClick={this.createToken.bind(this)}>一键发币</Button>
                </WingBlank>
                <WingBlank size="md">
                    <List renderHeader={() => {
                        return <Flex>
                            <Flex.Item style={{flex: 3}}>名字</Flex.Item>
                            <Flex.Item style={{flex: 3}}>发行量</Flex.Item>
                            <Flex.Item style={{flex: 3}}>精度</Flex.Item>
                            <Flex.Item style={{flex: 3}}>合约余额</Flex.Item>
                            <Flex.Item style={{flex: 0.9}}></Flex.Item>
                        </Flex>
                    }}>
                        {tokenList}
                    </List>

                </WingBlank>
            </div>
        )
    }
}

export default My;