import React from 'react';
import { Layout, Col, Row, Avatar, List, Card, Progress  } from 'antd';
import io from 'socket.io-client';


import Slider from 'react-slick'
import ReactSpeedometer from "react-d3-speedometer";
const { Content } = Layout;

class ListAgvInfoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://192.168.1.49:5002'),
      realtimeData: {
        "AGV": [
          {
            "Name": "AGV001",
            "IP": "10.5.87.10",
            "Location": "00-001-002",
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
            "Location": "00-001-000",
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
            "Location": "01-003-000",
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
          {Name: "RACK001", Location: "00-001-000", Face: "Right"},
          {Name: "RACK002", Location: "00-001-002", Face: "Right"},
          {Name: "RACK003", Location: "00-002-000", Face: "Right"},
          {Name: "RACK008", Location: "01-001-000", Face: "Right"},
          {Name: "RACK009", Location: "01-003-000", Face: "Right"},
          {Name: "RACK004", Location: "00-000-002", Face: "Up"},
          {Name: "RACK010", Location: "01-002-002", Face: "Up"},
          {Name: "RACK007", Location: "01-002-000", Face: "Right"},
        ]
      },
      realTimeStatic: {},
    }
    this.combineSocketToState = this.combineSocketToState.bind(this);
    this.combineSocketStaticsToState = this.combineSocketStaticsToState.bind(this);

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
    const { realtimeData } = this.state;
    console.log(realtimeData.AGV);
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500,
      rows: 2,
      slidesPerRow: 2
    };
    return (
      <Layout id="homepage-container">
        <Layout>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Content className="content">
              <Row>
                <Col span={24}>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={realtimeData.AGV}
                    renderItem={item => (
                      <Slider {...settings}>
                      <div>
                      <List.Item>
                        <Card
                        title={item.Name}
                        >
                          <p>Status:{item.Status}</p>
                          <p>Face:
                            <Avatar
                              shape="square"
                              size="large"
                              style={{ left: '5px' }}
                              icon={`${item.Face.toLowerCase()}-circle`}
                            />
                          </p>
                          <p>Servicetime:{item.Servicetime}</p>
                          <p>Workmileage:{item.Work_mileage}</p>
                          Battery:
                          <div style={{ width: 170 }}>
                            <Progress percent={Number(item.Battery)} status="active" />
                          </div>
                          Speed:
                          <ReactSpeedometer
                              height={200}
                              maxValue={220}
                              value={Number(item.Speed)}
                              needleColor="black"
                              startColor="green"
                              segments={10}
                              endColor="red"
                              needleTransition="easeElastic"
                            />
                        </Card>
                      </List.Item>
                      </div>
                      </Slider>
                    )}
                  />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default ListAgvInfoContainer;
