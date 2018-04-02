import React from 'react';
import { Layout, Avatar, Icon, List, Card, Progress  } from 'antd';
import { connect } from 'react-redux';

import Slider from 'react-slick'
import ReactSpeedometer from "react-d3-speedometer";
const { Content } = Layout;
const { Meta } = Card;

const data = [
  {
    agvname: 'AGV001',
    ip: '10.5.87.10',
    locatuon: '00-001-002',
    fireware: '0.0.0.1',
    status: 'Idle',
    face: 'Up',
    battery: '80',
    servicetime: '21:22:11',
    workmileage: '999999',
    speed: '20',
    rackname:'Rack002',
    racklocatuon: '00-001-002',
    rackface:'Up',
  },
  {
    agvname: 'AGV002',
    ip: '10.5.87.10',
    locatuon: '00-001-002',
    fireware: '0.0.0.1',
    status: 'Idle',
    face: 'Down',
    battery: '40',
    servicetime: '21:22:11',
    workmileage: '999999',
    speed: '60',
    rackname:'Rack002',
    racklocatuon: '00-001-002',
    rackface:'Up',
  },
  {
    agvname: 'AGV003',
    ip: '10.5.87.10',
    locatuon: '00-001-002',
    fireware: '0.0.0.1',
    status: 'Idle',
    face: 'Right',
    battery: '98',
    servicetime: '21:22:11',
    workmileage: '999999',
    speed: '80',
    rackname:'Rack002',
    racklocatuon: '00-001-002',
    rackface:'Up',
  },
  {
    agvname: 'AGV004',
    ip: '10.5.87.10',
    locatuon: '00-001-002',
    fireware: '0.0.0.1',
    status: 'Idle',
    face: 'Left',
    battery: '30',
    servicetime: '21:22:11',
    workmileage: '999999',
    speed: '40',
    rackname:'Rack002',
    racklocatuon: '00-001-002',
    rackface:'Up',
  },
];

class ChartFormContainer extends React.Component {

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
                    <Card
                    title={item.agvname}
                    >
                      <p>Locatuon:{item.locatuon}</p>
                      <p>Fireware:{item.fireware}</p>
                      <p>Status:{item.status}</p>
                      <p>Face:
                        <Avatar
                          shape="square"
                          size="large"
                          style={{ left: '5px' }}
                          icon={`${item.face.toLowerCase()}-circle`}
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

export default ChartFormContainer;
