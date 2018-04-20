import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import { doListItemRequest } from './../actions/index';

const columns = [{
  title: <h3 className="tableHeader">RackName</h3>,
  dataIndex: 'rackname',
  width: 200,
}, {
  title: <h3 className="tableHeader">Quantity</h3>,
  dataIndex: 'quantity',
  width: 200,
}, {
  title: <h3 className="tableHeader">Location</h3>,
  dataIndex: 'location',
  width: 200,
}];
class RacksTable extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { doListItemRequest, accessToken, accessType, } = this.props;
    doListItemRequest({
      token: accessToken,
    });
  }
  render() {
    const { itemInfo } = this.props;
    // different card one and three at left monitor or right monitor
    return (
      <Table
        columns={columns}
        dataSource={itemInfo}
        pagination={false}
        height={400}
        bordered={true}
        scroll={{ y : '37vh' }}
        size="small"
      />
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
  { doListItemRequest }
)(RacksTable);
