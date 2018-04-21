import React from 'react';
import { Layout, Col, Row, Avatar, List, Card, Progress  } from 'antd';
import io from 'socket.io-client';
import _ from 'lodash';


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
    // this.combineSocketStaticsToState = this.combineSocketStaticsToState.bind(this);

  }
  componentDidMount() {
    this.state.socket.on('realtime', this.combineSocketToState);
    // this.state.socket.on('wareHouseStatus', this.combineSocketStaticsToState);
  }
  combineSocketToState = (value) => {
    // console.log(value);
    this.setState({ realtimeData: value });
  }
  // combineSocketStaticsToState = (value) => {
  //   console.log(value);
  //   const side = this.props.match.params.side;
  //   if (side === 'left') { this.setState({ realTimeStatic: value.materialsWareHouse }); }
  //   else if (side === 'right') { this.setState({ realTimeStatic: value.itemsWareHouse }); }
  // }
  render() {
    const { realtimeData } = this.state;
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: _.size(realtimeData.AGV) === 3 ? 3  : _.size(realtimeData.AGV),
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    return (
      <Layout id="homepage-container">
        <Layout>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Content className="content">
              <Row>
                <Col>
                  <div>
                    <Slider {...settings}>
                    {
                      _.map(realtimeData.AGV, (item) => {
                        return <div>
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
                              value={Number(item.Speed)}
                              needleColor="black"
                              startColor="green"
                              segments={10}
                              endColor="red"
                              needleTransition="easeElastic"
                            />
                        </Card>
                        </div>
                      })
                    }
                    </Slider>
                  </div>
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
