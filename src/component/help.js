import React, {Component} from "react";
import {Button, WhiteSpace, WingBlank} from "antd-mobile";

class Help extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <WingBlank size="md">
                <WhiteSpace/>
                <Button activeStyle={false}>待更新</Button><WhiteSpace/>
            </WingBlank>
        )
    }
}

export default Help;