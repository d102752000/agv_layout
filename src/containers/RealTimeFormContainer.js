import React from 'react';
import { Layout, Col, Row, Card, Tabs } from 'antd';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { doLoginRequest, doListRackRequest } from './../actions/index';

import AgvMap from './../component/AgvMap';
import RacksTable from './../component/RacksTable';

const { Content } = Layout;
// const TabPane = Tabs.TabPane;

class RealTimeFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://192.168.1.49:5002'),
      realtimeData: {
        "AGV": [
          {
            "Name": "AGV001",
            "IP": "10.5.87.10",
            "Location": "00-003-001",
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
          }, {
            "Name": "AGV002",
            "IP": "10.5.87.10",
            "Location": "00-002-002",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV003",
            "IP": "10.5.87.10",
            "Location": "01-000-001",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV004",
            "IP": "10.5.87.10",
            "Location": "01-001-002",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV005",
            "IP": "10.5.87.10",
            "Location": "01-001-003",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV006",
            "IP": "10.5.87.10",
            "Location": "01-002-004",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV007",
            "IP": "10.5.87.10",
            "Location": "00-002-003",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
            "Work_mileage": "999999",
            "Route": [
              "00-001-002",
              "00-001-003"
            ],
            "TableName": "RACK001",
            "TableFace": "Down",
            "CreateTime": "2018-02-28 12:00:00"
          }, {
            "Name": "AGV008",
            "IP": "10.5.87.10",
            "Location": "00-001-004",
            "Firmware": "0.0.0.1",
            "Status": "Idle",
            "Face": "Up",
            "Battery": "50",
            "Servicetime": "21:22:11",
            "Speed": "20",
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
          {Name: "RACK005", Location: "00-000-000", Face: "Right"},
          {Name: "RACK001", Location: "00-001-000", Face: "Right"},
          {Name: "RACK002", Location: "00-001-002", Face: "Right"},
          {Name: "RACK003", Location: "00-002-000", Face: "Right"},
          {Name: "RACK006", Location: "00-003-000", Face: "Right"},
          {Name: "RACK008", Location: "01-001-000", Face: "Right"},
          {Name: "RACK009", Location: "01-003-000", Face: "Right"},
          {Name: "RACK004", Location: "00-000-002", Face: "Up"},
          {Name: "RACK010", Location: "01-002-002", Face: "Up"},
          {Name: "RACK007", Location: "01-002-000", Face: "Right"},
          {Name: "RACK011", Location: "01-003-002", Face: "Right"},
          {Name: "RACK012", Location: "01-000-000", Face: "Right"},
        ]
      },
      realTimeStatic: {},
    }
    this.combineSocketToState = this.combineSocketToState.bind(this);
    // this.combineSocketStaticsToState = this.combineSocketStaticsToState.bind(this);
  }
  componentDidMount() {
    const { doLoginRequest, } = this.props;
    doLoginRequest({userName: "exhibitionadmin", userPassword: "exhibitionadmin"});
    this.state.socket.on('realtime', this.combineSocketToState);
    // this.state.socket.on('wareHouseStatus', this.combineSocketStaticsToState);
  }
  combineSocketToState = (value) => {
    this.setState({ realtimeData: value });
  }
  // combineSocketStaticsToState = (value) => {
  //   const side = this.props.match.params.side;
  //   if (side === 'left') { this.setState({ realTimeStatic: value.materialsWareHouse }); }
  //   else if (side === 'right') { this.setState({ realTimeStatic: value.itemsWareHouse }); }
  // }

  render() {
    const { realtimeData } = this.state;
    const { userInfo } = this.props;
    // different card one and three at left monitor or right monitor
    // console.log(realtimeData);
    return (
      <Layout id="chartForm-container">
        <Layout>
          <Layout id="chartForm-layout">
            <Content className="content">
              <Row>
                <Col span={12}>
                  <Card className="carAnimate">
                    <AgvMap data={realtimeData} side={'left'} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="carAnimate" >
                    <AgvMap data={realtimeData} side={'right'} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    {
                      userInfo ?
                      <RacksTable
                        accessToken={userInfo['wms-access-token']}
                      /> : <RacksTable
                        accessToken={null}
                      />
                    }
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
  { doLoginRequest,
    doListRackRequest,
  }
)(RealTimeFormContainer);
