import React, {Component} from "react";
import {
    Button, Tabs,
    WhiteSpace,
    WingBlank,
} from "antd-mobile";
import LoadForm from "./loadform";
import OpForm from "./opform";

// const tabs = [
//     {title: '添加', sub: '0'},
//     {title: '操作', sub: '1'},
// ];


class Tools extends Component {

    constructor(props) {
        super(props);
        this.state = {contract: null, page: 0}
    }

    changeTab(contract) {
        this.setState({contract: contract, page: 1})
    }

    render() {
        return (
            <WingBlank size="md">
                未来将提供Token相关工具，有建义可以联系客服 A7oyppt22
            </WingBlank>
        )
    }
}

export default Tools;