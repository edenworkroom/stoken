import React, {Component} from "react";
import {Button, WhiteSpace, WingBlank} from "antd-mobile";

class Help extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{minHeight: document.documentElement.clientHeight}}>
                <WhiteSpace/>
                <img src={require('../icon/help.png')} width={"100%"}/>
            </div>
        )
    }
}

export default Help;