import React, {Component} from 'react';
import './App.css';
import {TabBar, Modal, Carousel, Flex, WingBlank, WhiteSpace, Button} from "antd-mobile";
import home_0 from "./icon/home_0.png";
import home_1 from "./icon/home_1.png";
import Home from "./component/home";
import my_0 from "./icon/my_0.png";
import my_1 from "./icon/my_1.png";
import My from "./component/my";
import help_0 from "./icon/help_0.png";
import help_1 from "./icon/help_1.png";
import Help from "./component/help";
import language from "./component/language";
import {showPK} from "./component/common";
import Abi from "./component/abi";
import TokenList from "./component/list";
import Tools from "./component/tool/tools";

const abi = new Abi();

const operation = Modal.operation;

class App extends Component {

    constructor(props) {
        super(props);

        let self = this;
        let pk = localStorage.getItem("PK");
        this.state = {
            selectedTab: 'my',
            pk: pk,
        };

        if (!pk) {
            abi.init
                .then(() => {
                    abi.accountList(function (accounts) {
                        self.setState({pk: accounts[0].pk, name: accounts[0].name});
                        localStorage.setItem("PK", accounts[0].pk);
                        return;
                    });
                })
        }
    }

    changAccount() {
        let self = this;
        abi.init
            .then(() => {
                abi.accountList(function (accounts) {
                    let actions = [];
                    accounts.forEach(function (account, index) {
                        actions.push(
                            {
                                text: <span>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                                    self.setState({pk: account.pk, name: account.name});
                                    localStorage.setItem("PK", account.pk);
                                }
                            }
                        );
                    });
                    operation(actions);
                });
            })
    }


    renderContent(name, pk, show) {
        let content;
        let showAccount = false;
        if (name === "market") {
            content = <Home pk={pk} show={show}/>
            showAccount = true;
        } else if (name === "my") {
            content = <My pk={pk} show={show}/>
            showAccount = true;
        } else if (name === "help") {
            content = <Help pk={pk} show={show}/>
        } else if (name === "list") {
            content = <TokenList pk={pk} show={show}/>
        } else if (name === "tools") {
            content = <Tools pk={pk}/>
            showAccount = true;
        }
        return <div>
            {
                showAccount && <WingBlank size="md">
                    <WhiteSpace/>
                    <Flex>
                        <Flex.Item style={{flex: 85}}>
                            <span>{language.e().home.account} : {this.state.name} {showPK(pk, 12)}</span>
                        </Flex.Item>
                        <Flex.Item style={{flex: 15}}>
                            <div><a onClick={this.changAccount.bind(this)}>{language.e().home.change}</a></div>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>

                </WingBlank>
            }

            {content}
        </div>
    }

    render() {
        return (
            <div style={{
                position: 'fixed',
                height: '100%',
                width: '100%',
                top: 0
            }}>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="white"
                    hidden={this.state.hidden}
                >
                    <TabBar.Item title="市场" key="market"
                                 selected={this.state.selectedTab === 'market'}
                                 icon={<img src={home_0} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={home_1}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: "market"})
                                 }}
                    >
                        {this.renderContent("market", this.state.pk, this.state.selectedTab === 'market')}
                    </TabBar.Item>

                    <TabBar.Item title="我的" key="my"
                                 selected={this.state.selectedTab === 'my'}
                                 icon={<img src={my_0} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={my_1}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: "my"})
                                 }}
                    >
                        {this.renderContent("my", this.state.pk, this.state.selectedTab === 'my')}
                    </TabBar.Item>

                    <TabBar.Item title="列表" key="list"
                                 selected={this.state.selectedTab === 'list'}
                                 icon={<img src={require('./icon/list_0.png')}
                                            style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={require('./icon/list_1.png')}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: "list"})
                                 }}
                    >
                        {this.renderContent("list", this.state.pk, this.state.selectedTab === 'list')}
                    </TabBar.Item>

                    {/*<TabBar.Item title="工具" key="tools"*/}
                    {/*             selected={this.state.selectedTab === 'tools'}*/}
                    {/*             icon={<img src={my_0} style={{width: '22px', height: '22px'}}/>}*/}
                    {/*             selectedIcon={<img src={my_1}*/}
                    {/*                                style={{width: '22px', height: '22px'}}/>}*/}
                    {/*             onPress={() => {*/}
                    {/*                 this.setState({selectedTab: "tools"})*/}
                    {/*             }}*/}
                    {/*>*/}
                    {/*    {this.renderContent("tools", this.state.pk, this.state.selectedTab === 'tools')}*/}
                    {/*</TabBar.Item>*/}

                    <TabBar.Item title="帮助" key="help"
                                 selected={this.state.selectedTab === 'help'}
                                 icon={<img src={help_0} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={help_1}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: "help"})
                                 }}
                    >
                        {this.renderContent("help", this.state.pk, this.state.selectedTab === 'help')}
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }

}

export default App;
