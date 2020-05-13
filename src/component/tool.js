import React, {Component} from 'react';
import './App.css';
import {HashRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {LoadContract} from "./tool/loadcontract";
import {OpContract} from "./tool/opcontract";
import {NavBar, Icon, Flex, TabBar, List, Button, WingBlank, Card, WhiteSpace, Tabs} from 'antd-mobile';
import app from './component/apps.js';

const tabs = [
    {title: 'finance'},
    {title: 'games'},
    {title: 'tools'},
];

export class Tool extends Component {

    constructor(props) {
        super(props);
        this.state = {link: "/load"}
    }

    handleLink() {
        if (this.state.link === "/load") {
            this.setState({link: "/op"})
        } else {
            this.setState({link: "/load"})
        }
    }

    //
    // renderContent(tab) {
    //     const list = app.list(tab.title).map(function (item, index) {
    //         return (
    //             <div>
    //                 <Card key={index}>
    //                     <Card.Header
    //                         title={item.name}
    //                         thumbStyle={{height: '50px', width: '50px'}}
    //                         thumb={item.url + "/logo.png"}
    //                         extra={
    //                             <span><Button type="primary" size="small" style={{width: '63px', float: 'right'}}>
    //                             <a href={item.url}>进入</a></Button></span>}
    //                     />
    //                     <Card.Body>
    //                         <div>
    //                             {item.describe}
    //                         </div>
    //                     </Card.Body>
    //                 </Card>
    //                 <WhiteSpace size="lg"/>
    //             </div>
    //         )
    //     });
    //     return (
    //         <WingBlank size="lg">
    //             <WhiteSpace size="lg"/>
    //             {list}
    //         </WingBlank>
    //     );
    // }


    render() {

        return (
            // <div>
            //
            //     <Tabs tabs={tabs}>
            //         {this.renderContent}
            //     </Tabs>
            // </div>
            <Router>
                <div style={{float: 'right', paddingRight: '15px'}}>
                    <Link onClick={this.handleLink.bind(this)} key="op" to={this.state.link}>
                        <Icon type="right"/>
                    </Link>
                </div>
                <Switch>
                    <Route exact path="/" component={LoadContract}/>
                    <Route exact path="/op" component={OpContract}/>
                    <Route exact path="/load" component={LoadContract}/>
                </Switch>
            </Router>
        )
    }
}

export default Tool;
