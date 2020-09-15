import React from 'react';
import {Flex, SearchBar, WhiteSpace, WingBlank} from 'antd-mobile';
import {ListView, Button, Toast, List} from 'antd-mobile';
import proxyAbi from "./proxyabi";
import {showValueP} from "./common";
import {StickyContainer, Sticky} from 'react-sticky';

const from = "23EAQCUBU9GEWajVb8YaCVxpk5sKh6qCeLoHPPjnnjDLPt4dydhCH5ezUxV3F8gJUxm8vmiCFGZLprsL8XikAQXk9euFoVpB6fnRdqEBf1oTFJiZ5ke8kdnxDjxYCCLxLuJG";

class TokenList extends React.Component {
    constructor(props) {
        super(props);
        const getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID][rowID];
        };

        const dataSource = new ListView.DataSource({
            getRowData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource,
            isLoading: true,
            start: 0,
            size: 5,
            tokens: [],
        };
    }

    componentDidMount() {
        let self = this;
        proxyAbi.coinsList(from, this.state.start, this.state.size, function (tokens) {
            let list = self.state.tokens.concat(tokens);
            self.setState({
                tokens: list,
                dataSource: self.state.dataSource.cloneWithRows(list),
                start: self.state.start + tokens.length,
                isLoading: false,
            });

        });
    }

    onEndReached = (event) => {
        let self = this;
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }

        this.setState({isLoading: true});
        proxyAbi.coinsList(from, this.state.start, this.state.size, function (tokens) {
            if (tokens.length > 0) {
                let list = self.state.tokens.concat(tokens);
                self.setState({
                    tokens: list,
                    dataSource: self.state.dataSource.cloneWithRows(list),
                    start: self.state.start + tokens.length,
                    isLoading: false,
                });
            } else {
                self.setState({
                    isLoading: false,
                });
            }
        });
    }

    search(token) {
        let self = this;
        proxyAbi.detail(from,
            token, function (token) {
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows([token]),
                    isLoading: false,
                });
            });
    }

    cancel() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.tokens),
            isLoading: false,
        });
    }

    render() {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );
        const row = (item, sectionID, rowID) => {
            return (
                <div key={rowID} style={{padding: '0 15px'}}>
                    <div
                        style={{
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}
                    >{item.token}</div>
                    <div style={{padding: '15px 0',}}>
                        <Flex style={{textAlign: "center"}}>
                            <Flex.Item style={{flex: 1}}>发行量</Flex.Item>
                            <Flex.Item style={{flex: 1}}>精度</Flex.Item>
                            <Flex.Item style={{flex: 1}}>永不增发</Flex.Item>
                            <Flex.Item style={{flex: 2}}>合约余额</Flex.Item>
                        </Flex>
                        <WhiteSpace/>
                        <Flex style={{textAlign: "center"}}>
                            <Flex.Item style={{flex: 1}}>{showValueP(item.totalSupply, item.decimals, 6)}</Flex.Item>
                            <Flex.Item style={{flex: 1}}>{item.decimals}</Flex.Item>
                            <Flex.Item style={{flex: 1}}>{
                                item.canMint ? "否" : "是"
                            }</Flex.Item>
                            <Flex.Item style={{flex: 2}}>{showValueP(item.balance, item.decimals, 6)}</Flex.Item>
                        </Flex>
                    </div>
                </div>
            );
        };

        return (
            <WingBlank size="md">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() =>
                        <span><SearchBar placeholder="币名" maxLength={8} onSubmit={value => {
                        this.search(value.trim());
                    }} onClear={value => {
                        this.cancel();
                    }}/>
                </span>
                    }
                    renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                        {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}

                    renderRow={row}
                    renderSeparator={separator}
                    style={{
                        height: document.documentElement.clientHeight,
                        overflow: 'auto',
                    }}
                    // pageSize={4}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />
            </WingBlank>
        );
    }
}

export default TokenList;