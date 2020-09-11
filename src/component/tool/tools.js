import React, {Component} from "react";
import {
    Button,
    List, WhiteSpace,
    WingBlank,
} from "antd-mobile";
import Base from "../base";
import DeployForm from "./deploy";


class Tools extends Base {

    constructor(props) {
        super(props,
            {contract: null, page: 0, showList: true, choiced: null});
    }

    _componentDidMount(pk) {

    }

    showList() {
        return (
            <List renderHeader={() => '工具'} className="my-list">
                <List.Item arrow="horizontal" multipleLine onClick={() => {
                    this.setState({showList: false, choiced: <DeployForm pk={this.state.pk}/>})
                }}>
                    部署合约
                </List.Item>
            </List>
        )
    }


    render() {
        let content;
        if (this.state.showList) {
            content = this.showList();
        } else {
            content = this.state.choiced;
        }

        return (
            <WingBlank size="md">
                {
                    this.state.showList == false && <Button onClick={() => {
                        this.setState({showList: true, choiced: null})
                    }}>BACK</Button>
                }
                {content}
            </WingBlank>
        )
    }
}

export default Tools;