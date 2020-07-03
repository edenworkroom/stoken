import React, {Component} from "react";
import Abi from "./abi";

const abi = new Abi();

export default class Base extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pk: this.props.pk,
            show: this.props.show
        }
    }

    init(pk, show) {
        if (!show && !this.state.show) {
            return;
        }
        if (!pk) {
            pk = this.state.pk;
        }
        if (this._init) {
            this._init(pk);
        }
    }

    componentDidMount() {
        let self = this;
        abi.init.then(() => {
            if (self._componentDidMount) {
                self._componentDidMount(this.state.pk);
            }
            self.init();
            self.timer = setInterval(function () {
                self.init();
            }, 20 * 1000);
        })
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pk !== this.props.pk) {
            this.setState({
                pk: nextProps.pk
            });
            this.init(nextProps.pk, this.state.show);
        }
        if (nextProps.show !== this.props.show) {
            this.setState({
                show: nextProps.show
            });
            this.init(this.state.pk, nextProps.show);
        }
    }
}

