import React from 'react';
import { Layout, Col, Row, Table, Progress, Card } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import io from 'socket.io-client';

import AgvMap from './../../component/AgvMap';
import ItemsPieChart from './../../component/ItemsPieChart';
import BarChart from './../../component/BarChart';

const { Header, Content } = Layout;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  width: 200,
}, {
  title: 'Age',
  dataIndex: 'age',
  width: 200,
}, {
  title: 'Address',
  dataIndex: 'address',
  width: 200,
}];
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '5',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '6',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '7',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '8',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '9',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '10',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

class ChartFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieData :[
        {name: 'Microsoft Internet Explorer', value: 56.33 },
        {name: 'Chrome', value: 24.03},
        {name: 'Firefox', value: 10.38},
        {name: 'Safari',  value: 4.77},
        {name: 'Opera', value: 0.91},
        {name: 'Proprietary or Undetectable', value: 0.2}
      ],
      barData :[
        {name: 'item1', count: 2},
        {name: 'item2', count: 22},
        {name: 'item3', count: 3},
        {name: 'item4', count: 6},
        {name: 'item5', count: 19},
        {name: 'item6', count: 6},
        {name: 'item7', count: 7},
        {name: 'item8', count: 10},
      ],
      socket: io('http://192.168.1.131:5002'),
      realtimeData: {},
    }
    this.combineSocketToState = this.combineSocketToState.bind(this);
  }
  componentDidMount() {
    this.state.socket.on('realtime', this.combineSocketToState);
  }
  combineSocketToState = (value) => {
    // console.log(value);
    this.setState({ realtimeData: value });
  }
  render() {
    return (
      <Layout id="chartForm-container">
        <Header className="header">
          <Row>
            <Col span={4}>
              <div className="logo" />
              <b className="titleWords">Auto Guided Vehicle</b>
            </Col>
            <Col span={16} style={{ textAlign: 'center' }}>
              <h3 className="titleWords">Statics</h3>
            </Col>
            <Col span={4}>
              <h3
                className="titleWords logoutStyle"
                onClick={() => this.props.history.push('/')}
              >
                Logout
              </h3>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Content className="content">
              <Row>
                <Col span={8}>
                  <Card title="AGV's RealTime"  className="carAnimate">
                    <AgvMap data={this.state.realtimeData} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Items Flow Ratio" className="upperRowCard">
                    <ItemsPieChart data={this.state.pieData} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Warehouse Usage Ratio" className="upperRowCard">
                    <Progress
                      type="dashboard"
                      percent={75}
                      width={250}
                      className="progressChart"
                    />
                  </Card>
                </Col>
                <Row>
                <Col span={8}>
                  <Card title="Items Quantity Ratio" className="upperRowCard">
                    <BarChart
                      data={this.state.barData}
                    />
                  </Card>
                </Col>
                <Col span={16}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{ y : '330px' }}
                    size="middle"
                  />
                </Col>
                </Row>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default ChartFormContainer;