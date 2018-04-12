import React from 'react';
import { Layout, Col, Row, Progress, Card } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import io from 'socket.io-client';
import { doInOutRequest } from './../actions/index';

import AgvMap from './../component/AgvMap';
import ItemsPieChart from './../component/ItemsPieChart';
import BarChart from './../component/BarChart';

const { Header, Content } = Layout;

class RealTimeFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://192.168.1.132:5002'),
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
          },
          {
            "Name": "RACK003",
            "Location": "00-002-003",
            "Face": "Down"
          }
        ]
      },
      realTimeStatic: {},
    }
    this.combineSocketToState = this.combineSocketToState.bind(this);
    this.combineSocketStaticsToState = this.combineSocketStaticsToState.bind(this);

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
  render() {
    // console.log(this.state.realTimeStatic);
    const { realtimeData } = this.state;
    console.log(realtimeData);
    // different card one and three at left monitor or right monitor
    return (
      <Layout id="chartForm-container">
        <Layout>
          <Layout id="chartForm-layout">
            <Content className="content">
              <Row>
                <Col span={12}>
                <Card>
                  <AgvMap data={realtimeData} side={'left'} /></Card>
                </Col>
                <Col span={12}>
                <Card>
                  <AgvMap data={realtimeData} side={'right'} /></Card>
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
)(RealTimeFormContainer);
