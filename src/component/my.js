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

const alert = Modal.alert;

const operation = Modal.operation;

class My extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pk: localStorage.getItem("PK"),
            tickets: new Map(),
            tokens: [],
        }
    }


    init(tickets) {
        let self = this;
        if (!tickets) {
            tickets = [];
            this.state.tickets.forEach(function (value, key) {
                tickets.push(key);
            });
        }
        console.log("tickets", tickets);
        pAbi.tokens(this.state.mainPKr, tickets, function (tokens) {
            self.setState({tokens: tokens});
        });
    }

    componentDidMount() {
        let self = this;
        let pk = localStorage.getItem("PK");
        pAbi.init.then(() => {
            pAbi.accountDetails(pk, function (account) {
                self.setState({mainPKr: account.mainPKr, tickets: account.tickets});
                self.init();
                self.timer = setInterval(function () {
                    self.init();
                }, 20 * 1000);
                pAbi.initLanguage(function (_lang) {
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

    createToken() {
        let self = this;
        alert('一键发币', <div>
            <InputItem ref={el => this.tokenValue = el} placeholder="tokens">币名</InputItem>
            <InputItem type="number" ref={el => this.decimalsValue = el} placeholder="decimals">精度</InputItem>
            <InputItem type="number" ref={el => this.supplyValue = el} placeholder="initialSupply">数量</InputItem>
        </div>, [
            {text: 'Cancel', style: 'default'},
            {
                text: 'Submit', onPress: () => {
                    let token = this.tokenValue.state.value;
                    let decimals = parseInt(this.decimalsValue.state.value);
                    let initialSupply = parseInt(this.supplyValue.state.value);
                    pAbi.createToken(self.state.pk, self.state.mainPKr, token, decimals, initialSupply);
                }
            },
        ]);
    }

    changAccount() {
        let self = this;
        pAbi.accountList(function (accounts) {
            let actions = [];
            accounts.forEach(function (account, index) {
                actions.push(
                    {
                        text: <span>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                            localStorage.setItem("PK", account.pk);
                            self.setState({pk: account.pk, mainPKr: account.mainPKr, tickets: account.tickets});
                            let tickets = [];
                            account.tickets.forEach(function (value, key) {
                                tickets.push(key);
                            });
                            self.init(tickets);
                        }
                    }
                );
            });
            operation(actions);
        });
    }


    onSelectPopover = (opt) => {
        this.setState({
            popoverVisible: false,
        });
        let catg = this.state.tickets.get(opt.props.ticket);

        switch (opt.props.value) {
            case "auction":
                break;
            case "sell":
                alert('出售', <div>
                    <InputItem type="number" ref={el => this.sellValue = el} placeholder="value">Price</InputItem>
                    <InputItem ref={el => this.tokenBuyValue = el} defaultValue="SERO" disabled={true}
                               placeholder="initialSupply">Token</InputItem>
                </div>, [
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
                            let value = new BigNumber(this.sellValue.state.value).multipliedBy(new BigNumber(10).pow(18));
                            let tokenBuy = this.tokenBuyValue.state.value;
                            // console.log("sell", value.toNumber(), tokenBuy);
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
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
                            let to = this.toValue.state.value;
                            pAbi.transfer(this.state.pk, this.state.mainPKr, to, 0, catg, opt.props.ticket);
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
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
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
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
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
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
                            let supply = new BigNumber(this.supplyValue.state.value).multipliedBy(new BigNumber(10).pow(opt.props.decimals));
                            pAbi.burnToken(this.state.pk, this.state.mainPKr, supply.toNumber(), catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            case "reset":
                alert('设置精度', <div>
                    <InputItem type="number" ref={el => this.decimalValue = el} placeholder="decimal"/>
                </div>, [
                    {text: 'Cancel', style: 'default'},
                    {
                        text: 'Submit', onPress: () => {
                            pAbi.setDecimals(this.state.pk, this.state.mainPKr, this.decimalValue.state.value, catg, opt.props.ticket);
                        }
                    },
                ]);
                break;
            default:
        }
    };


    render() {
        const tokenList = this.state.tokens.map((item, index) => {
            return (
                <List.Item key={index}
                           extra={
                               <Popover mask
                                        overlayClassName="fortest"
                                        overlayStyle={{color: 'currentColor'}}
                                        visible={this.state.popoverVisible}
                                        overlay={[
                                            (<Popover.Item key="4" value="auction" ticket={item.ticket} disabled={true}
                                                           token={item.token}
                                                           icon={<img src={auction} className="am-icon am-icon-xs"
                                                                      alt=""/>}
                                                           data-seed="logId">拍卖</Popover.Item>),
                                            (<Popover.Item key="5" value="sell" ticket={item.ticket} token={item.token}
                                                           icon={<img src={sell} className="am-icon am-icon-xs"
                                                                      alt=""/>}
                                                           style={{whiteSpace: 'nowrap'}}>出售</Popover.Item>),
                                            (<Popover.Item key="6" value="give" ticket={item.ticket} token={item.token}
                                                           icon={<img src={give} className="am-icon am-icon-xs"
                                                                      alt=""/>}
                                                           style={{whiteSpace: 'nowrap'}}>转让</Popover.Item>),
                                            (<Popover.Item key="7" value="transfer" ticket={item.ticket}
                                                           token={item.token} decimals={item.decimals}
                                                           icon={<img src={transfer} className="am-icon am-icon-xs"
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
                                                           icon={<img src={burning} className="am-icon am-icon-xs"
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
                        <Flex.Item style={{flex: 1}}><span style={{fontSize: '14px'}}>{item.token} </span></Flex.Item>
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

        return (
            <div>
                <WingBlank size="md">
                    <WhiteSpace/>
                    <Flex>
                        <Flex.Item style={{flex: 85}}>
                            <span>{language.e().home.account} : {showPK(this.state.pk, 12)}</span>
                        </Flex.Item>
                        <Flex.Item style={{flex: 15}}>
                            <div><a onClick={this.changAccount.bind(this)}>{language.e().home.change}</a></div>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
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