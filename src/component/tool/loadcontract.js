import React, {Component} from 'react';
import LoadForm from "./loadform";
import {Flex} from "antd-mobile";

export class LoadContract extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{height: document.documentElement.clientHeight}}>
                <div style={{padding: '50px 30px 10px 30px'}}>
                    <p role="listitem" className="item">1.承接智能合约，手机钱包dapp开发。有意者联系作者，微信号见底部。</p>
                    <p role="listitem" className="item">2.基于SERO链的去中心化交易平台上线了，点击链接: <a
                        href={"http://edenworkroom.gitee.io/market"}>http://edenworkroom.gitee.io/market</a></p>
                </div>
                <LoadForm/>
                <div style={{padding: '0 15px'}}>
                    <p>开发者：eden
                        <br/>如对您有用，可以打赏，多谢您的支持。
                        <br/> 如有问题请联系开发者。
                    </p>
                    <Flex>
                        <Flex.Item>
                            <img src="wc.jpeg" width="150" height="150"></img>
                            <p style={{textAlign: "center"}}>微信号</p>
                        </Flex.Item>
                        <Flex.Item>
                            <img src="address.jpeg" width="150" height="150"></img>
                            <p style={{textAlign: "center"}}>收款码</p>
                        </Flex.Item>
                    </Flex>
                </div>
            </div>
        )
    }
}