import React, {Component} from "react";
import {
    Button,
    WhiteSpace,
    WingBlank,
    Modal,
    InputItem,
    List,
    Popover,
    Icon,
    Flex,
    TextareaItem,
    Toast,
    Checkbox,
    Tabs
} from "antd-mobile";

import sAbi from './sellabi';
import auction from "../icon/auction.png";
import transfer from "../icon/transfer.png";
import burning from "../icon/burning.png";
import sell from "../icon/sell.png";
import give from "../icon/give.png";
import BigNumber from 'bignumber.js'
import {showToken, showValueP} from "./common";
import Base from './base'
import {pAbi3, pAbi1} from './platformabi';

import proxyAbi from './proxyabi';

const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;

const operation = Modal.operation;

class My extends Base {

    constructor(props) {
        super(props, {canMint: true, unableMint: true, setIndex: 0});
    }

    _update(tokens, tickets) {
        let self = this;
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
            self.setState({tokens: tokens, tickets: tickets});
        }
    }

    _init(pk) {
        let self = this;
        proxyAbi.accountDetails(pk, function (account) {
            let tickets1 = [];
            let tickets3 = [];
            self.setState({mainPKr: account.mainPKr});

            let tickets = [];
            account.tickets.forEach(function (value, key) {
                tickets.push(key);
            });

            if (tickets.length == 0) {
                proxyAbi.tokens(account.mainPKr, tickets3, function (tokens3) {
                    let tokens = [];
                    if (tokens3.length > 0) {
                        tokens.push.apply(tokens, tokens3);
                    }
                    self._update(tokens, account.tickets);
                });
            } else {
                sAbi.hasTickets(account.mainPKr, tickets, function (flags) {
                    tickets = tickets.filter(function (currentValue, index) {
                        return !flags[index];
                    });

                    if (tickets.length == 0) {
                        if (self.state.tokens && self.state.tokens.length > 0) {
                            self.setState({tokens: []});
                        }
                        return;
                    }

                    tickets.forEach(function (each) {
                        if ("COIN1" === account.tickets.get(each)) {
                            tickets1.push(each);
                        } else if ("COIN3" === account.tickets.get(each)) {
                            tickets3.push(each);
                        }
                    });

                    proxyAbi.tokens(account.mainPKr, tickets3, function (tokens3) {
                        let tokens = [];
                        if (tokens3.length > 0) {
                            tokens.push.apply(tokens, tokens3);
                        }
                        if (tickets1.length > 0) {
                            pAbi1.tokens(account.mainPKr, tickets1, function (tokens1) {
                                if (tokens1.length > 0) {
                                    tokens1.forEach(function (each) {
                                        each.decimals = 0;
                                        each.catg = "COIN1";
                                        tokens.push(each);
                                    });
                                }
                                self._update(tokens, account.tickets);

                            });
                        } else {
                            self._update(tokens, account.tickets);
                        }
                    });
                });
            }
        });
    }

    createToken() {
        let self = this;
        alert('一键发币', <div>
            <InputItem ref={el => this.tokenValue = el} placeholder="token name">币名</InputItem>
            <InputItem type="number" ref={el => this.decimalsValue = el} placeholder="decimals">精度</InputItem>
            <InputItem type="number" ref={el => this.supplyValue = el} placeholder="initialSupply">数量</InputItem>
            <Flex>
                <Flex.Item>
                    <AgreeItem defaultChecked={!this.state.canMint} ref={el => this.agree = el} onChange={e => {
                        console.log(e.target.checked)
                        this.setState({canMint: !e.target.checked});
                    }}>
                        永不增发
                        <br/>
                        <a style={{fontSize: '8px', color: 'red'}}>
                            开启永不增发发币无增发功能,且不能在币名市场交易。
                        </a>
                    </AgreeItem>
                </Flex.Item>
            </Flex>
        </div>, [
            {text: '取消', style: 'default'},
            {
                text: '确定', onPress: () => {
                    let token = this.tokenValue.state.value.toUpperCase();
                    let decimals = parseInt(this.decimalsValue.state.value);
                    let initialSupply = parseInt(this.supplyValue.state.value);
                    proxyAbi.createToken(self.state.pk, self.state.mainPKr, token, decimals, initialSupply, this.state.canMint);
                }
            },
        ]);
    }

    onSelectPopover = (opt) => {
        this.setState({
            popoverVisible: false,
        });
        let catg = this.state.tickets.get(opt.props.ticket);
        let pAbi = proxyAbi;
        if (catg == "COIN1") {
            pAbi = pAbi1;
        }
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
                            pAbi.give(this.state.pk, this.state.mainPKr, to, catg, opt.props.ticket, opt.props.canMint);
                        }
                    },
                ]);
                break;
            case "transfer":
                alert('转账', <div>
                    <InputItem type="number" ref={el => this.sendValue = el} placeholder="value"/>
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
                            pAbi.transfer(this.state.pk, this.state.mainPKr, to, value.toNumber(), catg, opt.props.ticket, opt.props.canMint);
                        }
                    },
                ]);
                break;
            case "issues":
                alert('增发', <div>
                    <InputItem type="number" ref={el => this.issuesValue = el} placeholder="value"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let issues = new BigNumber(this.issuesValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            pAbi.mintToken(this.state.pk, this.state.mainPKr, issues.toNumber(), catg, opt.props.ticket);
                        }
                    }
                ]);
                break;
            case "burning":
                alert('销毁', <div>
                    <InputItem type="number" ref={el => this.supplyValue = el} placeholder="values"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let supply = new BigNumber(this.supplyValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            pAbi.burnToken(this.state.pk, this.state.mainPKr, supply.toNumber(), catg, opt.props.ticket, opt.props.canMint);
                        }
                    },
                ]);
                break;
            case "reset":
                let title = "精度";
                let msg = <InputItem type="number" ref={el => this.decimalValue = el} placeholder="decimal"/>
                if (opt.props.canMint) {
                    title = "";
                    msg = <Tabs tabs={[
                        {title: '精度', sub: '1'},
                        {title: '增发', sub: '2'},
                    ]} initialPage={this.state.setIndex} onChange={(tab, index) => {
                        this.setState({setIndex: index});
                    }}
                    >
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <InputItem type="number" ref={el => this.decimalValue = el} placeholder="decimal"/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <AgreeItem defaultChecked={this.state.unableMint} onChange={e => {
                                this.setState({unableMint: e.target.checked});
                            }}>
                                永不增发
                            </AgreeItem>
                        </div>
                    </Tabs>
                }
                alert(title, msg, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            if (this.state.setIndex == 0) {
                                if (this.decimalValue.state.value > 18) {
                                    Toast.info('decimal <= 18', 1);
                                    return;
                                }
                                pAbi.setDecimals(this.state.pk, this.state.mainPKr, this.decimalValue.state.value, catg, opt.props.ticket, opt.props.canMint);
                            } else if (opt.props.canMint) {
                                if (this.state.unableMint) {
                                    pAbi.setUnableMint(this.state.pk, this.state.mainPKr, opt.props.token, false, catg, opt.props.ticket);
                                }
                            }
                        }
                    },
                ]);
                break;
            case "into":
                alert('转入', <div>
                    <InputItem type="number" ref={el => this.intoValue = el} placeholder="value"/>
                </div>, [
                    {text: '取消', style: 'default'},
                    {
                        text: '确定', onPress: () => {
                            let value = new BigNumber(this.intoValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            pAbi3.into(this.state.pk, this.state.mainPKr, opt.props.token, value);
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
                                                               disabled={item.totalSupply != item.balance || !item.canMint}
                                                               icon={<img src={sell} className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>出售</Popover.Item>),
                                                (<Popover.Item key="6" value="give" ticket={item.ticket}
                                                               token={item.token}
                                                               canMint={item.canMint}
                                                               icon={<img src={give} className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>转让</Popover.Item>),
                                                (<Popover.Item key="7" value="transfer" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               canMint={item.canMint}
                                                               icon={<img src={transfer}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}
                                                               style={{whiteSpace: 'nowrap'}}>转账</Popover.Item>),
                                                (<Popover.Item key="8" value="issues" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               disabled={!item.canMint}
                                                               icon={<img src={require('../icon/issues.png')}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>增发</span>
                                                </Popover.Item>),
                                                (<Popover.Item key="3" value="into" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               icon={<img src={require('../icon/into.png')}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>转入</span>
                                                </Popover.Item>),
                                                (<Popover.Item key="1" value="burning" ticket={item.ticket}
                                                               token={item.token} decimals={item.decimals}
                                                               canMint={item.canMint}
                                                               icon={<img src={burning}
                                                                          className="am-icon am-icon-xs"
                                                                          alt=""/>}>
                                                    <span style={{marginRight: 5}}>销毁</span>
                                                </Popover.Item>),
                                                (<Popover.Item key="2" value="reset" ticket={item.ticket}
                                                               token={item.token}
                                                               disabled={item.catg === "COIN1"}
                                                               canMint={item.canMint}
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
                            <Flex.Item style={{flex: 3}}>
                                {
                                    item.token.length > 10 ?
                                        <div>
                                            <span style={{fontSize: '14px'}}>{showToken(item.token)} </span>
                                            <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                                                {item.token}
                                            </div>
                                        </div> : <span style={{fontSize: '14px'}}>{item.token} </span>

                                }

                                {/* <span style={{fontSize: '14px'}}>{showToken(item.token)} </span>
                                <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                                    {item.token}
                                </div>*/}
                                {/*<span style={{fontSize: '14px'}}>{item.token} </span>*/}
                            </Flex.Item>
                            <Flex.Item style={{flex: 2}}><span
                                style={{fontSize: '14px'}}>{showValueP(item.totalSupply, item.decimals, 9)} </span></Flex.Item>
                            <Flex.Item style={{flex: 1}}><span
                                style={{fontSize: '14px'}}>{item.decimals} </span></Flex.Item>
                            <Flex.Item style={{flex: 2}}><span
                                style={{fontSize: '14px'}}>{showValueP(item.balance, item.decimals, 9)} </span></Flex.Item>
                        </Flex>
                    </List.Item>
                )
            });
        }


        return (
            <div>
                {/*<WhiteSpace size="md"/>*/}
                {/*<NoticeBar marqueeProps={{loop: true, style: {padding: '0 7.5px'}}}>*/}

                {/*</NoticeBar>*/}
                {/*<WhiteSpace size="lg" />*/}
                <WingBlank size="md">
                    <WhiteSpace/>
                    <Button onClick={this.createToken.bind(this)}>一键发币</Button>
                </WingBlank>
                <WingBlank size="md">
                    <List renderHeader={() => {
                        return <Flex>
                            <Flex.Item style={{flex: 3}}>名字</Flex.Item>
                            <Flex.Item style={{flex: 2}}>发行量</Flex.Item>
                            <Flex.Item style={{flex: 1}}>精度</Flex.Item>
                            <Flex.Item style={{flex: 2}}>合约余额</Flex.Item>
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