import React from 'react';
import { Layout, Col, Row, Table, Progress, Card } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import io from 'socket.io-client';
import { doInOutRequest } from './../../actions/index';

import AgvMap from './../../component/AgvMap';
import ItemsPieChart from './../../component/ItemsPieChart';
import BarChart from './../../component/BarChart';

const { Header, Content } = Layout;

const columns = [{
  title: <h3 className="tableHeader">ItemName</h3>,
  dataIndex: 'itemName',
  width: 200,
}, {
  title: <h3 className="tableHeader">Quantity</h3>,
  dataIndex: 'quantity',
  width: 200,
}, {
  title: <h3 className="tableHeader">Location</h3>,
  dataIndex: 'location',
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
        {name: 'Chrome', value: 224.03},
        {name: 'Firefox', value: 110.38},
        {name: 'Safari',  value: 42.77},
        {name: 'Opera', value: 220.91},
        {name: 'Proprietary or Undetectable', value: 50.2}
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
      socket: io('http://192.168.1.134:5002'),
      realtimeData: {
        "AGV": [
          {
            "Name": "AGV001",
            "IP": "10.5.87.10",
            "Location": "01-002-004",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "100",
            "Servicetime": "21:22:11",
            "Speed": "60",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }
        ],
        "Table": [
          {
            "Name": "RACK002",
            "Location": "01-002-003",
            "Face": "Down"
          }
        ]
      },
      realTimeStatic: {},
    }
    this.combineSocketToState = this.combineSocketToState.bind(this);
    this.combineSocketStaticsToState = this.combineSocketStaticsToState.bind(this);
    this.processTableData = this.processTableData.bind(this);

    const { doInOutRequest } = this.props;
    doInOutRequest({
      type: 'inRequests',

    })
  }
  componentDidMount() {
    this.state.socket.on('realtime', this.combineSocketToState);
    this.state.socket.on('wareHouseStatus', this.combineSocketStaticsToState);
  }
  combineSocketToState = (value) => {
    // console.log(value);
    this.setState({ realtimeData: value });
  }
  combineSocketStaticsToState = (value) => {
    console.log(value);
    const side = this.props.match.params.side;
    if (side === 'left') { this.setState({ realTimeStatic: value.materialsWareHouse }); }
    else if (side === 'right') { this.setState({ realTimeStatic: value.itemsWareHouse }); }
  }
  processTableData = (data) => {
    const tableData = [];
    const colKey = 0;
    _.map(data, (rack) => {
      _.map(rack.items, (item) => {
        _.map(item.positions, (value) => {
          const obj = {};
          obj.location = `${rack.rackName} ${item.positions.position}`;
          obj.quantity = item.positions.quantity;
          obj.itemName = item.itemName;
          tableData.push(obj);
        });
      });
    });
    return tableData;
  }
  render() {
    // console.log(this.state.realTimeStatic);
    const { realtimeData, realTimeStatic } = this.state;
    // different card one and three at left monitor or right monitor
    const side = this.props.match.params.side;
    const cardOne = [];
    const cardThree = [];
    if (side === 'right') {
      cardOne.push(<Card title="AGV's RealTime"  className="carAnimate">
        <AgvMap data={realtimeData} side={side} /></Card>);
      cardThree.push(<Card title="Warehouse Usage Ratio" className="upperRowCard">
      <div style={{ height: '5vh' }} />
        <div style={{ textAlign: 'center' }}>
          <Progress
            type="dashboard"
            percent={realTimeStatic.wareHouseUsage}
            width={300}
            className="progressChart"
          />
        </div>
      </Card>);
    } else if (side === 'left') {
      cardThree.push(<Card title="AGV's RealTime"  className="carAnimate">
        <AgvMap data={realtimeData} side={side}/></Card>);
      cardOne.push(<Card title="Warehouse Usage Ratio" className="upperRowCard">
      <div style={{ height: '5vh' }} />
        <div style={{ textAlign: 'center' }}>
          <Progress
            type="dashboard"
            percent={realTimeStatic.wareHouseUsage}
            width={300}
            className="progressChart"
          />
        </div>
      </Card>);
    }
    return (
      <Layout id="chartForm-container">
        <Header className="header">
          <Row>
            <Col span={4}>
              <div className="logo" />
              <b className="titleWords">Auto Guided Vehicle</b>
            </Col>
            <Col span={16} style={{ textAlign: 'center' }}>
              <h1 className="titleWords">Statics</h1>
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
          <Layout id="chartForm-layout">
            <Content className="content">
              <Row>
                <Col span={8}>
                  {cardOne}
                </Col>
                <Col span={8}>
                  <Card title="Items Flow Ratio" className="upperRowCard">
                    <ItemsPieChart data={realTimeStatic.flowRate} />
                  </Card>
                </Col>
                <Col span={8}>
                  {cardThree}
                </Col>
                </Row>
                <Row>
                <Col span={8}>
                  <Card title="Items Quantity Ratio" className="upperRowCard">
                    <BarChart
                      data={realTimeStatic.totalItems}
                    />
                  </Card>
                </Col>
                <Col span={16}>
                <Card className="upperRowCard lowerRowTableCard">
                  <Table
                    columns={columns}
                    dataSource={this.processTableData(realTimeStatic.itemDistributions)}
                    pagination={false}
                    scroll={{ y : '37vh' }}
                    size="middle"
                  />
                  </Card>
                </Col>
                </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.admin,
  };
};

export default connect(
  mapStateToProps,
  { doInOutRequest }
)(ChartFormContainer);
