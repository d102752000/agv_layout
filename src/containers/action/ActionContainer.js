import React from 'react';
import { Table, Col, Row, Radio, Divider, Input, Button, message } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';

import { doTurnRackRequest, doRackArrivalRequest, doInOutRequest, doRackReturnRequest } from './../../actions/index';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ActionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockId: this.props.allStockId,
      stationId: this.props.stationId,
      subStockId: '00',
      rackInfo: {},
      partNoAndQuantity: '',
      itemPosition: '',
      inputStyle: ['normal','normal'],
      timerArrs: {},
      rackRotateValue: 'A',
    }
    this.operationForm = this.operationForm.bind(this);
    this.rackRotate = this.rackRotate.bind(this);
    this.rackReturn = this.rackReturn.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log(nextProps, nextState);
    const { inputStyle, partNoAndQuantity, rackInfo, subStockId, itemPosition } = nextState;
    const { doInOutRequest, doRackArrivalRequest, stationOptions, currentStationUuid,
      currentStockUuid, userInfo, itemsId } = this.props;
    const isInputCheck = _.uniq(inputStyle);
    const isInputError = _.indexOf(inputStyle, 'red');

    // define the substock and staionId's string by stations
    if (nextProps.stationOptions !== stationOptions) {
      const stationGroup = nextProps.stationOptions.split('-')[0];
      doRackArrivalRequest({
        currentStockUuid: nextProps.currentStockUuid,
        currentStationUuid: nextProps.currentStationUuid,
        token: userInfo['wms-access-token'],
      });
      this.setState({
        subStockId: stationGroup === 'material' ? '00' : '01',
      });
    }
    // in/out request when scan barcode
    if (isInputCheck[0] === 'green' && isInputCheck.length === 1 && nextProps.type === this.props.type) {
      const itemPositionOnRack = itemPosition.split('-');
      let itemsKind = '';
      if (partNoAndQuantity.search("AB") !== -1) itemsKind = "finishedProduct";
      else if (partNoAndQuantity.search("A") !== -1) itemsKind = "topShell";
      else if (partNoAndQuantity.search("B") !== -1) itemsKind = "bottomShell";

      setTimeout(() => {
        const config = [{
          itemUuid: itemsId[itemsKind],
          stockUuid: currentStockUuid,
          rackUuid: rackInfo[currentStationUuid].rackUuid,
          stationIdentifier: currentStationUuid,
          subStockIdentifier: `SubStock,${subStockId}`,
          rackFace: itemPositionOnRack[0],
          rackLayer: itemPositionOnRack[1],
          rackBlock: itemPositionOnRack[2],
          quantity: 1,
          options: {},
        }];
        // console.log('fdbkdbdfljvdkjkldfjvkldjkvldf: ', config);
        // (XXX)JasonHsu: damn
        console.log(config);
        doInOutRequest({
          type: stationOptions.split('-')[1] === 'inbound' ? 'in' : 'out',
          token: userInfo['wms-access-token'],
          config
        })
        this.setState({
          partNoAndQuantity: '',
          itemPosition: '',
          inputStyle: ['normal', 'normal'],
        });
        this.partNoAndQuantity.focus();
      }, 500);
    } else if (isInputError !== -1) {
      setTimeout(() => {
        this.setState({
          partNoAndQuantity: '',
          itemPosition: '',
          inputStyle: ['normal', 'normal'],
        });
        message.error('Ooops! Please Check Barcode And Try Again!');
      }, 500);
    }
  }
  componentDidMount() {
    const { doRackArrivalRequest, type, userInfo, currentStationUuid, currentStockUuid } = this.props;
    if (type === 'DO_LOGIN_SUCCESS') {
      doRackArrivalRequest({
        currentStockUuid,
        currentStationUuid,
        token: userInfo['wms-access-token'],
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const { doRackArrivalRequest, userInfo } = this.props;
    const { currentStationUuid, currentStockUuid } = nextProps;
    const { stationId, timerArrs, rackInfo } = this.state;
    const isChangeStation = this.props.stationOptions !== nextProps.stationOptions;
    // call timer: check rack arrival
    if (nextProps.type === 'DO_RACK_SUCCESS' && !isChangeStation) {
      let timer = setInterval(() => {
        doRackArrivalRequest({
          currentStockUuid,
          currentStationUuid,
          token: userInfo['wms-access-token'],
        })
      }, 3000);
      timerArrs[currentStationUuid] = timer;
      this.setState({ timerArrs });

    // when car arrived, bind data to state and stop the timer
    } else if (this.state.timerArrs && nextProps.type === 'DO_RACK_ARRIVAL_SUCCESS' && !isChangeStation) {
      // console.log('yyyyy', this.state.timerArrs);
      const { rackInfo } = this.state;
      const targetStation = nextProps.rackData.stationId;
      rackInfo[targetStation] = nextProps.rackData;

      this.setState({ rackInfo });

      clearInterval(this.state.timerArrs[currentStationUuid]);

    } else if (nextProps.type === 'DO_IN_OUT_SUCCESS' && !isChangeStation && this.props.type !== nextProps.type) {
      console.log('doInOutRequest ', nextProps.type, this.props.type);
      this.partNoAndQuantity.focus();
      message.success('Success! Do Other Items Or Call Rack Return!');
      doRackArrivalRequest({
        currentStockUuid,
        currentStationUuid,
        token: userInfo['wms-access-token'],
      })
    } else if (nextProps.type === 'DO_RACK_RETURN_SUCCESS' && !isChangeStation) {
      rackInfo[currentStationUuid] = {};
      this.setState({ rackInfo });
    } else if (nextProps.type === 'DO_IN_OUT_FAILURE' && !isChangeStation) {
      this.partNoAndQuantity.focus();
      message.error('Ooops! Please Check Barcode And Try Again!');
    }
  }
  createColumn = (rackData) => {
    // console.log('create column: ', rackData);
    const colArrs = [];
    _.map(rackData[0], (data, key) => {
      const obj = {};
      obj.title = key;
      obj.dataIndex = key;
      obj.key = key;
      colArrs.push(obj);
    });
    // console.log('in create column: ', colArrs);
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
    // console.log('itemsOnRack: ', rackItems);
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
    // console.log('in taskonRack: ', rackTask);
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

    const { stationId, rackInfo, partNoAndQuantity, inputStyle, itemPosition } = this.state;
    const { stationOptions, rackData, currentStationUuid, currentStockUuid } = this.props;
    // console.log('opeation form: ', rackInfo, inputStyle);
    // station 站點刷一次 rack 每台車刷一次 partno 每個partno刷一次
    return (
      <Row>
        <Col span={6} className="operationFormTitle">Station Id</Col>
        <Col span={18} className="operationFormInput">
          <h2>{ stationOptions ? stationOptions : "Please Choose Station First" } </h2>
        </Col>
        <Col span={6} className="operationFormTitle">Rack Info</Col>
        <Col span={18} className="operationFormInput">
          <h2>{ !_.isEmpty(rackInfo[currentStationUuid]) ? rackInfo[currentStationUuid].rackName : "No Rack In This Station" }</h2>
        </Col>
        <Col span={6} className="operationFormTitle">Item Name</Col>
        <Col span={18} className="operationFormInput">
          { inputStyle[0] === 'normal'
          ? <Input
            ref={(input) => { this.partNoAndQuantity = input; }}
            className={inputStyle[0]}
            disabled={_.isEmpty(rackInfo[currentStationUuid]) || false}
            onChange={(e) => {this.setState({partNoAndQuantity: e.target.value})}}
            value={partNoAndQuantity}
            onPressEnter = {(e) => {
              inputStyle[0] = 'green';
              this.setState({ inputStyle });
              this.itemPosition.focus();
            }}
          />
          : <div>
              <Col span={8} />
              <Col className="green" span={8} />
              <Col span={8} />
            </div>
          }
        </Col>
        <Col span={6} className="operationFormTitle">Position</Col>
        <Col span={18} className="operationFormInput">
          { inputStyle[1] === 'normal'
          ? <Input
            ref={(input) => { this.itemPosition = input; }}
            className={inputStyle[1]}
            disabled={_.isEmpty(rackInfo[currentStationUuid]) || false}
            onChange={(e) => {this.setState({itemPosition: e.target.value})}}
            value={itemPosition}
            onPressEnter = {(e) => {
              if (e.target.value.split('-').length !== 3) {
                inputStyle[1] = 'red';
                this.setState({ inputStyle });
              } else {
                this.itemPosition.focus();
                inputStyle[1] = 'green';
                this.setState({ inputStyle });
              }
            }}
          />
          : <div>
              <Col span={8} />
              <Col className="green" span={8} />
              <Col span={8} />
            </div>
          }
        </Col>
      </Row>
    );
  }
  rackRotate = (e) => {

    const { doTurnRackRequest, userInfo, currentStationUuid, currentStockUuid } = this.props;
    const { rackInfo } = this.state;
    doTurnRackRequest({
      token: userInfo['wms-access-token'],
      rotateInfo: {
        "rackUuid": rackInfo[currentStationUuid].rackUuid,
        "stockUuid": currentStockUuid,
        "rackFace": e.target.value,
        "stationIdentifier": currentStationUuid
      }
    });
    this.setState({
      rackRotateValue: e.target.value,
    })
  }
  rackReturn = (e) => {

    const { doRackReturnRequest, userInfo, rackData, currentStationUuid, currentStockUuid } = this.props;
    const { rackInfo, subStockId } = this.state;
    // XXX(JasonHsu) : substockId not current
    doRackReturnRequest({
      token: userInfo['wms-access-token'],
      returnRack: {
        "rackUuid": rackInfo[currentStationUuid].rackUuid,
        "stockUuid": currentStockUuid,
        "stationIdentifier": currentStationUuid,
        "subStockIdentifier": `SubStock,${subStockId}`
      }
    });
    _.omit(rackInfo, rackData.stationId);
    this.setState({
      rackInfo,
      inputStyle: ['normal', 'normal']
    })
  }
  render() {
    const { currentStationUuid, currentStockUuid } = this.props;
    const { rackInfo, rackRotateValue } = this.state;
    // console.log('hhhhh: ', currentStationUuid, currentStockUuid, rackInfo);
    // console.log('ggggggg: ', rackInfo[currentStationUuid], rackInfo[currentStationUuid] ? rackInfo[currentStationUuid].tasksOnRack : 'none');
    return (
      <Row id="receive-container">
        <Col span={12}>
          <h3>Items On Rack</h3>
          {this.itemsOnRack(!_.isEmpty(rackInfo[currentStationUuid]) ? rackInfo[currentStationUuid].itemsOnRack : {})}
        </Col>
        <Col span={12} style={{ paddingLeft: '10px' }}>
          <h3>Task List On This Rack</h3>
          {this.taskOnRack(!_.isEmpty(rackInfo[currentStationUuid]) ? rackInfo[currentStationUuid].tasksOnRack : {})}
        </Col>
        <Divider style={{ paddingTop: '20px', paddingBottom: '5px' }}>Operation</Divider>
        <div style={{ textAlign: 'center' }}>
          <Col span={24} style={{ paddingBottom: '10px' }}>
            <RadioGroup
              defaultValue="A"
              size="large"
              onChange={this.rackRotate}
              disabled={_.isEmpty(rackInfo[currentStationUuid]) || false}
              value={rackRotateValue}
            >
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
          <Button
            type="primary"
            onClick={this.rackReturn}
            htmlType="submit"
            shape="circle"
            disabled={_.isEmpty(rackInfo[currentStationUuid]) || false}
            style={{ width: '150px', height:'150px' }}
          >
            Rack Return
          </Button>
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
  { doTurnRackRequest, doRackArrivalRequest, doInOutRequest, doRackReturnRequest }
)(ActionContainer);