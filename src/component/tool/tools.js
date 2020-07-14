import React, {Component} from "react";
import {
    Button, Tabs,
    WhiteSpace,
    WingBlank,
} from "antd-mobile";
import LoadForm from "./loadform";
import OpForm from "./opform";

const tabs = [
    { title: '添加', sub: '1' },
    { title: '发布', sub: '2' },
    { title: '操作', sub: '3' },
];


class Tools extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs
            tabs={tabs}
                initialPage={1}
                  onChange={(tab, index) => {
                      console.log('onChange', index, tab);
                  }}
                  onTabClick={(tab, index) => {
                      console.log('onTabClick', index, tab);
                  }}>
                <div>
                    <LoadForm/>
                </div>
                <div>
                    <OpForm/>
                </div>
            </Tabs>
        )
    }
}

export default Tools;