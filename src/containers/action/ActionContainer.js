import React from 'react';
import { Table, Col, Row, Radio, Divider, Input, Button } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';

import { doTurnRackRequest, doRackArrivalRequest, doInOutRequest } from './../../actions/index';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];

class ActionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockId: '',
      stationId: '',
      rackInfo: '',
      partNoAndQuantity: '',
      timer: '',
    }
    this.operationForm = this.operationForm.bind(this);
    this.rackRotate = this.rackRotate.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    const { stationId, rackInfo, partNoAndQuantity } = nextState;
    const { doInOutRequest } = this.props;
    if (stationId !== '' && rackInfo !== '' && partNoAndQuantity !== '') {
      setTimeout(() => {
        alert("mission complete");
        // const config = {

        // }
        // doInOutRequest({
        //   token: userInfo['wms-access-token'],
        //   consgi
        // })
        this.setState({ stationId: '', rackInfo: '', partNoAndQuantity: '' });
      }, 500);
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.type, this.state);
    // call timer: check rack arrival
    if (nextProps.type === 'DO_RACK_SUCCESS') {
      const stockUuid = "e080d091-d107-4f10-92c8-99475532c0b5";
      const stationIdentifier = "6lwn1oQ9nmApxhCQnFDMYQ,IN01,00,001,001";
      const { doRackArrivalRequest, userInfo } = this.props;
      let timer = setInterval(() => {
        doRackArrivalRequest({
          stockUuid,
          stationIdentifier,
          token: userInfo['wms-access-token'],
        })
      }, 3000);
      this.setState({ timer });
    // stop timer
    } else if (this.state.timer && nextProps.type === 'DO_RACK_ARRIVAL_SUCCESS') {
      this.setState({ rackInfo: nextProps.rackData.rackUuid });
      clearInterval(this.state.timer);
    } else if (nextProps.type === 'DO_IN_OUT_SUCCESS') {
      this.setState({ rackInfo: '' });
    }
  }
  createColumn = (rackData) => {
    const colArrs = [];
    _.map(rackData[0], (data, key) => {
      const obj = {};
      obj.title = key;
      obj.dataIndex = key;
      obj.key = key;
      colArrs.push(obj);
    });
    return(colArrs);
  }
  createTableData = (rackData) => {
    const dataSource = [];
    let index = 0;
    _.map(rackData, (data) => {
      const obj = {};
      _.map(data, (value, key) => {
        obj.key = index;
        obj[key] = value;
      });
      index += 1;
      dataSource.push(obj);
    });

    return dataSource;
  }
  itemsOnRack = (rackItems) => {
    return(
      <Table
        columns={this.createColumn(rackItems)}
        dataSource={this.createTableData(rackItems)}
        size="small"
        pagination={false}
        showHeader={false}
        scroll={{y: 200}}
      />
    );
  }
  taskOnRack = (rackTask) => {
    return (
      <Table
        columns={this.createColumn(rackTask)}
        dataSource={this.createTableData(rackTask)}
        size="small"
        pagination={false}
        showHeader={false}
        scroll={{y: 200}}
      />
    );
  }
  operationForm = () => {
    const { stationId, rackInfo, partNoAndQuantity } = this.state;
    // station 站點刷一次 rack 每台車刷一次 partno 每個partno刷一次
    return (
      <Row>
        <Col span={4} className="operationFormTitle">Station Id</Col>
        <Col span={20} className="operationFormInput">
          { stationId === ''
            ? <Input
              value={stationId}
              onChange={(e) => this.setState({stationId: e.target.value})}
            />
            : <div className="barcodeSuccess" /> }
        </Col>
        <Col span={4} className="operationFormTitle">Rack Info</Col>
        <Col span={20} className="operationFormInput">
          { rackInfo === ''
            ? <Input
              value={rackInfo}
              onChange={(e) => this.setState({rackInfo: e.target.value})}
            />
            : <div className="barcodeFailure" /> }
        </Col>
        <Col span={4} className="operationFormTitle">PartNo. & Quantity</Col>
        <Col span={20} className="operationFormInput">
          { partNoAndQuantity === ''
            ? <Input
              value={partNoAndQuantity}
              onChange={(e) => this.setState({partNoAndQuantity: e.target.value})}
            />
            : <div className="barcodeSuccess" /> }
        </Col>
      </Row>
    );
  }
  rackRotate = (e) => {
    const { doTurnRackRequest, userInfo } = this.props;
    const { rackInfo } = this.state;
    const stockId = "e080d091-d107-4f10-92c8-99475532c0b5";
    const stationId = "6lwn1oQ9nmApxhCQnFDMYQ,IN01,00,001,001";
    doTurnRackRequest({
      token: userInfo['wms-access-token'],
      rotateInfo: {
        "rackUuid": rackInfo,
        "stockUuid": stockId,
        "rackFace": e.target.value,
        "stationIdentifier": stationId
      }
    })
  }
  render() {
    const { rackData } = this.props;
    return (
      <Row id="receive-container">
        <Col span={12}>
          <h3>Items On Rack</h3>
          {this.itemsOnRack(rackData ? rackData.itemsOnRack : {})}
        </Col>
        <Col span={12} style={{ paddingLeft: '10px' }}>
          <h3>Task List On This Rack</h3>
          {this.taskOnRack(rackData ? rackData.tasksOnRack : {})}
        </Col>
        <Divider style={{ paddingTop: '20px', paddingBottom: '5px' }}>Operation</Divider>
        <div style={{ textAlign: 'center' }}>
          <Col span={24} style={{ paddingBottom: '10px' }}>
            <RadioGroup defaultValue="Face1" size="large" onChange={this.rackRotate}>
              <RadioButton value="A">Face1</RadioButton>
              <RadioButton value="B">Face2</RadioButton>
              <RadioButton value="C">Face3</RadioButton>
              <RadioButton value="D">Face4</RadioButton>
            </RadioGroup>
          </Col>
          <Col span={12}>
            {this.operationForm()}
          </Col>
          <Col span={12}>
          <div style={{ height: '10vh' }} />
          <Button type="primary" htmlType="submit">Rack Return</Button>
          </Col>
        </div>
      </Row>
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
  { doTurnRackRequest, doRackArrivalRequest, doInOutRequest }
)(ActionContainer);