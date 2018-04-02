import React from 'react';
import { Layout, Col, Row, Button, Switch, Modal, Form, Input, Radio, Icon, Select } from 'antd';
import { Route } from 'react-router-dom';

import { connect } from 'react-redux';
import _ from 'lodash';

import AgvMap from './../component/AgvMap';
import ActionContainer from './action/ActionContainer';
import { doRackRequest, doListRackRequest } from './../actions/index';

const { Header, Content } = Layout;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;

class RackRequestForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // socket : io("http://192.168.1.131:5002"),
      // socketData : [],
      formOptionsValue: 'empty'
    }
  }
  // componentDidMount() {
  //   this.state.socket.emit('connection');
  //   this.state.socket.on('frontend', (data) => {
  //     console.log('socket.io connect!', this.state.socketData);
  //     // this.setState({ socketData: data });
  //   });
  // }
  transRacksArrToOptions = (racksArr) => {
    const optionsArrs = [];
    _.map(racksArr, (value, key) => {
      optionsArrs.push(<Option value={value.rackUuid} key={key}>{value.rackName}</Option>);
    });
    return (optionsArrs);
  }
  render() {
    const { form, stockId, stationId, stationKind, racksIdInfo, itemsId } = this.props;
    const { formOptionsValue } = this.state;
    const { getFieldDecorator } = form;
    const currentStationUuid = stationId[stationKind];
    const currentStock = stationKind.split('-')[0];
    const currentStockUuid = stockId[currentStock];
    return (
      <Form layout="vertical">
        <FormItem label="Stock Uuid">
          {getFieldDecorator('stockUuid', {
            rules: [{ required: true, message: 'Please input the Stock Uuid!' }],
            initialValue: currentStockUuid
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="Station Identifier">
          {getFieldDecorator('stationIdentifier', {
            rules: [{ required: true, message: 'Please input the Station Identifier!' }],
            initialValue: currentStationUuid
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="Request Type">
          {getFieldDecorator('radioButton')(
            <RadioGroup onChange={(e) => { this.setState({ formOptionsValue: e.target.value }) }}>
              <RadioButton value="empty">EmptyRack</RadioButton>
              <RadioButton value="rack">Rack Uuid</RadioButton>
              <RadioButton value="item">Item Uuid</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="Racks Options" style={{ paddingLeft: '40px' }}>
          {getFieldDecorator('rackOptions')(
            <Select style={{ width: 240 }} disabled={formOptionsValue !== 'rack'}>
              {this.transRacksArrToOptions(racksIdInfo)}
            </Select>
          )}
        </FormItem>
        <FormItem label="Items Options" style={{ paddingLeft: '40px' }}>
          {getFieldDecorator('itemsOptions')(
            <Select style={{ width: 240 }} disabled={formOptionsValue !== 'item'}>
              { currentStock === 'material' ? <Option value={itemsId.topShell}>Top Shell</Option> : null }
              { currentStock === 'material' ? <Option value={itemsId.bottomShell}>Bottom Shell</Option> : null }
              { currentStock === 'items' ? <Option value={itemsId.finishedProduct}>Finished Product</Option> : null }
            </Select>
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
      stationKind: 'material-inbound',
      stationId: {
        "material-inbound": "rmXoGAepuBID7fPTbWEmAA,RECV,00,003,001",
        "material-outbound": "rmXoGAepuBID7fPTbWEmAA,ISSU,00,002,002",
        "items-inbound": "DT7Fe50goVvJuGic1MsgMg,ISSU,01,001,002",
        "items-outbound": "DT7Fe50goVvJuGic1MsgMg,ISSU,01,000,001",
      },
      stockId: {
        "material": "a49cb52e-4ca1-4a54-952c-6d264f55f236",
        "items": "c77c72e1-2eed-4b3a-a1a5-699ef9b5a9a4",
      },
      itemsId: {
        topShell: "04b217e3-9c1f-4c66-b04f-ba2496c01807",
        bottomShell: "8437b039-ae78-4fc6-9457-767452957632",
        finishedProduct: "343539e0-60a0-45a7-a67a-8e5740966708",
      }
    }
    this.RackRequestOk = this.RackRequestOk.bind(this);
  }
  // logout if doing without login
  componentWillMount() {
    // if (!userInfo) this.props.history.push('/');
    const { doListRackRequest, userInfo } = this.props;
    const  { stationKind, stockId } = this.state;
    const currentStockUuid = stockId[stationKind.split('-')[0]];
    doListRackRequest({
      token: userInfo['wms-access-token'],
      currentStockUuid
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  RackRequestOk = () => {
    const form = this.form;

    form.validateFields((err, values) => {
      let errStatus = false;
      if (values.radioButton  === 'rack' && !values.rackOptions) { errStatus = true }
      else if(values.radioButton  === 'item' && !values.itemsOptions) { errStatus = true }

      if (err) {
        return;
      } else if (errStatus) {
        alert('error');
        this.setState({ visible: false });
        return;
      }

      const { doRackRequest, userInfo } = this.props;
      const params = {};
      const configs = {};

      configs.stockUuid = values.stockUuid;
      configs.stationIdentifier = values.stationIdentifier;

      // config the rack request options
      if (values.radioButton === 'empty') {
        configs.options = { "mostEmptyRack": true };
      } else if (values.radioButton === 'rack') {
        configs.options = {
          "specificRack": {
            "rackUuid": values.rackOptions
          }
        };
      } else {
        configs.options = {
          "filter": {
            "itemUuid": values.itemsOptions,
            // "quantity": parseInt(values.quantity, 10) || null,
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
  stationKindSelect = (e) => {
    const { doListRackRequest, userInfo } = this.props;
    const  { stationKind, stockId } = this.state;
    const currentStockUuid = stockId[stationKind.split('-')[0]];
    doListRackRequest({
      token: userInfo['wms-access-token'],
      currentStockUuid
    });
    this.setState({
      stationKind: e,
    });
  }
  render() {
    const  { stationKind, stationId, stockId, itemsId } = this.state;
    console.log('stationKind: ', this.props.racksIdInfo);
    const currentStationUuid = stationId[stationKind];
    const currentStockUuid = stockId[stationKind.split('-')[0]];
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
                  <Select
                    defaultValue="material-inbound"
                    style={{ width: 200, paddingTop: '20px' }}
                    onChange={this.stationKindSelect}
                  >
                    <OptGroup label="Materials Warehouse">
                      <Option value="material-inbound">Materials Inbound</Option>
                      <Option value="material-outbound">Materials Outbound</Option>
                    </OptGroup>
                    <OptGroup label="Items Warehouse">
                      <Option value="items-inbound">Items Inbound</Option>
                      <Option value="items-outbound">Items Outbound</Option>
                    </OptGroup>
                  </Select>
                </Col>
                <Col span={4} />
                <Col span={24} className={`${this.state.isAnimate} slideInDown`}>
                  <Col span={24}>
                    <ActionContainer
                      stationOptions={stationKind}
                      currentStationUuid={currentStationUuid}
                      currentStockUuid={currentStockUuid}
                      stationId={stationId}
                      itemsId={itemsId}
                    />
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
          <WrappedRackRequestForm ref={this.saveFormRef} {...this.props} {...this.state} />
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
  { doRackRequest, doListRackRequest }
)(HomepageContainer);