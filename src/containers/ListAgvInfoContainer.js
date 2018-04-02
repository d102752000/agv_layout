import React from 'react';
import { Layout, Avatar, Icon, List, Card, Progress  } from 'antd';
import { connect } from 'react-redux';

import Slider from 'react-slick'
import ReactSpeedometer from "react-d3-speedometer";
const { Content } = Layout;
const { Meta } = Card;

const data = {
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
};

class ListAgvInfoContainer extends React.Component {

  render() {
    return (
      <Layout id="homepage-container">
        <Layout>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Content className="content">
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    console.log(item);
                    <Card
                    title={item.AGV[0].Name}
                    >
                      <p>Locatuon:{item.AGV[0].Location}</p>
                      <p>Fireware:{item.AGV[0].Firmware}</p>
                      <p>Status:{item.AGV[0].Status}</p>
                      <p>Face:
                        <Avatar
                          shape="square"
                          size="large"
                          style={{ left: '5px' }}
                          icon={`${item.AGV.Face.toLowerCase()}-circle`}
                        />
                      </p>
                      <p>Servicetime:{item.servicetime}</p>
                      <p>Workmileage:{item.workmileage}</p>
                      <p>Battery:
                       <Progress percent={item.battery} status="active" />
                      </p>
                      <p>Speed:
                        <ReactSpeedometer
                            maxValue={220}
                            value={item.speed}
                            needleColor="black"
                            startColor="green"
                            segments={10}
                            endColor="red"
                            needleTransition="easeElastic"
                          />
                      </p>
                    </Card>
                    <Card
                    title={item.rackname}
                    >
                    <p>Locatuon:{item.racklocatuon}</p>
                    <p>Face:
                      <Avatar
                        shape="square"
                        size="large"
                        style={{ left: '5px' }}
                        icon={`${item.rackface.toLowerCase()}-circle`}
                      />
                    </p>
                    </Card>
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default ListAgvInfoContainer;
