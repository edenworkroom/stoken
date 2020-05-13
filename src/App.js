import React, {Component} from 'react';
import './App.css';
import {TabBar, Modal, Carousel} from "antd-mobile";
import home_0 from "./icon/home_0.png";
import home_1 from "./icon/home_1.png";
import Home from "./component/home";
import my_0 from "./icon/my_0.png";
import my_1 from "./icon/my_1.png";
import My from "./component/my";
import help_0 from "./icon/help_0.png";
import help_1 from "./icon/help_1.png";
import Help from "./component/help";
import pAbi from './component/platformabi';
import {LoadContract} from "./component/tool/loadcontract";
import {OpContract} from "./component/tool/opcontract";

const operation = Modal.operation;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'my'
        };
    }

    // changAccount() {
    //     let self = this;
    //     pAbi.init
    //         .then(() => {
    //             pAbi.accountList(function (accounts) {
    //                 let actions = [];
    //                 accounts.forEach(function (account, index) {
    //                     actions.push(
    //                         {
    //                             text: <span>{account.name + ":" + self.showPK(account.pk)}</span>, onPress: () => {
    //                                 self.setState({pk: account.pk});
    //                                 localStorage.setItem("PK", account.pk);
    //                             }
    //                         }
    //                     );
    //                 });
    //                 operation(actions);
    //             });
    //         })
    // }


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
                        <Home/>
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
                        <My/>
                    </TabBar.Item>

                    {/*<TabBar.Item title="工具" key="tool"*/}
                    {/*             selected={this.state.selectedTab === 'tool'}*/}
                    {/*             icon={<img src={my_0} style={{width: '22px', height: '22px'}}/>}*/}
                    {/*             selectedIcon={<img src={my_1}*/}
                    {/*                                style={{width: '22px', height: '22px'}}/>}*/}
                    {/*             onPress={() => {*/}
                    {/*                 this.setState({selectedTab: "tool"})*/}
                    {/*             }}*/}
                    {/*>*/}
                    {/*    <Carousel*/}
                    {/*        autoplay={false}*/}
                    {/*        infinite*/}
                    {/*        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}*/}
                    {/*        afterChange={index => console.log('slide to', index)}*/}
                    {/*    >*/}
                    {/*        {([<LoadContract/>, <OpContract/>])}*/}
                    {/*    </Carousel>*/}
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
                        <Help/>
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }

}

export default App;
