import React from 'react';
import { Layout, Col, Row, Button, Switch, Modal, Form, Input, Radio, Icon } from 'antd';
import { Route } from 'react-router-dom';

import { connect } from 'react-redux';
import _ from 'lodash';

import AgvMap from './../component/AgvMap';
import ActionContainer from './action/ActionContainer';
import { fakeMapConfig, doRackRequest } from './../actions/index';

const { Header, Content } = Layout;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class RackRequestForm extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //   socket : io("http://192.168.1.131:5002"),
    //   socketData : [],
    // }
  }
  // componentDidMount() {
  //   this.state.socket.emit('connection');
  //   this.state.socket.on('frontend', (data) => {
  //     console.log('socket.io connect!', this.state.socketData);
  //     // this.setState({ socketData: data });
  //   });
  // }
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    let optionsText = false;
    return (
      <Form layout="vertical">
        <FormItem label="Stock Uuid">
          {getFieldDecorator('stockUuid', {
            rules: [{ required: true, message: 'Please input the Stock Uuid!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="Station Identifier">
          {getFieldDecorator('stationIdentifier', {
            rules: [{ required: true, message: 'Please input the Station Identifier!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="Rack Options">
          {getFieldDecorator('radioButton')(
            <RadioGroup onChange={(e) => { optionsText = e.target.value !== 'empty' || false; }}>
              <RadioButton value="empty">EmptyRack</RadioButton>
              <RadioButton value="rack">Rack Uuid</RadioButton>
              <RadioButton value="item">Item Uuid</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="Options Text(Rack/Item Uuid)" style={{ paddingLeft: '40px' }}>
          {getFieldDecorator('optionsText')(
            <Input />
          )}
        </FormItem>
        <FormItem label="Items Quantity" style={{ paddingLeft: '40px' }}>
          {getFieldDecorator('itemQuantity')(
            <Input />
          )}
        </FormItem>
        <FormItem className="rackRequestSwitch">
          <h3 style={{ paddingRight: '5px' }}>Receive</h3>
          {getFieldDecorator('switch', { valuePropName: 'checked' })(
            <Switch className="typeSwitch" />
          )}
          <h3 style={{ paddingLeft: '5px' }}>Issue</h3>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRackRequestForm = Form.create()(RackRequestForm);

class HomepageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
    const { fakeMapConfig } = this.props;
    this.RackRequestOk = this.RackRequestOk.bind(this);
    // setInterval(() => fakeMapConfig(), 2000);
  }
  // logout if doing without login
  componentWillMount() {
    // if (!this.props.userInfo) this.props.history.push('/');
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  RackRequestOk = () => {
    const form = this.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      } else if (values.radioButton !== 'empty' && !values.optionsText) {
        alert('error');
        this.setState({ visible: false });
        return;
      }

      const { doRackRequest, userInfo } = this.props;
      const params = {};
      const configs = {};

      // temp: e080d091-d107-4f10-92c8-99475532c0b5
      configs.stockUuid = values.stockUuid;
      // temp: 6lwn1oQ9nmApxhCQnFDMYQ,IN01,00,001,001
      configs.stationIdentifier = values.stationIdentifier;

      // config the rack request options
      if (values.radioButton === 'empty') {
        configs.options = { "mostEmptyRack": true };
      } else if (values.radioButton === 'rack') {
        configs.options = {
          "specificRack": {
            "rackUuid": values.optionsText
          }
        };
      } else {
        configs.options = {
          "filter": {
            "itemUuid": values.optionsText,
            "quantity": values.quantity || null,
          }
        };
      }

      params.token = userInfo['wms-access-token'];
      params.config = configs;

      doRackRequest(params);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <Layout id="homepage-container">
        <Header className="header">
          <Row style={{ color: 'white' }}>
            <Col span={4}>
              <div className="logo" />
              <b style={{ color: 'white' }}>Auto Guided dddVehicle</b>
            </Col>
            <Col span={16} style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'white' }}>Action --- Receive</h3>
            </Col>
            <Col span={4}>
              <h3
                style={{ color: 'white', textAlign: 'right', cursor: 'pointer' }}
                onClick={() => this.props.history.push('/')}
              >
                Logout
              </h3>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <Row>
                  {/* <AgvMap mapConfig={this.props.mapConfig} /> */}
                <Col span={10}>
                  <Button onClick={this.showModal}>Rack Request</Button>
                  <h3 className="stationSwitchWords">Station Exchange : </h3>
                </Col>
                <Col span={10}>
                  <Button type="primary" shape="circle" size="large">One</Button>
                  <Button type="primary" shape="circle" size="large">Two</Button>
                  <Button type="primary" shape="circle" size="large">Three</Button>
                  <Button type="primary" shape="circle" size="large">Four</Button>
                </Col>
                <Col span={4} />
                <Col span={24} className={`${this.state.isAnimate} slideInDown`}>
                  <Col span={24}>
                    <ActionContainer />
                  </Col>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
        <Modal
          title="Rack Request"
          visible={this.state.visible}
          onOk={this.RackRequestOk}
          okText="Send Request"
          onCancel={this.handleCancel}
          className="modalStyle"
        >
          <WrappedRackRequestForm ref={this.saveFormRef} {...this.props} />
        </Modal>
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
  { fakeMapConfig, doRackRequest }
)(HomepageContainer);